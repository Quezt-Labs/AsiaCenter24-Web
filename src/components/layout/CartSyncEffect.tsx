"use client";

import { useCartSync } from "@/hooks/useCartSync";

export default function CartSyncEffect() {
  useCartSync();
  return null;
}
