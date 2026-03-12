import { useQuery } from "@tanstack/react-query";
import { getBannersByPlacement } from "@/api/banners";
import type { BannerPlacement } from "@/types/banner";

export function useBanners(placement: BannerPlacement) {
  return useQuery({
    queryKey: ["banners", placement],
    queryFn: () => getBannersByPlacement(placement),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
