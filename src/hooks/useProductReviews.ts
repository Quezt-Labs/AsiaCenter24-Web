import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
} from "@/api/reviews";
import type { CreateReviewInput, UpdateReviewInput } from "@/types/api";

export function useProductReviews(productId: string | null) {
  return useQuery({
    queryKey: ["product-reviews", productId],
    queryFn: () => getProductReviews(productId!),
    enabled: !!productId,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}

export function useCreateReview(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateReviewInput) =>
      createReview(productId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] });
    },
  });
}

export function useUpdateReview(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateReviewInput }) =>
      updateReview(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] });
    },
  });
}

export function useDeleteReview(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] });
    },
  });
}
