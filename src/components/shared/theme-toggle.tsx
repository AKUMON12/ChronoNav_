"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop, Check } from "lucide-react";

interface ThemeToggleProps {
  compact?: boolean;
  className?: string;
}

/**
 * Animated Theme Toggle Component
 * Supports Light, Dark, and System modes with hydration-safe rendering.
 */
export function ThemeToggle({ compact = false, className = "" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) {
    return (
      <div className={`size-9 rounded-xl border border-border bg-card/60 animate-pulse ${className}`} />
    );
  }

  // Quick toggle mode when compact is true
  if (compact) {
    return (
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className={`flex size-9 items-center justify-center rounded-xl border border-border bg-card hover:bg-accent text-foreground transition-all duration-200 shadow-sm ${className}`}
        aria-label={`Switch to ${theme === "dark" ? "Light" : "Dark"} mode`}
        title={`Current mode: ${theme}`}
      >
        {theme === "dark" ? (
          <Sun className="size-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
        ) : (
          <Moon className="size-4 text-indigo-500 transition-transform duration-300 hover:-rotate-12" />
        )}
      </button>
    );
  }

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={`flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground hover:bg-accent transition-all shadow-sm ${className}`}
        aria-label="Theme Selection"
        aria-expanded={dropdownOpen}
      >
        {theme === "dark" ? (
          <Moon className="size-4 text-indigo-400" />
        ) : theme === "light" ? (
          <Sun className="size-4 text-amber-500" />
        ) : (
          <Laptop className="size-4 text-primary" />
        )}
        <span className="capitalize">{theme || "Theme"}</span>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-36 rounded-2xl border border-border bg-card p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 space-y-0.5">
          <button
            onClick={() => {
              setTheme("light");
              setDropdownOpen(false);
            }}
            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
              theme === "light"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <Sun className="size-3.5 text-amber-500" />
              <span>Light</span>
            </div>
            {theme === "light" && <Check className="size-3 text-primary" />}
          </button>

          <button
            onClick={() => {
              setTheme("dark");
              setDropdownOpen(false);
            }}
            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
              theme === "dark"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <Moon className="size-3.5 text-indigo-400" />
              <span>Dark</span>
            </div>
            {theme === "dark" && <Check className="size-3 text-primary" />}
          </button>

          <button
            onClick={() => {
              setTheme("system");
              setDropdownOpen(false);
            }}
            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
              theme === "system"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <div className="flex items-center gap-2">
              <Laptop className="size-3.5 text-primary" />
              <span>System</span>
            </div>
            {theme === "system" && <Check className="size-3 text-primary" />}
          </button>
        </div>
      )}
    </div>
  );
}
