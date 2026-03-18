"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight, Home } from "lucide-react";
import confetti from "canvas-confetti";
import { useOrderStore } from "@/store/useOrderStore";

export default function ThankYouPage() {
  const t = useTranslations();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("orderId") ?? "";
  const getOrder = useOrderStore((state) => state.getOrder);
  const order = orderId ? getOrder(orderId) : undefined;

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#22c55e", "#16a34a", "#15803d"],
    });
  }, []);

  const estimatedDelivery = order?.estimatedDelivery
    ? new Date(order.estimatedDelivery)
    : (() => {
        const d = new Date();
        d.setDate(d.getDate() + 2);
        return d;
      })();

  const formattedDate = estimatedDelivery.toLocaleDateString(
    locale === "hi" ? "hi-IN" : "en-IN",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
    },
  );

  const displayOrderId = orderId || order?.id || "—";

  return (
    <div className="container-app py-12 lg:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle size={48} className="text-primary" />
        </motion.div>

        {/* Title */}
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
          {t("thankYou")}
        </h1>
        <p className="text-lg text-muted-foreground mb-8">{t("orderPlaced")}</p>

        {/* Order Info Card */}
        <div className="bg-card rounded-2xl border border-border/50 p-6 mb-8 text-left">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
            <Package className="text-primary" size={24} />
            <div>
              <p className="text-sm text-muted-foreground">{t("orderId")}</p>
              <p className="font-bold text-foreground text-lg">
                {displayOrderId}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              {t("estimatedDelivery")}
            </p>
            <p className="font-semibold text-foreground">{formattedDate}</p>
            <p className="text-sm text-primary mt-1">{t("deliveryWindow")}</p>
          </div>
        </div>

        {/* Message */}
        <p className="text-muted-foreground mb-8">
          {t("orderConfirmationMessage")}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/order-tracking?orderId=${displayOrderId}`}
            className="flex-1 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
          >
            {t("trackOrder")}
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/"
            className="flex-1 py-3.5 rounded-xl border-2 border-border text-foreground font-semibold flex items-center justify-center gap-2 hover:bg-secondary transition-colors"
          >
            <Home size={18} />
            {t("home")}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
