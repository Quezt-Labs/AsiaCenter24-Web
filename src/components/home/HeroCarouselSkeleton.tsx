"use client";

const HeroCarouselSkeleton = () => {
  return (
    <section className="py-3 sm:py-4 lg:py-6">
      <div className="container-app">
        <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-lg aspect-[16/9] sm:aspect-[21/9] lg:aspect-[3/1]">
          <div className="absolute inset-0 animate-shimmer" />
          {/* Content overlay skeleton */}
          <div className="absolute inset-0 flex items-center">
            <div className="container-app">
              <div className="max-w-lg space-y-4">
                <div className="h-8 sm:h-10 lg:h-12 w-3/4 rounded animate-shimmer" />
                <div className="h-4 sm:h-6 w-1/2 rounded animate-shimmer" />
                <div className="h-12 w-32 rounded-full animate-shimmer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCarouselSkeleton;
