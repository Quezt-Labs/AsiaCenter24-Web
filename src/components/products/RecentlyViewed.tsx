import { useTranslation } from "react-i18next";
import { useRecentlyViewedStore } from "@/store/useRecentlyViewedStore";
import ProductCard from "./ProductCard";

const RecentlyViewed = () => {
  const { t } = useTranslation();
  const { products } = useRecentlyViewedStore();

  if (products.length === 0) return null;

  return (
    <section className="py-8">
      <h2 className="text-xl font-bold text-foreground mb-4">
        {t("recentlyViewed")}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.slice(0, 5).map((product) => (
          <ProductCard key={product.id} product={product} compact />
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewed;
