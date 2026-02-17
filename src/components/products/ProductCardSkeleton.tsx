const ProductCardSkeleton = () => {
  return (
    <div className="product-card animate-pulse">
      {/* Image */}
      <div className="aspect-square bg-secondary/50" />

      {/* Content */}
      <div className="p-3 space-y-2">
        {/* Brand */}
        <div className="h-3 bg-secondary/50 rounded w-16" />

        {/* Name */}
        <div className="space-y-1">
          <div className="h-4 bg-secondary/50 rounded w-full" />
          <div className="h-4 bg-secondary/50 rounded w-3/4" />
        </div>

        {/* Weight */}
        <div className="h-3 bg-secondary/50 rounded w-12" />

        {/* Rating */}
        <div className="h-4 bg-secondary/50 rounded w-20" />

        {/* Price */}
        <div className="flex items-center gap-2">
          <div className="h-6 bg-secondary/50 rounded w-16" />
          <div className="h-4 bg-secondary/50 rounded w-12" />
        </div>

        {/* Button */}
        <div className="h-10 bg-secondary/50 rounded-lg" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
