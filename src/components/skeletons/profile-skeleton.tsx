import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full animate-in fade-in duration-300">
      {/* Top Banner Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      {/* Avatar & Hero Identity Card */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
        <Skeleton className="size-24 rounded-3xl shrink-0" />
        <div className="space-y-3 flex-1 text-center sm:text-left">
          <Skeleton className="h-7 w-64 mx-auto sm:mx-0" />
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <Skeleton className="h-6 w-24 rounded-lg" />
            <Skeleton className="h-6 w-32 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Form Fields Card */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
        <Skeleton className="h-6 w-44" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-11 w-full rounded-2xl" />
            </div>
          ))}
        </div>
        <div className="pt-4 border-t border-border flex justify-end">
          <Skeleton className="h-11 w-36 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
