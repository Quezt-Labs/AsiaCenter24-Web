import api from "@/lib/api";
import type {
  ApiReview,
  CreateReviewInput,
  UpdateReviewInput,
} from "@/types/api";
import type { Review } from "@/types/product";
import { formatDistanceToNow } from "date-fns";

function mapApiReviewToReview(apiRev: ApiReview): Review {
  const dateStr =
    apiRev.createdAt ?? apiRev.created_at ?? new Date().toISOString();
  let dateFormatted: string;
  try {
    dateFormatted = formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    dateFormatted = dateStr;
  }
  return {
    id: apiRev.id,
    userName: apiRev.userName ?? apiRev.user_name ?? "Anonymous",
    rating: apiRev.rating,
    comment: apiRev.comment,
    date: dateFormatted,
    verified: apiRev.verified ?? false,
  };
}

/**
 * Get all reviews for a product.
 */
export async function getProductReviews(productId: string): Promise<Review[]> {
  const { data } = await api.get<ApiReview[]>(`/products/${productId}/reviews`);
  const list = Array.isArray(data) ? data : [];
  return list.map(mapApiReviewToReview);
}

/**
 * Create a review for a product (requires authentication).
 */
export async function createReview(
  productId: string,
  input: CreateReviewInput,
): Promise<Review> {
  const { data } = await api.post<ApiReview>(
    `/products/${productId}/reviews`,
    input,
  );
  return mapApiReviewToReview(data);
}

/**
 * Update your own review (requires authentication).
 */
export async function updateReview(
  id: string,
  input: UpdateReviewInput,
): Promise<Review> {
  const { data } = await api.patch<ApiReview>(`/reviews/${id}`, input);
  return mapApiReviewToReview(data);
}

/**
 * Delete your own review (requires authentication).
 */
export async function deleteReview(id: string): Promise<void> {
  await api.delete(`/reviews/${id}`);
}
