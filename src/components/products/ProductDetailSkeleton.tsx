"use client";

export default function ProductDetailSkeleton() {
  return (
    <div className="container-app py-4 sm:py-6">
      <div className="h-4 w-48 rounded animate-shimmer mb-6" />
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-12">
        <div className="aspect-square rounded-2xl animate-shimmer" />
        <div className="space-y-4">
          <div className="h-4 w-20 rounded animate-shimmer" />
          <div className="h-8 w-3/4 rounded animate-shimmer" />
          <div className="h-4 w-1/2 rounded animate-shimmer" />
          <div className="h-10 w-32 rounded animate-shimmer" />
          <div className="h-12 w-full rounded-lg animate-shimmer mt-6" />
        </div>
      </div>
    </div>
  );
}
