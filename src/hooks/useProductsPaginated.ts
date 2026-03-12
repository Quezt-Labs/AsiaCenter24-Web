import { useQuery } from "@tanstack/react-query";
import {
  getProductsPaginated,
  type GetProductsParams,
} from "@/api/products";

export function useProductsPaginated(params?: GetProductsParams) {
  return useQuery({
    queryKey: ["products", "paginated", params],
    queryFn: () => getProductsPaginated(params),
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}
