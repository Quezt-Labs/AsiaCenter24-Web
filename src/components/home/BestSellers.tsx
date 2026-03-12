"use client";

import SectionHeader from "@components/home/SectionHeader";
import ProductCard from "@components/products/ProductCard";
import { useTranslations } from "next-intl";
import { usePopularProducts } from "@/hooks/useLanding";
import { useProducts } from "@/hooks/useProducts";
import { products as staticProducts } from "@/data/products";
import type { Product } from "@/types/product";

export default function BestSellers({
  bestSellers,
}: {
  bestSellers?: Product[];
}) {
  const t = useTranslations();
  const { data: popularProducts, isError: landingError } = usePopularProducts({
    limit: 4,
  });
  const { data: apiProducts, isError } = useProducts({ isActive: true });
  const productsList = apiProducts ?? staticProducts;
  const list =
    bestSellers ??
    (popularProducts && !landingError
      ? popularProducts
      : productsList.filter((p) => p.isBestSeller).slice(0, 4));

  return (
    <section className="py-6 sm:py-8 lg:py-12 bg-secondary/20">
      <div className="container-app">
        <SectionHeader
          title={t("bestSellers")}
          linkTo="/products?filter=bestseller"
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
