"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  requestOTP,
  verifyOTP,
  logout as logoutApi,
  type RequestOTPInput,
  type VerifyOTPInput,
} from "@/api/auth";
import { useAuthStore } from "@/store/useAuthStore";

const AUTH_KEYS = {
  all: ["auth"] as const,
};

// ─── Request OTP ──────────────────────────────────────────────────────────

export function useRequestOTP() {
  return useMutation({
    mutationFn: (input: RequestOTPInput) => requestOTP(input),
    meta: { action: "requestOTP" },
  });
}

// ─── Verify OTP ───────────────────────────────────────────────────────────

export function useVerifyOTP() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (input: VerifyOTPInput) => verifyOTP(input),
    onSuccess: (data) => {
      const token = data.accessToken ?? (data as { token?: string }).token;
      const user = data.user;
      if (typeof window !== "undefined" && token) {
        localStorage.setItem("token", token);
      }
      if (data.refreshToken && typeof window !== "undefined") {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
      if (user) {
        setUser({
          id: user.id,
          phone: user.phone,
          name: user.name,
          isVerified: user.isVerified,
        });
      }
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.all });
      // Modal controls its own close/redirect flow for UX (success animation)
    },
    meta: { action: "verifyOTP" },
  });
}

// ─── Logout ───────────────────────────────────────────────────────────────

export function useLogout() {
  const queryClient = useQueryClient();
  const clearStore = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      }
      clearStore();
      queryClient.clear();
    },
    meta: { action: "logout" },
  });
}
