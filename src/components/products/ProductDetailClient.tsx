"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Star,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  Share2,
} from "lucide-react";
import Image from "next/image";
import { Product } from "@/types/product";
import {
  reviews as sampleReviews,
  products as allProducts,
} from "@/data/products";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useRecentlyViewedStore } from "@/store/useRecentlyViewedStore";
import ProductCard from "@/components/products/ProductCard";
import RecentlyViewed from "@/components/products/RecentlyViewed";
import { cn } from "@/lib/utils";

export default function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const [selectedWeight, setSelectedWeight] = useState(
    product?.weightOptions?.[0]?.weight ?? "",
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "description" | "nutrition" | "reviews"
  >("description");
  const [isAdded, setIsAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  const addItem = useCartStore((state) => state.addItem);
  const { isInWishlist, toggleItem } = useWishlistStore();
  const addRecentlyViewed = useRecentlyViewedStore((state) => state.addProduct);

  useEffect(() => {
    if (product) addRecentlyViewed(product);
  }, [product, addRecentlyViewed]);

  const name = i18n.language === "hi" ? product.nameHi : product.name;
  const description =
    i18n.language === "hi" ? product.descriptionHi : product.description;
  const isWishlisted = isInWishlist(product.id);

  const selectedWeightOption = product.weightOptions.find(
    (w) => w.weight === selectedWeight,
  );
  const currentPrice = selectedWeightOption?.price || product.price;
  const originalPrice =
    selectedWeightOption?.originalPrice || product.originalPrice;

  const relatedProducts: Product[] = allProducts
    .filter(
      (p) => p.categorySlug === product.categorySlug && p.id !== product.id,
    )
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem(product, quantity, selectedWeight);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addItem(product, quantity, selectedWeight);
    router.push("/cart");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: name, url: window.location.href });
    }
  };

  return (
    <div className="container-app py-4 sm:py-6">
      <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap pb-1">
        <Link
          href="/"
          className="hover:text-primary transition-colors flex-shrink-0"
        >
          {t("home")}
        </Link>
        <ChevronRight size={12} className="flex-shrink-0" />
        <Link
          href="/products"
          className="hover:text-primary transition-colors flex-shrink-0"
        >
          {t("products")}
        </Link>
        <ChevronRight size={12} className="flex-shrink-0" />
        <Link
          href={`/products?category=${product.categorySlug}`}
          className="hover:text-primary transition-colors flex-shrink-0"
        >
          {product.category}
        </Link>
        <ChevronRight size={12} className="flex-shrink-0" />
        <span className="text-foreground font-medium truncate">{name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
        <div className="space-y-3">
          <div
            className="aspect-square rounded-2xl overflow-hidden bg-secondary/30 cursor-zoom-in relative"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={(e) => {
              const rect = (
                e.currentTarget as HTMLElement
              ).getBoundingClientRect();
              setZoomPosition({
                x: ((e.clientX - rect.left) / rect.width) * 100,
                y: ((e.clientY - rect.top) / rect.height) * 100,
              });
            }}
          >
            <Image
              src={product.images[selectedImage] || product.image}
              alt={name}
              fill
              className={cn(
                "object-cover transition-transform duration-300",
                isZoomed && "scale-[2]",
              )}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }
                  : undefined
              }
              sizes="(max-width: 640px) 100vw, 50vw"
              quality={80}
            />

            {product.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 lg:hidden">
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      selectedImage === idx
                        ? "bg-primary w-5"
                        : "bg-foreground/30",
                    )}
                  />
                ))}
              </div>
            )}

            {originalPrice > currentPrice && (
              <span className="absolute top-3 left-3 badge-discount text-xs sm:text-sm px-2 sm:px-3 py-1">
                {Math.round((1 - currentPrice / originalPrice) * 100)}%{" "}
                {t("off")}
              </span>
            )}

            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <button
                onClick={() => toggleItem(product)}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all",
                  isWishlisted
                    ? "bg-primary/20 text-primary"
                    : "bg-background/70 text-muted-foreground hover:text-primary",
                )}
              >
                <Heart
                  size={18}
                  fill={isWishlisted ? "currentColor" : "none"}
                />
              </button>
              <button
                onClick={handleShare}
                className="w-10 h-10 rounded-full bg-background/70 backdrop-blur-md flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>

          {product.images.length > 1 && (
            <div className="hidden lg:flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={cn(
                    "w-16 h-16 xl:w-20 xl:h-20 rounded-lg overflow-hidden border-2 transition-all",
                    selectedImage === idx
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50",
                  )}
                >
                  <Image
                    src={img}
                    alt=""
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="inline-block px-2 py-0.5 bg-secondary rounded-md text-xs font-medium text-muted-foreground mb-2">
            {product.brand}
          </span>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2 leading-tight">
            {name}
          </h1>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 lg:line-clamp-none">
            {description}
          </p>

          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <div className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 rounded-lg">
              <Star size={14} className="fill-primary text-primary" />
              <span className="font-bold text-sm text-primary">
                {product.rating}
              </span>
            </div>
            <span className="text-muted-foreground text-xs sm:text-sm">
              ({product.reviewCount.toLocaleString()} {t("reviews")})
            </span>
            {product.inStock ? (
              <span className="text-xs font-semibold text-primary flex items-center gap-1 px-2 py-0.5 bg-primary/10 rounded-full">
                <Check size={12} /> {t("inStock")}
              </span>
            ) : (
              <span className="text-xs font-semibold text-destructive px-2 py-0.5 bg-destructive/10 rounded-full">
                {t("outOfStock")}
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-2xl sm:text-3xl font-extrabold text-foreground">
              ₹{currentPrice}
            </span>
            {originalPrice > currentPrice && (
              <>
                <span className="text-base sm:text-lg text-muted-foreground line-through">
                  ₹{originalPrice}
                </span>
                <span className="badge-discount text-xs">
                  {Math.round((1 - currentPrice / originalPrice) * 100)}%{" "}
                  {t("off")}
                </span>
              </>
            )}
          </div>

          <div className="mb-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {t("selectSize")}
            </p>
            <div className="flex flex-wrap gap-2">
              {product.weightOptions.map((option) => (
                <button
                  key={option.weight}
                  onClick={() => setSelectedWeight(option.weight)}
                  className={cn(
                    "px-3 sm:px-4 py-2 rounded-xl border-2 text-xs sm:text-sm font-medium transition-all",
                    selectedWeight === option.weight
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-foreground hover:border-primary/50",
                  )}
                >
                  <span className="block font-semibold">{option.weight}</span>
                  <span className="block text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                    ₹{option.price}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {t("quantity")}
            </p>
            <div className="flex items-center">
              <div className="flex items-center border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-foreground hover:bg-secondary transition-colors active:bg-secondary/80"
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 sm:w-12 text-center font-bold text-sm">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center text-foreground hover:bg-secondary transition-colors active:bg-secondary/80"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-5">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={cn(
                  "flex-1 py-3 sm:py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all text-sm sm:text-base",
                  product.inStock
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98]"
                    : "bg-muted text-muted-foreground cursor-not-allowed",
                )}
              >
                {isAdded ? (
                  <>
                    <Check size={18} /> {t("addedToCart")}
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} /> {t("addToCart")}
                  </>
                )}
              </button>
            </div>
            <button
              onClick={handleBuyNow}
              disabled={!product.inStock}
              className="w-full py-3 sm:py-3.5 rounded-xl font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all text-sm sm:text-base active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("buyNow")}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 p-4 bg-secondary/30 rounded-xl">
            <div className="text-center">
              <Truck className="w-5 h-5 mx-auto text-primary mb-1.5" />
              <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                {t("freeDelivery")}
              </p>
            </div>
            <div className="text-center">
              <ShieldCheck className="w-5 h-5 mx-auto text-primary mb-1.5" />
              <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                {t("genuineProduct")}
              </p>
            </div>
            <div className="text-center">
              <RotateCcw className="w-5 h-5 mx-auto text-primary mb-1.5" />
              <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">
                {t("easyReturns")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mt-12">
        <div className="border-b border-border overflow-x-auto">
          <div className="flex gap-4 sm:gap-8 min-w-max">
            {(["description", "nutrition", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "pb-3 text-xs sm:text-sm font-medium transition-colors relative whitespace-nowrap",
                  activeTab === tab
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab === "description" && t("description")}
                {tab === "nutrition" && t("nutritionalInfo")}
                {tab === "reviews" &&
                  `${t("reviews")} (${product.reviewCount})`}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="py-5 sm:py-6">
          {activeTab === "description" && (
            <div className="space-y-4 max-w-2xl">
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {description}
              </p>

              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-secondary rounded-full text-xs font-medium text-muted-foreground capitalize"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {product.storageInstructions && (
                <div className="p-4 bg-secondary/30 rounded-xl">
                  <h4 className="font-semibold text-sm text-foreground mb-1.5">
                    {t("storageInstructions")}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {product.storageInstructions}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "nutrition" && product.nutritionalInfo && (
            <div className="max-w-md">
              <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
                <div className="p-4 bg-primary/5 border-b border-border">
                  <h3 className="font-semibold text-sm text-foreground">
                    {t("nutritionalInfo")}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t("per100g")}
                  </p>
                </div>
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(product.nutritionalInfo).map(
                      ([key, value], idx) => (
                        <tr
                          key={key}
                          className={cn(
                            idx <
                              Object.keys(product.nutritionalInfo!).length -
                                1 && "border-b border-border/50",
                          )}
                        >
                          <td className="py-3 px-4 text-muted-foreground capitalize text-xs sm:text-sm">
                            {key}
                          </td>
                          <td className="py-3 px-4 text-foreground font-semibold text-right text-xs sm:text-sm">
                            {value}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4 sm:space-y-6 max-w-2xl">
              {sampleReviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 bg-card rounded-xl border border-border/50"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">
                        {review.userName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground">
                        {review.userName}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={11}
                              className={
                                i < review.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-muted"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-[10px] sm:text-xs text-muted-foreground">
                          {review.date}
                        </span>
                        {review.verified && (
                          <span className="text-[10px] sm:text-xs text-primary font-semibold">
                            ✓ {t("verified")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <section className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-4 sm:mb-6">
          {t("customersAlsoBuy")}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <RecentlyViewed />
    </div>
  );
}
