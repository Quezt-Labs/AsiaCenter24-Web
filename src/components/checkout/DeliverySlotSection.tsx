import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Clock, Check, CalendarDays } from "lucide-react";
import { useDeliverySlots } from "@/hooks/useDeliverySlots";
import type { DeliverySlot } from "@/api/deliverySlots";
import { cn } from "@/lib/utils";

interface DeliverySlotSectionProps {
  selectedSlot: string | null;
  onSelectSlot: (slotId: string) => void;
}

const DeliverySlotSection = ({
  selectedSlot,
  onSelectSlot,
}: DeliverySlotSectionProps) => {
  const t = useTranslations();
  const { data: deliverySlots = [] } = useDeliverySlots();

  const groupedSlots = deliverySlots.reduce<
    Record<string, DeliverySlot[]>
  >((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 24, delay: 0.05 }}
      className="bg-card rounded-2xl border border-border/50 p-4 sm:p-6"
    >
      <div className="flex items-center gap-3 mb-4 sm:mb-5">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Clock size={20} className="text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-base sm:text-lg text-foreground">
            {t("deliverySlot")}
          </h2>
          <p className="text-xs text-muted-foreground">
            {t("chooseDeliveryTime")}
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-secondary rounded-full">
          <span
            className={cn(
              "w-2 h-2 rounded-full",
              selectedSlot ? "bg-primary" : "bg-muted-foreground/30",
            )}
          />
          <span className="text-[10px] font-semibold text-muted-foreground">
            Step 2
          </span>
        </div>
      </div>

      {deliverySlots.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">
          {t("noSlotsAvailable") ?? "No delivery slots available. Please try again later."}
        </p>
      ) : (
        <>
      {Object.entries(groupedSlots).map(([date, slots], gi) => (
        <div key={date} className="mb-4 last:mb-0">
          <div className="flex items-center gap-2 mb-2.5">
            <CalendarDays size={14} className="text-primary" />
            <p className="text-xs font-bold text-foreground uppercase tracking-wider">
              {date}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {slots.map((slot, i) => (
              <motion.button
                key={slot.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: gi * 0.05 + i * 0.03 }}
                onClick={() => slot.available && onSelectSlot(slot.id)}
                disabled={!slot.available}
                className={cn(
                  "p-3 sm:p-3.5 rounded-xl border-2 text-left transition-all relative active:scale-[0.98]",
                  selectedSlot === slot.id
                    ? "border-primary bg-primary/[0.04] shadow-sm shadow-primary/10"
                    : slot.available
                      ? "border-border/60 hover:border-primary/30 hover:bg-secondary/30"
                      : "border-border/30 bg-muted/20 opacity-40 cursor-not-allowed",
                )}
              >
                <p
                  className={cn(
                    "text-xs sm:text-sm font-semibold",
                    selectedSlot === slot.id
                      ? "text-primary"
                      : "text-foreground",
                  )}
                >
                  {slot.timeSlot}
                </p>
                {slot.available && (
                  <p className="text-[10px] text-primary/70 font-medium mt-0.5">
                    Available
                  </p>
                )}
                {!slot.available && (
                  <p className="text-[10px] text-destructive font-semibold mt-0.5">
                    {t("slotUnavailable")}
                  </p>
                )}
                {selectedSlot === slot.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2"
                  >
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check size={11} className="text-primary-foreground" />
                    </div>
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      ))}
        </>
      )}
    </motion.div>
  );
};

export default DeliverySlotSection;
