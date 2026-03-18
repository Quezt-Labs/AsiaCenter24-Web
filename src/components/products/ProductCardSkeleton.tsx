"use client";

import { cn } from "@/lib/utils";

interface ProductCardSkeletonProps {
  compact?: boolean;
}

const ProductCardSkeleton = ({ compact = false }: ProductCardSkeletonProps) => {
  return (
    <div
      className={cn(
        "group relative rounded-2xl border border-border/40 overflow-hidden bg-card",
        compact && "product-card-compact",
      )}
    >
      {/* Image */}
      <div
        className={cn(
          "aspect-square animate-shimmer rounded-none",
          compact && "aspect-[4/3]",
        )}
      />

      {/* Content */}
      <div className="p-3 sm:p-4 space-y-2">
        {/* Brand */}
        <div className="h-3 w-16 rounded animate-shimmer" />

        {/* Name */}
        <div className="space-y-1">
          <div className="h-4 w-full rounded animate-shimmer" />
          <div className="h-4 w-3/4 rounded animate-shimmer" />
        </div>

        {/* Weight */}
        <div className="h-3 w-12 rounded animate-shimmer" />

        {/* Rating */}
        <div className="h-4 w-20 rounded animate-shimmer" />

        {/* Price */}
        <div className="flex items-center gap-2 pt-1">
          <div className="h-6 w-16 rounded animate-shimmer" />
          <div className="h-4 w-12 rounded animate-shimmer" />
        </div>

        {/* Button */}
        <div className="h-10 w-full rounded-lg animate-shimmer mt-4" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
