import api from "@/lib/api";
import type { ApiProduct, ApiProductFaq } from "@/types/api";
import type { Product, NutritionalInfo } from "@/types/product";

function mapWeightOption(opt: {
  weight: string;
  price: number;
  originalPrice?: number;
  original_price?: number;
}) {
  const orig = opt.originalPrice ?? opt.original_price ?? opt.price;
  return { weight: opt.weight, price: opt.price, originalPrice: orig };
}

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop";

export function mapApiProductToProduct(apiProd: ApiProduct): Product {
  const cat = apiProd.category;
  const categorySlug =
    apiProd.categorySlug ??
    apiProd.category_slug ??
    cat?.slug ??
    "";
  const categoryName = cat?.name ?? "";
  const weightOpts = apiProd.weightOptions ?? apiProd.weight_options ?? [];
  const variants = apiProd.variants ?? [];
  const firstVariant = variants[0] as
    | { price?: number; originalPrice?: number; original_price?: number; weight?: string }
    | undefined;
  const hasWeightOpts = weightOpts.length > 0;
  const basePrice =
    apiProd.price ??
    firstVariant?.price ??
    firstVariant?.originalPrice ??
    firstVariant?.original_price ??
    0;
  const baseOrig =
    apiProd.originalPrice ??
    apiProd.original_price ??
    firstVariant?.originalPrice ??
    firstVariant?.original_price ??
    basePrice;
  const rawImages = apiProd.images ?? (apiProd.image ? [apiProd.image] : []);
  const images = Array.isArray(rawImages) ? rawImages : [];
  const mainImage = apiProd.image ?? images[0] ?? PLACEHOLDER_IMAGE;
  const rating =
    apiProd.rating ??
    (typeof apiProd.averageRating === "string"
      ? parseFloat(apiProd.averageRating) || 0
      : ((apiProd.averageRating as number) ?? 0));

  return {
    id: apiProd.id,
    slug: apiProd.slug ?? apiProd.id,
    name: apiProd.name,
    nameHi: apiProd.nameHi ?? apiProd.name,
    brand: apiProd.brand ?? "",
    category: categoryName,
    categorySlug: categorySlug || "",
    description: apiProd.description ?? apiProd.shortDescription ?? "",
    descriptionHi: apiProd.descriptionHi ?? apiProd.description ?? "",
    price: basePrice,
    originalPrice: baseOrig,
    discount:
      apiProd.discount ??
      (baseOrig > 0 ? Math.round((1 - basePrice / baseOrig) * 100) || 0 : 0),
    unit: apiProd.unit ?? "kg",
    weightOptions: hasWeightOpts
      ? weightOpts.map(mapWeightOption)
      : [{ weight: "1 unit", price: basePrice, originalPrice: baseOrig }],
    image: mainImage || PLACEHOLDER_IMAGE,
    images: images.length > 0 ? images : [mainImage || PLACEHOLDER_IMAGE],
    rating,
    reviewCount: apiProd.reviewCount ?? apiProd.review_count ?? 0,
    inStock: apiProd.inStock ?? apiProd.in_stock ?? true,
    isBestSeller: apiProd.isBestSeller ?? apiProd.is_best_seller ?? false,
    isNewArrival: apiProd.isNewArrival ?? apiProd.is_new_arrival ?? false,
    isFeatured: apiProd.isFeatured ?? apiProd.is_featured ?? false,
    nutritionalInfo: (apiProd.nutritionalInfo ?? apiProd.nutritional_info) as
      | NutritionalInfo
      | undefined,
    storageInstructions:
      apiProd.storageInstructions ?? apiProd.storage_instructions,
    tags: apiProd.tags ?? [],
  };
}

export interface GetProductsParams {
  categoryId?: string;
  isActive?: boolean;
  country?: string;
  limit?: number;
  page?: number;
}

/** Paginated API response */
interface PaginatedProductsResponse {
  items?: ApiProduct[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

/**
 * Get a list of products with optional filtering and tax calculation.
 * Handles both flat array and paginated { items, total } responses.
 */
export async function getProducts(
  params?: GetProductsParams,
): Promise<Product[]> {
  const result = await getProductsPaginated(params);
  return result.products;
}

export interface ProductsPaginatedResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Get products with pagination metadata.
 */
export async function getProductsPaginated(
  params?: GetProductsParams,
): Promise<ProductsPaginatedResult> {
  const { data } = await api.get<ApiProduct[] | PaginatedProductsResponse>(
    "/products",
    { params: { ...params, limit: params?.limit ?? 12 } },
  );
  const isPaginated = data && !Array.isArray(data) && "items" in data;
  const list = Array.isArray(data)
    ? data
    : isPaginated && Array.isArray((data as PaginatedProductsResponse).items)
      ? (data as PaginatedProductsResponse).items!
      : [];
  const paginated = data as PaginatedProductsResponse | undefined;
  return {
    products: list.map(mapApiProductToProduct),
    total: paginated?.total ?? list.length,
    page: paginated?.page ?? 1,
    limit: paginated?.limit ?? params?.limit ?? 12,
    totalPages: paginated?.totalPages ?? 1,
  };
}

/**
 * Get a product by ID with tax calculation.
 */
export async function getProductById(
  id: string,
  country?: string,
): Promise<Product | null> {
  try {
    const { data } = await api.get<ApiProduct>(`/products/${id}`, {
      params: country ? { country } : undefined,
    });
    return data ? mapApiProductToProduct(data) : null;
  } catch {
    return null;
  }
}

/**
 * Get a product by slug with tax calculation.
 * Uses PRODUCT_SLUG_PATH env: "slug" → /products/slug/{slug}, else → /products/{slug}
 */
export async function getProductBySlug(
  slug: string,
  country?: string,
): Promise<Product | null> {
  const useSlugPath = process.env.NEXT_PUBLIC_PRODUCT_SLUG_PATH === "slug";
  const path = useSlugPath ? `products/slug/${slug}` : `products/${slug}`;
  try {
    const { data } = await api.get<ApiProduct>(`/${path}`, {
      params: country ? { country } : undefined,
    });
    return data ? mapApiProductToProduct(data) : null;
  } catch {
    return null;
  }
}

/**
 * Get all FAQs for a specific product.
 */
export async function getProductFaqs(
  productId: string,
): Promise<ApiProductFaq[]> {
  try {
    const { data } = await api.get<ApiProductFaq[]>(
      `/products/${productId}/faqs`,
    );
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
