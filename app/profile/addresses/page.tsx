"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ChevronRight, MapPin, Plus, Pencil, Trash2, Check } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useAddressStore } from "@/store/useAddressStore";
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from "@/hooks/useAddresses";
import { Address } from "@/types/product";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function toE164(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10 && !phone.startsWith("+")) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return phone.startsWith("+") ? phone : `+${digits}`;
}

export default function AddressesPage() {
  const t = useTranslations();
  const { user, isAuthenticated } = useAuthStore();
  const { addresses: localAddresses, addAddress, updateAddress, deleteAddress: localDelete, setDefaultAddress: localSetDefault } = useAddressStore();
  const { data: apiAddresses = [], isLoading } = useAddresses(isAuthenticated);
  const createMutation = useCreateAddress();
  const updateMutation = useUpdateAddress();
  const deleteMutation = useDeleteAddress();
  const setDefaultMutation = useSetDefaultAddress();

  const addresses = isAuthenticated ? apiAddresses : localAddresses;

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    setForm((f) => ({ ...f, phone: user?.phone || f.phone }));
  }, [user?.phone]);

  const resetForm = () => {
    setForm({
      name: "",
      phone: user?.phone || "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (addr: Address) => {
    setEditingId(addr.id);
    setForm({
      name: addr.name,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || "",
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name || !form.phone || !form.addressLine1 || !form.city || !form.state || !form.pincode) return;

    if (isAuthenticated) {
      if (editingId) {
        updateMutation.mutate(
          {
            id: editingId,
            input: {
              fullName: form.name.trim(),
              phoneE164: toE164(form.phone),
              addressLine1: form.addressLine1.trim(),
              addressLine2: form.addressLine2?.trim() || undefined,
              city: form.city.trim(),
              state: form.state.trim(),
              postalCode: form.pincode.trim(),
              country: "IN",
            },
          },
          {
            onSuccess: () => {
              toast.success(t("addressSaved") ?? "Address updated");
              resetForm();
            },
            onError: () => toast.error(t("addressSaveError") ?? "Failed to update"),
          },
        );
      } else {
        createMutation.mutate(
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
            onSuccess: () => {
              toast.success(t("addressSaved") ?? "Address saved");
              resetForm();
            },
            onError: () => toast.error(t("addressSaveError") ?? "Failed to save"),
          },
        );
      }
    } else {
      if (editingId) {
        updateAddress(editingId, {
          name: form.name.trim(),
          phone: form.phone.trim(),
          addressLine1: form.addressLine1.trim(),
          addressLine2: form.addressLine2?.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
        });
        resetForm();
      } else {
        addAddress({
          name: form.name.trim(),
          phone: form.phone.trim(),
          addressLine1: form.addressLine1.trim(),
          addressLine2: form.addressLine2?.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
          isDefault: addresses.length === 0,
        });
        resetForm();
      }
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm(t("deleteAddressConfirm") ?? "Delete this address?")) return;
    if (isAuthenticated) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success(t("addressDeleted") ?? "Address deleted"),
        onError: () => toast.error(t("addressDeleteError") ?? "Failed to delete"),
      });
    } else {
      localDelete(id);
    }
  };

  const handleSetDefault = (id: string) => {
    if (isAuthenticated) {
      setDefaultMutation.mutate(id, {
        onSuccess: () => toast.success(t("defaultAddressSet") ?? "Default address updated"),
      });
    } else {
      localSetDefault(id);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <main className="container-app py-6 sm:py-10">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">{t("home")}</Link>
        <ChevronRight size={14} />
        <Link href="/profile" className="hover:text-primary transition-colors">{t("profile")}</Link>
        <ChevronRight size={14} />
        <span className="text-foreground font-medium">{t("savedAddresses")}</span>
      </nav>

      <div className="max-w-2xl">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">
          {t("savedAddresses")}
        </h1>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 rounded-xl border border-border/50 animate-pulse">
                <div className="h-4 bg-secondary rounded w-1/3 mb-2" />
                <div className="h-3 bg-secondary rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={cn(
                  "p-4 sm:p-5 rounded-xl border-2 transition-all",
                  addr.isDefault ? "border-primary bg-primary/[0.04]" : "border-border/50",
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-foreground">{addr.name}</span>
                      {addr.isDefault && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">
                          <Check size={9} /> Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{addr.phone}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {addr.addressLine1}
                      {addr.addressLine2 && `, ${addr.addressLine2}`}, {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!addr.isDefault && (
                      <button
                        onClick={() => handleSetDefault(addr.id)}
                        className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"
                        title={t("setAsDefault") ?? "Set as default"}
                      >
                        <MapPin size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(addr)}
                      className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {!showForm ? (
              <button
                onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: "", phone: user?.phone || "", addressLine1: "", addressLine2: "", city: "", state: "", pincode: "" }); }}
                className="w-full p-4 rounded-xl border-2 border-dashed border-primary/30 hover:border-primary/50 hover:bg-primary/[0.03] flex items-center justify-center gap-2 text-primary font-semibold"
              >
                <Plus size={20} />
                {t("addNewAddress")}
              </button>
            ) : (
              <div className="p-5 rounded-xl border-2 border-primary/20 bg-primary/[0.02] space-y-4">
                <h3 className="font-semibold text-foreground">
                  {editingId ? t("edit") : t("addNewAddress")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: "name", label: t("fullName"), placeholder: t("enterName"), required: true, span: false },
                    { name: "phone", label: t("phoneNumber"), placeholder: "+91 98765 43210", required: true, span: false },
                    { name: "addressLine1", label: t("addressLine1Label"), placeholder: t("addressLine1Placeholder"), required: true, span: true },
                    { name: "addressLine2", label: t("addressLine2Label"), placeholder: t("addressLine2Placeholder"), required: false, span: true },
                    { name: "city", label: t("cityLabel"), placeholder: t("enterCity"), required: true, span: false },
                    { name: "state", label: t("stateLabel"), placeholder: t("enterState"), required: true, span: false },
                    { name: "pincode", label: t("pincodeLabel"), placeholder: t("enterPincode"), required: true, span: false },
                  ].map((f) => (
                    <div key={f.name} className={f.span ? "sm:col-span-2" : ""}>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">{f.label} {f.required && <span className="text-destructive">*</span>}</label>
                      <input
                        type="text"
                        name={f.name}
                        value={(form as Record<string, string>)[f.name]}
                        onChange={handleInputChange}
                        placeholder={f.placeholder}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={resetForm} className="px-4 py-2.5 rounded-xl border border-border hover:bg-secondary">
                    {t("cancel")}
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isPending}
                    className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isPending ? t("saving") : t("save")}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
