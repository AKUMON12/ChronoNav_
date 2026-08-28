import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function ScheduleSkeleton() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      {/* Top Header Controls Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-36 rounded-xl" />
          <Skeleton className="h-10 w-44 rounded-xl" />
        </div>
      </div>

      {/* Weekday Switcher Tabs Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-3 w-28" />
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-12 rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Schedule Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-3xl border border-border bg-card p-5 space-y-4 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <Skeleton className="h-5 w-24 rounded-lg" />
                <Skeleton className="h-5 w-20 rounded-md" />
              </div>
              <Skeleton className="h-6 w-4/5" />
              <Skeleton className="h-4 w-32" />
            </div>

            <div className="space-y-2 pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <Skeleton className="size-4 rounded-full" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="size-4 rounded-full" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-9 w-full rounded-xl mt-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
