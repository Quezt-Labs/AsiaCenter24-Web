import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, CartItem } from "@/types/product";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCartApi,
} from "@/api/cart";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

function getVariantId(
  product: Product,
  selectedWeight: string,
): string | undefined {
  const wo = product.weightOptions.find((w) => w.weight === selectedWeight);
  return (wo as { variantId?: string } | undefined)?.variantId;
}

interface CartState {
  items: CartItem[];
  isSyncing: boolean;
  hasUnavailableItems: boolean;

  setItems: (items: CartItem[]) => void;
  fetchCart: () => Promise<void>;
  addItem: (product: Product, quantity?: number, weight?: string) => void;
  addItemAsync: (
    product: Product,
    quantity?: number,
    weight?: string,
  ) => Promise<void>;
  removeItem: (productId: string, selectedWeight?: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    selectedWeight?: string,
  ) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getDiscount: () => number;
  getDeliveryCharge: () => number;
  getTotal: () => number;
}

function addItemLocal(
  set: (fn: (s: CartState) => Partial<CartState>) => void,
  get: () => CartState,
  product: Product,
  quantity: number,
  selectedWeight: string,
) {
  set((state) => {
    const existingItem = state.items.find(
      (item) =>
        item.product.id === product.id &&
        item.selectedWeight === selectedWeight,
    );
    const variantId = getVariantId(product, selectedWeight);
    const newItem: CartItem = {
      product,
      quantity: existingItem ? existingItem.quantity + quantity : quantity,
      selectedWeight,
      variantId,
    };
    if (existingItem) {
      return {
        items: state.items.map((item) =>
          item.product.id === product.id &&
          item.selectedWeight === selectedWeight
            ? newItem
            : item,
        ),
      };
    }
    return { items: [...state.items, newItem] };
  });
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isSyncing: false,
      hasUnavailableItems: false,

      setItems: (items) => set({ items }),

      fetchCart: async () => {
        const isAuth = useAuthStore.getState().isAuthenticated;
        if (!isAuth) return;
        set({ isSyncing: true });
        try {
          const result = await getCart("IN");
          set({
            items: result.items,
            hasUnavailableItems: result.hasUnavailableItems,
            isSyncing: false,
          });
        } catch {
          set({ isSyncing: false });
        }
      },

      addItem: (product, quantity = 1, weight) => {
        const selectedWeight = weight || product.weightOptions[0]?.weight || "";
        const isAuth = useAuthStore.getState().isAuthenticated;
        const variantId = getVariantId(product, selectedWeight);

        if (isAuth && variantId) {
          get().addItemAsync(product, quantity, selectedWeight);
        } else {
          addItemLocal(set, get, product, quantity, selectedWeight);
          if (isAuth && !variantId) {
            console.warn(
              "Cart: Product variant has no variantId; not syncing to backend.",
            );
          }
        }
      },

      addItemAsync: async (product, quantity = 1, weight) => {
        const selectedWeight = weight || product.weightOptions[0]?.weight || "";
        const variantId = getVariantId(product, selectedWeight);
        if (!variantId) {
          addItemLocal(set, get, product, quantity, selectedWeight);
          return;
        }
        try {
          await addToCart(variantId, quantity);
          await get().fetchCart();
        } catch (err: unknown) {
          const msg =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message ?? "";
          toast.error(
            msg?.toLowerCase().includes("stock")
              ? "Insufficient stock"
              : "Failed to add to cart",
          );
        }
      },

      removeItem: (productId, selectedWeight) => {
        const state = get();
        const item = state.items.find(
          (i) =>
            i.product.id === productId &&
            (selectedWeight == null || i.selectedWeight === selectedWeight),
        );
        const isAuth = useAuthStore.getState().isAuthenticated;

        if (isAuth && item?.variantId) {
          set({ isSyncing: true });
          removeCartItem(item.variantId)
            .then(() => get().fetchCart())
            .catch(() => {
              set({ isSyncing: false });
              toast.error("Failed to remove item");
            });
        } else {
          set((s) => ({
            items: s.items.filter(
              (i) =>
                i.product.id !== productId ||
                (selectedWeight != null && i.selectedWeight !== selectedWeight),
            ),
          }));
        }
      },

      updateQuantity: (productId, quantity, selectedWeight) => {
        if (quantity <= 0) {
          get().removeItem(productId, selectedWeight);
          return;
        }

        const state = get();
        const item = state.items.find(
          (i) =>
            i.product.id === productId &&
            (selectedWeight == null || i.selectedWeight === selectedWeight),
        );
        const isAuth = useAuthStore.getState().isAuthenticated;

        if (isAuth && item?.variantId) {
          set({ isSyncing: true });
          updateCartItem(item.variantId, quantity)
            .then(() => get().fetchCart())
            .catch(() => {
              set({ isSyncing: false });
              toast.error("Failed to update quantity");
            });
        } else {
          set((s) => ({
            items: s.items.map((i) =>
              i.product.id === productId &&
              (selectedWeight == null || i.selectedWeight === selectedWeight)
                ? { ...i, quantity }
                : i,
            ),
          }));
        }
      },

      clearCart: () => {
        const isAuth = useAuthStore.getState().isAuthenticated;
        if (isAuth) {
          set({ isSyncing: true });
          clearCartApi()
            .then(() => set({ items: [], isSyncing: false }))
            .catch(() => {
              set({ isSyncing: false });
              toast.error("Failed to clear cart");
            });
        } else {
          set({ items: [] });
        }
      },

      getItemCount: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((total, item) => {
          const wo = item.product.weightOptions.find(
            (w) => w.weight === item.selectedWeight,
          );
          const price = wo?.price ?? item.product.price;
          return total + price * item.quantity;
        }, 0),

      getDiscount: () =>
        get().items.reduce((total, item) => {
          const wo = item.product.weightOptions.find(
            (w) => w.weight === item.selectedWeight,
          );
          const orig = wo?.originalPrice ?? item.product.originalPrice;
          const price = wo?.price ?? item.product.price;
          return total + (orig - price) * item.quantity;
        }, 0),

      getDeliveryCharge: () => {
        const subtotal = get().getSubtotal();
        return subtotal >= 499 ? 0 : 40;
      },

      getTotal: () => get().getSubtotal() + get().getDeliveryCharge(),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
