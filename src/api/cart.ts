import api from "@/lib/api";
import { getProductById } from "@/api/products";
import type { CartItem, Product } from "@/types/product";

/** API cart item - flexible for various backend response shapes */
export interface ApiCartItem {
  variantId?: string;
  variant_id?: string;
  quantity: number;
  price?: string | number;
  productId?: string;
  product_id?: string;
  product?: Partial<Product> & {
    id?: string;
    name?: string;
    nameHi?: string;
    image?: string;
    images?: string[];
    weightOptions?: Array<{
      weight: string;
      price: number;
      originalPrice: number;
      variantId?: string;
    }>;
  };
  weight?: string;
}

export interface ApiCartResponse {
  items?: ApiCartItem[];
  itemCount?: number;
  subtotal?: string;
  totalTax?: string;
  total?: string;
  currency?: string;
  hasUnavailableItems?: boolean;
}

const parseDecimal = (v: string | number | undefined): number =>
  typeof v === "number" ? v : parseFloat(String(v ?? 0)) || 0;

/**
 * Build a CartItem from API cart item.
 * Fetches full product if API item has productId but minimal product data.
 */
async function mapApiCartItemToCartItem(
  apiItem: ApiCartItem,
  country?: string,
): Promise<CartItem | null> {
  const variantId = apiItem.variantId ?? apiItem.variant_id;
  const productId =
    apiItem.productId ?? apiItem.product_id ?? apiItem.product?.id;
  const weight =
    apiItem.weight ?? apiItem.product?.weightOptions?.[0]?.weight ?? "1 unit";

  if (!variantId && !productId) return null;

  let product: Product | null = null;

  if (apiItem.product?.id && apiItem.product?.name) {
    // API returned enough product info - build minimal Product
    const p = apiItem.product;
    product = {
      id: p.id ?? productId ?? "",
      slug: p.slug ?? p.id,
      name: p.name ?? "",
      nameHi: p.nameHi ?? p.name ?? "",
      brand: p.brand ?? "",
      category: p.category ?? "",
      categorySlug: p.categorySlug ?? "",
      description: p.description ?? "",
      descriptionHi: p.descriptionHi ?? "",
      price: parseDecimal(p.price ?? apiItem.price),
      originalPrice:
        parseDecimal((p as { originalPrice?: number }).originalPrice) ||
        parseDecimal(p.price ?? apiItem.price),
      discount: p.discount ?? 0,
      unit: p.unit ?? "kg",
      weightOptions: p.weightOptions ?? [
        {
          weight,
          price: parseDecimal(apiItem.price),
          originalPrice: parseDecimal(apiItem.price),
        },
      ],
      image: p.image ?? p.images?.[0] ?? "",
      images: p.images ?? [],
      rating: p.rating ?? 0,
      reviewCount: p.reviewCount ?? 0,
      inStock: p.inStock ?? true,
      isBestSeller: p.isBestSeller ?? false,
      isNewArrival: p.isNewArrival ?? false,
      tags: p.tags ?? [],
    };
    const wo =
      product.weightOptions.find((w) => w.weight === weight) ??
      product.weightOptions[0];
    if (wo) {
      (wo as { variantId?: string }).variantId = variantId;
    }
  } else if (productId) {
    product = await getProductById(productId, country ?? "IN");
    if (product) {
      const wo =
        product.weightOptions.find((w) => w.weight === weight) ??
        product.weightOptions[0];
      if (wo && variantId) {
        (wo as { variantId?: string }).variantId = variantId;
      }
    }
  }

  if (!product) return null;

  return {
    product,
    quantity: apiItem.quantity,
    selectedWeight: weight,
    variantId: variantId,
  };
}

/**
 * Get the authenticated user's cart.
 */
export async function getCart(country = "IN"): Promise<{
  items: CartItem[];
  subtotal: number;
  totalTax: number;
  total: number;
  currency: string;
  hasUnavailableItems: boolean;
}> {
  const { data } = await api.get<ApiCartResponse>("/cart", {
    params: { country },
  });

  const apiItems = data?.items ?? [];
  const items: CartItem[] = [];
  for (const apiItem of apiItems) {
    const item = await mapApiCartItemToCartItem(apiItem, country);
    if (item) items.push(item);
  }

  return {
    items,
    subtotal: parseDecimal(data?.subtotal),
    totalTax: parseDecimal(data?.totalTax),
    total: parseDecimal(data?.total) || 0,
    currency: data?.currency ?? "INR",
    hasUnavailableItems: data?.hasUnavailableItems ?? false,
  };
}

/**
 * Add a product variant to the cart.
 */
export async function addToCart(
  variantId: string,
  quantity: number,
): Promise<void> {
  await api.post("/cart", { variantId, quantity });
}

/**
 * Update cart item quantity. Set quantity to 0 to remove.
 */
export async function updateCartItem(
  variantId: string,
  quantity: number,
): Promise<void> {
  await api.patch(`/cart/${variantId}`, { quantity });
}

/**
 * Remove a specific variant from the cart.
 */
export async function removeCartItem(variantId: string): Promise<void> {
  await api.delete(`/cart/${variantId}`);
}

/**
 * Clear the entire cart.
 */
export async function clearCartApi(): Promise<void> {
  await api.delete("/cart");
}
