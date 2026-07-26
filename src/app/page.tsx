"use client";

import Link from "next/link";
import { Compass, Shield, LayoutDashboard } from "lucide-react";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 text-center bg-background text-foreground">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
        <Compass className="size-10" />
      </div>
      <h1 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight max-w-2xl">
        ChronoNav Campus Navigation &amp; Schedule System
      </h1>
      <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl">
        University of Cebu Main Campus indoor navigation, automated schedule management, and OCR room routing.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 shadow-md"
        >
          <LayoutDashboard className="size-4" />
          <span>Go to Admin Dashboard</span>
        </Link>

        <Link
          href="/privacy"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-3 text-sm font-bold text-foreground transition-colors hover:bg-accent"
        >
          <Shield className="size-4" />
          <span>View Privacy Policy</span>
        </Link>
      </div>
    </main>
  );
}
