"use client";

import SectionHeader from "@components/home/SectionHeader";
import ProductCard from "@components/products/ProductCard";
import ProductCardSkeleton from "@components/products/ProductCardSkeleton";
import { useTranslations } from "next-intl";
import { useFeaturedProducts } from "@/hooks/useLanding";

export default function FeaturedProducts() {
  const t = useTranslations();
  const { data: apiFeatured, isLoading } = useFeaturedProducts({ limit: 8 });
  const list = apiFeatured ?? [];

  return (
    <section className="py-6 sm:py-8 lg:py-12">
      <div className="container-app">
        <SectionHeader
          title={t("featuredProducts")}
          linkTo="/products?filter=featured"
          linkLabel={t("viewAll")}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
            : list.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
        </div>
      </div>
    </section>
  );
}
