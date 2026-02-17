import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Address } from "@/types/product";

interface AddressState {
  addresses: Address[];
  addAddress: (address: Omit<Address, "id">) => Address;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  getDefaultAddress: () => Address | undefined;
}

export const useAddressStore = create<AddressState>()(
  persist(
    (set, get) => ({
      addresses: [],

      addAddress: (addressData) => {
        const newAddress: Address = {
          ...addressData,
          id: `addr_${Date.now()}`,
          isDefault: get().addresses.length === 0, // First address is default
        };

        set((state) => ({
          addresses: [...state.addresses, newAddress],
        }));

        return newAddress;
      },

      updateAddress: (id, updatedData) => {
        set((state) => ({
          addresses: state.addresses.map((addr) =>
            addr.id === id ? { ...addr, ...updatedData } : addr,
          ),
        }));
      },

      deleteAddress: (id) => {
        set((state) => {
          const filtered = state.addresses.filter((addr) => addr.id !== id);
          // If deleted address was default, make first one default
          if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
            filtered[0].isDefault = true;
          }
          return { addresses: filtered };
        });
      },

      setDefaultAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.map((addr) => ({
            ...addr,
            isDefault: addr.id === id,
          })),
        }));
      },

      getDefaultAddress: () => {
        return get().addresses.find((addr) => addr.isDefault);
      },
    }),
    {
      name: "freshmart-addresses",
    },
  ),
);
