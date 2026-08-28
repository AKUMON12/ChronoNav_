import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function MapSkeleton() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground animate-in fade-in duration-300">
      {/* Top Header Bar Skeleton */}
      <div className="flex h-16 items-center justify-between border-b border-border bg-card/90 px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Skeleton className="size-9 rounded-xl" />
          <Skeleton className="h-8 w-24 rounded-xl" />
        </div>
      </div>

      {/* Main Map Viewport Grid Skeleton */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Route Controls Skeleton */}
        <div className="space-y-6 lg:col-span-4 flex flex-col">
          {/* Origin / Destination Card */}
          <div className="rounded-3xl border border-border bg-card p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-6 w-16 rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-10 w-full rounded-2xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-10 w-full rounded-2xl" />
            </div>
          </div>

          {/* Turn-by-Turn Guide Card */}
          <div className="rounded-3xl border border-border bg-card p-5 flex-1 flex flex-col space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-6 w-20 rounded-md" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Skeleton className="h-16 rounded-2xl" />
              <Skeleton className="h-16 rounded-2xl" />
            </div>
            <div className="space-y-2.5 flex-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 rounded-2xl border border-border bg-muted/20 flex items-center gap-3">
                  <Skeleton className="size-6 rounded-full shrink-0" />
                  <Skeleton className="h-4 flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Map Canvas Skeleton */}
        <div className="space-y-4 lg:col-span-8 flex flex-col">
          {/* Controls Bar */}
          <div className="flex items-center justify-between p-3 rounded-2xl border border-border bg-card">
            <Skeleton className="h-6 w-48 rounded-xl" />
            <div className="flex items-center gap-2">
              <Skeleton className="size-8 rounded-xl" />
              <Skeleton className="size-8 rounded-xl" />
              <Skeleton className="h-8 w-20 rounded-xl" />
            </div>
          </div>

          {/* Canvas Box */}
          <div className="relative flex-1 min-h-[450px] sm:min-h-[550px] lg:min-h-[620px] rounded-3xl border border-border bg-slate-100 dark:bg-[#090E14] overflow-hidden flex items-center justify-center">
            <Skeleton className="h-3/4 w-3/4 rounded-2xl opacity-40" />

            {/* Vertical Floor Selector Skeleton */}
            <div className="absolute top-4 right-4 bg-card/90 border border-border p-2 rounded-2xl space-y-1 w-20">
              <Skeleton className="h-3 w-12 mx-auto mb-2" />
              {[7, 6, 5, 4, 3, 2, "M", 1].map((f) => (
                <Skeleton key={String(f)} className="h-8 w-full rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
