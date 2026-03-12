import api from "@/lib/api";
import type { Banner } from "@/types/banner";
import type { BannerPlacement } from "@/types/banner";

/**
 * Get all active banners, optionally filtered by placement.
 * Returns banners sorted by priority (highest first).
 */
export async function getBanners(
  placement?: BannerPlacement,
): Promise<Banner[]> {
  const params = placement ? { placement } : {};
  const { data } = await api.get<Banner[]>("/banners", { params });
  return data ?? [];
}

/**
 * Get active banners for a specific placement slot.
 * Returns only banners that are active, within their date range, sorted by priority.
 */
export async function getBannersByPlacement(
  placement: BannerPlacement,
): Promise<Banner[]> {
  const { data } = await api.get<Banner[]>(`/banners/${placement}`);
  return data ?? [];
}
