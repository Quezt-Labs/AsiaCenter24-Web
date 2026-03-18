"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Package, ArrowRight, ShoppingBag, RotateCcw } from "lucide-react";
import { useOrderStore } from "@/store/useOrderStore";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/product";

const statusStyles: Record<OrderStatus, string> = {
  confirmed: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  packed: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  out_for_delivery: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  delivered: "bg-green-500/10 text-green-600 dark:text-green-400",
};

export default function MyOrdersPage() {
  const t = useTranslations();
  const locale = useLocale();
  const orders = useOrderStore((state) => state.orders);
  const addItem = useCartStore((state) => state.addItem);
  const { isAuthenticated, openAuthModal } = useAuthStore();

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case "confirmed":
        return t("confirmed");
      case "packed":
        return t("packed");
      case "out_for_delivery":
        return t("outForDelivery");
      case "delivered":
        return t("delivered");
      default:
        return status;
    }
  };

  const handleReorder = (order: (typeof orders)[0]) => {
    order.items.forEach((item) => {
      addItem(item.product, item.quantity, item.selectedWeight);
    });
    toast.success(t("reorderSuccess"), {
      description: t("reorderSuccessDesc", { count: order.items.length }),
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="container-app py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
            <Package size={40} className="text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {t("loginRequired")}
          </h1>
          <p className="text-muted-foreground mb-6">
            {t("loginToViewOrders")}
          </p>
          <button
            type="button"
            onClick={() => openAuthModal("/my-orders")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            {t("login")}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container-app py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {t("noOrders")}
          </h1>
          <p className="text-muted-foreground mb-6">
            {t("startShoppingNow")}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            {t("startShopping")}
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-6">
      <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">
        {t("myOrders")}
      </h1>

      <div className="space-y-4">
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-card rounded-xl border border-border/50 overflow-hidden"
          >
            {/* Order Header */}
            <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-sm text-muted-foreground">
                  Order #{order.id}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString(
                    locale === "hi" ? "hi-IN" : "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    },
                  )}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium",
                    statusStyles[order.status],
                  )}
                >
                  {getStatusLabel(order.status)}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-4">
              <div className="flex gap-3 overflow-x-auto pb-2">
                {order.items.slice(0, 4).map((item, idx) => {
                  const name =
                    locale === "hi" ? item.product.nameHi : item.product.name;
                  return (
                    <div key={`${item.product.id}-${idx}`} className="shrink-0">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-secondary">
                        <Image
                          src={item.product.image}
                          alt={name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    </div>
                  );
                })}
                {order.items.length > 4 && (
                  <div className="shrink-0 w-16 h-16 rounded-lg bg-secondary flex items-center justify-center">
                    <span className="text-sm font-medium text-muted-foreground">
                      +{order.items.length - 4}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {order.items.length} {t("items")}
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    {t("currency")}
                    {order.total}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleReorder(order)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/5 transition-colors text-sm font-medium"
                  >
                    <RotateCcw size={16} />
                    {t("orderAgain")}
                  </button>
                  <Link
                    href={`/order-tracking?orderId=${order.id}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
                  >
                    {t("trackOrder")}
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
