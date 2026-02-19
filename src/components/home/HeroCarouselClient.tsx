"use client";
import dynamic from "next/dynamic";

const HeroCarousel = dynamic(() => import("./HeroCarousel"), {
  ssr: false,
  loading: () => <div className="h-48" />,
});

export default function HeroCarouselClient() {
  return <HeroCarousel />;
}
