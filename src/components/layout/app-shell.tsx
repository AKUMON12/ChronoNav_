"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";
import {
  Compass,
  LayoutDashboard,
  Calendar,
  MapPin,
  ScanLine,
  Bell,
  Settings,
  Shield,
  GraduationCap,
  Users,
  LogOut,
  Menu,
  X,
  ChevronRight,
  User,
  Map,
} from "lucide-react";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { BackButton } from "@/components/shared/back-button";
import { signOut, getCurrentUser } from "@/lib/supabase/auth";
import type { UserRole } from "@/types/database";

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  roles: UserRole[];
}

/** Dynamic Role-Based Navigation Configuration following standard hierarchy */
const navigationConfig: NavigationItem[] = [
  // ── 1. Student Portal ──
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["student"],
  },
  {
    label: "My Classes",
    href: "/schedule",
    icon: Calendar,
    roles: ["student"],
  },
  {
    label: "Scan Study Load",
    href: "/schedule?ocr=open",
    icon: ScanLine,
    badge: "Scan",
    roles: ["student"],
  },
  {
    label: "Campus Map",
    href: "/map",
    icon: MapPin,
    badge: "5 Floors",
    roles: ["student"],
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["student"],
  },

  // ── 2. Faculty Portal ──
  {
    label: "Dashboard",
    href: "/faculty/dashboard",
    icon: LayoutDashboard,
    roles: ["faculty"],
  },
  {
    label: "Teaching Schedule",
    href: "/schedule",
    icon: Calendar,
    roles: ["faculty"],
  },
  {
    label: "Campus Map",
    href: "/map",
    icon: MapPin,
    badge: "5 Floors",
    roles: ["faculty"],
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["faculty"],
  },

  // ── 3. Administrator Suite ──
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    roles: ["admin"],
  },
  {
    label: "User Accounts",
    href: "/admin/users",
    icon: Users,
    roles: ["admin"],
  },
  {
    label: "Master Schedules",
    href: "/admin/schedules",
    icon: Calendar,
    roles: ["admin"],
  },
  {
    label: "Campus Rooms",
    href: "/admin/rooms",
    icon: Map,
    badge: "5 Floors",
    roles: ["admin"],
  },
  {
    label: "Announcements",
    href: "/admin/bulletin",
    icon: Bell,
    roles: ["admin"],
  },
  {
    label: "Activity Logs",
    href: "/admin/logs",
    icon: Shield,
    roles: ["admin"],
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    roles: ["admin"],
  },
];

interface AppShellProps {
  children: React.ReactNode;
  forcedRole?: UserRole;
}

/**
 * Enterprise Responsive Role-Aware App Shell
 * Clean, user-friendly, and responsive across Mobile, Tablet, and Desktop.
 */
export function AppShell({ children, forcedRole }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Helper to synchronously read cached session from localStorage
  const getCachedSession = () => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("chrononav_user_session");
        if (stored) return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  };

  const cachedSession = getCachedSession();

  const [userRole, setUserRole] = useState<UserRole>(() => {
    if (forcedRole) return forcedRole;
    if (cachedSession?.user_metadata?.role) return cachedSession.user_metadata.role;
    return "student";
  });

  const [userName, setUserName] = useState<string>(() => {
    if (cachedSession?.user_metadata?.first_name) {
      return `${cachedSession.user_metadata.first_name}`;
    }
    if (cachedSession?.email) {
      return cachedSession.email.split("@")[0];
    }
    return "Student";
  });

  const [userFullName, setUserFullName] = useState<string>(() => {
    if (cachedSession?.user_metadata?.first_name) {
      const last = cachedSession.user_metadata.last_name ? ` ${cachedSession.user_metadata.last_name}` : "";
      return `${cachedSession.user_metadata.first_name}${last}`;
    }
    return "Student Account";
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);

  useEffect(() => {
    async function loadUserData() {
      if (forcedRole) {
        setUserRole(forcedRole);
        return;
      }
      const user = await getCurrentUser();
      if (user) {
        const metadataRole = user.user_metadata?.role as UserRole;
        if (metadataRole) setUserRole(metadataRole);
        if (user.user_metadata?.first_name) {
          setUserName(`${user.user_metadata.first_name}`);
          const last = user.user_metadata?.last_name ? ` ${user.user_metadata.last_name}` : "";
          setUserFullName(`${user.user_metadata.first_name}${last}`);
        } else if (user.email) {
          const prefix = user.email.split("@")[0];
          setUserName(prefix);
          setUserFullName(prefix);
        }
      }
    }
    loadUserData();
  }, [forcedRole]);

  // Dynamic Navigation Items Filtering based on RBAC Role
  const filteredNavItems = navigationConfig.filter((item) =>
    item.roles.includes(userRole)
  );

  // Dynamic Mobile Bottom Dock based on Role
  const mobileDockItems: NavigationItem[] = useMemo(() => {
    if (userRole === "admin") {
      return [
        {
          label: "Overview",
          href: "/admin/dashboard",
          icon: Shield,
          roles: ["admin"],
        },
        {
          label: "Schedules",
          href: "/admin/schedules",
          icon: Calendar,
          roles: ["admin"],
        },
        {
          label: "Users",
          href: "/admin/users",
          icon: Users,
          roles: ["admin"],
        },
        {
          label: "Rooms",
          href: "/admin/rooms",
          icon: Map,
          roles: ["admin"],
        },
      ];
    }

    if (userRole === "faculty") {
      return [
        {
          label: "Home",
          href: "/faculty/dashboard",
          icon: GraduationCap,
          roles: ["faculty"],
        },
        {
          label: "Classes",
          href: "/schedule",
          icon: Calendar,
          roles: ["faculty"],
        },
        {
          label: "Map",
          href: "/map",
          icon: MapPin,
          roles: ["faculty"],
        },
        {
          label: "Profile",
          href: "/profile",
          icon: User,
          roles: ["faculty"],
        },
      ];
    }

    // Default: Student
    return [
      {
        label: "Home",
        href: "/dashboard",
        icon: LayoutDashboard,
        roles: ["student"],
      },
      {
        label: "Schedule",
        href: "/schedule",
        icon: Calendar,
        roles: ["student"],
      },
      {
        label: "Map",
        href: "/map",
        icon: MapPin,
        roles: ["student"],
      },
      {
        label: "Profile",
        href: "/profile",
        icon: User,
        roles: ["student"],
      },
    ];
  }, [userRole]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    // Return user to the public landing page upon sign out
    window.location.href = "/";
  };

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-rose-500/15 border-rose-500/30 text-rose-500 dark:text-rose-400";
      case "faculty":
        return "bg-indigo-500/15 border-indigo-500/30 text-indigo-600 dark:text-indigo-400";
      default:
        return "bg-primary/15 border-primary/30 text-primary";
    }
  };

  const isRootDashboard =
    pathname === "/dashboard" ||
    pathname === "/student" ||
    pathname === "/faculty/dashboard" ||
    pathname === "/admin/dashboard";

  return (
    <div className="min-h-screen flex w-full bg-background text-foreground antialiased selection:bg-primary selection:text-white transition-colors duration-200">
      {/* ── Desktop Left Sidebar (≥1024px / lg breakpoint) ── */}
      <aside className="hidden lg:flex w-64 sticky top-0 h-screen flex-col justify-between border-r border-border bg-card p-5 shrink-0 z-30 transition-colors duration-200">
        <div className="flex-1 min-h-0 overflow-y-auto space-y-6 pr-1">
          {/* Brand Logo Header */}
          <Link href="/dashboard" className="flex items-center gap-3 px-2">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30">
              <Compass className="size-6" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-foreground block">
                CHRONONAV
              </span>
              <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">
                UC Main • CCS
              </span>
            </div>
          </Link>

          {/* User Profile Card (Clickable link to /profile) */}
          <Link
            href="/profile"
            className={`rounded-2xl border p-3 flex items-center gap-3 transition-all duration-200 group block focus:outline-none focus:ring-2 focus:ring-primary ${
              pathname === "/profile"
                ? "bg-primary/10 border-primary/50 ring-1 ring-primary/30 shadow-md"
                : "border-border bg-muted/40 hover:bg-muted/70 shadow-sm"
            }`}
            title="Manage My Profile"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 border border-primary/30 text-primary font-black text-sm shrink-0 group-hover:scale-105 transition-transform">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black text-foreground truncate">{userFullName}</p>
                <ChevronRight className={`size-3 transition-colors ${
                  pathname === "/profile" ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                }`} />
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`rounded-md border px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider ${getRoleBadgeStyle(
                    userRole
                  )}`}
                >
                  {userRole}
                </span>
                <span className="text-[9px] font-bold text-muted-foreground">Profile</span>
              </div>
            </div>
          </Link>

          {/* Dynamic Navigation Links */}
          <nav className="space-y-1.5" aria-label="Desktop Navigation">
            <span className="text-[10px] font-black text-muted-foreground px-3 uppercase tracking-wider block pb-1">
              MENU
            </span>
            {filteredNavItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-extrabold transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/25 scale-[1.02]"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="size-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && !isActive && (
                    <span className="text-[9px] font-black bg-muted border border-border text-primary px-1.5 py-0.5 rounded-md">
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="size-3.5 text-white/80" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Clean Sign Out Button */}
        <div className="shrink-0 pt-4 border-t border-border mt-auto">
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex w-full items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-xs font-black text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-50"
          >
            <LogOut className="size-4" />
            <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content Viewport Area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Universal Top Header Bar with Back Button & Single Top-Right Theme Toggle */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card/90 backdrop-blur px-4 sm:px-6 transition-colors duration-200">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-foreground hover:bg-muted transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Menu className="size-5" />
            </button>

            {/* Top-Left Back Button */}
            {!isRootDashboard ? (
              <BackButton fallbackUrl="/dashboard" showLabel={false} />
            ) : (
              <Link href="/dashboard" className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/30">
                  <Compass className="size-4.5" />
                </div>
                <span className="text-sm sm:text-base font-black tracking-tight text-foreground hidden xs:inline">
                  CHRONONAV
                </span>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Single Clean Theme Toggle */}
            <ThemeToggle />

            {/* Campus Map Shortcut for Desktop */}
            <Link
              href="/map"
              className="hidden md:flex items-center gap-1.5 rounded-xl border border-border bg-muted/50 px-3 py-1.5 text-xs font-extrabold text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Map className="size-3.5 text-primary" />
              <span>Campus Map</span>
            </Link>

            {/* User Avatar Badge (Clickable link to /profile) */}
            <Link
              href="/profile"
              className="flex items-center gap-2 pl-2 border-l border-border hover:opacity-85 transition-opacity"
              title="View Profile"
            >
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-black">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:inline text-xs font-black text-foreground capitalize">
                {userRole}
              </span>
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 pb-24 lg:pb-8 overflow-x-hidden">{children}</main>
      </div>

      {/* ── Mobile Navigation Drawer Overlay (<1024px) ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 left-0 w-72 bg-card border-r border-border p-5 flex flex-col justify-between shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            <div className="flex-1 min-h-0 overflow-y-auto space-y-6 pr-1">
              <div className="flex items-center justify-between">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-white shadow-md shadow-primary/30">
                    <Compass className="size-5" />
                  </div>
                  <div>
                    <span className="text-base font-black tracking-tight text-foreground block">
                      CHRONONAV
                    </span>
                    <span className="text-[9px] font-bold text-muted-foreground tracking-wider uppercase">
                      UC Main Campus
                    </span>
                  </div>
                </Link>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground"
                  aria-label="Close Menu"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* User Identity Card */}
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-2xl border border-border bg-muted/40 p-3 flex items-center gap-3 hover:bg-muted/70 transition-colors block"
              >
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary/15 text-primary font-black text-sm">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-black text-foreground truncate">{userName}</p>
                  <span
                    className={`inline-block rounded-md border px-1.5 py-0.2 text-[9px] font-black uppercase mt-0.5 ${getRoleBadgeStyle(
                      userRole
                    )}`}
                  >
                    {userRole}
                  </span>
                </div>
              </Link>

              {/* Mobile Nav Links */}
              <nav className="space-y-1" aria-label="Mobile Navigation Drawer">
                {filteredNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-extrabold transition-all ${
                        isActive
                          ? "bg-primary text-white shadow-md shadow-primary/30"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="size-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && !isActive && (
                        <span className="text-[9px] font-black bg-muted text-primary px-1.5 py-0.5 rounded-md">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Mobile Drawer Footer: Clean Sign Out Button */}
            <div className="shrink-0 pt-4 border-t border-border mt-auto">
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="flex w-full items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-xs font-black text-destructive hover:bg-destructive/20 transition-colors"
              >
                <LogOut className="size-4" />
                <span>{isSigningOut ? "Signing out..." : "Sign Out"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Fixed Bottom Navigation Dock (<1024px) ── */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card/95 backdrop-blur-md border-t border-border shadow-2xl px-2 py-1.5 transition-colors duration-200"
        aria-label="Mobile Bottom Navigation"
      >
        <div className="grid grid-cols-4 items-center max-w-md mx-auto">
          {mobileDockItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                  isActive
                    ? "text-primary font-black scale-105"
                    : "text-muted-foreground hover:text-foreground font-semibold"
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-colors ${
                    isActive ? "bg-primary/15 text-primary" : ""
                  }`}
                >
                  <Icon className="size-4.5" />
                </div>
                <span className="text-[10px] mt-0.5 leading-tight truncate">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

