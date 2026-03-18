"use client";

const CategoryCardSkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl bg-secondary/40 border border-transparent">
      {/* Image */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl animate-shimmer" />

      {/* Icon placeholder */}
      <div className="w-8 h-8 rounded animate-shimmer" />

      {/* Name */}
      <div className="h-3 w-16 rounded animate-shimmer" />

      {/* Count */}
      <div className="h-3 w-12 rounded animate-shimmer" />
    </div>
  );
};

export default CategoryCardSkeleton;
