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

export function mapApiProductToProduct(apiProd: ApiProduct): Product {
  const cat = apiProd.category;
  const categorySlug =
    apiProd.categorySlug ?? apiProd.category_slug ?? cat?.slug ?? "";
  const categoryName = cat?.name ?? "";
  const weightOpts = apiProd.weightOptions ?? apiProd.weight_options ?? [];
  const hasWeightOpts = weightOpts.length > 0;
  const basePrice = apiProd.price;
  const baseOrig =
    apiProd.originalPrice ?? apiProd.original_price ?? apiProd.price;
  const images = apiProd.images ?? (apiProd.image ? [apiProd.image] : []);
  const mainImage = apiProd.image ?? images[0] ?? "";

  return {
    id: apiProd.id,
    name: apiProd.name,
    nameHi: apiProd.nameHi ?? apiProd.name,
    brand: apiProd.brand ?? "",
    category: categoryName,
    categorySlug,
    description: apiProd.description ?? "",
    descriptionHi: apiProd.descriptionHi ?? apiProd.description ?? "",
    price: basePrice,
    originalPrice: baseOrig,
    discount:
      apiProd.discount ?? (Math.round((1 - basePrice / baseOrig) * 100) || 0),
    unit: apiProd.unit ?? "kg",
    weightOptions: hasWeightOpts
      ? weightOpts.map(mapWeightOption)
      : [{ weight: "1 unit", price: basePrice, originalPrice: baseOrig }],
    image: mainImage,
    images: images.length > 0 ? images : [mainImage],
    rating: apiProd.rating ?? 0,
    reviewCount: apiProd.reviewCount ?? apiProd.review_count ?? 0,
    inStock: apiProd.inStock ?? apiProd.in_stock ?? true,
    isBestSeller: apiProd.isBestSeller ?? apiProd.is_best_seller ?? false,
    isNewArrival: apiProd.isNewArrival ?? apiProd.is_new_arrival ?? false,
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
}

/**
 * Get a list of products with optional filtering and tax calculation.
 */
export async function getProducts(
  params?: GetProductsParams,
): Promise<Product[]> {
  const { data } = await api.get<ApiProduct[]>("/products", { params });
  const list = Array.isArray(data) ? data : [];
  return list.map(mapApiProductToProduct);
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
 */
export async function getProductBySlug(
  slug: string,
  country?: string,
): Promise<Product | null> {
  try {
    const { data } = await api.get<ApiProduct>(`/products/slug/${slug}`, {
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
