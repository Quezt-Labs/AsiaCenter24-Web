"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";

export default function CartPage() {
  const t = useTranslations();
  const locale = useLocale();
  const {
    items,
    updateQuantity,
    removeItem,
    getSubtotal,
    getDiscount,
    getDeliveryCharge,
    getTotal,
  } = useCartStore();
  const { isAuthenticated, openAuthModal } = useAuthStore();

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const deliveryCharge = getDeliveryCharge();
  const total = getTotal();

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      openAuthModal("/checkout");
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-app py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {t("emptyCart")}
          </h1>
          <p className="text-muted-foreground mb-6">{t("emptyCartMessage")}</p>
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
        {t("yourCart")} ({items.length} {t("items")})
      </h1>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => {
            const name =
              locale === "hi" ? item.product.nameHi : item.product.name;
            const weightOption = item.product.weightOptions.find(
              (w) => w.weight === item.selectedWeight,
            );
            const price = weightOption?.price || item.product.price;
            const productSlug = item.product.slug || item.product.id;

            return (
              <motion.div
                key={`${item.product.id}-${item.selectedWeight}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-4 p-4 bg-card rounded-xl border border-border/50"
              >
                {/* Image */}
                <Link href={`/products/${productSlug}`} className="shrink-0">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-secondary">
                    <Image
                      src={item.product.image}
                      alt={name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${productSlug}`}>
                    <h3 className="font-medium text-foreground line-clamp-2 hover:text-primary transition-colors">
                      {name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {item.product.brand} • {item.selectedWeight}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity - 1,
                            item.selectedWeight,
                          )
                        }
                        className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity + 1,
                            item.selectedWeight,
                          )
                        }
                        className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-bold text-foreground">
                        {t("currency")}
                        {price * item.quantity}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-muted-foreground">
                          {t("currency")}
                          {price} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() =>
                    removeItem(item.product.id, item.selectedWeight)
                  }
                  className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-card rounded-xl border border-border/50 p-6">
            <h2 className="font-semibold text-lg text-foreground mb-4">
              {t("orderSummary")}
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t("subtotal")}</span>
                <span className="text-foreground font-medium">
                  {t("currency")}
                  {subtotal}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-primary">
                  <span>{t("discount")}</span>
                  <span className="font-medium">
                    -{t("currency")}
                    {discount}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  {t("deliveryCharge")}
                </span>
                <span
                  className={cn(
                    "font-medium",
                    deliveryCharge === 0 ? "text-primary" : "text-foreground",
                  )}
                >
                  {deliveryCharge === 0
                    ? t("free")
                    : `${t("currency")}${deliveryCharge}`}
                </span>
              </div>
              {subtotal < 499 && (
                <p className="text-xs text-muted-foreground bg-secondary/50 rounded-lg p-2">
                  {t("addMoreForFreeDelivery", {
                    amount: 499 - subtotal,
                  })}
                </p>
              )}
            </div>

            <div className="border-t border-border mt-4 pt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-foreground">
                  {t("total")}
                </span>
                <span className="text-xl font-bold text-foreground">
                  {t("currency")}
                  {total}
                </span>
              </div>

              {isAuthenticated ? (
                <Link
                  href="/checkout"
                  className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                >
                  {t("proceedToCheckout")}
                  <ArrowRight size={18} />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleProceedToCheckout}
                  className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                >
                  {t("proceedToCheckout")}
                  <ArrowRight size={18} />
                </button>
              )}
            </div>

            <Link
              href="/products"
              className="block text-center text-sm text-primary hover:underline mt-4"
            >
              {t("continueShopping")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
