"use client";

import React from "react";
import Link from "next/link";
import { 
  Users, 
  Navigation, 
  ScanLine, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Activity, 
  Database, 
  Zap, 
  CheckCircle2, 
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Megaphone,
  FileText
} from "lucide-react";

export default function AdminAnalyticsDashboard() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
            <ShieldCheck className="size-8 text-[#1D7DD7]" />
            <span>Admin Analytics Dashboard</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            System oversight, real-time indoor navigation analytics, and OCR engine metrics for UC Main Campus (CCS).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Systems Normal</span>
          </span>
        </div>
      </div>

      {/* METRIC OVERVIEW CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">TOTAL REGISTERED USERS</span>
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#1D7DD7]/10 text-[#1D7DD7]">
              <Users className="size-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-foreground">1,482</div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground mt-1">
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center">
                <ArrowUpRight className="size-3.5" /> +14%
              </span>
              <span>(1,240 Students • 242 Faculty)</span>
            </div>
          </div>
        </div>

        {/* Navigation Queries */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">DAILY NAVIGATION QUERIES</span>
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#1D7DD7]/10 text-[#1D7DD7]">
              <Navigation className="size-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-foreground">3,840</div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground mt-1">
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center">
                <ArrowUpRight className="size-3.5" /> +18.4%
              </span>
              <span>vs yesterday</span>
            </div>
          </div>
        </div>

        {/* OCR Success Rate */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">OCR SUCCESS RATE</span>
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <ScanLine className="size-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-foreground">96.8%</div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground mt-1">
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">482 / 498</span>
              <span>study loads parsed</span>
            </div>
          </div>
        </div>

        {/* System Log Alerts */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">SYSTEM LOG ALERTS</span>
            <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <AlertTriangle className="size-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-amber-500">3 Alerts</div>
            <div className="text-[11px] font-bold text-muted-foreground mt-1">
              1 Network Retry • 2 Minor Warnings
            </div>
          </div>
        </div>
      </section>

      {/* VISUAL ANALYTICS WIDGETS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Peak Navigation Hours Chart */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4 lg:col-span-8 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-foreground uppercase tracking-wide flex items-center gap-2">
                <Clock className="size-4 text-[#1D7DD7]" />
                <span>Peak Campus Navigation Hours</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Hourly foot traffic trends across CCS Building floors (8:00 AM - 6:00 PM)
              </p>
            </div>
            <span className="text-[10px] font-bold text-[#1D7DD7] bg-[#1D7DD7]/10 border border-[#1D7DD7]/30 px-2.5 py-1 rounded-lg">
              Live Real-Time
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-6">
            <div className="flex items-end justify-between gap-2 h-44 border-b border-border pb-2 px-2">
              {[
                { hour: "8 AM", traffic: 85 },
                { hour: "9 AM", traffic: 65 },
                { hour: "10 AM", traffic: 100 }, // Peak
                { hour: "11 AM", traffic: 70 },
                { hour: "12 PM", traffic: 50 },
                { hour: "1 PM", traffic: 75 },
                { hour: "2 PM", traffic: 95 }, // Peak
                { hour: "3 PM", traffic: 60 },
                { hour: "4 PM", traffic: 40 },
                { hour: "5 PM", traffic: 25 },
              ].map((bar) => (
                <div key={bar.hour} className="flex flex-col items-center gap-2 flex-1 group">
                  <span className="text-[9px] font-extrabold text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    {bar.traffic * 12}
                  </span>
                  <div
                    className={`w-full rounded-t-xl transition-all duration-300 ${
                      bar.traffic >= 90 
                        ? "bg-[#1D7DD7] shadow-md shadow-[#1D7DD7]/40" 
                        : "bg-muted hover:bg-[#1D7DD7]/60"
                    }`}
                    style={{ height: `${bar.traffic}%` }}
                  />
                  <span className="text-[10px] font-bold text-muted-foreground">{bar.hour}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Most Visited Rooms Leaderboard */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4 lg:col-span-4">
          <h3 className="text-sm font-black text-foreground uppercase tracking-wide flex items-center gap-2">
            <MapPin className="size-4 text-[#1D7DD7]" />
            <span>Top Visited Locations</span>
          </h3>

          <div className="space-y-3">
            {[
              { room: "Mac Lab 101", floor: "Floor 1", visits: "842 visits", pct: 85 },
              { room: "CCS Dean's Office Suite", floor: "Floor 3", visits: "620 visits", pct: 68 },
              { room: "Multipurpose AV Hall 401", floor: "Floor 4", visits: "410 visits", pct: 45 },
              { room: "CCS Canteen", floor: "Floor 1", visits: "315 visits", pct: 35 },
              { room: "Programming Lab 201", floor: "Floor 2", visits: "280 visits", pct: 30 },
            ].map((item, idx) => (
              <div key={item.room} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-foreground truncate">{idx + 1}. {item.room}</span>
                  <span className="font-extrabold text-[#1D7DD7] shrink-0">{item.visits}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-[#1D7DD7] rounded-full"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SYSTEM HEALTH INDICATORS & QUICK NAVIGATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* System Health Status */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4 lg:col-span-5">
          <h3 className="text-sm font-black text-foreground uppercase tracking-wide flex items-center gap-2">
            <Activity className="size-4 text-emerald-500" />
            <span>System Health Indicators</span>
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30">
              <div className="flex items-center gap-2.5">
                <Database className="size-4 text-[#1D7DD7]" />
                <span className="text-xs font-bold text-foreground">Supabase Database Latency</span>
              </div>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">14 ms</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30">
              <div className="flex items-center gap-2.5">
                <Zap className="size-4 text-amber-500" />
                <span className="text-xs font-bold text-foreground">API Response Time</span>
              </div>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">42 ms</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span className="text-xs font-bold text-foreground">Service Uptime</span>
              </div>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">99.98%</span>
            </div>
          </div>
        </div>

        {/* Quick Admin Modules Grid */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4 lg:col-span-7">
          <h3 className="text-sm font-black text-foreground uppercase tracking-wide">
            Admin Management Quick Suite
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              href="/admin/users"
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-background p-4 text-center hover:border-[#1D7DD7] hover:bg-[#1D7DD7]/5 transition-all"
            >
              <Users className="size-6 text-[#1D7DD7]" />
              <span className="text-xs font-bold text-foreground">User Management</span>
            </Link>

            <Link
              href="/admin/rooms"
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-background p-4 text-center hover:border-[#1D7DD7] hover:bg-[#1D7DD7]/5 transition-all"
            >
              <Building2 className="size-6 text-[#1D7DD7]" />
              <span className="text-xs font-bold text-foreground">Room Manager</span>
            </Link>

            <Link
              href="/admin/logs"
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-background p-4 text-center hover:border-[#1D7DD7] hover:bg-[#1D7DD7]/5 transition-all"
            >
              <FileText className="size-6 text-[#1D7DD7]" />
              <span className="text-xs font-bold text-foreground">System Logs</span>
            </Link>

            <Link
              href="/admin/bulletin"
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-background p-4 text-center hover:border-[#1D7DD7] hover:bg-[#1D7DD7]/5 transition-all"
            >
              <Megaphone className="size-6 text-[#1D7DD7]" />
              <span className="text-xs font-bold text-foreground">Bulletin Board</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
