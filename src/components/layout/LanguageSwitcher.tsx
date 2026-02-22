import { Globe } from "lucide-react";
import React, { useEffect, useState } from "react";

interface LanguageSwitcherProps {
  compact?: boolean;
}

const LanguageSwitcher = ({ compact = false }: LanguageSwitcherProps) => {
  const languages = [
    { code: "en", label: "English", shortLabel: "EN" },
    { code: "hi", label: "हिंदी", shortLabel: "हि" },
    { code: "de", label: "Deutsch", shortLabel: "DE" },
  ];

  const [locale, setLocale] = useState<string>(() => {
    try {
      if (typeof window !== "undefined") {
        return (
          localStorage.getItem("locale") ||
          (navigator.language?.startsWith("hi")
            ? "hi"
            : navigator.language?.startsWith("de")
              ? "de"
              : "en")
        );
      }
    } catch {
      /* ignore */
    }
    return "en";
  });

  useEffect(() => {
    (window as any).__setLocale = (l: string) => {
      setLocale(l);
    };
  }, []);

  const currentLang =
    languages.find((lang) => lang.code === locale) || languages[0];

  const changeLanguage = (next: string) => {
    try {
      localStorage.setItem("locale", next);
    } catch {
      /* ignore */
    }
    if ((window as any).__setLocale) {
      (window as any).__setLocale(next);
    } else {
      // fallback: reload
      location.reload();
    }
  };

  if (compact) {
    return (
      <button
        onClick={() => {
          const idx = languages.findIndex((l) => l.code === locale);
          const next = languages[(idx + 1) % languages.length].code;
          changeLanguage(next);
        }}
        className="flex items-center gap-1 p-2 text-foreground hover:text-primary transition-colors"
        aria-label="Switch language"
      >
        <Globe size={18} />
        <span className="text-xs font-medium">{currentLang.shortLabel}</span>
      </button>
    );
  }

  return (
    <div
      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Switch language"
    >
      <Globe size={16} />
      <select
        value={locale}
        onChange={(e) => changeLanguage(e.target.value)}
        className="bg-transparent border-none text-sm"
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
