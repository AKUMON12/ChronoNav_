"use client";

import React from "react";
import { AppShell } from "@/components/layout/app-shell";

export default function FacultyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell forcedRole="faculty">{children}</AppShell>;
}
