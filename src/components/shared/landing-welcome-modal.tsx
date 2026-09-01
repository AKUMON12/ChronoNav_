"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Compass,
  Map,
  ScanLine,
  Bell,
  ArrowRight,
  X,
  Sparkles,
  Layers,
  GraduationCap,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";

interface LandingWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = "chrononav_welcome_dismissed";

/**
 * LandingWelcomeModal - Interactive entrance modal for ChronoNav landing page.
 *
 * Features:
 * - GPU-accelerated entrance animation with smooth backdrop blur
 * - Responsive layout: centered card on desktop/tablet, adaptive scrollable modal on mobile
 * - Quick action cards linking to 8-floor interactive map, OCR load registration, and portals
 * - LocalStorage persistence for user's "Don't show again" preference
 * - Accessible keyboard navigation with Escape key close support
 */
export function LandingWelcomeModal({ isOpen, onClose }: LandingWelcomeModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Close modal and persist "don't show again" choice to localStorage if checked
  const handleDismiss = useCallback(() => {
    if (dontShowAgain && typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, "true");
      } catch (err) {
        console.warn("Unable to access localStorage:", err);
      }
    }
    onClose();
  }, [dontShowAgain, onClose]);

  // Handle keyboard Escape press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleDismiss();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleDismiss]);

  // Lock body scroll when modal is open on mobile devices
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
      onClick={(e) => {
        // Close modal when clicking outer backdrop
        if (e.target === e.currentTarget) {
          handleDismiss();
        }
      }}
    >
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl border border-border bg-card shadow-2xl overflow-hidden animate-scale-in text-foreground">
        {/* Top ambient color mesh banner */}
        <div className="relative h-28 sm:h-32 bg-gradient-to-br from-primary via-sky-600 to-sky-400 p-5 flex items-start justify-between shrink-0 overflow-hidden">
          {/* Subtle background overlay circles */}
          <div className="absolute -top-12 -right-12 size-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-48 h-20 bg-cyan-300/20 blur-2xl pointer-events-none" />

          {/* Banner content */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-md">
              <Compass className="size-6 text-white animate-spin-slow" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider mb-0.5 backdrop-blur-sm">
                <Sparkles className="size-3" />
                <span>University of Cebu Main Campus</span>
              </div>
              <h2 id="welcome-modal-title" className="text-lg sm:text-xl font-black text-white leading-tight">
                Welcome to ChronoNav
              </h2>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="relative z-10 p-2 rounded-2xl bg-black/20 hover:bg-black/40 text-white/90 hover:text-white transition-all backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Close welcome modal"
          >
            <X className="size-4 sm:size-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* Subtitle & Introduction */}
          <p className="text-muted-foreground leading-relaxed text-xs sm:text-sm font-medium">
            Experience smart indoor navigation, intelligent study-load timetable routing, and real-time announcements
            across all <strong>8 campus floors</strong> with zero hassle.
          </p>

          {/* Interactive Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
            {/* Feature 1: 8-Floor Interactive Map */}
            <Link
              href="/explore"
              onClick={handleDismiss}
              className="group p-3.5 rounded-2xl border border-border bg-background hover:border-primary/50 hover:bg-accent/40 transition-all duration-200 flex items-start gap-3 shadow-sm hover:shadow-md"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary shrink-0 group-hover:scale-105 group-hover:bg-primary group-hover:text-white transition-all">
                <Map className="size-5" />
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-foreground text-xs sm:text-sm group-hover:text-primary transition-colors">
                    8-Floor Public Map
                  </h3>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                    Free
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-2">
                  Browse classrooms, labs, elevators, and shortest walking paths without logging in.
                </p>
              </div>
            </Link>

            {/* Feature 2: Smart OCR Timetable */}
            <Link
              href="/register"
              onClick={handleDismiss}
              className="group p-3.5 rounded-2xl border border-border bg-background hover:border-primary/50 hover:bg-accent/40 transition-all duration-200 flex items-start gap-3 shadow-sm hover:shadow-md"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-400 shrink-0 group-hover:scale-105 group-hover:bg-sky-500 group-hover:text-white transition-all">
                <ScanLine className="size-5" />
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-foreground text-xs sm:text-sm group-hover:text-primary transition-colors">
                    AI Study Load OCR
                  </h3>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400">
                    Smart
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-2">
                  Upload study load PDF or photo to automatically generate daily schedule routes.
                </p>
              </div>
            </Link>

            {/* Feature 3: Live Bulletins */}
            <div className="p-3.5 rounded-2xl border border-border bg-background flex items-start gap-3 shadow-sm">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">
                <Bell className="size-5" />
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <h3 className="font-black text-foreground text-xs sm:text-sm">Campus Bulletins</h3>
                <p className="text-[11px] text-muted-foreground line-clamp-2">
                  Stay informed on official announcements, room transfers, and facility schedules.
                </p>
              </div>
            </div>

            {/* Feature 4: Role-Based Portals */}
            <Link
              href="/login"
              onClick={handleDismiss}
              className="group p-3.5 rounded-2xl border border-border bg-background hover:border-primary/50 hover:bg-accent/40 transition-all duration-200 flex items-start gap-3 shadow-sm hover:shadow-md"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-105 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                <Lock className="size-5" />
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-foreground text-xs sm:text-sm group-hover:text-primary transition-colors">
                    Portal Sign In
                  </h3>
                  <ArrowRight className="size-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-2">
                  Secure access for Students, Faculty instructors, and Department Administrators.
                </p>
              </div>
            </Link>
          </div>

          {/* Quick campus metrics pill bar */}
          <div className="p-3 rounded-2xl bg-muted/40 border border-border flex items-center justify-around text-center">
            <div>
              <p className="text-xs sm:text-sm font-black text-primary">8 Floors</p>
              <p className="text-[10px] text-muted-foreground font-semibold">Campus Levels</p>
            </div>
            <div className="h-6 w-px bg-border" />
            <div>
              <p className="text-xs sm:text-sm font-black text-primary">60+ Rooms</p>
              <p className="text-[10px] text-muted-foreground font-semibold">Corridor Nodes</p>
            </div>
            <div className="h-6 w-px bg-border" />
            <div>
              <p className="text-xs sm:text-sm font-black text-primary">Dijkstra</p>
              <p className="text-[10px] text-muted-foreground font-semibold">Fastest Route</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-border bg-card/80 backdrop-blur flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {/* "Don't show again" Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-[11px] sm:text-xs text-muted-foreground hover:text-foreground">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="size-4 rounded border-border text-primary focus:ring-primary accent-primary"
            />
            <span>Don't show this entrance guide again</span>
          </label>

          {/* Action CTA Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Link
              href="/explore"
              onClick={handleDismiss}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-border bg-background text-xs font-black text-foreground hover:bg-accent transition-colors"
            >
              <Map className="size-3.5 text-primary" />
              <span>Explore Map</span>
            </Link>
            <button
              onClick={handleDismiss}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-xs font-black text-white hover:bg-primary/90 shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 transition-all"
            >
              <span>Get Started</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
