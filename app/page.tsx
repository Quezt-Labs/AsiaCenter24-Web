export const dynamic = "force-static";

import HeroCarouselClient from "@/components/home/HeroCarouselClient";
import TestimonialsClient from "@/components/home/TestimonialsClient";
import { bannerSlides } from "@/data/products";
import type { Metadata } from "next";
import PageTransition from "@components/layout/PageTransition";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import WhyChooseUs from "@components/home/WhyChooseUs";
import BestSellers from "@/components/home/BestSellers";
import NewArrivals from "@/components/home/NewArrivals";
import { categories, products } from "@data/products";
import OfferBanner from "@/components/home/OfferBanner";

export async function generateMetadata({
  params,
  searchParams,
  locale,
}: {
  params?: any;
  searchParams?: any;
  locale?: string | undefined;
}): Promise<Metadata> {
  const lang = locale || "en";
  const titles: Record<string, string> = {
    en: "FreshMart — Asia Center 24",
    hi: "FreshMart — एशिया सेंटर 24",
  };
  const descriptions: Record<string, string> = {
    en: "FreshMart at Asia Center 24 — fresh groceries delivered fast. Explore categories, best sellers and latest arrivals.",
    hi: "FreshMart — ताज़ा किराना, तेज़ डिलीवरी। श्रेणियाँ, बेस्टसेलर और नई कलेक्शन देखें।",
  };

  const heroImage =
    bannerSlides?.[0]?.image ??
    "https://asia-center24.example.com/og-image.jpg";

  return {
    title: titles[lang] ?? titles.en,
    description: descriptions[lang] ?? descriptions.en,
    openGraph: {
      title: titles[lang] ?? titles.en,
      description: descriptions[lang] ?? descriptions.en,
      url: "https://asia-center24.example.com/",
      siteName: "FreshMart",
      images: [
        {
          url: heroImage,
          alt: titles[lang] ?? titles.en,
        },
      ],
      locale: lang,
    },
  };
}

export default function HomePage() {
  const featuredProducts =
    products?.filter((p: any) => p.isFeatured || p.isBestSeller).slice(0, 8) ?? [];
  const bestSellers =
    products?.filter((p: any) => p.isBestSeller).slice(0, 4) ?? [];
  const newArrivals =
    products?.filter((p: any) => p.isNewArrival).slice(0, 4) ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FreshMart",
    url: "https://asia-center24.example.com/",
    logo: "https://asia-center24.example.com/logo.png",
    sameAs: ["https://www.facebook.com/", "https://www.instagram.com/"],
  };

  return (
    <PageTransition>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroCarouselClient />
      <CategoryGrid categories={categories} />
      <FeaturedProducts featuredProducts={featuredProducts} />
      <BestSellers bestSellers={bestSellers} />
      <NewArrivals newArrivals={newArrivals} />
      <OfferBanner />
      <WhyChooseUs />
      <TestimonialsClient />
    </PageTransition>
  );
}
