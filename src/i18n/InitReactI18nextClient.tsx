"use client";

import { useEffect } from "react";
import { initReactI18nextClient } from "@/i18n";

// Ensure react-i18next plugin is attached during the first client render.
// Calling the async helper inside useEffect avoids running client-only APIs at module scope
// while still initializing early in the app lifecycle (RootLayout mounts this component).
export default function InitReactI18nextClient() {
  useEffect(() => {
    // fire-and-forget - the helper is idempotent and will attach only once
    initReactI18nextClient().catch(() => {
      /* swallow init errors to avoid crashing the app during client init */
    });
  }, []);

  return null;
}
