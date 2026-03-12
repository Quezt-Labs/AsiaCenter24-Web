"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Ref } from "react";
import { useBanners } from "@/hooks/useBanners";

const DEFAULT_TITLE = "Save More on Monthly Essentials";
const DEFAULT_SUBTITLE =
  "Stock up on your favorite groceries and save up to 30% on rice, atta, dal, and more!";
const DEFAULT_CTA = "Explore Deals";
const DEFAULT_LINK = "/products";

const OfferBanner = () => {
  const { ref, isInView } = useScrollReveal(0.3);
  const { data: banners } = useBanners("HOME_SECONDARY");
  const banner = banners?.[0];

  const title = banner?.title ?? DEFAULT_TITLE;
  const subtitle = banner?.subtitle ?? DEFAULT_SUBTITLE;
  const ctaText = banner?.ctaText ?? DEFAULT_CTA;
  const ctaLink = banner?.ctaLink ?? DEFAULT_LINK;

  return (
    <section className="py-8 lg:py-12">
      <div className="container-app">
        <motion.div
          ref={ref as Ref<HTMLDivElement>}
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="gradient-deal rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12 text-center relative overflow-hidden"
        >
          {/* Animated decorative elements */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-32 h-32 bg-background/10 rounded-full -translate-x-1/2 -translate-y-1/2"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], rotate: [0, -10, 0] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-0 right-0 w-48 h-48 bg-background/10 rounded-full translate-x-1/2 translate-y-1/2"
          />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 right-1/4 w-16 h-16 bg-background/5 rounded-full hidden lg:block"
          />

          <div className="relative z-10">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-background/20 backdrop-blur-sm rounded-full text-sm font-medium text-accent-foreground mb-4"
            >
              <Sparkles size={14} />
              Limited Time Offer
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-accent-foreground mb-3"
            >
              {title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="text-accent-foreground/80 mb-6 max-w-xl mx-auto text-sm sm:text-base"
            >
              {subtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
            >
              <Link
                href={ctaLink}
                className="inline-flex items-center gap-2 px-6 py-3 bg-background text-foreground font-semibold rounded-full hover:bg-background/90 transition-all shadow-xl hover:shadow-2xl group"
              >
                {ctaText}
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OfferBanner;
