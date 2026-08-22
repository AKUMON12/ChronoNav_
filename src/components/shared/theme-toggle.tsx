"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";

interface ThemeToggleProps {
  compact?: boolean;
  className?: string;
}

/**
 * Enterprise Icon-Only Theme Toggle Component
 * Seamlessly toggles between Light and Dark modes (with hydration safety).
 * Displays ONLY clean icons with fluid micro-animations and no text labels.
 */
export function ThemeToggle({ compact = false, className = "" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`size-9 rounded-xl border border-border bg-card/60 animate-pulse ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative flex size-9 items-center justify-center rounded-xl border border-border bg-card hover:bg-accent text-foreground transition-all duration-200 shadow-sm active:scale-95 group focus:outline-none focus:ring-2 focus:ring-primary/40 ${className}`}
      aria-label={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
      title={`Theme: ${isDark ? "Dark" : "Light"} Mode (Click to switch)`}
    >
      {isDark ? (
        <Sun className="size-4 text-amber-400 transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110" />
      ) : (
        <Moon className="size-4 text-indigo-500 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
      )}
      <span className="sr-only">Toggle Theme</span>
    </button>
  );
}
