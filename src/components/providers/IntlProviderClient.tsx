"use client";

import React, { useEffect, useState } from "react";
import { NextIntlClientProvider } from "next-intl";
import en from "../../../messages/en.json";
import hi from "../../../messages/hi.json";
import de from "../../../messages/de.json";

const MESSAGES: Record<string, Record<string, string>> = {
  en,
  hi,
  de,
};

export default function IntlProviderClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, setLocale] = useState<string>(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("locale");
        if (stored) return stored;
        const nav = navigator.language ?? navigator.languages?.[0];
        if (nav?.startsWith("hi")) return "hi";
        if (nav?.startsWith("de")) return "de";
      }
    } catch {
      /* ignore */
    }
    return "en";
  });

  useEffect(() => {
    try {
      localStorage.setItem("locale", locale);
    } catch {
      /* ignore */
    }
    // expose setter for LanguageSwitcher fallback (optional)
    (window as any).__setLocale = setLocale;
  }, [locale]);

  const messages = MESSAGES[locale] || MESSAGES.en;

  const timeZone =
    typeof Intl !== "undefined" && typeof Intl.DateTimeFormat === "function"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
      : "UTC";

  return (
    <NextIntlClientProvider messages={messages} locale={locale} timeZone={timeZone}>
      {children}
    </NextIntlClientProvider>
  );
}
