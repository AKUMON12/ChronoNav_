import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function MapSkeleton() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
        </div>
        <Skeleton className="h-8 w-32 rounded-xl" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left selector panel */}
        <div className="space-y-4 lg:col-span-4">
          <div className="rounded-3xl border border-border bg-card p-5 space-y-4">
            <Skeleton className="h-4 w-36" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 space-y-3">
            <Skeleton className="h-4 w-40" />
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-2xl" />
            ))}
          </div>
        </div>

        {/* Right Map Canvas */}
        <div className="space-y-4 lg:col-span-8">
          <div className="rounded-2xl border border-border bg-card p-3 flex justify-between">
            <Skeleton className="h-6 w-48 rounded-xl" />
            <div className="flex gap-2">
              <Skeleton className="size-8 rounded-xl" />
              <Skeleton className="size-8 rounded-xl" />
              <Skeleton className="h-8 w-24 rounded-xl" />
            </div>
          </div>
          <Skeleton className="w-full h-[520px] rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
