"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Map,
  CalendarDays,
  Bell,
  Settings,
  Users,
  BarChart3,
  FileText,
  Building2,
  Compass,
  X,
} from "lucide-react";

/** Navigation item configuration for the sidebar */
interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  /** If true, only visible to admin role */
  adminOnly?: boolean;
}

/** Student navigation items */
const studentNavItems: NavItem[] = [
  { label: "Dashboard", href: "/student", icon: Home },
  { label: "Schedule", href: "/student/schedule", icon: CalendarDays },
  { label: "Campus Map", href: "/map", icon: Map },
  { label: "Notifications", href: "/student/notifications", icon: Bell },
  { label: "Settings", href: "/student/settings", icon: Settings },
];

/** Admin navigation items */
const adminNavItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: Home },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Rooms", href: "/admin/rooms", icon: Building2 },
  { label: "Activity Logs & Reports", href: "/admin/logs", icon: BarChart3 },
  { label: "Campus Bulletin", href: "/admin/bulletin", icon: FileText },
  { label: "Campus Map", href: "/map", icon: Map },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];


interface SidebarProps {
  /** Which role's navigation items to show */
  role?: "student" | "faculty" | "admin";
  /** Whether the mobile drawer is open */
  isOpen: boolean;
  /** Callback to close the mobile drawer */
  onClose: () => void;
}

/**
 * Shared Sidebar component for dashboard layouts.
 * Desktop: static sidebar on the left side (md+ breakpoint).
 * Mobile/Tablet: slide-in drawer with backdrop overlay.
 * Uses ChronoNav design tokens from globals.css.
 */
export function Sidebar({ role = "student", isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const navItems = role === "admin" ? adminNavItems : studentNavItems;

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-border bg-card transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar header with logo */}
        <div className="flex h-14 sm:h-16 items-center justify-between border-b border-border px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Compass className="size-5" />
            </div>
            <span className="text-base font-bold text-foreground tracking-tight">ChronoNav</span>
          </Link>

          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            aria-label="Close sidebar"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Dashboard navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="size-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer — role indicator */}
        <div className="border-t border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">
            Logged in as <span className="font-bold text-foreground capitalize">{role}</span>
          </p>
        </div>
      </aside>
    </>
  );
}

/**
 * Mobile Bottom Tab Bar — shown only on small screens (md:hidden).
 * Provides quick access to the primary navigation items.
 */
export function MobileBottomNav({ role = "student" }: { role?: "student" | "faculty" | "admin" }) {
  const pathname = usePathname();
  const items = role === "admin"
    ? [adminNavItems[0], adminNavItems[1], adminNavItems[5], adminNavItems[6]]  // Dashboard, Users, Map, Settings
    : [studentNavItems[0], studentNavItems[1], studentNavItems[2], studentNavItems[4]]; // Dashboard, Schedule, Map, Settings

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-border bg-card md:hidden"
      aria-label="Mobile navigation"
    >
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 px-2 py-1 text-[10px] font-medium transition-colors ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            <Icon className="size-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
