import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, CartItem } from '@/types/product';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, weight?: string) => void;
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

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, weight) => {
        const selectedWeight = weight || product.weightOptions[0]?.weight || '';
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id && item.selectedWeight === selectedWeight
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id && item.selectedWeight === selectedWeight
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          return {
            items: [...state.items, { product, quantity, selectedWeight }],
          };
        });
      },

      removeItem: (productId, selectedWeight) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              item.product.id !== productId ||
              (selectedWeight != null && item.selectedWeight !== selectedWeight),
          ),
        }));
      },

      updateQuantity: (productId, quantity, selectedWeight) => {
        if (quantity <= 0) {
          get().removeItem(productId, selectedWeight);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId &&
            (selectedWeight == null || item.selectedWeight === selectedWeight)
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const weightOption = item.product.weightOptions.find(
            (w) => w.weight === item.selectedWeight
          );
          const price = weightOption?.price || item.product.price;
          return total + price * item.quantity;
        }, 0);
      },

      getDiscount: () => {
        return get().items.reduce((total, item) => {
          const weightOption = item.product.weightOptions.find(
            (w) => w.weight === item.selectedWeight
          );
          const originalPrice = weightOption?.originalPrice || item.product.originalPrice;
          const price = weightOption?.price || item.product.price;
          return total + (originalPrice - price) * item.quantity;
        }, 0);
      },

      getDeliveryCharge: () => {
        const subtotal = get().getSubtotal();
        return subtotal >= 499 ? 0 : 40;
      },

      getTotal: () => {
        return get().getSubtotal() + get().getDeliveryCharge();
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
