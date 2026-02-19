import SectionHeader from "@components/home/SectionHeader";
import CategoryCard from "@components/products/CategoryCard";

export default function CategoryGrid({
  categories,
  t,
}: {
  categories?: any[];
  t: (k: string) => string;
}) {
  return (
    <section className="py-6 sm:py-8 lg:py-12">
      <div className="container-app">
        <SectionHeader
          title={t("shopByCategory")}
          linkTo="/products"
          linkLabel={t("viewAll")}
        />
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3 lg:gap-4">
          {categories?.map((category: any, index: number) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

