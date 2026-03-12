import { useCallback } from "react";
import { useFavorites, useAddFavorite, useRemoveFavorite } from "./useFavorites";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAuthStore } from "@/store/useAuthStore";
import type { Product } from "@/types/product";

/**
 * Unified wishlist hook: uses API when authenticated, local store when not.
 * Same interface for ProductCard, ProductDetailClient, HeaderClient.
 */
export function useWishlist() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: apiFavorites = [], isLoading } = useFavorites();
  const addFavoriteMutation = useAddFavorite();
  const removeFavoriteMutation = useRemoveFavorite();

  const localAddItem = useWishlistStore((s) => s.addItem);
  const localRemoveItem = useWishlistStore((s) => s.removeItem);
  const localIsInWishlist = useWishlistStore((s) => s.isInWishlist);
  const localItems = useWishlistStore((s) => s.items);

  const items = isAuthenticated
    ? apiFavorites.map((p) => ({ product: p, addedAt: new Date() }))
    : localItems;

  const isInWishlist = useCallback(
    (productId: string) => {
      if (isAuthenticated) {
        return apiFavorites.some((p) => p.id === productId);
      }
      return localIsInWishlist(productId);
    },
    [isAuthenticated, apiFavorites, localIsInWishlist],
  );

  const toggleItem = useCallback(
    (product: Product) => {
      if (isAuthenticated) {
        const inList = apiFavorites.some((p) => p.id === product.id);
        if (inList) {
          removeFavoriteMutation.mutate(product.id);
        } else {
          addFavoriteMutation.mutate(product.id);
        }
      } else {
        if (localIsInWishlist(product.id)) {
          localRemoveItem(product.id);
        } else {
          localAddItem(product);
        }
      }
    },
    [
      isAuthenticated,
      apiFavorites,
      addFavoriteMutation,
      removeFavoriteMutation,
      localAddItem,
      localRemoveItem,
      localIsInWishlist,
    ],
  );

  return {
    items,
    itemCount: items.length,
    isInWishlist,
    toggleItem,
    isLoading,
    isPending:
      addFavoriteMutation.isPending || removeFavoriteMutation.isPending,
  };
}
