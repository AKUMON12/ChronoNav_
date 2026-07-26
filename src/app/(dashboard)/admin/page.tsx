"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Home, 
  User as UserIcon, 
  BarChart3, 
  FileText, 
  Settings, 
  Search, 
  Bell, 
  Users, 
  Building2, 
  HelpCircle, 
  ListOrdered, 
  Calendar, 
  Megaphone,
  Rocket,
  Wrench,
  Sun,
  Moon,
  Menu,
  X
} from "lucide-react";
import { useTheme } from "next-themes";

export default function AdminDashboardPage() {
  const { theme, setTheme } = useTheme();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card p-4 transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-2 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
              CN
            </div>
            <h1 className="text-lg font-bold text-foreground">ChronoNav</h1>
          </div>
          <button 
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden text-muted-foreground hover:text-foreground"
            aria-label="Close sidebar"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col justify-between py-4" aria-label="Admin Navigation">
          <div className="space-y-1">
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2.5 text-sm font-semibold text-primary"
            >
              <Home className="size-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <UserIcon className="size-5" />
              <span>Profile</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <BarChart3 className="size-5" />
              <span>Reports</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <FileText className="size-5" />
              <span>Report Generator</span>
            </Link>
          </div>

          <div className="space-y-1 border-t border-border pt-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
              <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
            </button>
            <Link
              href="#"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <Settings className="size-5" />
              <span>Settings</span>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content View */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Header Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 md:hidden text-foreground hover:bg-accent rounded-lg"
              aria-label="Open sidebar"
            >
              <Menu className="size-6" />
            </button>
            <h2 className="text-lg font-bold tracking-tight text-foreground">Admin Portal</h2>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative hidden sm:block w-48 lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-lg border border-input bg-card py-1.5 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button className="flex size-9 items-center justify-center rounded-lg border border-input bg-card text-foreground hover:bg-accent transition-colors">
              <Bell className="size-4" />
            </button>
            <div className="size-9 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-xs">
              AD
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <main className="flex-1 space-y-6 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          {/* Welcome Banner */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Welcome, System Administrator</h1>
            <p className="text-muted-foreground text-sm">Central hub for managing campus rooms, users, schedules, and analytics.</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <MetricCard title="Total Users" value="1,234" change="+10%" positive={true} />
              <MetricCard title="Active Tickets" value="56" change="-5%" positive={false} />
              <MetricCard title="Total Feedback" value="789" change="+15%" positive={true} />
              <MetricCard title="Total Rooms" value="300" change="+8%" positive={true} />
              <MetricCard title="Announcements" value="123" change="+5%" positive={true} />
            </div>
          </section>

          {/* Visual Metrics / Charts Section */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-foreground">Charts and Visual Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ChartCard title="Overall System Metrics" value="100%" change="+5%" months={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]} heights={[70, 100, 70, 0, 70, 60, 40]} />
              <ChartCard title="Activity Metrics" value="75%" change="-2%" positive={false} months={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]} heights={[50, 10, 10, 80, 50, 50, 30]} />
              <ChartCard title="User Role Distribution" value="50%" change="+3%" months={["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]} heights={[80, 70, 30, 70, 20, 10, 30]} />
            </div>
          </section>

          {/* Quick Admin Links Grid */}
          <section className="space-y-3">
            <h3 className="text-lg font-bold text-foreground">Quick Admin Navigation</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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

          {/* Status / Maintenance Cards */}
          <section className="space-y-3 pt-2">
            <h3 className="text-lg font-bold text-foreground">System Maintenance Status</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <AdminLinkCard icon={Rocket} title="Future Release Pipeline" />
              <AdminLinkCard icon={Wrench} title="Maintenance Check Status" />
              <AdminLinkCard icon={Users} title="User Role Permissions" />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function MetricCard({ title, value, change, positive = true }: { title: string; value: string; change: string; positive?: boolean }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border bg-card p-5 shadow-sm">
      <p className="text-xs font-medium text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
      <p className={`text-xs font-semibold ${positive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
        {change}
      </p>
    </div>
  );
}

function ChartCard({ title, value, change, positive = true, months, heights }: { title: string; value: string; change: string; positive?: boolean; months: string[]; heights: number[] }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
        <div className="flex items-center gap-1.5 pt-1">
          <span className="text-xs text-muted-foreground">Last 30 Days</span>
          <span className={`text-xs font-semibold ${positive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>{change}</span>
        </div>
      </div>
      <div className="grid min-h-[160px] grid-flow-col gap-3 items-end justify-items-center pt-4">
        {months.map((m, i) => (
          <div key={m} className="flex flex-col items-center gap-2 w-full">
            <div className="w-full bg-primary/20 rounded-t-sm transition-all" style={{ height: `${heights[i]}%`, minHeight: "4px" }} />
            <span className="text-[11px] font-bold text-muted-foreground">{m}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminLinkCard({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 hover:bg-accent/50 cursor-pointer transition-colors">
      <div className="p-2 rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>
      <h4 className="text-sm font-semibold text-foreground leading-tight">{title}</h4>
    </div>
  );
}
