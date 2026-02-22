"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Heart,
  ShoppingCart,
  Star,
  Plus,
  Minus,
  Check,
  Zap,
} from "lucide-react";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { cn } from "@/lib/utils";
import { slugify } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
  index?: number;
}

const ProductCard = ({
  product,
  compact = false,
  index = 0,
}: ProductCardProps) => {
  const t = useTranslations();
  const locale = useLocale();
  const [isAdded, setIsAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const cartItems = useCartStore((state) => state.items);
  const { isInWishlist, toggleItem } = useWishlistStore();

  const isWishlisted = isInWishlist(product.id);
  const cartItem = cartItems.find((item) => item.product.id === product.id);
  const currentQuantity = cartItem?.quantity || 0;
  const name = locale === "hi" ? product.nameHi : product.name;

  const handleAddToCart = () => {
    addItem(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleIncrement = () => updateQuantity(product.id, currentQuantity + 1);
  const handleDecrement = () => updateQuantity(product.id, currentQuantity - 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        type: "spring",
        damping: 22,
        stiffness: 200,
      }}
      className={cn("group relative", compact && "product-card-compact")}
    >
      <div className="bg-card rounded-2xl border border-border/40 overflow-hidden transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">
        {/* Image */}
        <Link
          href={`/products/${product.id}-${slugify(product.name)}`}
          className="relative block overflow-hidden"
        >
          <div
            className={cn(
              "aspect-square overflow-hidden bg-secondary/20",
              compact && "aspect-[4/3]",
            )}
          >
            <motion.div
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full h-full relative"
            >
              <Image
                src={product.image}
                alt={name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </motion.div>
          </div>

          {/* Badges - Enhanced visibility */}
          <div
            className={cn(
              "absolute top-2 left-2 flex flex-col gap-1.5",
              compact && "top-1.5 left-1.5",
            )}
          >
            {product.discount > 0 && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "inline-flex items-center gap-1 font-bold rounded-lg shadow-md",
                  compact ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1",
                  "bg-gradient-to-r from-orange-500 to-amber-500 text-white",
                )}
              >
                <Zap size={compact ? 10 : 12} className="fill-white" />
                {product.discount}% {t("off")}
              </motion.span>
            )}
            {!compact && product.isBestSeller && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-primary text-primary-foreground shadow-md">
                <Star size={11} className="fill-primary-foreground" />{" "}
                Bestseller
              </span>
            )}
            {!compact && product.isNewArrival && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-500 text-white shadow-md">
                🆕 New
              </span>
            )}
          </div>

          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
              <span className="px-3 py-1.5 bg-destructive/90 text-destructive-foreground text-xs font-bold rounded-lg">
                {t("outOfStock")}
              </span>
            </div>
          )}

          {/* Wishlist */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              toggleItem(product);
            }}
            className={cn(
              "absolute top-2 right-2 rounded-full flex items-center justify-center transition-all shadow-sm",
              compact ? "w-7 h-7 top-1.5 right-1.5" : "w-9 h-9",
              isWishlisted
                ? "bg-red-50 text-red-500 shadow-red-100"
                : "bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-red-500 hover:bg-red-50",
            )}
            aria-label={
              isWishlisted ? t("removeFromWishlist") : t("addToWishlist")
            }
          >
            <Heart
              size={compact ? 13 : 17}
              fill={isWishlisted ? "currentColor" : "none"}
            />
          </motion.button>
        </Link>

        {/* Content */}
        <div className={cn("p-3", compact && "p-2")}>
          {!compact && (
            <p className="text-[10px] uppercase tracking-widest text-primary/70 font-bold mb-1">
              {product.brand}
            </p>
          )}

          <Link href={`/products/${product.id}-${slugify(product.name)}`}>
            <h3
              className={cn(
                "font-medium text-foreground hover:text-primary transition-colors",
                compact
                  ? "text-sm line-clamp-1"
                  : "text-sm line-clamp-2 min-h-[2.5rem]",
              )}
            >
              {name}
            </h3>
          </Link>

          <p
            className={cn(
              "text-[11px] text-muted-foreground",
              compact ? "mt-0.5" : "mt-1",
            )}
          >
            {product.weightOptions[0]?.weight}
          </p>

          {!compact && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="flex items-center gap-0.5 bg-primary/10 px-1.5 py-0.5 rounded-md">
                <Star size={11} className="fill-primary text-primary" />
                <span className="text-xs font-bold text-primary">
                  {product.rating}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground">
                ({product.reviewCount})
              </span>
            </div>
          )}

          {/* Price */}
          <div
            className={cn(
              "flex items-baseline gap-2",
              compact ? "mt-1.5" : "mt-2",
            )}
          >
            <span
              className={cn(
                "font-bold text-foreground",
                compact ? "text-sm" : "text-lg",
              )}
            >
              ₹{product.price}
            </span>
            {product.originalPrice > product.price && (
              <span
                className={cn(
                  "text-muted-foreground line-through",
                  compact ? "text-[10px]" : "text-xs",
                )}
              >
                ₹{product.originalPrice}
              </span>
            )}
            {!compact && product.discount > 0 && (
              <span className="text-[11px] font-bold text-primary ml-auto">
                Save ₹{product.originalPrice - product.price}
              </span>
            )}
          </div>

          {/* Add to Cart */}
          <div className={cn(compact ? "mt-2" : "mt-3")}>
            {currentQuantity === 0 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={cn(
                  "w-full rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.97]",
                  compact ? "py-2 text-xs" : "py-2.5 text-sm",
                  product.inStock
                    ? "bg-primary text-primary-foreground hover:brightness-110 shadow-sm shadow-primary/15"
                    : "bg-muted text-muted-foreground cursor-not-allowed",
                )}
              >
                {isAdded ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-1.5"
                  >
                    <Check size={compact ? 12 : 16} />
                    {!compact && t("addedToCart")}
                  </motion.span>
                ) : (
                  <>
                    <ShoppingCart size={compact ? 12 : 16} />
                    {product.inStock
                      ? compact
                        ? "Add"
                        : t("addToCart")
                      : t("outOfStock")}
                  </>
                )}
              </motion.button>
            ) : (
              <div
                className={cn(
                  "flex items-center justify-between bg-primary/10 rounded-xl",
                  compact ? "p-0.5" : "p-1",
                )}
              >
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={handleDecrement}
                  className={cn(
                    "rounded-lg bg-background flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors",
                    compact ? "w-7 h-7" : "w-10 h-10",
                  )}
                >
                  <Minus size={compact ? 14 : 18} />
                </motion.button>
                <motion.span
                  key={currentQuantity}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  className={cn("font-bold text-primary", compact && "text-sm")}
                >
                  {currentQuantity}
                </motion.span>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={handleIncrement}
                  className={cn(
                    "rounded-lg bg-background flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors",
                    compact ? "w-7 h-7" : "w-10 h-10",
                  )}
                >
                  <Plus size={compact ? 14 : 18} />
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
