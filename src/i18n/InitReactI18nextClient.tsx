"use client";

import i18n from "@/i18n";
import { initReactI18next } from "react-i18next";

// Run plugin attachment at module initialization on the client so it executes
// as early as possible (before many client components render). This avoids
// showing i18n keys like "addToCart" while the plugin is still being attached.
try {
  if (typeof window !== "undefined" && !(i18n as any)._reactInitialized) {
    i18n.use(initReactI18next);
    // mark to avoid re-initializing
    (i18n as any)._reactInitialized = true;
  }
} catch (e) {
  // ignore in dev if something goes wrong
}

export default function InitReactI18nextClient() {
  return null;
}
