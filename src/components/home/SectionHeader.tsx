"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Ref } from "react";

interface SectionHeaderProps {
  title: string;
  linkTo?: string;
  linkLabel?: string;
}

const SectionHeader = ({ title, linkTo, linkLabel }: SectionHeaderProps) => {
  const { ref, isInView } = useScrollReveal();

  return (
    <motion.div
      ref={ref as Ref<HTMLDivElement>}
      className="flex items-center justify-between mb-6"
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <h2 className="text-xl lg:text-2xl font-bold text-foreground">{title}</h2>
      {linkTo && (
        <Link
          href={linkTo}
          className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1 group transition-colors"
        >
          {linkLabel || "View All"}
          <ArrowRight
            size={16}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </Link>
      )}
    </motion.div>
  );
};

export default SectionHeader;
