 "use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Plus, Check, X, ChevronDown, Home } from "lucide-react";
import { useAddressStore } from "@/store/useAddressStore";
import { useAuthStore } from "@/store/useAuthStore";
import {
  useAddresses,
  useCreateAddress,
} from "@/hooks/useAddresses";
import { Address } from "@/types/product";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/** Normalize phone to E.164 (e.g. +919876543210) */
function toE164(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10 && !phone.startsWith("+")) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return phone.startsWith("+") ? phone : `+${digits}`;
}

interface AddressSectionProps {
  selectedAddressId: string | null;
  onSelectAddress: (address: Address) => void;
}

const AddressSection = ({
  selectedAddressId,
  onSelectAddress,
}: AddressSectionProps) => {
  const t = useTranslations();
  const { user, isAuthenticated } = useAuthStore();
  const { addresses: localAddresses, addAddress: localAddAddress } =
    useAddressStore();
  const { data: apiAddresses = [] } = useAddresses(isAuthenticated);
  const createAddressMutation = useCreateAddress();

  const addresses = isAuthenticated ? apiAddresses : localAddresses;

  const [showForm, setShowForm] = useState(false);
  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: user?.phone || "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    setForm((f) => ({ ...f, phone: user?.phone || f.phone }));
  }, [user?.phone]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSaveAddress = async () => {
    if (
      !form.name ||
      !form.phone ||
      !form.addressLine1 ||
      !form.city ||
      !form.state ||
      !form.pincode
    )
      return;

    if (isAuthenticated) {
      createAddressMutation.mutate(
        {
          fullName: form.name.trim(),
          phoneE164: toE164(form.phone),
          addressLine1: form.addressLine1.trim(),
          addressLine2: form.addressLine2?.trim() || undefined,
          city: form.city.trim(),
          state: form.state.trim(),
          postalCode: form.pincode.trim(),
          country: "IN",
          isDefault: addresses.length === 0,
        },
        {
          onSuccess: (newAddr) => {
            onSelectAddress(newAddr);
            setShowForm(false);
            setForm({
              name: "",
              phone: user?.phone || "",
              addressLine1: "",
              addressLine2: "",
              city: "",
              state: "",
              pincode: "",
            });
            toast.success(t("addressSaved") ?? "Address saved");
          },
          onError: () => {
            toast.error(t("addressSaveError") ?? "Failed to save address");
          },
        },
      );
    } else {
      const newAddr = localAddAddress({
        name: form.name.trim(),
        phone: form.phone.trim(),
        addressLine1: form.addressLine1.trim(),
        addressLine2: form.addressLine2?.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
        isDefault: addresses.length === 0,
      });
      onSelectAddress(newAddr);
      setShowForm(false);
      setForm({
        name: "",
        phone: user?.phone || "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        pincode: "",
      });
    }
  };

  const displayedAddresses = showAllAddresses
    ? addresses
    : addresses.slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", damping: 24 }}
      className="bg-card rounded-2xl border border-border/50 p-4 sm:p-6"
    >
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4 sm:mb-5">
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <MapPin size={20} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-base sm:text-lg text-foreground">
            {t("deliveryAddress")}
          </h2>
          <p className="text-xs text-muted-foreground">
            {t("selectOrAddAddress")}
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-secondary rounded-full">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-semibold text-muted-foreground">
            Step 1
          </span>
        </div>
      </div>

      {/* Saved Addresses */}
      {addresses.length > 0 && (
        <div className="space-y-2.5 mb-3">
          {displayedAddresses.map((addr, i) => (
            <motion.button
              key={addr.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onSelectAddress(addr)}
              className={cn(
                "w-full p-3.5 sm:p-4 rounded-xl border-2 text-left transition-all active:scale-[0.99]",
                selectedAddressId === addr.id
                  ? "border-primary bg-primary/[0.04] shadow-sm shadow-primary/10"
                  : "border-border/60 hover:border-primary/30 hover:bg-secondary/30",
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors",
                    selectedAddressId === addr.id
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30",
                  )}
                >
                  {selectedAddressId === addr.id && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <Check size={11} className="text-primary-foreground" />
                    </motion.div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-foreground">
                      {addr.name}
                    </span>
                    {addr.isDefault && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">
                        <Check size={9} /> Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {addr.phone}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                    {addr.addressLine1}
                    {addr.addressLine2 && `, ${addr.addressLine2}`}, {addr.city}
                    , {addr.state} - {addr.pincode}
                  </p>
                </div>
              </div>
            </motion.button>
          ))}

          {addresses.length > 2 && (
            <button
              onClick={() => setShowAllAddresses(!showAllAddresses)}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              {showAllAddresses
                ? "Show less"
                : `+${addresses.length - 2} more addresses`}
              <ChevronDown
                size={14}
                className={cn(
                  "transition-transform",
                  showAllAddresses && "rotate-180",
                )}
              />
            </button>
          )}
        </div>
      )}

      {/* Add New Address */}
      {!showForm ? (
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(true)}
          className="w-full p-3.5 sm:p-4 rounded-xl border-2 border-dashed border-primary/30 hover:border-primary/50 hover:bg-primary/[0.03] transition-all flex items-center justify-center gap-2 text-sm font-semibold text-primary"
        >
          <Plus size={18} />
          {t("addNewAddress")}
        </motion.button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 sm:p-5 rounded-xl border-2 border-primary/20 bg-primary/[0.02] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Home size={16} className="text-primary" />
                  {t("addNewAddress")}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-1.5 rounded-full hover:bg-secondary transition-colors"
                >
                  <X size={16} className="text-muted-foreground" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    name: "name",
                    label: t("fullName"),
                    placeholder: t("enterName"),
                    required: true,
                    span: false,
                  },
                  {
                    name: "phone",
                    label: t("phoneNumber"),
                    placeholder: "+91 98765 43210",
                    required: true,
                    span: false,
                  },
                  {
                    name: "addressLine1",
                    label: t("addressLine1Label"),
                    placeholder: t("addressLine1Placeholder"),
                    required: true,
                    span: true,
                  },
                  {
                    name: "addressLine2",
                    label: t("addressLine2Label"),
                    placeholder: t("addressLine2Placeholder"),
                    required: false,
                    span: true,
                  },
                  {
                    name: "city",
                    label: t("cityLabel"),
                    placeholder: t("enterCity"),
                    required: true,
                    span: false,
                  },
                  {
                    name: "state",
                    label: t("stateLabel"),
                    placeholder: t("enterState"),
                    required: true,
                    span: false,
                  },
                  {
                    name: "pincode",
                    label: t("pincodeLabel"),
                    placeholder: t("enterPincode"),
                    required: true,
                    span: false,
                  },
                ].map((field) => (
                  <div
                    key={field.name}
                    className={field.span ? "sm:col-span-2" : ""}
                  >
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      {field.label}{" "}
                      {field.required && (
                        <span className="text-destructive">*</span>
                      )}
                    </label>
                    <input
                      type="text"
                      name={field.name}
                      value={(form as any)[field.name]}
                      onChange={handleInputChange}
                      placeholder={field.placeholder}
                      className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                    />
                  </div>
                ))}
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSaveAddress}
                disabled={createAddressMutation.isPending && isAuthenticated}
                className="w-full sm:w-auto px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-primary/15 disabled:opacity-50"
              >
                <Check size={16} />
                {createAddressMutation.isPending && isAuthenticated
                  ? t("saving")
                  : t("saveAndDeliver")}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default AddressSection;
