"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Map,
  CalendarDays,
  ScanLine,
  Bell,
  ArrowRight,
  Menu,
  X,
  Sparkles,
  Layers,
  Building2,
  Smartphone,
  HelpCircle,
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Logo } from "@/components/shared/logo";
import { LandingWelcomeModal } from "@/components/shared/landing-welcome-modal";
import { HeroCampus3DVisualizer } from "@/components/shared/hero-campus-3d-visualizer";

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
 *
 * Layout:
 * - 2-Column Responsive Hero: Context & CTA on Left, 3D Isometric Campus Navigation Visualizer on Right
 * - Icon-Only Quick Tour trigger in Hero CTA group (modal opens only upon user click)
 * - Infinite department marquee with hover-pause
 * - Responsive layout tested for Desktop, Tablet, and Mobile screens
 */
export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200 overflow-x-hidden selection:bg-primary selection:text-white">
      {/* ── Interactive Welcome & Quick Navigator Pop-Up Modal (Manual Trigger Only) ── */}
      <LandingWelcomeModal
        isOpen={welcomeModalOpen}
        onClose={() => setWelcomeModalOpen(false)}
      />

      {/* ── Sticky Navigation Bar ── */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-md transition-colors duration-200">
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

          {/* Desktop Auth CTA + Theme Toggle */}
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

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setWelcomeModalOpen(true);
              }}
              className="w-full text-left text-sm font-semibold text-primary py-1 flex items-center gap-2"
            >
              <Sparkles className="size-4" />
              <span>Campus Quick Tour & Guide</span>
            </button>

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

        {/* ── 2-Column Responsive Hero Section ── */}
        <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-8 pt-12 sm:pt-16 lg:pt-20 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Context, Headline, CTA & Metrics */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Badge with Pop & Guide Trigger */}
              <div className="animate-fade-in-up">
                <button
                  onClick={() => setWelcomeModalOpen(true)}
                  className="group inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-black text-primary shadow-sm hover:bg-primary/20 hover:border-primary/50 hover:scale-105 transition-all cursor-pointer"
                  title="Click to view Quick Guide & System Features"
                >
                  <Compass className="size-3.5 text-primary group-hover:rotate-45 transition-transform duration-300" />
                  <span>University of Cebu Main Campus • 8 Floors</span>
                  <Sparkles className="size-3 text-primary animate-pulse" />
                </button>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight text-foreground leading-[1.1] animate-fade-in-up delay-100">
                Navigate Your Campus.{" "}
                <span className="bg-gradient-to-r from-primary via-sky-500 to-sky-400 bg-clip-text text-transparent">
                  Never Miss a Class.
                </span>
              </h1>

              {/* Description Paragraph */}
              <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed font-medium max-w-xl animate-fade-in-up delay-200">
                ChronoNav is an indoor navigation and schedule management web system that guides you through every
                corridor, staircase, and elevator across all 8 campus floors with automatic study-load routing.
              </p>

              {/* Hero CTA Group with Icon-Only Quick Tour Button */}
              <div className="flex flex-wrap items-center gap-3 pt-2 animate-fade-in-up delay-300">
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-2.5 rounded-2xl bg-primary px-6 sm:px-7 py-3.5 text-sm font-black text-white hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/30 hover:shadow-primary/45 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Register Study Load</span>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <Link
                  href="/explore"
                  className="group inline-flex items-center gap-2.5 rounded-2xl border border-border bg-card px-6 sm:px-7 py-3.5 text-sm font-black text-foreground hover:bg-accent hover:text-primary transition-all duration-200 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Map className="size-4 text-primary" />
                  <span>Explore Map</span>
                </Link>

                {/* ── Icon-Only Quick Tour Button (Modal only opens on click) ── */}
                <button
                  onClick={() => setWelcomeModalOpen(true)}
                  className="relative group flex size-12 items-center justify-center rounded-2xl border border-border bg-card hover:bg-primary/15 hover:border-primary/50 text-muted-foreground hover:text-primary transition-all duration-200 shadow-sm hover:scale-105 active:scale-95"
                  title="Quick Tour & Feature Guide"
                  aria-label="Open Quick Tour and System Guide"
                >
                  <HelpCircle className="size-5 transition-transform group-hover:scale-110 text-primary" />
                  {/* Subtle hover pulse indicator */}
                  <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-primary ring-2 ring-background animate-pulse" />
                </button>
              </div>

              {/* Key Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-xl animate-fade-in-up delay-400">
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
                      className="rounded-2xl border border-border bg-card/70 backdrop-blur p-3.5 space-y-1 text-center shadow-sm hover:border-primary/40 hover:-translate-y-1 hover:shadow-md transition-all duration-200"
                    >
                      <Icon className="size-4.5 text-primary mx-auto mb-1" />
                      <p className="text-sm font-black text-foreground">{stat.val}</p>
                      <p className="text-[10px] font-semibold text-muted-foreground">{stat.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: 3D Campus Navigation Visualizer */}
            <div className="lg:col-span-5 w-full animate-fade-in-up delay-200">
              <HeroCampus3DVisualizer />
            </div>
          </div>
        </section>

        {/* ── Infinite Horizontal Department Marquee ── */}
        <section id="departments" className="relative z-10 border-y border-border bg-card/60 backdrop-blur py-4 overflow-hidden animate-fade-in-up delay-500">
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
              <button
                onClick={() => setWelcomeModalOpen(true)}
                className="hover:text-primary transition-colors font-bold"
              >
                Quick Guide
              </button>
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
    <div className="rounded-3xl border border-border bg-card p-6 space-y-3 shadow-sm hover:border-primary/40 hover:-translate-y-1 transition-all duration-200">
      <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-white font-black text-sm shadow-md shadow-primary/30">
        {step}
      </div>
      <h3 className="text-base font-black text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
