import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * LandingSkeleton - Skeletal placeholder UI for the public landing page.
 * Synchronized with the 2-column Hero section layout (left content, right 3D isometric visualizer).
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

      {/* 2-Column Hero Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center pt-8 sm:pt-12">
        {/* Left Column Placeholders */}
        <div className="lg:col-span-7 space-y-6">
          <Skeleton className="h-7 w-64 rounded-full" />
          <Skeleton className="h-12 sm:h-14 w-full max-w-xl rounded-2xl" />
          <Skeleton className="h-5 w-4/5 rounded-xl" />
          <Skeleton className="h-5 w-3/5 rounded-xl" />

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Skeleton className="h-12 w-44 rounded-2xl" />
            <Skeleton className="h-12 w-36 rounded-2xl" />
            <Skeleton className="size-12 rounded-2xl" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-xl">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-3.5 space-y-2 flex flex-col items-center">
                <Skeleton className="size-5 rounded-lg mb-1" />
                <Skeleton className="h-4 w-16 rounded-md" />
                <Skeleton className="h-3 w-12 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column 3D Visualizer Placeholder Card */}
        <div className="lg:col-span-5 w-full">
          <div className="rounded-3xl border border-border bg-card/80 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <Skeleton className="size-9 rounded-xl" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-28 rounded-md" />
                  <Skeleton className="h-4 w-36 rounded-md" />
                </div>
              </div>
              <Skeleton className="h-6 w-16 rounded-xl" />
            </div>

            {/* 3D Stack isometric mockup */}
            <div className="h-[240px] flex items-center justify-center">
              <Skeleton className="w-4/5 h-[160px] rounded-2xl" />
            </div>

            <div className="p-3 rounded-2xl border border-border bg-background space-y-2">
              <Skeleton className="h-4 w-40 rounded-md" />
              <Skeleton className="h-3 w-56 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid Skeleton */}
      <div className="pt-10 space-y-6">
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
