export type BannerPlacement =
  | "HOME_HERO"
  | "HOME_SECONDARY"
  | "CATEGORY_TOP"
  | "CATEGORY_SIDEBAR"
  | "PRODUCT_PAGE"
  | "CART_PAGE"
  | "CHECKOUT_PAGE"
  | "FOOTER";

export interface Banner {
  id: string;
  campaignId: string;
  title: string;
  subtitle: string;
  imageDesktopUrl: string;
  imageMobileUrl: string;
  ctaText: string;
  ctaLink: string;
  placement: BannerPlacement;
  priority: number;
  isActive: boolean;
  startAt: string;
  endAt: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
