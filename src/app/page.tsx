"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import {
  Compass,
  Map,
  CalendarDays,
  ScanLine,
  Bell,
  Shield,
  Sun,
  Moon,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import React, { useState } from "react";

/**
 * ChronoNav Public Landing Page
 * Serves as the entry point for unauthenticated users.
 * Provides hero CTA, feature overview, and footer with privacy link.
 * Fully responsive: mobile-first with tablet/desktop breakpoints.
 */
export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* ── Sticky Navigation Bar ── */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Compass className="size-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">CHRONONAV</span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium" aria-label="Main Navigation">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
          </nav>

          {/* Desktop CTA + theme toggle */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex size-9 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-accent transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <Link
              href="/login"
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-bold text-foreground hover:bg-accent transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-foreground hover:bg-accent transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-4 space-y-3">
            <a href="#features" className="block text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#how-it-works" className="block text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <Link href="/privacy" className="block text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Privacy</Link>
            <div className="flex gap-2 pt-2 border-t border-border">
              <Link href="/login" className="flex-1 text-center rounded-lg border border-border bg-card px-3 py-2 text-sm font-bold text-foreground">Log In</Link>
              <Link href="/register" className="flex-1 text-center rounded-lg bg-primary px-3 py-2 text-sm font-bold text-primary-foreground">Get Started</Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero Section ── */}
      <section className="flex-1 flex items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 py-16 sm:py-24 lg:py-32 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary mb-6">
            <Compass className="size-3.5" />
            <span>University of Cebu Main Campus</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground max-w-3xl mx-auto leading-[1.1]">
            Navigate Your Campus.{" "}
            <span className="text-primary">Never Miss a Class.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            ChronoNav is an indoor navigation and schedule management system that guides you
            to every classroom, lab, and office on campus — with automatic routing from your uploaded study load.
          </p>

          {/* Hero CTA buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
            >
              <span>Get Started Free</span>
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-bold text-foreground hover:bg-accent transition-colors"
            >
              <Map className="size-4" />
              <span>Explore Campus Map</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="border-t border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 py-16 sm:py-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Everything You Need on Campus
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Built for students, faculty, and administrators at the University of Cebu.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={Map}
              title="Indoor Campus Map"
              description="Interactive SVG floor plans with room markers, corridors, and staircase transitions across all buildings."
            />
            <FeatureCard
              icon={CalendarDays}
              title="Smart Schedule"
              description="Upload your study load and get a personalized timetable with automatic navigation to each classroom."
            />
            <FeatureCard
              icon={ScanLine}
              title="OCR Schedule Import"
              description="Snap a photo of your printed class schedule — ChronoNav extracts courses, times, and rooms automatically."
            />
            <FeatureCard
              icon={Bell}
              title="Class Reminders"
              description="Receive notifications before each class starts, with one-tap navigation to the correct room."
            />
          </div>
        </div>
      </section>

      {/* ── How It Works Section ── */}
      <section id="how-it-works" className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 py-16 sm:py-24">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              How ChronoNav Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard step={1} title="Create Your Account" description="Register with your university email. Choose your role — student, faculty, or admin." />
            <StepCard step={2} title="Upload Your Schedule" description="Import your class schedule via OCR photo upload or manual entry. ChronoNav maps every course to a room." />
            <StepCard step={3} title="Navigate Instantly" description="Get turn-by-turn indoor directions to your next class. Never wander the hallways again." />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Compass className="size-4 text-primary" />
            <span>© 2026 ChronoNav — University of Cebu Main Campus</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Shield className="size-3.5" />
              <span>Privacy Policy</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/** Feature card used in the features grid */
function FeatureCard({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-3 hover:shadow-md transition-shadow">
      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>
      <h3 className="text-base font-bold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}

/** Step card used in the "How It Works" section */
function StepCard({ step, title, description }: { step: number; title: string; description: string }) {
  return (
    <div className="text-center space-y-3">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold shadow-md">
        {step}
      </div>
      <h3 className="text-base font-bold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{description}</p>
    </div>
  );
}
