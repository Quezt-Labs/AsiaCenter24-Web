import api from "@/lib/api";
import type { ApiProduct, ApiCategoryWithProducts } from "@/types/api";
import type { Product, Category } from "@/types/product";
import { mapApiProductToProduct } from "@/api/products";

export interface LandingParams {
  country?: string;
  limit?: number;
}

/**
 * Get featured products for the landing page with tax calculation.
 */
export async function getFeaturedProducts(
  params?: LandingParams
): Promise<Product[]> {
  const { data } = await api.get<ApiProduct[]>("/landing/featured-products", {
    params: { limit: params?.limit ?? 10, country: params?.country },
  });
  const list = Array.isArray(data) ? data : [];
  return list.map(mapApiProductToProduct);
}

/**
 * Get trending products for the landing page with tax calculation.
 */
export async function getTrendingProducts(
  params?: LandingParams
): Promise<Product[]> {
  const { data } = await api.get<ApiProduct[]>("/landing/trending-products", {
    params: { limit: params?.limit ?? 10, country: params?.country },
  });
  const list = Array.isArray(data) ? data : [];
  return list.map(mapApiProductToProduct);
}

/**
 * Get popular products sorted by popularity score with tax calculation.
 */
export async function getPopularProducts(
  params?: LandingParams
): Promise<Product[]> {
  const { data } = await api.get<ApiProduct[]>("/landing/popular-products", {
    params: { limit: params?.limit ?? 10, country: params?.country },
  });
  const list = Array.isArray(data) ? data : [];
  return list.map(mapApiProductToProduct);
}

/**
 * Get top-level categories with a few products each for the landing page.
 */
export async function getCategoriesWithProducts(
  params?: LandingParams
): Promise<Category[]> {
  const { data } = await api.get<ApiCategoryWithProducts[]>(
    "/landing/categories-with-products",
    {
      params: { limit: params?.limit ?? 6, country: params?.country },
    }
  );
  const list = Array.isArray(data) ? data : [];
  return list.map((cat) => {
    const products = cat.products ?? [];
    const productCount =
      cat.productCount ?? cat.product_count ?? products.length;
    return {
      id: cat.id,
      name: cat.name,
      nameHi: cat.nameHi ?? cat.name,
      slug: cat.slug,
      icon: cat.icon ?? "📦",
      image:
        cat.image ??
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
      productCount,
    };
  });
}

/**
 * Get products for a specific category with tax calculation.
 */
export async function getCategoryProducts(
  categoryId: string,
  params?: Omit<LandingParams, "limit"> & { limit?: number }
): Promise<Product[]> {
  const { data } = await api.get<ApiProduct[]>(
    `/landing/category/${categoryId}/products`,
    {
      params: { limit: params?.limit ?? 12, country: params?.country },
    }
  );
  const list = Array.isArray(data) ? data : [];
  return list.map(mapApiProductToProduct);
}
