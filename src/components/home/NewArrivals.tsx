 "use client";

import SectionHeader from "@components/home/SectionHeader";
import ProductCard from "@components/products/ProductCard";
import { useTranslations } from "next-intl";

export default function NewArrivals({ newArrivals }: { newArrivals?: any[] }) {
  const t = useTranslations();
  return (
    <section className="py-6 sm:py-8 lg:py-12">
      <div className="container-app">
        <SectionHeader title={t("newArrivals")} linkTo="/products?filter=new" linkLabel={t("viewAll")} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
          {newArrivals?.map((product: any, index: number) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

