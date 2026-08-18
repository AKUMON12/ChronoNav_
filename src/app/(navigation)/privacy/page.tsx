"use client";

import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { BackButton } from "@/components/shared/back-button";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground transition-colors duration-200">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card/90 backdrop-blur px-4 sm:px-10 py-3">
        <div className="flex items-center gap-3">
          <BackButton fallbackUrl="/" showLabel={false} />

          <Link href="/" className="flex items-center gap-2 text-foreground hover:opacity-90 transition-opacity">
            <div className="flex items-center justify-center size-8 rounded-xl bg-primary text-white font-bold">
              <Shield className="size-4.5" />
            </div>
            <h2 className="text-base font-black leading-tight tracking-tight">CHRONONAV</h2>
          </Link>
        </div>

        <nav aria-label="Main Navigation" className="flex items-center gap-3 sm:gap-4">
          <ThemeToggle />
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl h-9 px-4 bg-primary text-white text-xs font-black transition-colors hover:bg-primary/90 shadow-sm shadow-primary/20"
          >
            Sign In
          </Link>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex justify-center px-4 sm:px-8 md:px-16 lg:px-40 py-8">
        <article className="flex flex-col w-full max-w-[960px] space-y-6">
          <div className="border-b border-border pb-4">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Privacy Policy & Security Standards
            </h1>
            <p className="text-muted-foreground text-xs pt-1">
              University of Cebu • College of Computer Studies | Effective: Academic Year 2026
            </p>
          </div>

          <section className="space-y-2 rounded-2xl bg-card border border-border p-5 shadow-sm">
            <h2 className="text-base font-bold text-foreground">1. Institutional Scope</h2>
            <p className="text-muted-foreground text-xs leading-relaxed">
              ChronoNav serves students, faculty members, and guests of the University of Cebu (Main Campus). This document details our commitments regarding data collection, encrypted credential validation, and real-time indoor pathfinding telemetry.
            </p>
          </section>

          <section className="space-y-2 rounded-2xl bg-card border border-border p-5 shadow-sm">
            <h2 className="text-base font-bold text-foreground">2. Information We Process</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground text-xs leading-relaxed">
              <li><strong>Student & Staff Credentials:</strong> UC Student ID numbers and encrypted password hashes managed via Supabase SSR authentication.</li>
              <li><strong>Academic Study Load:</strong> Course schedules, classroom identifiers, and weekly schedule matrices imported manually or via OCR document parser.</li>
              <li><strong>Campus Navigation Coordinates:</strong> Dijkstra graph nodes and waypoint pathing calculations computed purely on-demand.</li>
            </ul>
          </section>

          <section className="space-y-2 rounded-2xl bg-card border border-border p-5 shadow-sm">
            <h2 className="text-base font-bold text-foreground">3. Data Protection & Row-Level Security</h2>
            <p className="text-muted-foreground text-xs leading-relaxed">
              All personal records and class schedules are protected using PostgreSQL Row-Level Security (RLS) policies. Only authenticated account holders can access or mutate their own schedule details.
            </p>
          </section>

          <section className="space-y-2 rounded-2xl bg-card border border-border p-5 shadow-sm">
            <h2 className="text-base font-bold text-foreground">4. Contact Administration</h2>
            <p className="text-muted-foreground text-xs leading-relaxed">
              For questions regarding account administration or institutional registry permissions, contact the College of Computer Studies Dean&apos;s Office or email: <span className="font-semibold text-primary">ccs@uc.edu.ph</span>.
            </p>
          </section>
        </article>
      </main>
    </div>
  );
}
