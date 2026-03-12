import { useQuery } from "@tanstack/react-query";
import {
  getFeaturedProducts,
  getTrendingProducts,
  getPopularProducts,
  getCategoriesWithProducts,
  getCategoryProducts,
} from "@/api/landing";
import type { LandingParams } from "@/api/landing";

export function useFeaturedProducts(params?: LandingParams) {
  return useQuery({
    queryKey: ["landing", "featured", params],
    queryFn: () => getFeaturedProducts(params),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useTrendingProducts(params?: LandingParams) {
  return useQuery({
    queryKey: ["landing", "trending", params],
    queryFn: () => getTrendingProducts(params),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function usePopularProducts(params?: LandingParams) {
  return useQuery({
    queryKey: ["landing", "popular", params],
    queryFn: () => getPopularProducts(params),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useCategoriesWithProducts(params?: LandingParams) {
  return useQuery({
    queryKey: ["landing", "categories-with-products", params],
    queryFn: () => getCategoriesWithProducts(params),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useCategoryProducts(
  categoryId: string | null,
  params?: Omit<LandingParams, "limit"> & { limit?: number }
) {
  return useQuery({
    queryKey: ["landing", "category-products", categoryId, params],
    queryFn: () => getCategoryProducts(categoryId!, params),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
