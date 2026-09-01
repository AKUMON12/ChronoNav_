import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * LandingSkeleton - Skeletal placeholder UI for the public landing page.
 * Displays loading placeholders matching header, hero banner, metrics, and feature cards.
 */
export function LandingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-background p-4 sm:p-8 space-y-12 animate-in fade-in duration-300 max-w-7xl mx-auto w-full">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between py-2 border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-xl" />
          <Skeleton className="h-6 w-32 rounded-lg" />
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-xl" />
          <Skeleton className="h-9 w-24 rounded-xl" />
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <div className="flex flex-col items-center text-center space-y-6 pt-10 sm:pt-16 max-w-3xl mx-auto w-full">
        <Skeleton className="h-7 w-64 rounded-full" />
        <Skeleton className="h-12 sm:h-16 w-full max-w-2xl rounded-2xl" />
        <Skeleton className="h-5 w-4/5 rounded-xl" />
        <Skeleton className="h-5 w-3/5 rounded-xl" />

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Skeleton className="h-12 w-44 rounded-2xl" />
          <Skeleton className="h-12 w-44 rounded-2xl" />
        </div>
      </div>

      {/* Metrics Strip Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-4xl mx-auto w-full">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-4 space-y-2 flex flex-col items-center">
            <Skeleton className="size-6 rounded-lg mb-1" />
            <Skeleton className="h-5 w-20 rounded-md" />
            <Skeleton className="h-3 w-16 rounded-md" />
          </div>
        ))}
      </div>

      {/* Features Grid Skeleton */}
      <div className="pt-8 space-y-6">
        <div className="text-center space-y-2 max-w-md mx-auto">
          <Skeleton className="h-7 w-56 mx-auto rounded-xl" />
          <Skeleton className="h-4 w-72 mx-auto rounded-lg" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-3xl border border-border bg-card p-6 space-y-4">
              <Skeleton className="size-12 rounded-2xl" />
              <Skeleton className="h-5 w-36 rounded-lg" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-4/5 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
