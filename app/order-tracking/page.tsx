"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Package,
  Truck,
  Home as HomeIcon,
  ChevronRight,
  MapPin,
  CreditCard,
} from "lucide-react";
import { useOrderStore } from "@/store/useOrderStore";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/product";

const ORDER_STATUS_FLOW: { id: OrderStatus; icon: typeof CheckCircle }[] = [
  { id: "confirmed", icon: CheckCircle },
  { id: "packed", icon: Package },
  { id: "out_for_delivery", icon: Truck },
  { id: "delivered", icon: HomeIcon },
];

const STATUS_INDEX: Record<OrderStatus, number> = {
  confirmed: 0,
  packed: 1,
  out_for_delivery: 2,
  delivered: 3,
};

function getPaymentLabel(method: string, t: (key: string) => string): string {
  switch (method) {
    case "upi":
      return t("upi");
    case "card":
      return t("creditDebitCard");
    case "cod":
      return t("cashOnDelivery");
    default:
      return method;
  }
}

export default function OrderTrackingPage() {
  const t = useTranslations();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("orderId") ?? "";
  const getOrder = useOrderStore((state) => state.getOrder);
  const order = orderId ? getOrder(orderId) : undefined;

  const currentStatusIndex = order
    ? STATUS_INDEX[order.status]
    : 0;

  if (!orderId) {
    return (
      <div className="container-app py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {t("orderTracking")}
        </h1>
        <p className="text-muted-foreground mb-6">
          No order ID provided. Please use a valid order tracking link.
        </p>
        <Link
          href="/my-orders"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
        >
          {t("myOrders")}
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-app py-16 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {t("orderTracking")}
        </h1>
        <p className="text-muted-foreground mb-6">
          Order #{orderId} not found. It may have been placed from another
          device.
        </p>
        <Link
          href="/my-orders"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors"
        >
          {t("myOrders")}
        </Link>
      </div>
    );
  }

  const addr = order.deliveryAddress;

  return (
    <div className="container-app py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          {t("home")}
        </Link>
        <ChevronRight size={14} />
        <span className="text-foreground font-medium">
          {t("orderTracking")}
        </span>
      </nav>

      <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
        {t("orderTracking")}
      </h1>
      <p className="text-muted-foreground mb-8">
        {t("orderId")}:{" "}
        <span className="font-semibold text-foreground">{order.id}</span>
      </p>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Timeline */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl border border-border/50 p-6">
            <h2 className="font-semibold text-lg text-foreground mb-6">
              {t("orderStatus")}
            </h2>

            <div className="relative">
              {ORDER_STATUS_FLOW.map((status, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                const isLast = index === ORDER_STATUS_FLOW.length - 1;
                const StatusIcon = status.icon;

                return (
                  <motion.div
                    key={status.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 relative"
                  >
                    {/* Line */}
                    {!isLast && (
                      <div
                        className={cn(
                          "absolute left-5 top-12 w-0.5 h-12",
                          isCompleted ? "bg-primary" : "bg-border",
                        )}
                      />
                    )}

                    {/* Icon */}
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0 relative z-10",
                        isCompleted
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground",
                      )}
                    >
                      <StatusIcon size={20} />
                    </div>

                    {/* Content */}
                    <div className="pb-12">
                      <p
                        className={cn(
                          "font-medium",
                          isCompleted
                            ? "text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {t(
                          status.id === "out_for_delivery"
                            ? "outForDelivery"
                            : status.id,
                        )}
                      </p>
                      {isCurrent && (
                        <p className="text-sm text-primary mt-1">
                          {t("yourOrderBeingPrepared")}
                        </p>
                      )}
                      {isCompleted && !isCurrent && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("completed")}
                        </p>
                      )}
                      {!isCompleted && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("pending")}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-card rounded-xl border border-border/50 p-6 mt-6">
            <h2 className="font-semibold text-lg text-foreground mb-4">
              {t("orderItems")}
            </h2>

            <div className="space-y-4">
              {order.items.map((item) => {
                const name =
                  locale === "hi" ? item.product.nameHi : item.product.name;
                return (
                  <div
                    key={`${item.product.id}-${item.selectedWeight}`}
                    className="flex items-center gap-4"
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-secondary shrink-0">
                      <Image
                        src={item.product.image}
                        alt={name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.selectedWeight} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium text-foreground shrink-0">
                      {t("currency")}
                      {item.price * item.quantity}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Details Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            {/* Delivery Address */}
            <div className="bg-card rounded-xl border border-border/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin size={20} className="text-primary" />
                <h3 className="font-semibold text-foreground">
                  {t("deliveryAddress")}
                </h3>
              </div>
              <p className="text-foreground">{addr.name}</p>
              <p className="text-muted-foreground text-sm mt-1">
                {addr.addressLine1}
                {addr.addressLine2 && `, ${addr.addressLine2}`}
                <br />
                {addr.city}, {addr.state} {addr.pincode}
                <br />
                {addr.phone}
              </p>
            </div>

            {/* Payment Summary */}
            <div className="bg-card rounded-xl border border-border/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard size={20} className="text-primary" />
                <h3 className="font-semibold text-foreground">
                  {t("paymentSummary")}
                </h3>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("subtotal")}</span>
                  <span className="text-foreground">
                    {t("currency")}
                    {order.subtotal}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>{t("discount")}</span>
                    <span>
                      -{t("currency")}
                      {order.discount}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("deliveryCharge")}
                  </span>
                  <span
                    className={cn(
                      order.deliveryCharge === 0
                        ? "text-primary font-medium"
                        : "text-foreground",
                    )}
                  >
                    {order.deliveryCharge === 0
                      ? t("free")
                      : `${t("currency")}${order.deliveryCharge}`}
                  </span>
                </div>
                <div className="border-t border-border pt-2 mt-2 flex justify-between">
                  <span className="font-semibold text-foreground">
                    {t("total")}
                  </span>
                  <span className="font-bold text-foreground">
                    {t("currency")}
                    {order.total}
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                {t("paidVia", {
                  method: getPaymentLabel(order.paymentMethod, t),
                })}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Link
                href="/products"
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-center hover:bg-primary/90 transition-colors"
              >
                {t("continueShopping")}
              </Link>
              <button
                type="button"
                className="w-full py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-secondary transition-colors"
              >
                {t("needHelp")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
