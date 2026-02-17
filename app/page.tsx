export const dynamic = "force-static";

import i18n from "@/i18n";
import PageTransition from "@components/layout/PageTransition";
import SectionHeader from "@components/home/SectionHeader";
import CategoryCard from "@components/products/CategoryCard";
import ProductCard from "@components/products/ProductCard";
import WhyChooseUs from "@components/home/WhyChooseUs";
import { categories, products } from "@data/products";
import OfferBanner from "@/components/home/OfferBanner";
import Testimonials from "@/components/home/Testimonials";
import HeroCarousel from "@/components/home/HeroCarousel";

export default function HomePage() {
  const t = (key: string) => i18n.t(key);

  const bestSellers =
    products?.filter((p: any) => p.isBestSeller).slice(0, 4) ?? [];
  const newArrivals =
    products?.filter((p: any) => p.isNewArrival).slice(0, 4) ?? [];

  return (
    <PageTransition>
      {/* Hero Carousel */}
      <section className="py-3 sm:py-4 lg:py-6">
        <div className="container-app">
          <HeroCarousel />
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="container-app">
          <SectionHeader
            title={t("shopByCategory")}
            linkTo="/products"
            linkLabel={t("viewAll")}
          />
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3 lg:gap-4">
            {categories?.map((category: any, index: number) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-6 sm:py-8 lg:py-12 bg-secondary/20">
        <div className="container-app">
          <SectionHeader
            title={t("bestSellers")}
            linkTo="/products?filter=bestseller"
            linkLabel={t("viewAll")}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
            {bestSellers.map((product: any, index: number) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-6 sm:py-8 lg:py-12">
        <div className="container-app">
          <SectionHeader
            title={t("newArrivals")}
            linkTo="/products?filter=new"
            linkLabel={t("viewAll")}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
            {newArrivals.map((product: any, index: number) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>
      <OfferBanner />

      {/* Why Choose Us */}
      <WhyChooseUs />

      <Testimonials />

      {/* Testimonials are included in HomeWidgets */}
    </PageTransition>
  );
}
