"use client";

import dynamic from "next/dynamic";
import { useAuthStore } from "@/store/useAuthStore";

const AuthModal = dynamic(
  () => import("@/components/auth/AuthModal"),
  { ssr: false, loading: () => null }
);

export default function AuthModalClient() {
  const isAuthModalOpen = useAuthStore((s) => s.isAuthModalOpen);
  
  // Only mount AuthModal when it's needed
  if (!isAuthModalOpen) return null;
  
  return <AuthModal />;
}
