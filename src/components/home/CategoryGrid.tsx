"use client";

import { useRef, useState, useEffect } from "react";
import SectionHeader from "@components/home/SectionHeader";
import CategoryCard from "@components/products/CategoryCard";
import CategoryCardSkeleton from "@components/products/CategoryCardSkeleton";
import { useTranslations } from "next-intl";
import { useCategoriesWithProducts } from "@/hooks/useLanding";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const SCROLL_AMOUNT = 280;

export default function CategoryGrid() {
  const t = useTranslations();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const { data: landingCategories, isLoading } =
    useCategoriesWithProducts({ limit: 20 });
  const categories = landingCategories ?? [];

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState);
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(el);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      resizeObserver.disconnect();
    };
  }, [categories, isLoading]);

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-6 sm:py-8 lg:py-12">
      <div className="container-app">
        <SectionHeader
          title={t("shopByCategory")}
          linkTo="/products"
          linkLabel={t("viewAll")}
        />
        <div className="relative">
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm border border-border shadow-md flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors z-10 -ml-2"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </motion.button>
          )}
          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm border border-border shadow-md flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors z-10 -mr-2"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </motion.button>
          )}
          <div
            ref={scrollRef}
            className="flex gap-2 sm:gap-3 lg:gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-2 sm:pb-3"
          >
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="shrink-0 w-[calc(33.333%-0.5rem)] min-w-[100px] sm:w-[calc(25%-0.75rem)] sm:min-w-[110px] lg:w-[calc(14.28%-1rem)] lg:min-w-[120px]"
                  >
                    <CategoryCardSkeleton />
                  </div>
                ))
              : categories?.map((category, index) => (
                  <div
                    key={category.id}
                    className="shrink-0 w-[calc(33.333%-0.5rem)] min-w-[100px] sm:w-[calc(25%-0.75rem)] sm:min-w-[110px] lg:w-[calc(14.28%-1rem)] lg:min-w-[120px]"
                  >
                    <CategoryCard category={category} index={index} />
                  </div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}
