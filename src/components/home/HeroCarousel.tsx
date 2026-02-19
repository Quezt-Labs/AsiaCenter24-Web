"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { bannerSlides } from "@/data/products";
import Image from "next/image";

const HeroCarousel = () => {
  const { t, i18n } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide(
      (prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length,
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const slide = bannerSlides[currentSlide];

  const slideVariants = {
    enter: (d: number) => ({
      x: d > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
    },
    exit: (d: number) => ({
      x: d < 0 ? "100%" : "-100%",
      opacity: 0,
      transition: { duration: 0.4, ease: "easeIn" as const },
    }),
  };

  return (
    <section className="py-3 sm:py-4 lg:py-6">
      <div className="container-app">
        <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-lg">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="relative aspect-[16/9] sm:aspect-[21/9] lg:aspect-[3/1]"
            >
              {/* Background Image */}
              <Image
                src={slide.image}
                alt={i18n.language === "hi" ? slide.titleHi : slide.title}
                fill
                className="absolute inset-0 w-full h-full object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1400px"
                quality={75}
                priority={currentSlide === 0}
              />

              {/* Overlay */}
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-r opacity-90",
                  slide.bgColor,
                )}
              />

              {/* Content */}
              <div className="absolute inset-0 flex items-center">
                <div className="container-app">
                  <motion.div
                    initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
                    className="max-w-lg"
                  >
                    <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-primary-foreground mb-2 sm:mb-4 leading-tight">
                      {i18n.language === "hi" ? slide.titleHi : slide.title}
                    </h2>
                    <p className="text-sm sm:text-lg text-primary-foreground/90 mb-4 sm:mb-6">
                      {i18n.language === "hi"
                        ? slide.subtitleHi
                        : slide.subtitle}
                    </p>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35, duration: 0.4 }}
                    >
                      <Link
                        href="/products"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-background text-foreground font-semibold hover:bg-background/90 transition-all shadow-xl hover:shadow-2xl group"
                      >
                        {i18n.language === "hi" ? slide.ctaHi : slide.cta}
                        <ChevronRight
                          size={18}
                          className="group-hover:translate-x-0.5 transition-transform"
                        />
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/20 backdrop-blur-md flex items-center justify-center text-primary-foreground hover:bg-background/40 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/20 backdrop-blur-md flex items-center justify-center text-primary-foreground hover:bg-background/40 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </motion.button>

          {/* Dots */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {bannerSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentSlide ? 1 : -1);
                  setCurrentSlide(index);
                }}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  index === currentSlide
                    ? "bg-background w-7"
                    : "bg-background/40 w-2 hover:bg-background/60",
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-background/10">
            <motion.div
              key={currentSlide}
              className="h-full bg-background/60"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, ease: "linear" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
