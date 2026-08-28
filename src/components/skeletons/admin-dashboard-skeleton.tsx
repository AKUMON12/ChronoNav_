import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-72" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>

      {/* Top 4 Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-3xl border border-border bg-card p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <Skeleton className="size-10 rounded-2xl" />
              <Skeleton className="h-5 w-16 rounded-md" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Graph & Heatmap Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Analytics Chart */}
        <div className="rounded-3xl border border-border bg-card p-6 lg:col-span-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-3 w-64" />
            </div>
            <Skeleton className="h-8 w-32 rounded-xl" />
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>

        {/* Real-time Status Card */}
        <div className="rounded-3xl border border-border bg-card p-6 lg:col-span-4 space-y-4 shadow-sm">
          <Skeleton className="h-5 w-40" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3.5 rounded-2xl border border-border bg-muted/20 flex items-center justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-6 w-14 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
