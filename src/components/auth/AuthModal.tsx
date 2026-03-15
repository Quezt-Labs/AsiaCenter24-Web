"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Phone,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Sparkles,
  Shield,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { useRequestOTP, useVerifyOTP } from "@/hooks/useAuth";
import OTPInput from "./OTPInput";
import { cn } from "@/lib/utils";

type AuthStep = "phone" | "otp" | "success";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
  exit: { opacity: 0, transition: { duration: 0.2, ease: "easeIn" as const } },
};

const modalVariants = {
  hidden: { opacity: 0, y: "100%" },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 30,
      stiffness: 350,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    y: "100%",
    transition: { duration: 0.25, ease: [0.4, 0, 1, 1] as const },
  },
};

const desktopModalVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      damping: 28,
      stiffness: 400,
      mass: 0.6,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 20,
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
};

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring" as const, damping: 25, stiffness: 300 },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 80 : -80,
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  }),
};

const floatingDots = [
  { size: 80, x: "10%", y: "20%", delay: 0 },
  { size: 60, x: "80%", y: "15%", delay: 0.5 },
  { size: 40, x: "70%", y: "70%", delay: 1 },
  { size: 50, x: "15%", y: "75%", delay: 1.5 },
];

const DEVICE_ID_KEY = "deviceId";

const AuthModal = () => {
  const t = useTranslations();
  const deviceIdRef = useRef<string | null>(null);

  const getOrCreateDeviceId = () => {
    if (deviceIdRef.current) return deviceIdRef.current;
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(DEVICE_ID_KEY);
      if (stored) {
        deviceIdRef.current = stored;
        return stored;
      }
    }
    const id = crypto.randomUUID();
    deviceIdRef.current = id;
    return id;
  };
  const requestOTP = useRequestOTP();
  const verifyOTP = useVerifyOTP();

  // Use individual selectors to avoid unnecessary re-renders
  const isAuthModalOpen = useAuthStore((s) => s.isAuthModalOpen);
  const closeAuthModal = useAuthStore((s) => s.closeAuthModal);
  const intendedRoute = useAuthStore((s) => s.intendedRoute);
  const clearIntendedRoute = useAuthStore((s) => s.clearIntendedRoute);

  const [step, setStep] = useState<AuthStep>("phone");
  const [direction, setDirection] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [countryCode, setCountryCode] = useState<"IN" | "DE">("IN");
  const [countdown, setCountdown] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const isLoading = requestOTP.isPending || verifyOTP.isPending;
  const dialPrefix = countryCode === "IN" ? "+91" : "+49";

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isAuthModalOpen) {
      setStep("phone");
      setDirection(1);
      setPhone("");
      setOtp("");
      setCountryCode("IN");
      setCountdown(0);
    }
  }, [isAuthModalOpen]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isAuthModalOpen) closeAuthModal();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isAuthModalOpen, closeAuthModal]);

  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isAuthModalOpen]);

  const validatePhone = (value: string) =>
    countryCode === "IN"
      ? /^[6-9]\d{9}$/.test(value)
      : /^\d{10,15}$/.test(value); // DE: 10–15 digits

  const handleSendOTP = async () => {
    if (!validatePhone(phone)) {
      toast.error("Invalid Phone Number", {
        description:
          countryCode === "IN"
            ? "Please enter a valid 10-digit Indian mobile number"
            : "Please enter a valid German mobile number (10–15 digits)",
      });
      return;
    }
    requestOTP.mutate(
      { phone, countryCode },
      {
        onSuccess: () => {
          setDirection(1);
          setStep("otp");
          setCountdown(30);
          toast.success("OTP Sent!", {
            description: `A 6-digit OTP has been sent to ${dialPrefix} ${phone}`,
          });
        },
        onError: (err: Error) => {
          toast.error("Failed to send OTP", {
            description: err.message || "Please try again later",
          });
        },
      },
    );
  };

  const handleVerifyOTP = async (otpValue: string) => {
    if (otpValue.length !== 4) return;
    verifyOTP.mutate(
      { phone, countryCode, otp: otpValue, deviceId: getOrCreateDeviceId() },
      {
        onSuccess: () => {
          setDirection(1);
          setStep("success");
          setTimeout(() => {
            closeAuthModal();
            if (intendedRoute) {
              clearIntendedRoute();
              window.location.href = intendedRoute;
            }
          }, 2000);
        },
        onError: (err: Error) => {
          toast.error("Verification failed", {
            description: err.message || "Invalid OTP. Please try again.",
          });
        },
      },
    );
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    requestOTP.mutate(
      { phone, countryCode },
      {
        onSuccess: () => {
          setCountdown(30);
          setOtp("");
          toast.success("OTP Resent!", {
            description: `A new OTP has been sent to ${dialPrefix} ${phone}`,
          });
        },
        onError: (err: Error) => {
          toast.error("Failed to resend OTP", {
            description: err.message || "Please try again later",
          });
        },
      },
    );
  };

  if (!isAuthModalOpen) return null;

  const activeVariants = isMobile ? modalVariants : desktopModalVariants;

  return (
    <AnimatePresence mode="wait">
      {isAuthModalOpen && (
        <motion.div
          key="auth-overlay"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          onClick={closeAuthModal}
        >
          {/* Backdrop with blur */}
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-md" />

          {/* Floating decorative orbs */}
          {floatingDots.map((dot, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary/10 pointer-events-none"
              style={{
                width: dot.size,
                height: dot.size,
                left: dot.x,
                top: dot.y,
              }}
              animate={{
                y: [0, -15, 0],
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: dot.delay,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Modal */}
          <motion.div
            variants={activeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "relative w-full sm:max-w-[420px] bg-background overflow-hidden",
              "rounded-t-3xl sm:rounded-3xl",
              "shadow-2xl border border-border/30",
              "max-h-[92vh] overflow-y-auto",
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
          >
            {/* Drag handle (mobile) */}
            <div className="sm:hidden flex justify-center pt-3 pb-1">
              <div className="w-10 h-1.5 rounded-full bg-border/80" />
            </div>

            {/* Gradient top glow */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={closeAuthModal}
              className="absolute top-4 right-4 p-2 rounded-full bg-secondary/80 hover:bg-secondary transition-colors z-10"
              aria-label="Close modal"
            >
              <X size={18} className="text-muted-foreground" />
            </motion.button>

            <div className="relative p-6 sm:p-8 pt-4 sm:pt-8">
              {/* Header with animated icon */}
              <div className="text-center mb-8">
                <motion.div
                  key={step}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 15, stiffness: 200 }}
                  className={cn(
                    "w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5",
                    step === "success"
                      ? "bg-primary/15"
                      : "bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10",
                  )}
                >
                  {step === "success" ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                    >
                      <CheckCircle2 size={36} className="text-primary" />
                    </motion.div>
                  ) : step === "otp" ? (
                    <Shield size={32} className="text-primary" />
                  ) : (
                    <Phone size={30} className="text-primary" />
                  )}
                </motion.div>

                <motion.h2
                  key={`title-${step}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  id="auth-modal-title"
                  className="text-2xl font-bold text-foreground"
                >
                  {step === "phone" && t("loginSignup")}
                  {step === "otp" && t("verifyOTP")}
                  {step === "success" && t("welcomeBack")}
                </motion.h2>
                <motion.p
                  key={`desc-${step}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm text-muted-foreground mt-2"
                >
                  {step === "phone" && t("enterPhoneDesc")}
                  {step === "otp" && `${t("otpSentTo")} ${dialPrefix} ${phone}`}
                  {step === "success" && t("loginSuccessDesc")}
                </motion.p>
              </div>

              {/* Step content with sliding transitions */}
              <AnimatePresence mode="wait" custom={direction}>
                {step === "phone" && (
                  <motion.div
                    key="phone"
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="space-y-5"
                  >
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2.5">
                        {t("mobileNumber")}
                      </label>
                      <div className="flex rounded-xl overflow-hidden border-2 border-border focus-within:border-primary transition-colors">
                        <select
                          value={countryCode}
                          onChange={(e) => {
                            setCountryCode(e.target.value as "IN" | "DE");
                            setPhone("");
                          }}
                          className="px-3 py-4 bg-secondary/60 border-r border-border text-sm font-semibold text-muted-foreground focus:outline-none cursor-pointer"
                        >
                          <option value="IN">🇮🇳 +91</option>
                          <option value="DE">🇩🇪 +49</option>
                        </select>
                        <input
                          type="tel"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={countryCode === "IN" ? 10 : 15}
                          value={phone}
                          onChange={(e) =>
                            setPhone(
                              e.target.value
                                .replace(/\D/g, "")
                                .slice(0, countryCode === "IN" ? 10 : 15),
                            )
                          }
                          placeholder={
                            countryCode === "IN"
                              ? "Enter 10-digit mobile"
                              : "Enter mobile number"
                          }
                          className={cn(
                            "flex-1 px-4 py-4 bg-background text-foreground",
                            "focus:outline-none text-lg tracking-widest font-medium",
                            "placeholder:text-muted-foreground/50 placeholder:tracking-normal placeholder:font-normal placeholder:text-base",
                          )}
                          autoFocus
                        />
                      </div>
                      {/* Phone length indicator */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex gap-0.5">
                          {Array.from({
                            length: countryCode === "IN" ? 10 : 15,
                          }).map((_, i) => (
                            <motion.div
                              key={i}
                              className={cn(
                                "h-1 rounded-full transition-colors duration-200",
                                i < phone.length ? "bg-primary" : "bg-border",
                              )}
                              style={{ width: i < phone.length ? 12 : 8 }}
                              animate={{ width: i < phone.length ? 12 : 8 }}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {phone.length}/{countryCode === "IN" ? 10 : 15}
                        </span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSendOTP}
                      disabled={!validatePhone(phone) || isLoading}
                      className={cn(
                        "w-full py-4 rounded-xl font-semibold text-base",
                        "flex items-center justify-center gap-2.5",
                        "bg-primary text-primary-foreground",
                        "hover:brightness-110 transition-all duration-200",
                        "disabled:opacity-40 disabled:cursor-not-allowed",
                        "shadow-lg shadow-primary/20",
                      )}
                    >
                      {isLoading ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <>
                          {t("sendOTP")}
                          <ArrowRight size={18} />
                        </>
                      )}
                    </motion.button>

                    <p className="text-xs text-center text-muted-foreground/70 leading-relaxed">
                      {t("termsAgree")}
                    </p>
                  </motion.div>
                )}

                {step === "otp" && (
                  <motion.div
                    key="otp"
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="space-y-6"
                  >
                    <OTPInput
                      length={4}
                      value={otp}
                      onChange={setOtp}
                      onComplete={handleVerifyOTP}
                      disabled={isLoading}
                    />

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleVerifyOTP(otp)}
                      disabled={otp.length !== 4 || isLoading}
                      className={cn(
                        "w-full py-4 rounded-xl font-semibold text-base",
                        "flex items-center justify-center gap-2.5",
                        "bg-primary text-primary-foreground",
                        "hover:brightness-110 transition-all duration-200",
                        "disabled:opacity-40 disabled:cursor-not-allowed",
                        "shadow-lg shadow-primary/20",
                      )}
                    >
                      {isLoading ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        t("verifyLogin")
                      )}
                    </motion.button>

                    <div className="text-center space-y-3">
                      <button
                        onClick={handleResendOTP}
                        disabled={countdown > 0 || isLoading}
                        className={cn(
                          "text-sm font-medium transition-colors",
                          countdown > 0
                            ? "text-muted-foreground cursor-not-allowed"
                            : "text-primary hover:text-primary/80",
                        )}
                      >
                        {countdown > 0 ? (
                          <span className="flex items-center justify-center gap-1.5">
                            Resend in
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold">
                              {countdown}
                            </span>
                          </span>
                        ) : (
                          t("resendOTP")
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setDirection(-1);
                          setStep("phone");
                        }}
                        className="block w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        ← {t("changeNumber")}
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === "success" && (
                  <motion.div
                    key="success"
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="text-center py-6"
                  >
                    {/* Confetti-like particles */}
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 rounded-full bg-primary/60"
                          style={{
                            left: "50%",
                            top: "50%",
                          }}
                          animate={{
                            x: Math.cos((i * Math.PI * 2) / 8) * 45,
                            y: Math.sin((i * Math.PI * 2) / 8) * 45,
                            opacity: [0, 1, 0],
                            scale: [0, 1.5, 0],
                          }}
                          transition={{
                            duration: 1.5,
                            delay: 0.3 + i * 0.05,
                            ease: "easeOut",
                          }}
                        />
                      ))}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.15 }}
                        className="w-24 h-24 rounded-full bg-primary/15 flex items-center justify-center"
                      >
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", delay: 0.3 }}
                        >
                          <CheckCircle2 size={44} className="text-primary" />
                        </motion.div>
                      </motion.div>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                        <Sparkles size={14} className="text-primary" />
                        {t("redirecting")}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Security badge at bottom */}
            {step !== "success" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="px-6 pb-6 sm:pb-8"
              >
                <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-secondary/50">
                  <Shield size={14} className="text-primary" />
                  <span className="text-xs text-muted-foreground font-medium">
                    256-bit SSL encrypted & secure
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
