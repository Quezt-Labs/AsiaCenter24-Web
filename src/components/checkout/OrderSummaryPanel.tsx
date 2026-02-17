import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Loader2, ShieldCheck, Truck, Package, Gift } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { Coupon } from "@/types/product";
import CouponInput from "./CouponInput";
import { cn } from "@/lib/utils";

interface OrderSummaryPanelProps {
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  couponDiscount: number;
  total: number;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon, discount: number) => void;
  onRemoveCoupon: () => void;
  isLoading: boolean;
  isFormValid: boolean;
  onPlaceOrder: () => void;
}

const OrderSummaryPanel = ({
  subtotal,
  discount,
  deliveryCharge,
  couponDiscount,
  total,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  isLoading,
  isFormValid,
  onPlaceOrder,
}: OrderSummaryPanelProps) => {
  const { t, i18n } = useTranslation();
  const { items } = useCartStore();

  const totalSavings = discount + couponDiscount;

  return (
    <div className="lg:col-span-1">
      <div className="sticky top-24 space-y-3 sm:space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 24, delay: 0.15 }}
          className="bg-card rounded-2xl border border-border/50 p-4 sm:p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Package size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-base sm:text-lg text-foreground">
                {t("orderSummary")}
              </h2>
              <p className="text-xs text-muted-foreground">
                {items.length} {items.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3 mb-4 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
            {items.map((item) => {
              const name =
                i18n.language === "hi"
                  ? item.product.nameHi
                  : item.product.name;
              const weightOption = item.product.weightOptions.find(
                (w) => w.weight === item.selectedWeight,
              );
              const price = weightOption?.price || item.product.price;

              return (
                <div
                  key={`${item.product.id}-${item.selectedWeight}`}
                  className="flex items-center gap-3"
                >
                  <img
                    src={item.product.image}
                    alt={name}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover flex-shrink-0 border border-border/30"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-foreground line-clamp-1">
                      {name}
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      {item.selectedWeight} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-foreground">
                    ₹{price * item.quantity}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Price Breakdown */}
          <div className="border-t border-border/50 pt-3 space-y-2.5 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs sm:text-sm">
                {t("subtotal")}
              </span>
              <span className="text-foreground font-medium text-xs sm:text-sm">
                ₹{subtotal}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between text-primary">
                <span className="text-xs sm:text-sm font-medium">
                  {t("discount")}
                </span>
                <span className="font-bold text-xs sm:text-sm">
                  -₹{discount}
                </span>
              </div>
            )}
            {couponDiscount > 0 && (
              <div className="flex items-center justify-between text-primary">
                <span className="text-xs sm:text-sm font-medium flex items-center gap-1">
                  <Gift size={13} /> {t("couponDiscount")}
                </span>
                <span className="font-bold text-xs sm:text-sm">
                  -₹{couponDiscount}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs sm:text-sm">
                {t("deliveryCharge")}
              </span>
              <span
                className={cn(
                  "font-medium text-xs sm:text-sm",
                  deliveryCharge === 0
                    ? "text-primary font-bold"
                    : "text-foreground",
                )}
              >
                {deliveryCharge === 0 ? t("free") : `₹${deliveryCharge}`}
              </span>
            </div>
          </div>

          {/* Total Savings */}
          {totalSavings > 0 && (
            <div className="mt-3 p-2.5 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-xs font-bold text-primary flex items-center gap-1.5">
                🎉 You're saving ₹{totalSavings} on this order!
              </p>
            </div>
          )}

          {/* Coupon */}
          <div className="border-t border-border/50 mt-3 pt-3">
            <CouponInput
              orderTotal={subtotal}
              appliedCoupon={appliedCoupon}
              couponDiscount={couponDiscount}
              onApply={onApplyCoupon}
              onRemove={onRemoveCoupon}
            />
          </div>

          {/* Total + CTA */}
          <div className="border-t border-border/50 mt-3 pt-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-foreground text-sm sm:text-base">
                {t("total")}
              </span>
              <div className="text-right">
                <span className="text-xl sm:text-2xl font-black text-foreground">
                  ₹{total}
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: isFormValid ? 1.01 : 1 }}
              whileTap={{ scale: isFormValid ? 0.98 : 1 }}
              onClick={onPlaceOrder}
              disabled={isLoading || !isFormValid}
              className={cn(
                "w-full py-3.5 sm:py-4 rounded-2xl font-bold flex items-center justify-center gap-2.5 transition-all text-sm sm:text-base",
                isFormValid
                  ? "bg-primary text-primary-foreground hover:brightness-110 shadow-lg shadow-primary/25"
                  : "bg-muted text-muted-foreground cursor-not-allowed",
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {t("processing")}
                </>
              ) : (
                <>
                  {t("placeOrder")}
                  <span className="text-primary-foreground/70">•</span>
                  <span>₹{total}</span>
                </>
              )}
            </motion.button>

            {!isFormValid && (
              <p className="text-[11px] text-muted-foreground text-center mt-2.5">
                Please complete all steps to place your order
              </p>
            )}
          </div>
        </motion.div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-5 py-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck size={15} className="text-primary" />
            <span className="font-medium">{t("securePayment")}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-border" />
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Truck size={15} className="text-primary" />
            <span className="font-medium">{t("fastDelivery")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryPanel;
