import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({ rows = 6, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      {/* Top Title & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-40 rounded-xl" />
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <Skeleton className="h-11 w-full sm:w-80 rounded-2xl" />
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Skeleton className="h-11 w-32 rounded-2xl" />
          <Skeleton className="h-11 w-28 rounded-2xl" />
        </div>
      </div>

      {/* Table Card */}
      <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
        {/* Table Header */}
        <div className="p-4 bg-muted/40 border-b border-border flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-border">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <Skeleton className="size-10 rounded-xl shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <Skeleton className="h-6 w-20 rounded-md" />
              <Skeleton className="h-4 w-28 hidden md:block" />
              <Skeleton className="h-8 w-20 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
