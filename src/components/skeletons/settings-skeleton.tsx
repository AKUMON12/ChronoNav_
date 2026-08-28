import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function SettingsSkeleton() {
  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="border-b border-border pb-6 space-y-2">
        <Skeleton className="h-8 w-60" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Account Info Form Card */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-11 w-full rounded-2xl" />
            </div>
          ))}
        </div>
      </div>

      {/* Security & Password Card */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
        <Skeleton className="h-6 w-52" />
        <div className="space-y-4 max-w-lg">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-11 w-full rounded-2xl" />
            </div>
          ))}
          <Skeleton className="h-11 w-44 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
