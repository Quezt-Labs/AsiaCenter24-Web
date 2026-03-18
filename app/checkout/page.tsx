"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ChevronRight, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useAddressStore } from "@/store/useAddressStore";
import { useAddresses } from "@/hooks/useAddresses";
import { toast } from "sonner";
import type { Coupon, Order, Address } from "@/types/product";
import AddressSection from "@/components/checkout/AddressSection";
import DeliverySlotSection from "@/components/checkout/DeliverySlotSection";
import PaymentSection from "@/components/checkout/PaymentSection";
import OrderSummaryPanel from "@/components/checkout/OrderSummaryPanel";

export default function CheckoutPage() {
  const t = useTranslations();
  const router = useRouter();
  const { items, getSubtotal, getDiscount, getDeliveryCharge, clearCart } =
    useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { addOrder } = useOrderStore();
  const { getDefaultAddress } = useAddressStore();
  const { data: apiAddresses = [] } = useAddresses(isAuthenticated);

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>("upi");
  const [isLoading, setIsLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const deliveryCharge = getDeliveryCharge();
  const total = subtotal + deliveryCharge - couponDiscount;

  useEffect(() => {
    if (isAuthenticated && apiAddresses.length > 0 && !selectedAddress) {
      const defaultAddr =
        apiAddresses.find((a) => a.isDefault) ?? apiAddresses[0];
      setSelectedAddress(defaultAddr);
    } else if (!isAuthenticated) {
      const defaultAddr = getDefaultAddress();
      if (defaultAddr && !selectedAddress) {
        setSelectedAddress(defaultAddr);
      }
    }
  }, [isAuthenticated, apiAddresses, getDefaultAddress, selectedAddress]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/cart");
    }
  }, [isAuthenticated, router]);

  const handleApplyCoupon = (coupon: Coupon, discountAmount: number) => {
    setAppliedCoupon(coupon);
    setCouponDiscount(discountAmount);
    toast.success(t("couponApplied"), {
      description: `${t("youSave")} ${t("currency")}${discountAmount}!`,
    });
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const isFormValid = () =>
    !!(selectedAddress && selectedSlot && selectedPayment);

  const handlePlaceOrder = async () => {
    if (!isFormValid() || !selectedAddress) {
      toast.error(t("fillAllFields"), {
        description: t("fillAllFieldsDesc"),
      });
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const orderId = `FM${Date.now().toString().slice(-8)}`;
    const order: Order = {
      id: orderId,
      items: items.map((item) => ({
        product: item.product,
        quantity: item.quantity,
        selectedWeight: item.selectedWeight,
        price:
          item.product.weightOptions.find(
            (w) => w.weight === item.selectedWeight,
          )?.price || item.product.price,
      })),
      subtotal,
      discount: discount + couponDiscount,
      deliveryCharge,
      total,
      status: "confirmed",
      deliveryAddress: selectedAddress,
      paymentMethod: selectedPayment,
      createdAt: new Date(),
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    };

    addOrder(order);
    clearCart();
    router.push(`/thank-you?orderId=${orderId}`);
  };

  if (items.length === 0) {
    return (
      <div className="container-app py-16 text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="w-20 h-20 rounded-3xl bg-secondary flex items-center justify-center mx-auto mb-5">
            <ShoppingBag size={36} className="text-muted-foreground/50" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
            {t("emptyCart")}
          </h1>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-sm transition-colors"
          >
            {t("startShopping")} <ChevronRight size={16} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container-app py-4 sm:py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
        <Link href="/cart" className="hover:text-primary transition-colors">
          {t("cart")}
        </Link>
        <ChevronRight size={14} />
        <span className="text-foreground font-semibold">{t("checkout")}</span>
      </nav>

      <div className="flex items-center gap-3 mb-5 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
          {t("checkout")}
        </h1>
        <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
          {items.length} {items.length === 1 ? "item" : t("items")}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-5">
          <AddressSection
            selectedAddressId={selectedAddress?.id ?? null}
            onSelectAddress={setSelectedAddress}
          />
          <DeliverySlotSection
            selectedSlot={selectedSlot}
            onSelectSlot={setSelectedSlot}
          />
          <PaymentSection
            selectedPayment={selectedPayment}
            onSelectPayment={setSelectedPayment}
          />
        </div>

        {/* Order Summary */}
        <OrderSummaryPanel
          subtotal={subtotal}
          discount={discount}
          deliveryCharge={deliveryCharge}
          couponDiscount={couponDiscount}
          total={total}
          appliedCoupon={appliedCoupon}
          onApplyCoupon={handleApplyCoupon}
          onRemoveCoupon={handleRemoveCoupon}
          isLoading={isLoading}
          isFormValid={isFormValid()}
          onPlaceOrder={handlePlaceOrder}
        />
      </div>
    </div>
  );
}
