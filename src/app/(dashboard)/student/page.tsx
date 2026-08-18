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

/** Enrolled Today's Classes for Student Dashboard */
const todayClasses: (ClassScheduleItem & { status: "completed" | "in_progress" | "upcoming" })[] = [
  {
    id: "cls-1",
    courseCode: "CS 301",
    courseTitle: "Data Structures and Algorithms",
    instructor: "Dr. Maria Santos",
    building: "CCS Building",
    room: "CCS 538",
    dayOfWeek: "Today",
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
    dayOfWeek: "Today",
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
    dayOfWeek: "Today",
    startTime: "01:30 PM",
    endTime: "03:30 PM",
    status: "upcoming",
  },
  {
    id: "cls-4",
    courseCode: "IT-CPSTONE41",
    courseTitle: "Capstone Project and Research 1",
    instructor: "Dr. Ramon Garcia",
    building: "CCS Building",
    room: "AV Hall 401",
    dayOfWeek: "Today",
    startTime: "04:00 PM",
    endTime: "06:00 PM",
    status: "upcoming",
  },
];

/** Campus Bulletins & Facility Notices */
const campusBulletins = [
  {
    id: "b-1",
    title: "CCS 5th Floor Elevator Maintenance",
    type: "warning",
    message: "Elevator 2 is undergoing routine maintenance today (1:00 PM - 3:00 PM). Please use the Central Staircase.",
    time: "35 mins ago",
    badge: "Facility Notice",
  },
  {
    id: "b-2",
    title: "Midterm Exam Room Assignments Released",
    type: "info",
    message: "Rooms for BSCS 3rd Year Midterm Examinations have been updated. Review your schedule for changes.",
    time: "2 hours ago",
    badge: "Academic",
  },
  {
    id: "b-3",
    title: "Mac Lab 101 Workstation Upgrade",
    type: "success",
    message: "New Xcode 16 developer environments are now available on all 45 Mac workstations.",
    time: "Yesterday",
    badge: "Lab Update",
  },
];

export default function StudentDashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("Tristan");
  const [countdownMinutes, setCountdownMinutes] = useState<number>(24);

  useEffect(() => {
    async function loadUser() {
      const user = await getCurrentUser();
      if (user?.user_metadata?.first_name) {
        setUserName(user.user_metadata.first_name);
      }
    }
    loadUser();

    // Subtle countdown timer simulation
    const interval = setInterval(() => {
      setCountdownMinutes((prev) => (prev > 1 ? prev - 1 : 24));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const upcomingClass = todayClasses[0];
  const targetNodeId = getGraphNodeForRoom(upcomingClass.room);

  const handleNavigate = (roomCode: string) => {
    const target = getGraphNodeForRoom(roomCode);
    router.push(`/map?start=F1_ENTRANCE&target=${target}`);
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* ── Welcome Header & Academic Program Banner ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#507495]/20 pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Welcome back, {userName} 👋
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-[#74777E]">
            <span className="flex items-center gap-1.5 text-[#1D7DD7] font-bold">
              <GraduationCap className="size-4" />
              <span>University of Cebu • College of Computer Studies</span>
            </span>
            <span>•</span>
            <span className="font-semibold text-slate-300">BS Computer Science (Year 3)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/schedule?ocr=open"
            className="flex items-center gap-2 rounded-2xl bg-[#1D7DD7] px-4 py-2.5 text-xs sm:text-sm font-extrabold text-white hover:bg-[#1D7DD7]/90 shadow-lg shadow-[#1D7DD7]/30 transition-all"
          >
            <ScanLine className="size-4" />
            <span>Scan Study Load</span>
          </Link>
        </div>
      </div>

      {/* ── Hero Upcoming Class Card with Live Routing Countdown ── */}
      <section className="relative overflow-hidden rounded-3xl border border-[#1D7DD7]/40 bg-gradient-to-br from-[#141E28] via-[#141E28] to-[#0E151B] p-6 sm:p-8 shadow-2xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 size-64 rounded-full bg-[#1D7DD7]/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-4">
            {/* Live Countdown Badge */}
            <div className="inline-flex items-center gap-2 rounded-xl bg-[#1D7DD7]/20 border border-[#1D7DD7]/50 px-3.5 py-1.5 text-xs font-black text-[#1D7DD7]">
              <span className="size-2 rounded-full bg-[#1D7DD7] animate-ping" />
              <span>LIVE ACTIVE SESSION • STARTS IN {countdownMinutes} MINS</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black bg-[#1D7DD7] text-white px-2 py-0.5 rounded-md">
                  {upcomingClass.courseCode}
                </span>
                <span className="text-xs font-bold text-[#74777E]">Lecture & Laboratory</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">
                {upcomingClass.courseTitle}
              </h2>
            </div>

            {/* Class Metadata Badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#74777E]">
              <div className="flex items-center gap-1.5 font-bold text-slate-200">
                <Clock className="size-4 text-[#1D7DD7]" />
                <span>{upcomingClass.startTime} – {upcomingClass.endTime}</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-[#1D7DD7]">
                <MapPin className="size-4" />
                <span>{upcomingClass.building} — {upcomingClass.room} (5th Floor)</span>
              </div>
              <div className="font-medium text-[#74777E]">
                Instructor: <span className="text-slate-300 font-semibold">{upcomingClass.instructor}</span>
              </div>
            </div>
          </div>

          {/* Direct Navigate Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              href={`/map?start=F1_ENTRANCE&target=${targetNodeId}`}
              className="flex items-center justify-center gap-2.5 rounded-2xl bg-[#1D7DD7] px-6 py-4 text-sm font-black text-white hover:bg-[#1D7DD7]/90 shadow-xl shadow-[#1D7DD7]/35 hover:scale-[1.02] transition-all"
            >
              <Navigation className="size-5" />
              <span>Navigate to Room</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Quick Actions Grid ── */}
      <section className="space-y-3">
        <h3 className="text-xs font-black text-[#74777E] uppercase tracking-wider">
          FAST SHORTCUTS
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <Link
            href="/schedule"
            className="flex flex-col items-center gap-2 rounded-2xl border border-[#507495]/20 bg-[#141E28] p-4 text-center hover:border-[#1D7DD7] hover:bg-[#1D7DD7]/5 transition-all group"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#1D7DD7]/15 text-[#1D7DD7] group-hover:scale-110 transition-transform">
              <Calendar className="size-5" />
            </div>
            <span className="text-xs font-bold text-white">Full Schedule</span>
          </Link>

          <Link
            href="/map"
            className="flex flex-col items-center gap-2 rounded-2xl border border-[#507495]/20 bg-[#141E28] p-4 text-center hover:border-[#1D7DD7] hover:bg-[#1D7DD7]/5 transition-all group"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-[#1D7DD7]/15 text-[#1D7DD7] group-hover:scale-110 transition-transform">
              <Compass className="size-5" />
            </div>
            <span className="text-xs font-bold text-white">Campus 5F Map</span>
          </Link>

          <Link
            href="/schedule?ocr=open"
            className="flex flex-col items-center gap-2 rounded-2xl border border-[#507495]/20 bg-[#141E28] p-4 text-center hover:border-[#1D7DD7] hover:bg-[#1D7DD7]/5 transition-all group"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 group-hover:scale-110 transition-transform">
              <ScanLine className="size-5" />
            </div>
            <span className="text-xs font-bold text-white">Scan Study Load</span>
          </Link>

          <Link
            href="/explore"
            className="flex flex-col items-center gap-2 rounded-2xl border border-[#507495]/20 bg-[#141E28] p-4 text-center hover:border-[#1D7DD7] hover:bg-[#1D7DD7]/5 transition-all group"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400 group-hover:scale-110 transition-transform">
              <Layers className="size-5" />
            </div>
            <span className="text-xs font-bold text-white">Guest Explorer</span>
          </Link>
        </div>
      </section>

      {/* ── Main Two-Column Layout: Class Timeline & Campus Bulletins ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Today's Class Timeline */}
        <section className="space-y-4 lg:col-span-8 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-wide flex items-center gap-2">
              <BookOpen className="size-4 text-[#1D7DD7]" />
              <span>Today&apos;s Class Timeline</span>
            </h3>
            <Link
              href="/schedule"
              className="text-xs font-bold text-[#1D7DD7] hover:underline"
            >
              View Full Week →
            </Link>
          </div>

          <div className="space-y-3 flex-1">
            {todayClasses.map((item) => {
              const isInProgress = item.status === "in_progress";
              const isUpcoming = item.status === "upcoming";

              return (
                <div
                  key={item.id}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border p-5 transition-all ${
                    isInProgress
                      ? "border-[#1D7DD7] bg-[#141E28] shadow-lg shadow-[#1D7DD7]/15 ring-1 ring-[#1D7DD7]/30"
                      : "border-[#507495]/20 bg-[#141E28]/70 hover:border-[#507495]/40 hover:bg-[#141E28]"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Time Badge */}
                    <div className="flex flex-col items-center justify-center rounded-2xl bg-[#0E151B] border border-[#507495]/25 px-3.5 py-2.5 text-center min-w-[95px] shrink-0">
                      <span className="text-xs font-black text-white">{item.startTime}</span>
                      <span className="text-[10px] font-bold text-[#74777E]">to</span>
                      <span className="text-[11px] font-bold text-[#74777E]">{item.endTime}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black bg-[#1D7DD7]/20 border border-[#1D7DD7]/40 text-[#1D7DD7] px-2 py-0.5 rounded-md">
                          {item.courseCode}
                        </span>
                        {isInProgress && (
                          <span className="text-[10px] font-black bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <span className="size-1.5 rounded-full bg-emerald-400 animate-ping" />
                            <span>In Progress</span>
                          </span>
                        )}
                        {isUpcoming && (
                          <span className="text-[10px] font-bold text-[#74777E] bg-[#0E151B] px-2 py-0.5 rounded-md">
                            Upcoming
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm sm:text-base font-black text-white">
                        {item.courseTitle}
                      </h4>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#74777E] pt-0.5">
                        <span className="font-bold text-white flex items-center gap-1">
                          <MapPin className="size-3.5 text-[#1D7DD7]" />
                          {item.building} — <span className="text-[#1D7DD7]">{item.room}</span>
                        </span>
                        <span>•</span>
                        <span>{item.instructor}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleNavigate(item.room)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#0E151B] hover:bg-[#1D7DD7] text-white border border-[#507495]/30 hover:border-[#1D7DD7] px-4 py-2.5 text-xs font-bold transition-all shrink-0 shadow-sm"
                  >
                    <Navigation className="size-3.5 text-[#1D7DD7] group-hover:text-white" />
                    <span>Get Route</span>
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Column: Campus Bulletins & Facility Notices Widget */}
        <section id="bulletins" className="space-y-4 lg:col-span-4 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-wide flex items-center gap-2">
              <Bell className="size-4 text-[#1D7DD7]" />
              <span>Campus Bulletins</span>
            </h3>
            <span className="text-[10px] font-black text-[#1D7DD7] bg-[#1D7DD7]/10 px-2 py-0.5 rounded-md">
              Live Updates
            </span>
          </div>

          <div className="rounded-3xl border border-[#507495]/20 bg-[#141E28] p-5 flex-1 space-y-4 shadow-sm">
            {campusBulletins.map((notice) => (
              <div
                key={notice.id}
                className="p-3.5 rounded-2xl border border-[#507495]/20 bg-[#0E151B]/60 space-y-2 hover:border-[#507495]/40 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black text-[#1D7DD7] bg-[#1D7DD7]/15 px-2 py-0.5 rounded-md">
                    {notice.badge}
                  </span>
                  <span className="text-[10px] font-bold text-[#74777E]">{notice.time}</span>
                </div>
                <h5 className="text-xs font-black text-white leading-snug">{notice.title}</h5>
                <p className="text-[11px] text-[#74777E] leading-relaxed">{notice.message}</p>
              </div>
            ))}

            <div className="pt-2 border-t border-[#507495]/20 text-center">
              <span className="text-[11px] font-semibold text-[#74777E] block">
                Broadcasted by CCS Dean&apos;s Office
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
