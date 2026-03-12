import api from "@/lib/api";

export interface UserProfile {
  id: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
}

function normalizeProfile(data: UserProfile): UserProfile {
  return {
    id: data.id,
    phone: data.phone,
    firstName: data.firstName ?? data.first_name ?? "",
    lastName: data.lastName ?? data.last_name ?? "",
  };
}

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
}

/**
 * Get the authenticated user's profile information.
 */
export async function getUserProfile(): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>("/user/profile");
  return normalizeProfile(data);
}

/**
 * Update the authenticated user's profile information.
 */
export async function updateUserProfile(
  input: UpdateProfileInput,
): Promise<UserProfile> {
  const { data } = await api.patch<UserProfile>("/user/profile", input);
  return normalizeProfile(data);
}

/**
 * Permanently delete the authenticated user's account.
 */
export async function deleteUserAccount(): Promise<{ success: boolean }> {
  const { data } = await api.delete<{ success: boolean }>("/user/account");
  return data;
}
