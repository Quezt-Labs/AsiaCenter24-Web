"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Ref } from "react";
import { testimonials } from "@/data/products";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, damping: 22, stiffness: 180 },
  },
};

const Testimonials = () => {
  const { ref, isInView } = useScrollReveal(0.15);

  return (
    <section className="py-12 lg:py-20 bg-secondary/30">
      <div className="container-app">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground mt-2 text-sm max-w-md mx-auto">
            Trusted by 50,000+ happy households
          </p>
        </motion.div>

        <motion.div
          ref={ref as Ref<HTMLDivElement>}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-card rounded-2xl p-5 sm:p-6 border border-border/30 relative overflow-hidden group"
            >
              {/* Decorative quote */}
              <Quote
                className="absolute -top-2 -right-2 text-primary/[0.06] group-hover:text-primary/[0.1] transition-colors duration-500"
                size={80}
              />

              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/10"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-[8px] text-primary-foreground">
                      ✓
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < testimonial.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-border fill-border"
                    }
                  />
                ))}
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed">
                "{testimonial.comment}"
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
