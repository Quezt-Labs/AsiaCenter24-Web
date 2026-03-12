/**
 * API response types for categories and products.
 * Flexible to handle camelCase or snake_case from backend.
 */

export interface ApiCategory {
  id: string;
  name: string;
  nameHi?: string;
  slug: string;
  image?: string;
  icon?: string;
  productCount?: number;
  product_count?: number;
  isActive?: boolean;
  is_active?: boolean;
}

export interface ApiCategoryWithProducts extends ApiCategory {
  products?: ApiProduct[];
}

export interface ApiWeightOption {
  weight: string;
  price: number;
  originalPrice?: number;
  original_price?: number;
}

export interface ApiVariant {
  id?: string;
  weight?: string;
  price?: number;
  originalPrice?: number;
  original_price?: number;
}

export interface ApiProduct {
  id: string;
  name: string;
  nameHi?: string;
  slug?: string;
  brand?: string;
  description?: string;
  descriptionHi?: string;
  shortDescription?: string;
  categoryId?: string;
  category_id?: string;
  category?: { id: string; name: string; slug: string };
  categorySlug?: string;
  category_slug?: string;
  price?: number;
  originalPrice?: number;
  original_price?: number;
  discount?: number;
  unit?: string;
  weightOptions?: ApiWeightOption[];
  weight_options?: ApiWeightOption[];
  image?: string;
  images?: string[];
  variants?: ApiVariant[];
  rating?: number;
  averageRating?: string | number;
  reviewCount?: number;
  review_count?: number;
  inStock?: boolean;
  in_stock?: boolean;
  isBestSeller?: boolean;
  is_best_seller?: boolean;
  isTrending?: boolean;
  isFeatured?: boolean;
  is_featured?: boolean;
  isNewArrival?: boolean;
  is_new_arrival?: boolean;
  nutritionalInfo?: Record<string, string>;
  nutritional_info?: Record<string, string>;
  storageInstructions?: string;
  storage_instructions?: string;
  tags?: string[];
}

export interface ApiProductFaq {
  id: string;
  question: string;
  answer: string;
  productId?: string;
  product_id?: string;
  order?: number;
}

export interface ApiReview {
  id: string;
  productId?: string;
  product_id?: string;
  userId?: string;
  user_id?: string;
  userName?: string;
  user_name?: string;
  variantId?: string;
  variant_id?: string;
  rating: number;
  comment: string;
  verified?: boolean;
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
}

export interface CreateReviewInput {
  variantId?: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewInput {
  rating?: number;
  comment?: string;
}
