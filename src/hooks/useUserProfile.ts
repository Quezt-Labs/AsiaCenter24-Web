import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
} from "@/api/user";
import type { UpdateProfileInput } from "@/api/user";
import { useAuthStore } from "@/store/useAuthStore";

export function useUserProfile() {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: getUserProfile,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => updateUserProfile(input),
    onSuccess: (data) => {
      const name = [data.firstName, data.lastName].filter(Boolean).join(" ").trim();
      setUser({
        id: data.id,
        phone: data.phone,
        name: name || undefined,
        isVerified: true,
      });
      queryClient.setQueryData(["user", "profile"], data);
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const logout = useAuthStore((s) => s.logout);

  return useMutation({
    mutationFn: deleteUserAccount,
    onSuccess: () => {
      queryClient.clear();
      logout();
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/";
      }
    },
  });
}
