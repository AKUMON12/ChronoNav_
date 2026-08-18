import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Base polymorphic animated shimmer Skeleton component
 */
export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-muted/60 dark:bg-muted/40 animate-shimmer ${className}`}
      {...props}
    />
  );
}
