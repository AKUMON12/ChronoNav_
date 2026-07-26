"use client";

import React from "react";
import {
  Users,
  Settings,
  Building2,
  HelpCircle,
  ListOrdered,
  Calendar,
  Megaphone,
  Rocket,
  Wrench,
  FileText,
} from "lucide-react";

/**
 * Admin Dashboard Page — main content area.
 * The sidebar, header, and bottom nav are handled by the (dashboard)/layout.tsx wrapper.
 * This page focuses purely on dashboard content: metrics, charts, and quick links.
 */
export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Welcome Banner */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Welcome, System Administrator
        </h1>
        <p className="text-sm text-muted-foreground">
          Central hub for managing campus rooms, users, schedules, and analytics.
        </p>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-2.5">
        <button className="rounded-lg border border-border bg-card px-4 py-2 text-xs sm:text-sm font-semibold text-foreground hover:bg-accent transition-colors">
          View App Intro Video
        </button>
        <button className="rounded-lg border border-border bg-card px-4 py-2 text-xs sm:text-sm font-semibold text-foreground hover:bg-accent transition-colors">
          View App Tour
        </button>
        <button className="rounded-lg border border-border bg-card px-4 py-2 text-xs sm:text-sm font-semibold text-foreground hover:bg-accent transition-colors">
          Restart Onboarding
        </button>
      </div>

      {/* Key Metrics Cards */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-foreground">Key Metrics / Status</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <MetricCard title="Total Users" value="1,234" change="+10%" positive />
          <MetricCard title="Active Tickets" value="56" change="-5%" positive={false} />
          <MetricCard title="Total Feedback" value="789" change="+15%" positive />
          <MetricCard title="Total Rooms" value="300" change="+8%" positive />
          <MetricCard title="Announcements" value="123" change="+5%" positive />
        </div>
      </section>

      {/* Charts and Visual Metrics */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-foreground">Charts and Visual Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <ChartCard
            title="Overall System Metrics"
            value="100%"
            change="+5%"
            positive
            months={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]}
            heights={[70, 100, 70, 5, 70, 60, 40]}
          />
          <ChartCard
            title="Activity Metrics"
            value="75%"
            change="-2%"
            positive={false}
            months={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]}
            heights={[50, 10, 10, 80, 50, 50, 30]}
          />
          <ChartCard
            title="User Role Distribution"
            value="50%"
            change="+3%"
            positive
            months={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]}
            heights={[80, 70, 30, 70, 20, 10, 30]}
          />
        </div>
      </section>

      {/* Quick Admin Navigation */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-foreground">Quick Admin Navigation</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AdminLinkCard icon={Users} title="User Management Panel" />
          <AdminLinkCard icon={Settings} title="Class Offerings & Assignments" />
          <AdminLinkCard icon={Building2} title="Office Hours Requests" />
          <AdminLinkCard icon={Building2} title="Building Room Manager" />
          <AdminLinkCard icon={HelpCircle} title="Campus Announcement Board" />
          <AdminLinkCard icon={ListOrdered} title="Academic Calendar Viewer" />
          <AdminLinkCard icon={ListOrdered} title="System Logs and Activities" />
          <AdminLinkCard icon={Calendar} title="Help & Support Center" />
          <AdminLinkCard icon={FileText} title="Manage FAQs" />
          <AdminLinkCard icon={Megaphone} title="Feedback List" />
        </div>
      </section>

      {/* System Maintenance Status */}
      <section className="space-y-3">
        <h3 className="text-lg font-bold text-foreground">System Maintenance Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AdminLinkCard icon={Rocket} title="Future Release Pipeline" />
          <AdminLinkCard icon={Wrench} title="Maintenance Check Status" />
          <AdminLinkCard icon={Users} title="User Role Permissions" />
        </div>
      </section>
    </div>
  );
}

/* ── Metric Card Component ── */
function MetricCard({ title, value, change, positive }: { title: string; value: string; change: string; positive: boolean }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl border border-border bg-card p-4 sm:p-5 shadow-sm">
      <p className="text-xs font-medium text-muted-foreground">{title}</p>
      <p className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">{value}</p>
      <p className={`text-xs font-semibold ${positive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
        {change}
      </p>
    </div>
  );
}

/* ── Chart Card Component ── */
function ChartCard({ title, value, change, positive, months, heights }: {
  title: string; value: string; change: string; positive: boolean; months: string[]; heights: number[];
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 sm:p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{value}</p>
        <div className="flex items-center gap-1.5 pt-1">
          <span className="text-xs text-muted-foreground">Last 30 Days</span>
          <span className={`text-xs font-semibold ${positive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
            {change}
          </span>
        </div>
      </div>
      {/* Bar chart */}
      <div className="flex items-end gap-2 sm:gap-3 min-h-[140px] sm:min-h-[160px] pt-4">
        {months.map((m, i) => (
          <div key={m} className="flex flex-1 flex-col items-center gap-1.5">
            <div
              className="w-full rounded-t bg-primary/20 transition-all"
              style={{ height: `${heights[i]}%`, minHeight: "4px" }}
            />
            <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground">{m}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Admin Link Card Component ── */
function AdminLinkCard({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:bg-accent/50 cursor-pointer transition-colors">
      <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
        <Icon className="size-5" />
      </div>
      <h4 className="text-sm font-semibold text-foreground leading-tight">{title}</h4>
    </div>
  );
}
