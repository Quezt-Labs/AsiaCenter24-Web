import axios from "axios";
import api from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

// ─── Types ───────────────────────────────────────────────────────────────

export type CountryCode = "IN" | "DE";

export interface RequestOTPInput {
  phone: string;
  countryCode: CountryCode;
}

export interface RequestOTPResponse {
  success: boolean;
}

export interface RefreshTokenInput {
  refreshToken: string;
  deviceId?: string;
  deviceSecret?: string;
}

export interface RefreshTokenResponse {
  accessToken?: string;
  token?: string; // some APIs use `token`
  refreshToken?: string;
  expiresIn?: number;
}

export interface VerifyOTPInput {
  phone: string;
  countryCode: CountryCode;
  otp: string;
  deviceId: string;
}

export interface VerifyOTPResponse {
  accessToken?: string;
  token?: string;
  refreshToken?: string;
  user?: {
    id: string;
    phone: string;
    firstName?: string | null;
    lastName?: string | null;
  };
  isNewUser?: boolean;
  deviceSecret?: string;
}

// ─── API functions (used by hooks + interceptor) ───────────────────────────

export async function requestOTP(
  input: RequestOTPInput,
): Promise<RequestOTPResponse> {
  const { data } = await api.post<RequestOTPResponse>(
    "/auth/request-otp",
    input,
  );
  return data;
}

export async function verifyOTP(
  input: VerifyOTPInput,
): Promise<VerifyOTPResponse> {
  const { data } = await api.post<VerifyOTPResponse>("/auth/verify-otp", input);
  return data;
}

/** Used by axios interceptor — uses raw axios to avoid interceptor loop */
export async function refreshAccessToken(
  input: RefreshTokenInput,
): Promise<RefreshTokenResponse> {
  const { data } = await axios.post<RefreshTokenResponse>(
    `${API_BASE}/auth/refresh`,
    input,
    {
      headers: {
        "Content-Type": "application/json",
        "client-type": "WEB",
      },
    },
  );
  return data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}
