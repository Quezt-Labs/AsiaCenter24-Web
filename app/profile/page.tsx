"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { User, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import {
  useUserProfile,
  useUpdateProfile,
  useDeleteAccount,
} from "@/hooks/useUserProfile";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const t = useTranslations();
  const { isAuthenticated, openAuthModal } = useAuthStore();
  const { data: profile, isLoading, isError } = useUserProfile();
  const updateProfile = useUpdateProfile();
  const deleteAccount = useDeleteAccount();

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName ?? "");
      setLastName(profile.lastName ?? "");
    }
  }, [profile]);

  const displayName = profile
    ? [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim()
    : "";

  if (!isAuthenticated) {
    return (
      <main className="container-app py-8 sm:py-12">
        <div className="max-w-md mx-auto text-center py-16">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {t("profile")}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t("loginToViewProfile")}
          </p>
          <button
            onClick={() => openAuthModal()}
            className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors"
          >
            {t("login")}
          </button>
        </div>
      </main>
    );
  }

  const handleSave = () => {
    const fName = firstName.trim();
    const lName = lastName.trim();
    if (!fName || !lName) {
      toast.error(t("nameRequired"), {
        description: t("firstNameLastNameRequired"),
      });
      return;
    }
    updateProfile.mutate(
      { firstName: fName, lastName: lName },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  const handleDelete = () => {
    deleteAccount.mutate();
  };

  return (
    <main className="container-app py-6 sm:py-10">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">
          {t("home")}
        </Link>
        <ChevronRight size={14} />
        <span className="text-foreground font-medium">{t("profile")}</span>
      </nav>

      <div className="max-w-xl">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-6">
          {t("myAccount")}
        </h1>

        {isLoading ? (
          <div className="p-6 sm:p-8 bg-card rounded-2xl border border-border/50 animate-pulse space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-secondary" />
              <div className="space-y-2">
                <div className="h-4 bg-secondary rounded w-32" />
                <div className="h-3 bg-secondary rounded w-24" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="h-4 bg-secondary rounded w-full" />
              <div className="h-4 bg-secondary rounded w-full" />
            </div>
          </div>
        ) : isError ? (
          <div className="p-8 bg-card rounded-2xl border border-border/50 text-center">
            <p className="text-muted-foreground mb-4">
              {t("profileLoadError")}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="text-primary font-medium hover:underline"
            >
              {t("tryAgain")}
            </button>
          </div>
        ) : profile ? (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 bg-card rounded-2xl border border-border/50">
              {/* Avatar with initials */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-lg font-semibold text-primary">
                    {displayName
                      ? (
                          displayName[0] +
                          (displayName.split(" ")[1]?.[0] ?? "")
                        )
                          .toUpperCase()
                          .slice(0, 2)
                      : "?"}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground truncate">
                    {displayName || t("addYourName")}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {profile.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">
                  {t("profileInfo")}
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  >
                    <Pencil size={14} />
                    {t("edit")}
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setFirstName(profile.firstName ?? "");
                        setLastName(profile.lastName ?? "");
                      }}
                      className="px-3 py-2 text-sm text-muted-foreground hover:bg-secondary rounded-lg"
                    >
                      {t("cancel")}
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={updateProfile.isPending}
                      className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
                    >
                      {updateProfile.isPending ? t("saving") : t("save")}
                    </button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t("firstName")}{" "}
                      <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder={t("enterFirstName")}
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      {t("lastName")}{" "}
                      <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder={t("enterLastName")}
                      required
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">
                      {t("fullName")}
                    </p>
                    <p
                      className={cn(
                        "font-medium",
                        displayName
                          ? "text-foreground"
                          : "text-muted-foreground italic",
                      )}
                    >
                      {displayName || t("addYourName")}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5">
                      {t("phoneNumber")}
                    </p>
                    <p className="text-foreground font-medium">
                      {profile.phone}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <Link
                href="/my-orders"
                className="flex items-center justify-between p-4 bg-card rounded-xl border border-border/50 hover:border-primary/20 transition-colors group"
              >
                <span className="font-medium text-foreground">
                  {t("myOrders")}
                </span>
                <ChevronRight
                  size={18}
                  className="text-muted-foreground group-hover:text-primary transition-colors"
                />
              </Link>
              <Link
                href="/profile/addresses"
                className="flex items-center justify-between p-4 bg-card rounded-xl border border-border/50 hover:border-primary/20 transition-colors group"
              >
                <span className="font-medium text-foreground">
                  {t("savedAddresses")}
                </span>
                <ChevronRight
                  size={18}
                  className="text-muted-foreground group-hover:text-primary transition-colors"
                />
              </Link>
            </div>

            <div className="pt-6 border-t border-border">
              <button
                onClick={() => setShowDeleteDialog(true)}
                disabled={deleteAccount.isPending}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
                  "text-destructive hover:bg-destructive/10 disabled:opacity-50",
                )}
              >
                <Trash2 size={16} />
                {t("deleteAccount")}
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("deleteAccountConfirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteAccountConfirmDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteAccount.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteAccount.isPending ? t("processing") : t("deleteAccount")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
