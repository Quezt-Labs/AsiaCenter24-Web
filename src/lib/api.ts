import axios from "axios";
import { refreshAccessToken } from "@/api/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "client-type": "WEB",
  },
});

// Request interceptor: attach auth token if present
api.interceptors.request.use(
  (config) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // ignore
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: basic retry on 401 using refresh token flow
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const refreshToken =
          typeof window !== "undefined"
            ? localStorage.getItem("refreshToken")
            : null;
        const deviceId =
          typeof window !== "undefined" ? localStorage.getItem("deviceId") : null;
        const deviceSecret =
          typeof window !== "undefined"
            ? localStorage.getItem("deviceSecret")
            : null;
        if (!refreshToken) throw new Error("No refresh token");
        const resp = await refreshAccessToken({
          refreshToken,
          deviceId: deviceId ?? undefined,
          deviceSecret: deviceSecret ?? undefined,
        });
        const newToken = resp.accessToken ?? resp.token;
        if (newToken) {
          localStorage.setItem("token", newToken);
          if (api.defaults.headers.common) {
            api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
          }
          processQueue(null, newToken);
          return api(originalRequest);
        }
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export const axiosFetcher = (url: string) => api.get(url).then((r) => r.data);

export default api;
