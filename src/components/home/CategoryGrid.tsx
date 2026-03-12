"use client";

import SectionHeader from "@components/home/SectionHeader";
import CategoryCard from "@components/products/CategoryCard";
import { useTranslations } from "next-intl";
import { useCategoriesWithProducts } from "@/hooks/useLanding";
import { useCategories } from "@/hooks/useCategories";
import { categories as staticCategories } from "@/data/products";
import type { Category } from "@/types/product";

export default function CategoryGrid({
  categories: propCategories,
}: {
  categories?: Category[];
}) {
  const t = useTranslations();
  const { data: landingCategories, isError: landingError } =
    useCategoriesWithProducts({ limit: 7 });
  const { data: apiCategories, isError } = useCategories({ isActive: true });
  const categories =
    landingCategories && landingCategories.length > 0 && !landingError
      ? landingCategories
      : apiCategories && apiCategories.length > 0 && !isError
        ? apiCategories
        : propCategories ?? staticCategories;

  return (
    <section className="py-6 sm:py-8 lg:py-12">
      <div className="container-app">
        <SectionHeader
          title={t("shopByCategory")}
          linkTo="/products"
          linkLabel={t("viewAll")}
        />
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3 lg:gap-4">
          {categories?.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

