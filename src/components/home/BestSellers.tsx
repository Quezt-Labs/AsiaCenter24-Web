import SectionHeader from "@components/home/SectionHeader";
import ProductCard from "@components/products/ProductCard";

export default function BestSellers({
  bestSellers,
  t,
}: {
  bestSellers?: any[];
  t: (k: string) => string;
}) {
  return (
    <section className="py-6 sm:py-8 lg:py-12 bg-secondary/20">
      <div className="container-app">
        <SectionHeader
          title={t("bestSellers")}
          linkTo="/products?filter=bestseller"
          linkLabel={t("viewAll")}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
          {bestSellers?.map((product: any, index: number) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

