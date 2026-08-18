"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Compass,
  LayoutDashboard,
  CalendarDays,
  Map,
  ScanLine,
  Bell,
  GraduationCap,
  Shield,
  LogOut,
  Menu,
  X,
  User,
  ChevronRight,
  Sun,
  Moon,
  Search,
} from "lucide-react";
import { useTheme } from "next-themes";
import { signOut, getCurrentUser } from "@/lib/supabase/auth";
import type { UserRole } from "@/types/database";

interface AppShellProps {
  children: React.ReactNode;
  forcedRole?: UserRole;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
  badge?: string;
}

const navigationConfig: NavItem[] = [
  // Base Student Links
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["student", "faculty", "admin"],
  },
  {
    label: "My Schedule",
    href: "/schedule",
    icon: CalendarDays,
    roles: ["student", "faculty", "admin"],
  },
  {
    label: "Campus Map",
    href: "/map",
    icon: Map,
    roles: ["student", "faculty", "admin"],
  },
  {
    label: "Scan Load",
    href: "/schedule?ocr=open",
    icon: ScanLine,
    roles: ["student", "faculty", "admin"],
  },
  {
    label: "Alerts",
    href: "/dashboard#bulletins",
    icon: Bell,
    roles: ["student", "faculty", "admin"],
  },

  // Faculty Specific Link
  {
    label: "Faculty Hub",
    href: "/faculty/dashboard",
    icon: GraduationCap,
    roles: ["faculty", "admin"],
    badge: "Faculty",
  },

  // Admin Specific Link
  {
    label: "Admin Suite",
    href: "/admin/dashboard",
    icon: Shield,
    roles: ["admin"],
    badge: "Admin",
  },
];

export function AppShell({ children, forcedRole }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [userRole, setUserRole] = useState<UserRole>(forcedRole || "student");
  const [userName, setUserName] = useState<string>("Student");
  const [userEmail, setUserEmail] = useState<string>("user@uc.edu.ph");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);

  // Load user metadata on mount
  useEffect(() => {
    async function loadUserData() {
      const user = await getCurrentUser();
      if (user) {
        const metadata = user.user_metadata || {};
        const detectedRole = (forcedRole || metadata.role || "student") as UserRole;
        setUserRole(detectedRole);

        const fullName = metadata.first_name
          ? `${metadata.first_name} ${metadata.last_name || ""}`.trim()
          : "Juan Dela Cruz";
        setUserName(fullName);
        setUserEmail(user.email || "user@uc.edu.ph");
      }
    }
    loadUserData();
  }, [forcedRole]);

  // Dynamic Navigation Items Filtering based on RBAC Role
  const filteredNavItems = navigationConfig.filter((item) =>
    item.roles.includes(userRole)
  );

  // Mobile Bottom Dock Items (Top 4 core items + profile)
  const mobileDockItems = filteredNavItems.slice(0, 4);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    router.push("/login");
  };

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-rose-500/15 border-rose-500/30 text-rose-400";
      case "faculty":
        return "bg-indigo-500/15 border-indigo-500/30 text-indigo-400";
      default:
        return "bg-[#1D7DD7]/15 border-[#1D7DD7]/30 text-[#1D7DD7]";
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-[#0E151B] text-foreground antialiased selection:bg-[#1D7DD7] selection:text-white">
      {/* ── Desktop Left Sidebar (≥1024px / lg breakpoint) ── */}
      <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-[#507495]/20 bg-[#141E28] p-5 shrink-0 z-30">
        <div className="space-y-6">
          {/* Brand Logo Header */}
          <Link href="/dashboard" className="flex items-center gap-3 px-2">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-[#1D7DD7] text-white shadow-lg shadow-[#1D7DD7]/30">
              <Compass className="size-6" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white block">CHRONONAV</span>
              <span className="text-[10px] font-bold text-[#74777E] tracking-wider uppercase">
                UC Main • CCS
              </span>
            </div>
          </Link>

          {/* User Profile Card */}
          <div className="rounded-2xl border border-[#507495]/20 bg-[#0E151B]/80 p-3 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#1D7DD7]/20 border border-[#1D7DD7]/40 text-[#1D7DD7] font-black text-sm shrink-0">
              {userName.charAt(0)}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-black text-white truncate">{userName}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`rounded-md border px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider ${getRoleBadgeStyle(
                    userRole
                  )}`}
                >
                  {userRole}
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic Navigation Links */}
          <nav className="space-y-1.5" aria-label="Desktop Navigation">
            <span className="text-[10px] font-black text-[#74777E] px-3 uppercase tracking-wider block pb-1">
              CAMPUS SUITE
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
                      ? "bg-[#1D7DD7] text-white shadow-lg shadow-[#1D7DD7]/30 scale-[1.02]"
                      : "text-[#74777E] hover:bg-[#0E151B] hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="size-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && !isActive && (
                    <span className="text-[9px] font-black bg-[#0E151B] border border-[#507495]/30 text-[#1D7DD7] px-1.5 py-0.5 rounded-md">
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="size-3.5 text-white/80" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Sign Out Button */}
        <div className="space-y-3 pt-4 border-t border-[#507495]/20">
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex w-full items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-xs font-black text-rose-400 hover:bg-destructive/20 transition-colors disabled:opacity-50"
          >
            <LogOut className="size-4" />
            <span>{isSigningOut ? "Signing out..." : "Sign Out Session"}</span>
          </button>
        </div>
      </aside>

      {/* ── Main Content Viewport Area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile & Tablet Header Bar */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#507495]/20 bg-[#141E28]/95 backdrop-blur px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-foreground hover:bg-[#0E151B] transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Menu className="size-5" />
            </button>

            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-xl bg-[#1D7DD7] text-white shadow-md shadow-[#1D7DD7]/30">
                <Compass className="size-5" />
              </div>
              <span className="text-base font-black tracking-tight text-white">CHRONONAV</span>
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Guest Explorer Link */}
            <Link
              href="/explore"
              className="hidden sm:flex items-center gap-1.5 rounded-xl border border-[#507495]/30 bg-[#0E151B] px-3 py-1.5 text-xs font-extrabold text-[#74777E] hover:text-white transition-colors"
            >
              <Map className="size-3.5 text-[#1D7DD7]" />
              <span>Campus Map View</span>
            </Link>

            {/* User Avatar Badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-[#507495]/20">
              <div className="flex size-8 items-center justify-center rounded-full bg-[#1D7DD7]/20 border border-[#1D7DD7]/40 text-[#1D7DD7] text-xs font-black">
                {userName.charAt(0)}
              </div>
              <span className="hidden sm:inline text-xs font-black text-white capitalize">
                {userRole}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content (pb-24 on mobile for bottom dock clearance) */}
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

          <div className="fixed inset-y-0 left-0 w-72 bg-[#141E28] border-r border-[#507495]/30 p-5 flex flex-col justify-between shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5"
                >
                  <div className="flex size-9 items-center justify-center rounded-xl bg-[#1D7DD7] text-white shadow-md shadow-[#1D7DD7]/30">
                    <Compass className="size-5" />
                  </div>
                  <span className="text-base font-black text-white">CHRONONAV</span>
                </Link>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-[#74777E] hover:text-white"
                  aria-label="Close navigation"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Mobile Profile Card */}
              <div className="rounded-2xl border border-[#507495]/20 bg-[#0E151B] p-3 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-[#1D7DD7]/20 text-[#1D7DD7] font-black">
                  {userName.charAt(0)}
                </div>
                <div className="overflow-hidden flex-1">
                  <p className="text-xs font-bold text-white truncate">{userName}</p>
                  <span
                    className={`inline-block rounded-md border px-1.5 py-0.2 text-[9px] font-black uppercase ${getRoleBadgeStyle(
                      userRole
                    )}`}
                  >
                    {userRole}
                  </span>
                </div>
              </div>

              {/* Mobile Drawer Navigation Links */}
              <nav className="space-y-1.5">
                {filteredNavItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href));
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-extrabold transition-all ${
                        isActive
                          ? "bg-[#1D7DD7] text-white shadow-md shadow-[#1D7DD7]/30"
                          : "text-[#74777E] hover:bg-[#0E151B] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="size-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && !isActive && (
                        <span className="text-[9px] font-black bg-[#0E151B] border border-[#507495]/30 text-[#1D7DD7] px-1.5 py-0.5 rounded-md">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#507495]/20">
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-xs font-black text-rose-400 hover:bg-destructive/20"
              >
                <LogOut className="size-4" />
                <span>Sign Out Session</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Fixed Mobile Bottom Navigation Dock (<1024px / lg:hidden) ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-[#507495]/25 bg-[#141E28]/95 backdrop-blur-lg lg:hidden px-2 shadow-2xl"
        aria-label="Mobile Bottom Navigation Dock"
      >
        {mobileDockItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-1 text-[10px] font-black transition-all ${
                isActive
                  ? "text-[#1D7DD7] scale-105"
                  : "text-[#74777E] hover:text-white"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <div
                className={`flex size-8 items-center justify-center rounded-xl transition-colors ${
                  isActive ? "bg-[#1D7DD7]/20 border border-[#1D7DD7]/50" : ""
                }`}
              >
                <Icon className="size-4.5" />
              </div>
              <span className="truncate max-w-[65px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
