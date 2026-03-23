"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";
import { addToCart } from "@/api/cart";

/**
 * Syncs cart with backend when authenticated.
 * - On login: merges local (guest) cart into backend, then fetches cart
 * - On logout: clears local cart
 * - When already auth on mount: fetches cart from API
 */
export function useCartSync() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const fetchCart = useCartStore((s) => s.fetchCart);
  const setItems = useCartStore((s) => s.setItems);
  const prevAuthRef = useRef(isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      if (prevAuthRef.current) {
        setItems([]);
      }
      prevAuthRef.current = false;
      return;
    }

    const wasJustLoggedIn = !prevAuthRef.current;
    prevAuthRef.current = true;

    const run = async () => {
      if (wasJustLoggedIn) {
        const items = useCartStore.getState().items;
        const toMerge = items.filter((i) => i.variantId);
        for (const item of toMerge) {
          if (item.variantId) {
            try {
              await addToCart(item.variantId, item.quantity);
            } catch {
              // Continue with others; fetchCart will get server state
            }
          }
        }
      }
      await fetchCart();
    };

    run();
  }, [isAuthenticated, fetchCart, setItems]);
}
