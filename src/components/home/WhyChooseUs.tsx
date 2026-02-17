 "use client";

import i18n from "@/i18n";
import { motion } from "framer-motion";
import { Truck, ShieldCheck, Clock, BadgePercent } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Ref } from "react";

const features = [
  {
    icon: ShieldCheck,
    titleKey: "freshStock",
    descKey: "freshStockDesc",
    gradient: "from-emerald-500/10 to-emerald-500/5",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600",
  },
  {
    icon: BadgePercent,
    titleKey: "trustedBrands",
    descKey: "trustedBrandsDesc",
    gradient: "from-blue-500/10 to-blue-500/5",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600",
  },
  {
    icon: Truck,
    titleKey: "fastDelivery",
    descKey: "fastDeliveryDesc",
    gradient: "from-accent/10 to-accent/5",
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
  },
  {
    icon: Clock,
    titleKey: "affordablePricing",
    descKey: "affordablePricingDesc",
    gradient: "from-purple-500/10 to-purple-500/5",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-600",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, damping: 20, stiffness: 200 },
  },
};

const WhyChooseUs = () => {
  const t = (k: string) => i18n.t(k);
  const { ref, isInView } = useScrollReveal(0.2);

  return (
    <section className="py-12 lg:py-20">
      <div className="container-app">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
            {t("whyChooseUs")}
          </h2>
          <p className="text-muted-foreground mt-2 text-sm max-w-md mx-auto">
            We deliver quality you can trust — every day, every order.
          </p>
        </motion.div>

        <motion.div
          ref={ref as Ref<HTMLDivElement>}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.titleKey}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`relative bg-gradient-to-br ${feature.gradient} rounded-2xl p-5 sm:p-6 text-center border border-border/30 overflow-hidden group cursor-default`}
            >
              {/* Subtle glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 to-transparent" />

              <motion.div
                whileHover={{ rotate: [0, -8, 8, 0], scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${feature.iconBg} ${feature.iconColor} flex items-center justify-center mx-auto mb-3 sm:mb-4`}
              >
                <feature.icon size={24} className="sm:w-7 sm:h-7" />
              </motion.div>
              <h3 className="font-semibold text-foreground text-sm sm:text-base mb-1.5">
                {t(feature.titleKey)}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {t(feature.descKey)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
