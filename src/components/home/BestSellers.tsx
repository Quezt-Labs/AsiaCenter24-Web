"use client";

import SectionHeader from "@components/home/SectionHeader";
import ProductCard from "@components/products/ProductCard";
import ProductCardSkeleton from "@components/products/ProductCardSkeleton";
import { useTranslations } from "next-intl";
import { usePopularProducts } from "@/hooks/useLanding";

export default function BestSellers() {
  const t = useTranslations();
  const { data: popularProducts, isLoading } = usePopularProducts({ limit: 4 });
  const list = popularProducts ?? [];

  return (
    <section className="py-6 sm:py-8 lg:py-12 bg-secondary/20">
      <div className="container-app">
        <SectionHeader
          title={t("bestSellers")}
          linkTo="/products?filter=bestseller"
          linkLabel={t("viewAll")}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
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
