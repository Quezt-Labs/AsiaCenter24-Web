import { useQuery } from "@tanstack/react-query";
import { getProductById, getProductBySlug } from "@/api/products";

export function useProductById(id: string | null, country?: string) {
  return useQuery({
    queryKey: ["product", id, country],
    queryFn: () => getProductById(id!, country),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}

export function useProductBySlug(slug: string | null, country?: string) {
  return useQuery({
    queryKey: ["product", "slug", slug, country],
    queryFn: () => getProductBySlug(slug!, country),
    enabled: !!slug,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}
