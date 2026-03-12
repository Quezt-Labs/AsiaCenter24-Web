"use client";

import SectionHeader from "@components/home/SectionHeader";
import ProductCard from "@components/products/ProductCard";
import { useTranslations } from "next-intl";
import { useTrendingProducts } from "@/hooks/useLanding";
import { products as staticProducts } from "@/data/products";
import type { Product } from "@/types/product";

export default function NewArrivals({
  newArrivals,
}: {
  newArrivals?: Product[];
}) {
  const t = useTranslations();
  const { data: trendingProducts, isError: landingError } = useTrendingProducts(
    {
      limit: 4,
    },
  );
  const list =
    trendingProducts && trendingProducts.length > 0 && !landingError
      ? trendingProducts
      : newArrivals && newArrivals.length > 0
        ? newArrivals
        : staticProducts.filter((p) => p.isNewArrival).slice(0, 4);

  return (
    <section className="py-6 sm:py-8 lg:py-12">
      <div className="container-app">
        <SectionHeader
          title={t("newArrivals")}
          linkTo="/products?filter=new"
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
