"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Tag, Percent, Zap, Gift, Copy, Check } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import ProductCardSkeleton from "@/components/products/ProductCardSkeleton";
import { coupons } from "@/data/coupons";
import { useProducts } from "@/hooks/useProducts";
import { toast } from "sonner";

export default function OffersPage() {
  const t = useTranslations();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const { data: products = [], isLoading } = useProducts({
    isActive: true,
    limit: 50,
  });

  const discountedProducts = products
    .filter((p) => p.discount > 0)
    .sort((a, b) => b.discount - a.discount);
  const bestSellers = products.filter((p) => p.isBestSeller);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    toast.success(t("codeCopied"), {
      description: code,
    });
  };

  return (
    <div className="container-app py-4 sm:py-6">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden mb-6 sm:mb-8 gradient-deal p-6 sm:p-10 text-white"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={20} className="fill-white" />
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider opacity-90">
              {t("limitedTimeOffers")}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-2">
            {t("offersTitle")}
          </h1>
          <p className="text-sm sm:text-base opacity-90 max-w-lg">
            {t("offersSubtitle")}
          </p>
        </div>
        <div className="absolute top-0 right-0 w-40 h-40 sm:w-56 sm:h-56 opacity-10">
          <Percent className="w-full h-full" />
        </div>
      </motion.div>

      {/* Coupon Cards */}
      <section className="mb-8 sm:mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Gift size={20} className="text-accent" />
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            {t("availableCoupons")}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {coupons
            .filter((c) => c.isActive)
            .map((coupon) => (
              <motion.div
                key={coupon.code}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-card rounded-xl border-2 border-dashed border-accent/30 p-4 hover:border-accent/60 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-1 bg-accent/10 text-accent text-xs font-bold rounded-md uppercase">
                    {coupon.code}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(coupon.code)}
                    className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
                    aria-label="Copy code"
                  >
                    {copiedCode === coupon.code ? (
                      <Check size={14} className="text-primary" />
                    ) : (
                      <Copy size={14} className="text-muted-foreground" />
                    )}
                  </button>
                </div>
                <p className="text-sm font-semibold text-foreground mb-1">
                  {coupon.discountType === "percentage"
                    ? `${coupon.discountValue}% ${t("off")}`
                    : `${t("currency")}${coupon.discountValue} ${t("off")}`}
                  {coupon.maxDiscount && (
                    <span className="text-xs text-muted-foreground font-normal">
                      {" "}
                      (up to {t("currency")}
                      {coupon.maxDiscount})
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("minOrder")}: {t("currency")}
                  {coupon.minOrderValue}
                </p>
              </motion.div>
            ))}
        </div>
      </section>

      {/* Top Deals */}
      <section className="mb-8 sm:mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Tag size={20} className="text-primary" />
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            {t("topDeals")}
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          ) : discountedProducts.length > 0 ? (
            discountedProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))
          ) : (
            <p className="col-span-full text-muted-foreground text-center py-8">
              {t("noResults")}
            </p>
          )}
        </div>
      </section>

      {/* Best Sellers on Offer */}
      {bestSellers.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Zap size={20} className="text-accent" />
            <h2 className="text-lg sm:text-xl font-bold text-foreground">
              {t("bestSellerDeals")}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {bestSellers.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
