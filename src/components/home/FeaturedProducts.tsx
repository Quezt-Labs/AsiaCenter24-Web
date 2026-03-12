"use client";

import SectionHeader from "@components/home/SectionHeader";
import ProductCard from "@components/products/ProductCard";
import { useTranslations } from "next-intl";
import { useFeaturedProducts } from "@/hooks/useLanding";
import { products as staticProducts } from "@/data/products";
import type { Product } from "@/types/product";

export default function FeaturedProducts({
  featuredProducts,
}: {
  featuredProducts?: Product[];
}) {
  const t = useTranslations();
  const { data: apiFeatured, isError: landingError } = useFeaturedProducts({
    limit: 8,
  });
  const list =
    apiFeatured && apiFeatured.length > 0 && !landingError
      ? apiFeatured
      : featuredProducts && featuredProducts.length > 0
        ? featuredProducts
        : staticProducts.filter((p) => p.isBestSeller || p.isNewArrival).slice(0, 8);

  return (
    <section className="py-6 sm:py-8 lg:py-12">
      <div className="container-app">
        <SectionHeader
          title={t("featuredProducts")}
          linkTo="/products?filter=featured"
          linkLabel={t("viewAll")}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
          {list.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
