import api from "@/lib/api";
import type { Address } from "@/types/product";

/** API address shape */
export interface ApiAddress {
  id: string;
  fullName: string;
  phoneE164: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

function mapApiAddressToAddress(apiAddr: ApiAddress): Address {
  return {
    id: apiAddr.id,
    name: apiAddr.fullName,
    phone: apiAddr.phoneE164,
    addressLine1: apiAddr.addressLine1,
    addressLine2: apiAddr.addressLine2,
    city: apiAddr.city,
    state: apiAddr.state,
    pincode: apiAddr.postalCode,
    isDefault: apiAddr.isDefault,
  };
}

export interface CreateAddressInput {
  fullName: string;
  phoneE164: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface UpdateAddressInput {
  fullName?: string;
  phoneE164?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  isDefault?: boolean;
}

/**
 * Get all addresses for the authenticated user.
 */
export async function getUserAddresses(): Promise<Address[]> {
  const { data } = await api.get<ApiAddress[]>("/user/addresses");
  const list = Array.isArray(data) ? data : [];
  return list.map(mapApiAddressToAddress);
}

/**
 * Get a specific address by ID.
 */
export async function getAddressById(id: string): Promise<Address | null> {
  try {
    const { data } = await api.get<ApiAddress>(`/user/addresses/${id}`);
    return data ? mapApiAddressToAddress(data) : null;
  } catch {
    return null;
  }
}

/**
 * Create a new address.
 */
export async function createAddress(
  input: CreateAddressInput,
): Promise<Address> {
  const { data } = await api.post<ApiAddress | undefined>("/user/addresses", {
    ...input,
    isDefault: input.isDefault ?? false,
  });
  if (!data) throw new Error("Address created but no response returned");
  return mapApiAddressToAddress(data);
}

/**
 * Update an existing address.
 */
export async function updateAddress(
  id: string,
  input: UpdateAddressInput,
): Promise<Address> {
  const { data } = await api.patch<ApiAddress>(`/user/addresses/${id}`, input);
  return mapApiAddressToAddress(data);
}

/**
 * Delete an address.
 */
export async function deleteAddress(id: string): Promise<void> {
  await api.delete(`/user/addresses/${id}`);
}

/**
 * Set an address as the default.
 */
export async function setDefaultAddress(id: string): Promise<Address> {
  const { data } = await api.patch<ApiAddress>(
    `/user/addresses/${id}/default`,
  );
  return mapApiAddressToAddress(data);
}
