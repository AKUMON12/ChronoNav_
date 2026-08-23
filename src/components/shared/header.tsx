import React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon, Bell, Search, Menu, X } from "lucide-react";
import { Logo } from "@/components/shared/logo";

interface HeaderProps {
  /** Page title displayed in the header bar */
  title?: string;
  /** Show the search input field */
  showSearch?: boolean;
  /** Callback when mobile hamburger is clicked (for sidebar toggle) */
  onMenuToggle?: () => void;
  /** User initials for avatar placeholder (e.g. "JD") */
  userInitials?: string;
}

/**
 * Shared responsive header component used across all dashboard and navigation pages.
 * Adapts for mobile (hamburger + compact) and desktop (full search + controls) viewports.
 * Uses ChronoNav design tokens from globals.css.
 */
export function Header({
  title = "ChronoNav",
  showSearch = true,
  onMenuToggle,
  userInitials = "CN",
}: HeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center justify-between border-b border-border bg-card/95 backdrop-blur px-4 sm:px-6">
      {/* Left: Menu toggle (mobile) + Logo/Title */}
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="p-2 md:hidden rounded-lg text-foreground hover:bg-accent transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Menu className="size-5" />
          </button>
        )}

        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <Logo size="sm" priority={true} />
          <span className="text-base sm:text-lg font-bold text-foreground tracking-tight">
            {title}
          </span>
        </Link>
      </div>

      {/* Right: Search + Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search bar — hidden on mobile, visible on sm+ */}
        {showSearch && (
          <div className="relative hidden sm:block w-40 lg:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-lg border border-input bg-background py-1.5 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        )}

        {/* Theme toggle button */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex size-9 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-accent transition-colors"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>

        {/* Notification bell */}
        <Link
          href="/notifications"
          className="flex size-9 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-accent transition-colors relative"
          aria-label="View notifications"
        >
          <Bell className="size-4" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-primary ring-2 ring-card animate-pulse" />
        </Link>

        {/* User avatar placeholder */}
        <div className="flex size-9 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">
          {userInitials}
        </div>
      </div>
    </header>
  );
}
