import { useQuery } from "@tanstack/react-query";
import { getProductFaqs } from "@/api/products";

export function useProductFaqs(productId: string | null) {
  return useQuery({
    queryKey: ["product-faqs", productId],
    queryFn: () => getProductFaqs(productId!),
    enabled: !!productId,
    staleTime: 10 * 60 * 1000,
    retry: 1,
  });
}
