"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  ChevronDown,
  X,
  SlidersHorizontal,
  ChevronRight,
} from "lucide-react";
import { products as staticProducts, categories as staticCategories } from "@/data/products";
import ProductCard from "@/components/products/ProductCard";
import { cn } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";

const sortOptions = [
  { value: "popularity", labelKey: "popularity" },
  { value: "price_low_high", labelKey: "priceLowHigh" },
  { value: "price_high_low", labelKey: "priceHighLow" },
  { value: "newest", labelKey: "newest" },
  { value: "rating", labelKey: "rating" },
];

export default function ProductsClient({
  initialSearchParams,
}: {
  initialSearchParams?: Record<string, string | string[] | undefined>;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const categoryParam =
    searchParams?.get("category") ??
    (Array.isArray(initialSearchParams?.category)
      ? initialSearchParams?.category[0]
      : initialSearchParams?.category);
  const sortParam =
    searchParams?.get("sort") ??
    (Array.isArray(initialSearchParams?.sort)
      ? initialSearchParams?.sort[0]
      : initialSearchParams?.sort) ??
    "popularity";
  const filterParam =
    searchParams?.get("filter") ??
    (Array.isArray(initialSearchParams?.filter)
      ? initialSearchParams?.filter[0]
      : initialSearchParams?.filter);

  const { data: apiCategories, isError: categoriesError } = useCategories({
    isActive: true,
  });
  const currentCategoryFromList = (apiCategories ?? staticCategories).find(
    (c) => c.slug === categoryParam
  );
  const categoryId = currentCategoryFromList?.id;

  const { data: apiProducts, isError: productsError } = useProducts({
    categoryId: categoryId || undefined,
    isActive: true,
  });

  const categories =
    apiCategories && apiCategories.length > 0 && !categoriesError
      ? apiCategories
      : staticCategories;
  const productsFromApi =
    apiProducts && apiProducts.length >= 0 && !productsError ? apiProducts : null;

  const updateParams = (fn: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    fn(params);
    const qs = params.toString();
    router.push(`${window.location.pathname}${qs ? `?${qs}` : ""}`);
  };

  const handleSortChange = (value: string) => {
    updateParams((p) => p.set("sort", value));
    setIsSortOpen(false);
  };

  const handleCategoryChange = (slug: string | null) => {
    updateParams((p) => {
      if (slug) p.set("category", slug);
      else p.delete("category");
      p.delete("filter");
    });
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    router.push(window.location.pathname);
  };

  const filteredProducts = useMemo(() => {
    const baseProducts =
      productsFromApi !== null ? productsFromApi : staticProducts;
    let result = [...baseProducts];
    if (categoryParam) {
      result = result.filter((p) => p.categorySlug === categoryParam);
    }
    if (filterParam === "bestseller")
      result = result.filter((p) => p.isBestSeller);
    else if (filterParam === "new")
      result = result.filter((p) => p.isNewArrival);

    switch (sortParam) {
      case "price_low_high":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_high_low":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort(
          (a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0),
        );
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => b.reviewCount - a.reviewCount);
    }
    return result;
  }, [productsFromApi, categoryParam, sortParam, filterParam]);

  const currentCategory = categories.find((c) => c.slug === categoryParam);
  const currentSort = sortOptions.find((s) => s.value === sortParam);

  return (
    <>
      <div className="container-app py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary transition-colors">
            {t("home")}
          </Link>
          <ChevronRight size={14} />
          <span className="text-foreground font-medium">
            {currentCategory
            ? locale === "hi"
              ? currentCategory.nameHi
              : currentCategory.name
            : t("products")}
          </span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              {currentCategory
                ? locale === "hi"
                  ? currentCategory.nameHi
                  : currentCategory.name
                : t("products")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {filteredProducts.length} products
            </p>
          </div>

          {/* Desktop Sort */}
          <div className="hidden lg:block relative">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center gap-2 px-4 py-2.5 bg-secondary rounded-lg text-sm font-medium"
            >
              {t("sortBy")}: {currentSort && t(currentSort.labelKey)}
              <ChevronDown
                size={16}
                className={cn(
                  "transition-transform",
                  isSortOpen && "rotate-180",
                )}
              />
            </button>

            <AnimatePresence>
              {isSortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-card rounded-xl shadow-lg border border-border overflow-hidden z-20"
                >
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={cn(
                        "w-full px-4 py-3 text-left text-sm transition-colors",
                        sortParam === option.value
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground hover:bg-secondary",
                      )}
                    >
                      {t(option.labelKey)}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Filter/Sort Bar */}
        <div className="flex items-center gap-3 lg:hidden mb-4">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-secondary rounded-lg text-sm font-medium"
          >
            <Filter size={16} />
            {t("filters")}
          </button>
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-secondary rounded-lg text-sm font-medium"
          >
            <SlidersHorizontal size={16} />
            {t("sortBy")}
          </button>
        </div>

        {/* Active Filters */}
        {(categoryParam || filterParam) && (
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {categoryParam && currentCategory && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
                {locale === "hi" ? currentCategory.nameHi : currentCategory.name}
                <button
                  onClick={() => handleCategoryChange(null)}
                  className="ml-1"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            {filterParam && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-accent/10 text-accent rounded-full text-sm capitalize">
                {filterParam === "bestseller" ? "Best Sellers" : "New Arrivals"}
                <button onClick={clearFilters} className="ml-1">
                  <X size={14} />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {t("clearAll")}
            </button>
          </div>
        )}

        <div className="flex gap-6">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div className="bg-card rounded-xl p-4 border border-border/50">
                <h3 className="font-semibold text-foreground mb-3">
                  {t("categories")}
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => handleCategoryChange(null)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                      !categoryParam
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground hover:bg-secondary",
                    )}
                  >
                    All Products
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2",
                        categoryParam === cat.slug
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground hover:bg-secondary",
                      )}
                    >
                      <span>{cat.icon}</span>
                {locale === "hi" ? cat.nameHi : cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground mb-2">
                  {t("noResults")}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("tryDifferent")}
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
                >
                  {t("clearAll")}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/50 z-50 lg:hidden"
            onClick={() => setIsFilterOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 top-0 h-full w-80 max-w-[90vw] bg-background overflow-y-auto"
            >
              <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
                <h2 className="font-semibold text-lg">{t("filters")}</h2>
                <button onClick={() => setIsFilterOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              <div className="p-4 space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="font-semibold text-foreground mb-3">
                    {t("categories")}
                  </h3>
                  <div className="space-y-1">
                    <button
                      onClick={() => handleCategoryChange(null)}
                      className={cn(
                        "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors",
                        !categoryParam
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground hover:bg-secondary",
                      )}
                    >
                      All Products
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.slug)}
                        className={cn(
                          "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2",
                          categoryParam === cat.slug
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-foreground hover:bg-secondary",
                        )}
                      >
                        <span>{cat.icon}</span>
                {locale === "hi" ? cat.nameHi : cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sort Modal */}
      <AnimatePresence>
        {isSortOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/50 z-50 lg:hidden"
            onClick={() => setIsSortOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold text-lg">{t("sortBy")}</h2>
                <button onClick={() => setIsSortOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              <div className="p-4 pb-8">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={cn(
                      "w-full px-4 py-3.5 text-left text-sm rounded-lg transition-colors",
                      sortParam === option.value
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground hover:bg-secondary",
                    )}
                  >
                    {t(option.labelKey)}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
