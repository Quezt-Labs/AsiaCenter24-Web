import api from "@/lib/api";
import type { ApiCategory } from "@/types/api";
import type { Category } from "@/types/product";

function mapApiCategoryToCategory(apiCat: ApiCategory): Category {
  const productCount = apiCat.productCount ?? apiCat.product_count ?? 0;
  return {
    id: apiCat.id,
    name: apiCat.name,
    nameHi: apiCat.nameHi ?? apiCat.name,
    slug: apiCat.slug,
    icon: apiCat.icon ?? "📦",
    image:
      apiCat.image ??
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop",
    productCount,
  };
}

export interface GetCategoriesParams {
  isActive?: boolean;
  limit?: number;
  page?: number;
}

/** Paginated API response */
interface PaginatedCategoriesResponse {
  items?: ApiCategory[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

/**
 * Get a list of all product categories.
 * Handles both flat array and paginated { items, total } responses.
 */
export async function getCategories(
  params?: GetCategoriesParams,
): Promise<Category[]> {
  const { data } = await api.get<ApiCategory[] | PaginatedCategoriesResponse>(
    "/categories",
    { params },
  );
  const list = Array.isArray(data)
    ? data
    : data && "items" in data && Array.isArray(data.items)
      ? data.items
      : [];
  return list.map(mapApiCategoryToCategory);
}

/**
 * Get a category by ID.
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const { data } = await api.get<ApiCategory>(`/categories/${id}`);
    return data ? mapApiCategoryToCategory(data) : null;
  } catch {
    return null;
  }
}
