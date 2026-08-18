"use client";

import React from "react";
import { AppShell } from "@/components/layout/app-shell";

/**
 * Dashboard Layout Wrapper
 * Uses the role-aware AppShell to provide persistent desktop sidebar,
 * mobile bottom navigation dock, and header controls.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
