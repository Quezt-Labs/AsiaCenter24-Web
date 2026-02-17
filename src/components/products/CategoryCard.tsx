"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Category } from "@/types/product";

interface CategoryCardProps {
  category: Category;
  index?: number;
}

const CategoryCard = ({ category, index = 0 }: CategoryCardProps) => {
  const { i18n } = useTranslation();
  const name = i18n.language === "hi" ? category.nameHi : category.name;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.04,
        type: "spring" as const,
        damping: 20,
        stiffness: 250,
      }}
    >
      <Link
        href={`/products?category=${category.slug}`}
        className="group flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl bg-secondary/40 border border-transparent hover:border-primary/20 hover:bg-primary/5 transition-all duration-300 cursor-pointer"
      >
        <motion.div
          whileHover={{ scale: 1.08, rotate: 2 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-secondary shadow-sm"
        >
          <div className="w-full h-full relative">
            <Image
              src={category.image}
              alt={name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          {/* Shimmer on hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-700" />
        </motion.div>
        <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300">
          {category.icon}
        </span>
        <span className="text-xs sm:text-sm font-medium text-foreground text-center leading-tight">
          {name}
        </span>
        <span className="text-[10px] sm:text-xs text-muted-foreground">
          {category.productCount} items
        </span>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
