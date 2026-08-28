import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function AuthSkeleton() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-4 bg-background animate-in fade-in duration-300">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Logo & Title */}
        <div className="text-center space-y-3 flex flex-col items-center">
          <Skeleton className="size-12 rounded-2xl" />
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>

        {/* Auth Form Card */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-5 shadow-xl">
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-11 w-full rounded-2xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-11 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-11 w-full rounded-2xl mt-4" />
        </div>

        {/* Footer Link */}
        <div className="flex justify-center">
          <Skeleton className="h-4 w-44" />
        </div>
      </div>
    </div>
  );
}
