import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/api/categories";
import type { GetCategoriesParams } from "@/api/categories";

export function useCategories(params?: GetCategoriesParams) {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => getCategories(params),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
