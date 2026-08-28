"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  Clock,
  MapPin,
  Calendar,
  BookOpen,
  ArrowRight,
  ScanLine,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Navigation,
  Sparkles,
  Info,
  Footprints,
  Layers,
  GraduationCap,
} from "lucide-react";
import { ClassScheduleItem } from "@/types/schedule";
import { getGraphNodeForRoom } from "@/lib/navigation/pathfinding";
import { getCurrentUser } from "@/lib/supabase/auth";
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";

/** Enrolled Today's Classes for Student Dashboard */
const todayClasses: (ClassScheduleItem & { status: "completed" | "in_progress" | "upcoming" })[] = [
  {
    id: "cls-1",
    courseCode: "CS 301",
    courseTitle: "Data Structures and Algorithms",
    instructor: "Dr. Maria Santos",
    building: "CCS Building",
    room: "CCS 538",
    dayOfWeek: "Mon",
    startTime: "08:00 AM",
    endTime: "10:30 AM",
    status: "in_progress",
  },
  {
    id: "cls-2",
    courseCode: "CS 302",
    courseTitle: "Operating Systems & Architecture",
    instructor: "Engr. Pedro Cruz",
    building: "CCS Building",
    room: "Mac Lab 101",
    dayOfWeek: "Mon",
    startTime: "10:30 AM",
    endTime: "12:00 PM",
    status: "upcoming",
  },
  {
    id: "cls-3",
    courseCode: "IT-NETWORKING31",
    courseTitle: "Cisco Enterprise Networking",
    instructor: "Prof. Ana Reyes",
    building: "CCS Building",
    room: "CCS 301",
    dayOfWeek: "Mon",
    startTime: "01:00 PM",
    endTime: "03:30 PM",
    status: "upcoming",
  },
];

/** Campus Bulletin Announcements */
const campusBulletins = [
  {
    id: "bul-1",
    title: "1st Semester Midterm Exam Room Assignments",
    type: "info",
    message: "Room assignments for all CCS computing departments are now posted on bulletin boards.",
    time: "2 hours ago",
    badge: "Official Notice",
  },
  {
    id: "bul-2",
    title: "5th Floor Elevator Scheduled Maintenance",
    type: "warning",
    message: "Elevator 2 servicing floors 4-5 will be offline today from 4:00 PM to 6:00 PM.",
    time: "4 hours ago",
    badge: "Facility Notice",
  },
  {
    id: "bul-3",
    title: "Mac Lab 101 Workstation Upgrade",
    type: "success",
    message: "New Xcode 16 developer environments are now available on all 45 Mac workstations.",
    time: "Yesterday",
    badge: "Lab Update",
  },
];

export default function StudentDashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("Student");
  const [userProgram, setUserProgram] = useState<string>("BSIT");
  const [countdownMinutes, setCountdownMinutes] = useState<number>(24);
  const [classList, setClassList] = useState<ClassScheduleItem[]>(todayClasses);

  useEffect(() => {
    setMounted(true);
    async function loadUser() {
      const user = await getCurrentUser();
      if (user?.user_metadata?.first_name) {
        setUserName(user.user_metadata.first_name);
      }
      if (user?.user_metadata?.program) {
        setUserProgram(user.user_metadata.program);
      }
    }
    loadUser();

    // Check localStorage for registered study load schedule
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("chrononav_student_schedule");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setClassList(parsed);
          }
        }
      } catch (err) {
        console.error("Error reading stored student schedule", err);
      }
    }

    // Subtle countdown timer simulation
    const interval = setInterval(() => {
      setCountdownMinutes((prev) => (prev > 1 ? prev - 1 : 24));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const upcomingClass = classList[0] || todayClasses[0];
  const targetNodeId = getGraphNodeForRoom(upcomingClass.room);

  const handleNavigate = (roomCode: string) => {
    const target = getGraphNodeForRoom(roomCode);
    router.push(`/map?start=F1_ENTRANCE&target=${target}`);
  };

  if (!mounted) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full transition-colors duration-200">
      {/* ── Welcome Header & Academic Program Banner ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground">
              Welcome back, {userName} 👋
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5 text-primary font-bold">
              <GraduationCap className="size-4" />
              <span>University of Cebu • College of Computer Studies</span>
            </span>
            <span>•</span>
            <span className="font-semibold text-foreground">BS Computer Science (Year 3)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/schedule"
            className="flex items-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-xs sm:text-sm font-extrabold text-white hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all"
          >
            <Calendar className="size-4" />
            <span>Class Timetable</span>
          </Link>
        </div>
      </div>

      {/* ── Hero Upcoming Class Card with Live Routing Countdown ── */}
      <section className="relative overflow-hidden rounded-3xl border border-primary/40 bg-card p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 size-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-4">
            {/* Live Countdown Badge */}
            <div className="inline-flex items-center gap-2 rounded-xl bg-primary/15 border border-primary/40 px-3.5 py-1.5 text-xs font-black text-primary">
              <span className="size-2 rounded-full bg-primary animate-ping" />
              <span>LIVE ACTIVE SESSION • STARTS IN {countdownMinutes} MINS</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                {upcomingClass.courseCode}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                {upcomingClass.courseTitle}
              </h2>
            </div>

            {/* Class Metadata Badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <Clock className="size-4 text-primary" />
                <span>
                  {upcomingClass.startTime} – {upcomingClass.endTime}
                </span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5 font-bold text-primary">
                <MapPin className="size-4" />
                <span>
                  {upcomingClass.building} — {upcomingClass.room} (5th Floor)
                </span>
              </div>
              <span>•</span>
              <div className="text-muted-foreground">Instructor: {upcomingClass.instructor}</div>
            </div>
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavigate(upcomingClass.room)}
              className="flex items-center justify-center gap-2.5 rounded-2xl bg-primary hover:bg-primary/90 text-white px-6 py-4 text-sm font-black shadow-xl shadow-primary/30 hover:scale-[1.02] transition-all"
            >
              <Compass className="size-5" />
              <span>Navigate to Room</span>
              <ArrowRight className="size-4" />
            </button>

            <Link
              href="/schedule"
              className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-muted/40 hover:bg-accent px-4 py-4 text-xs font-bold text-foreground transition-colors"
            >
              <Calendar className="size-4" />
              <span>Full Schedule</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Quick Action Grid ── */}
      <section className="space-y-3">
        <h3 className="text-xs font-black text-muted-foreground uppercase tracking-wider">
          QUICK ACTIONS
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <Link
            href="/map"
            className="flex flex-col items-center justify-center p-4 rounded-3xl border border-border bg-card hover:border-primary hover:scale-[1.02] transition-all shadow-sm group text-center space-y-2"
          >
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary group-hover:scale-110 transition-transform">
              <Compass className="size-6" />
            </div>
            <span className="text-xs font-extrabold text-foreground">Interactive Map</span>
            <span className="text-[10px] text-muted-foreground">8 Floors Navigation</span>
          </Link>

          <Link
            href="/schedule"
            className="flex flex-col items-center justify-center p-4 rounded-3xl border border-border bg-card hover:border-primary hover:scale-[1.02] transition-all shadow-sm group text-center space-y-2"
          >
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary group-hover:scale-110 transition-transform">
              <Calendar className="size-6" />
            </div>
            <span className="text-xs font-extrabold text-foreground">Academic Calendar</span>
            <span className="text-[10px] text-muted-foreground">Events & Holidays</span>
          </Link>

          <Link
            href="/schedule"
            className="flex flex-col items-center justify-center p-4 rounded-3xl border border-border bg-card hover:border-primary hover:scale-[1.02] transition-all shadow-sm group text-center space-y-2"
          >
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary group-hover:scale-110 transition-transform">
              <Calendar className="size-6" />
            </div>
            <span className="text-xs font-extrabold text-foreground">Weekly Matrix</span>
            <span className="text-[10px] text-muted-foreground">Class Timetable</span>
          </Link>

          <Link
            href="/settings"
            className="flex flex-col items-center justify-center p-4 rounded-3xl border border-border bg-card hover:border-primary hover:scale-[1.02] transition-all shadow-sm group text-center space-y-2"
          >
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/15 text-primary group-hover:scale-110 transition-transform">
              <Sparkles className="size-6" />
            </div>
            <span className="text-xs font-extrabold text-foreground">Audio & Theme</span>
            <span className="text-[10px] text-muted-foreground">App Preferences</span>
          </Link>
        </div>
      </section>

      {/* ── Two Column Layout: Today's Schedule Timeline & Campus Bulletins ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Today's Class Timeline */}
        <section className="space-y-4 lg:col-span-8">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-foreground flex items-center gap-2">
              <BookOpen className="size-5 text-primary" />
              <span>Today&apos;s Class Schedule</span>
            </h3>
            <Link
              href="/schedule"
              className="text-xs font-extrabold text-primary hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {classList.slice(0, 4).map((item, idx) => (
              <div
                key={item.id || idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border bg-card p-5 hover:border-primary/40 shadow-sm transition-all group"
              >
                <div className="flex items-start gap-4">
                  {/* Time Badge */}
                  <div className="flex flex-col items-center justify-center rounded-2xl bg-muted/40 border border-border px-3.5 py-2.5 text-center min-w-[90px] shrink-0">
                    <span className="text-xs font-black text-foreground">{item.startTime}</span>
                    <span className="text-[10px] font-bold text-muted-foreground">to</span>
                    <span className="text-[11px] font-bold text-muted-foreground">{item.endTime}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                        {item.courseCode}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                          idx === 0
                            ? "bg-emerald-500/15 text-emerald-500"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {idx === 0 ? "In Progress" : "Upcoming"}
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-foreground">{item.courseTitle}</h4>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-bold text-foreground">
                        <MapPin className="size-3.5 text-primary" />
                        <span>
                          {item.building} — {item.room}
                        </span>
                      </span>
                      <span>•</span>
                      <span>{item.instructor}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleNavigate(item.room)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white px-4 py-2.5 text-xs font-black transition-all shrink-0 group/btn"
                >
                  <Compass className="size-4" />
                  <span>Get Route</span>
                  <ArrowRight className="size-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Right Column: Campus Bulletins & Facility Notices */}
        <section className="space-y-4 lg:col-span-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-foreground flex items-center gap-2">
              <Bell className="size-5 text-primary" />
              <span>Campus Bulletins</span>
            </h3>
            <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-md">
              Live Updates
            </span>
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 space-y-4 shadow-sm">
            {campusBulletins.map((bulletin) => (
              <div
                key={bulletin.id}
                className="space-y-2 pb-4 border-b border-border last:border-b-0 last:pb-0"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                      bulletin.type === "warning"
                        ? "bg-amber-500/15 text-amber-500"
                        : bulletin.type === "success"
                        ? "bg-emerald-500/15 text-emerald-500"
                        : "bg-primary/15 text-primary"
                    }`}
                  >
                    {bulletin.badge}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-semibold">
                    {bulletin.time}
                  </span>
                </div>

                <h4 className="text-xs font-extrabold text-foreground leading-snug">
                  {bulletin.title}
                </h4>

                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {bulletin.message}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
