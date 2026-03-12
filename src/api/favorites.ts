import api from "@/lib/api";
import type { ApiProduct } from "@/types/api";
import type { Product } from "@/types/product";
import { mapApiProductToProduct } from "@/api/products";

/**
 * Get user's favorite products (requires authentication).
 */
export async function getFavorites(): Promise<Product[]> {
  const { data } = await api.get<ApiProduct[]>("/favorites");
  const list = Array.isArray(data) ? data : [];
  return list.map(mapApiProductToProduct);
}

/**
 * Add a product to favorites (requires authentication).
 */
export async function addFavorite(productId: string): Promise<void> {
  await api.post("/favorites", { productId });
}

/**
 * Remove a product from favorites (requires authentication).
 */
export async function removeFavorite(productId: string): Promise<void> {
  await api.delete(`/favorites/${productId}`);
}
