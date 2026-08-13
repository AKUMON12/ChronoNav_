"use client";

import React, { useState } from "react";
import { Header } from "@/components/shared/header";
import { Sidebar, MobileBottomNav } from "@/components/shared/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const role = "admin" as const;

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Shared Sidebar */}
      <Sidebar
        role={role}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        <Header
          title="ChronoNav Admin Portal"
          onMenuToggle={() => setSidebarOpen(true)}
          showSearch={true}
        />

        <main className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <MobileBottomNav role={role} />
    </div>
  );
}
