"use client";

import React, { useState } from "react";
import { Header } from "@/components/shared/header";
import { Sidebar, MobileBottomNav } from "@/components/shared/sidebar";

/**
 * Dashboard Layout wrapper for all authenticated dashboard pages.
 * Renders a shared sidebar (desktop) + mobile bottom nav + header.
 * Child pages are rendered inside the main content area with bottom padding
 * on mobile to account for the fixed bottom nav bar.
 *
 * TODO: Replace hardcoded role with actual user role from Supabase auth session.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // TODO: Detect role from auth session. Hardcoded to "admin" for now
  // since only admin dashboard exists. Will switch dynamically once
  // auth is connected.
  const role = "admin" as const;

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Sidebar — static on desktop, drawer on mobile */}
      <Sidebar
        role={role}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Shared header with hamburger toggle for mobile sidebar */}
        <Header
          title="ChronoNav"
          onMenuToggle={() => setSidebarOpen(true)}
          showSearch={true}
        />

        {/* Page content — pb-20 on mobile for bottom nav clearance */}
        <main className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile bottom tab bar — md:hidden */}
      <MobileBottomNav role={role} />
    </div>
  );
}
