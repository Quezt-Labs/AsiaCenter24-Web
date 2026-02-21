import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
}

const OTPInput = ({
  length = 4,
  value,
  onChange,
  onComplete,
  disabled = false,
}: OTPInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const onCompleteRef = useRef(onComplete);

  // Keep ref updated without triggering effect
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    if (value.length === length && onCompleteRef.current) {
      onCompleteRef.current(value);
    }
  }, [value, length]);

  const handleChange = (index: number, inputValue: string) => {
    const digit = inputValue.replace(/\D/g, "").slice(-1);
    const newValue = value.split("");
    newValue[index] = digit;
    const joined = newValue.join("").slice(0, length);
    onChange(joined);
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    onChange(pasted);
    const focusIndex = Math.min(pasted.length, length - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex items-center justify-center gap-2.5 sm:gap-3">
      {Array.from({ length }).map((_, index) => {
        const isFilled = !!value[index];
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, type: "spring", damping: 20 }}
            className="relative"
          >
            <input
              ref={(el) => {
                if (el) {
                  inputRefs.current[index] = el;
                }
              }}
              type="text"
              maxLength={1}
              value={value[index] || ""}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={disabled}
              className={cn(
                "w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-bold",
                "rounded-xl border-2 bg-background text-foreground",
                "focus:outline-none transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                isFilled
                  ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
                  : "border-border hover:border-border/80",
                "focus:border-primary focus:ring-4 focus:ring-primary/10",
              )}
              aria-label={`OTP digit ${index + 1}`}
            />
            {/* Dot indicator below */}
            <motion.div
              className={cn(
                "absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-colors",
                isFilled ? "bg-primary" : "bg-border",
              )}
              animate={{ scale: isFilled ? [1, 1.4, 1] : 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default OTPInput;
