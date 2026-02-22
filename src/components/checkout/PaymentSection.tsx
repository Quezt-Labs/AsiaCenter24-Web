import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CreditCard, Wallet, Banknote, Check, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const paymentMethods = [
  {
    id: "upi",
    labelKey: "upi",
    icon: Wallet,
    descKey: "upiDesc",
    color: "text-violet-600",
    bg: "bg-violet-500/10",
  },
  {
    id: "card",
    labelKey: "creditDebitCard",
    icon: CreditCard,
    descKey: "cardDesc",
    color: "text-blue-600",
    bg: "bg-blue-500/10",
  },
  {
    id: "cod",
    labelKey: "cashOnDelivery",
    icon: Banknote,
    descKey: "codDesc",
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
  },
];

interface PaymentSectionProps {
  selectedPayment: string;
  onSelectPayment: (id: string) => void;
}

const PaymentSection = ({
  selectedPayment,
  onSelectPayment,
}: PaymentSectionProps) => {
  const t = useTranslations();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 24, delay: 0.1 }}
      className="bg-card rounded-2xl border border-border/50 p-4 sm:p-6"
    >
      <div className="flex items-center gap-3 mb-4 sm:mb-5">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <CreditCard size={20} className="text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-base sm:text-lg text-foreground">
            {t("paymentMethod")}
          </h2>
          <p className="text-xs text-muted-foreground">
            {t("choosePaymentMethod")}
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-secondary rounded-full">
          <span
            className={cn(
              "w-2 h-2 rounded-full",
              selectedPayment ? "bg-primary" : "bg-muted-foreground/30",
            )}
          />
          <span className="text-[10px] font-semibold text-muted-foreground">
            Step 3
          </span>
        </div>
      </div>

      <div className="space-y-2.5">
        {paymentMethods.map((method, i) => (
          <motion.button
            key={method.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onSelectPayment(method.id)}
            className={cn(
              "w-full p-3.5 sm:p-4 rounded-xl border-2 flex items-center gap-3 sm:gap-4 transition-all text-left active:scale-[0.99]",
              selectedPayment === method.id
                ? "border-primary bg-primary/[0.04] shadow-sm shadow-primary/10"
                : "border-border/60 hover:border-primary/30 hover:bg-secondary/30",
            )}
          >
            <div
              className={cn(
                "w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors",
                selectedPayment === method.id ? "bg-primary/10" : method.bg,
              )}
            >
              <method.icon
                size={22}
                className={
                  selectedPayment === method.id ? "text-primary" : method.color
                }
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground">
                {t(method.labelKey)}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t(method.descKey)}
              </p>
            </div>
            <div
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                selectedPayment === method.id
                  ? "border-primary bg-primary"
                  : "border-muted-foreground/30",
              )}
            >
              {selectedPayment === method.id && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <Check size={11} className="text-primary-foreground" />
                </motion.div>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 mt-4 py-2.5 rounded-xl bg-secondary/50">
        <ShieldCheck size={14} className="text-primary" />
        <span className="text-xs text-muted-foreground font-medium">
          All payments are 256-bit SSL encrypted
        </span>
      </div>
    </motion.div>
  );
};

export default PaymentSection;
