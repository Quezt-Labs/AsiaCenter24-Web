"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Heart, ChevronRight } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuthStore } from "@/store/useAuthStore";
import ProductCard from "@/components/products/ProductCard";

export default function WishlistPage() {
  const t = useTranslations();
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const { items, isLoading } = useWishlist();

  return (
    <main className="container-app py-6 sm:py-10">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          {t("home")}
        </Link>
        <ChevronRight size={14} />
        <span className="text-foreground font-medium">{t("wishlist")}</span>
      </nav>

      <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">
        {t("wishlist")}
      </h1>

      {!isAuthenticated && items.length === 0 && (
        <div className="max-w-md mx-auto text-center py-16">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Heart size={32} className="text-primary" />
          </div>
          <p className="text-muted-foreground mb-6">{t("loginToViewWishlist")}</p>
          <button
            onClick={() => openAuthModal()}
            className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors"
          >
            {t("login")}
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl bg-secondary/30 animate-pulse"
            />
          ))}
        </div>
      ) : items.length > 0 ? (
        <>
          <p className="text-muted-foreground mb-6">
            {items.length} {t("items")}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
            {items.map(({ product }, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </>
      ) : isAuthenticated ? (
        <div className="max-w-md mx-auto text-center py-16">
          <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
            <Heart size={32} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-6">{t("emptyWishlist")}</p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors"
          >
            {t("startShopping")}
          </Link>
        </div>
      ) : null}
    </main>
  );
}
