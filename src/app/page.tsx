"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Map,
  CalendarDays,
  ScanLine,
  Bell,
  Shield,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  Layers,
  GraduationCap,
  Building2,
  CheckCircle2,
  Smartphone,
  Flame,
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Logo } from "@/components/shared/logo";

const CAMPUS_DEPARTMENTS = [
  "College of Computer Studies",
  "Allied Engineering",
  "Teacher Education (CTE)",
  "Commerce & Accountancy",
  "College of Criminology",
  "Hotel & Restaurant Management",
  "Arts & Sciences",
  "Junior & Senior High School",
  "Main Campus Library",
  "University Clinic",
];

/**
 * ChronoNav Public Landing Page
 * Features subtle GPU-accelerated entrance animations, infinite department marquee,
 * interactive feature cards, and instant route to Explore/Register.
 */
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200 overflow-x-hidden selection:bg-primary selection:text-white">
      {/* ── Sticky Navigation Bar ── */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md transition-colors duration-200">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Logo size="sm" showText={true} subtitle="" priority={true} />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold" aria-label="Main Navigation">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#departments" className="text-muted-foreground hover:text-foreground transition-colors">
              Departments
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
          </nav>

          {/* Desktop CTA + Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="rounded-xl border border-border bg-card px-4 py-2 text-xs font-black text-foreground hover:bg-accent hover:text-primary transition-all duration-200 shadow-sm"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-primary px-4 py-2 text-xs font-black text-white hover:bg-primary/90 transition-all duration-200 shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 hover:scale-[1.02] active:scale-[0.98]"
            >
              Register Study Load
            </Link>
          </div>

          {/* Mobile Top Action Buttons */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle compact={true} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-foreground hover:bg-accent transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <a
              href="#features"
              className="block text-sm font-semibold text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#departments"
              className="block text-sm font-semibold text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Departments
            </a>
            <a
              href="#how-it-works"
              className="block text-sm font-semibold text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </a>
            <Link
              href="/privacy"
              className="block text-sm font-semibold text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Privacy & Security
            </Link>

            <div className="flex gap-2 pt-2 border-t border-border">
              <Link
                href="/login"
                className="flex-1 text-center rounded-xl border border-border bg-card px-3 py-2 text-xs font-black text-foreground"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="flex-1 text-center rounded-xl bg-primary px-3 py-2 text-xs font-black text-white"
              >
                Register Load
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Ambient Background Glow Mesh ── */}
      <div className="relative flex-1 flex flex-col justify-between">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[850px] h-[350px] bg-gradient-to-tr from-primary/20 to-sky-400/15 dark:from-primary/10 dark:to-cyan-400/10 blur-[120px] rounded-full pointer-events-none animate-glow" />

        {/* ── Hero Section ── */}
        <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-8 pt-16 sm:pt-24 lg:pt-28 pb-12 text-center animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-black text-primary mb-6 shadow-sm animate-float">
            <Compass className="size-3.5 text-primary" />
            <span>University of Cebu Main Campus • 8 Floors</span>
            <Sparkles className="size-3 text-primary animate-pulse" />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground max-w-4xl mx-auto leading-[1.1]">
            Navigate Your Campus.{" "}
            <span className="bg-gradient-to-r from-primary to-sky-400 bg-clip-text text-transparent">
              Never Miss a Class.
            </span>
          </h1>

          <p className="mt-6 text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
            ChronoNav is an indoor navigation and schedule management web system that guides you through every
            corridor, staircase, and elevator across all 8 campus floors with automatic study-load routing.
          </p>

          {/* Hero CTA buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2.5 rounded-2xl bg-primary px-7 py-3.5 text-sm font-black text-white hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/30 hover:shadow-primary/45 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Register Study Load</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/explore"
              className="group inline-flex items-center gap-2.5 rounded-2xl border border-border bg-card px-7 py-3.5 text-sm font-black text-foreground hover:bg-accent hover:text-primary transition-all duration-200 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              <Map className="size-4 text-primary" />
              <span>Explore 8-Floor Map</span>
            </Link>
          </div>

          {/* Key Metrics Strip */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-4xl mx-auto">
            {[
              { label: "Campus Floors", val: "8 Levels", icon: Layers },
              { label: "Navigable Rooms", val: "60+ Rooms", icon: Building2 },
              { label: "Shortest Paths", val: "Dijkstra Engine", icon: Compass },
              { label: "Guest Explorer", val: "Zero-Login", icon: Smartphone },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-card/70 backdrop-blur p-4 space-y-1 text-center shadow-sm hover:border-primary/40 transition-colors"
                >
                  <Icon className="size-5 text-primary mx-auto mb-1" />
                  <p className="text-base font-black text-foreground">{stat.val}</p>
                  <p className="text-[11px] font-semibold text-muted-foreground">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Infinite Horizontal Department Marquee ── */}
        <section id="departments" className="relative z-10 border-y border-border bg-card/60 backdrop-blur py-4 overflow-hidden">
          <div className="animate-marquee gap-8 items-center select-none">
            {[...CAMPUS_DEPARTMENTS, ...CAMPUS_DEPARTMENTS].map((dept, i) => (
              <div key={i} className="flex items-center gap-3 shrink-0 px-4">
                <span className="size-2 rounded-full bg-primary inline-block" />
                <span className="text-xs font-black tracking-wide text-muted-foreground hover:text-foreground transition-colors uppercase">
                  {dept}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features Section ── */}
        <section id="features" className="relative z-10 border-b border-border bg-card/30 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-8">
            <div className="text-center mb-12 space-y-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight">
                Everything You Need on Campus
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                Engineered specifically for students, faculty, and administrators at the University of Cebu.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard
                icon={Map}
                title="8-Floor Indoor Map"
                description="Interactive architectural floorplans with corridor spines, stairs, and elevators across all 8 campus levels."
              />
              <FeatureCard
                icon={CalendarDays}
                title="Smart Schedule"
                description="Upload your study load to generate a personal timetable with instant one-click routes to your classrooms."
              />
              <FeatureCard
                icon={ScanLine}
                title="AI Study Load OCR"
                description="Automatic client-side study load parser extracts courses, time slots, and room numbers in seconds."
              />
              <FeatureCard
                icon={Bell}
                title="Live Alerts & Bulletins"
                description="Stay updated with official department announcements, room transfers, and campus notifications."
              />
            </div>
          </div>
        </section>

        {/* ── How It Works Step-by-Step ── */}
        <section id="how-it-works" className="relative z-10 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-8 text-center space-y-12">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Get Started in 3 Simple Steps
              </h2>
              <p className="text-sm text-muted-foreground">Turn your enrollment document into live turn-by-turn guidance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
              <StepCard
                step="1"
                title="Upload Study Load"
                description="Take a photo or upload your registration PDF. Our secure client-side OCR extracts all subjects instantly."
              />
              <StepCard
                step="2"
                title="View Daily Timetable"
                description="See your classes sorted by day, time, instructor, and specific classroom across all campus buildings."
              />
              <StepCard
                step="3"
                title="Navigate Step-by-Step"
                description="Click 'Navigate' on any class to see the fastest walking route from campus gates right to your desk."
              />
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-border bg-card py-8 transition-colors duration-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-foreground">CHRONONAV</span>
              <span>•</span>
              <span>University of Cebu Main Campus</span>
            </div>

            <div className="flex items-center gap-6">
              <Link href="/explore" className="hover:text-foreground transition-colors">
                Public Map
              </Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/login" className="hover:text-foreground transition-colors font-bold text-primary">
                Portal Sign In
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-3xl border border-border bg-card p-6 space-y-3.5 shadow-sm hover:shadow-xl hover:border-primary/40 hover:-translate-y-1.5 transition-all duration-300">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/15 border border-primary/30 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
        <Icon className="size-6" />
      </div>
      <h3 className="text-base font-black text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 space-y-3 shadow-sm hover:border-primary/40 transition-colors">
      <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-white font-black text-sm shadow-md shadow-primary/30">
        {step}
      </div>
      <h3 className="text-base font-black text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
