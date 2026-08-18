"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  fallbackUrl?: string;
  label?: string;
  showLabel?: boolean;
  className?: string;
}

/**
 * Consistent Top-Left Back Navigation Button
 * Supports browser history back navigation with safe fallback route.
 */
export function BackButton({
  fallbackUrl = "/dashboard",
  label = "Back",
  showLabel = false,
  className = "",
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackUrl);
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`group flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-2.5 py-1.5 text-xs font-black text-foreground shadow-sm hover:bg-accent hover:text-primary hover:border-primary/40 transition-all duration-200 ${className}`}
      aria-label="Go back to previous page"
      title="Go Back"
    >
      <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5 text-primary" />
      {showLabel && <span className="text-xs font-black">{label}</span>}
    </button>
  );
}
