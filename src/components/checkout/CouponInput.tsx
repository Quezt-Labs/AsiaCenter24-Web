 "use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tag, X, Loader2 } from "lucide-react";
import { validateCoupon } from "@/data/coupons";
import { Coupon } from "@/types/product";
import { cn } from "@/lib/utils";

interface CouponInputProps {
  orderTotal: number;
  appliedCoupon: Coupon | null;
  couponDiscount: number;
  onApply: (coupon: Coupon, discount: number) => void;
  onRemove: () => void;
}

const CouponInput = ({
  orderTotal,
  appliedCoupon,
  couponDiscount,
  onApply,
  onRemove,
}: CouponInputProps) => {
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApply = async () => {
    if (!code.trim()) return;

    setIsLoading(true);
    setError(null);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = validateCoupon(code, orderTotal);

    if (result.valid && result.coupon && result.discount) {
      onApply(result.coupon, result.discount);
      setCode("");
    } else {
      setError(result.message || "Invalid coupon");
    }

    setIsLoading(false);
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
        <div className="flex items-center gap-2">
          <Tag size={18} className="text-primary" />
          <div>
            <p className="text-sm font-medium text-primary">
              {appliedCoupon.code}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("youSave")} ₹{couponDiscount}
            </p>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="p-1.5 rounded-full hover:bg-primary/10 transition-colors"
          aria-label="Remove coupon"
        >
          <X size={16} className="text-primary" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError(null);
            }}
            placeholder={t("enterCouponCode")}
            className={cn(
              "w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm",
              "bg-background text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:border-primary transition-colors",
              error ? "border-destructive" : "border-border",
            )}
          />
        </div>
        <button
          onClick={handleApply}
          disabled={!code.trim() || isLoading}
          className={cn(
            "px-4 py-2.5 rounded-lg font-medium text-sm",
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90 transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "flex items-center gap-2",
          )}
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            t("apply")
          )}
        </button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground">
        {t("tryCoupons")}: FRESH10, SAVE50, FIRST20
      </p>
    </div>
  );
};

export default CouponInput;
