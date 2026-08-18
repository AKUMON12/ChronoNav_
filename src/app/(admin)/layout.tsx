"use client";

import React from "react";
import { AppShell } from "@/components/layout/app-shell";

/**
 * Admin Layout Wrapper
 * Renders the persistent AppShell with admin role privileges.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell forcedRole="admin">{children}</AppShell>;
}
