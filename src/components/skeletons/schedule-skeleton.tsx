import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function ScheduleSkeleton() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      {/* Top Header Controls Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div className="space-y-2">
          <Skeleton className="h-8 w-72 rounded-xl" />
          <Skeleton className="h-4 w-96 max-w-full rounded-lg" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-64 rounded-2xl" />
          <Skeleton className="h-10 w-28 rounded-2xl" />
        </div>
      </div>

      {/* Summary Metrics Bar Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-3xl border border-border bg-card p-4 space-y-2">
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="h-7 w-20 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Grid Layout: Calendar Skeleton (Left) & Schedule Timeline Skeleton (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Mini Calendar Skeleton */}
        <div className="lg:col-span-5 rounded-3xl border border-border bg-card p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <Skeleton className="h-6 w-36 rounded-lg" />
            <div className="flex gap-1.5">
              <Skeleton className="h-8 w-14 rounded-xl" />
              <Skeleton className="size-8 rounded-xl" />
              <Skeleton className="size-8 rounded-xl" />
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-16 w-full rounded-2xl mt-2" />
        </div>

        {/* Right: Sort & Filter Bar + Schedule Cards Skeleton */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-card border border-border">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-8 w-14 rounded-xl" />
              ))}
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-28 rounded-xl" />
              <Skeleton className="h-8 w-36 rounded-xl" />
            </div>
          </div>

          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border bg-card p-5 space-y-2"
              >
                <div className="flex items-start gap-4">
                  <Skeleton className="h-14 w-24 rounded-2xl shrink-0" />
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-20 rounded-md" />
                      <Skeleton className="h-5 w-16 rounded-md" />
                    </div>
                    <Skeleton className="h-6 w-56 rounded-md" />
                    <Skeleton className="h-4 w-40 rounded-md" />
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Skeleton className="h-10 w-32 rounded-xl" />
                  <Skeleton className="size-10 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
