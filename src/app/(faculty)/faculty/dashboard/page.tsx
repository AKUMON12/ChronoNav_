"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Users,
  Calendar,
  Clock,
  MapPin,
  Compass,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  FileText,
  UserCheck,
} from "lucide-react";
import { getCurrentUser } from "@/lib/supabase/auth";
import { getGraphNodeForRoom } from "@/lib/navigation/pathfinding";
import { DashboardSkeleton } from "@/components/skeletons/dashboard-skeleton";

const facultyTeachingSchedule = [
  {
    id: "f-1",
    courseCode: "CS 301",
    courseTitle: "Data Structures & Algorithms (Sec A)",
    students: 42,
    room: "CCS 538",
    building: "CCS Building",
    day: "Monday",
    time: "08:00 AM – 10:30 AM",
    status: "Active Class",
  },
  {
    id: "f-2",
    courseCode: "CS 301",
    courseTitle: "Data Structures & Algorithms (Sec B)",
    students: 38,
    room: "Mac Lab 101",
    building: "CCS Building",
    day: "Monday",
    time: "01:00 PM – 03:30 PM",
    status: "Upcoming",
  },
  {
    id: "f-3",
    courseCode: "CS 401",
    courseTitle: "Advanced Systems Architecture",
    students: 35,
    room: "AV Hall 401",
    building: "CCS Building",
    day: "Wednesday",
    time: "10:30 AM – 12:30 PM",
    status: "Upcoming",
  },
];

export default function FacultyDashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState<boolean>(false);
  const [facultyName, setFacultyName] = useState<string>("Dr. Santos");

  useEffect(() => {
    setMounted(true);
    async function loadUser() {
      const user = await getCurrentUser();
      if (user?.user_metadata?.last_name) {
        setFacultyName(`Prof. ${user.user_metadata.last_name}`);
      }
    }
    loadUser();
  }, []);

  const handleNavigate = (room: string) => {
    const target = getGraphNodeForRoom(room);
    router.push(`/map?start=F1_ENTRANCE&target=${target}`);
  };

  if (!mounted) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <GraduationCap className="size-8 text-indigo-500 dark:text-indigo-400" />
            <span>Faculty Hub & Academic Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Welcome back, {facultyName}. Manage teaching schedules, classroom navigation, and student consultations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 px-3.5 py-1.5 text-xs font-black text-indigo-600 dark:text-indigo-400">
            <UserCheck className="size-3.5" />
            <span>CCS Faculty Active</span>
          </span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-3xl border border-border bg-card p-5 space-y-1 shadow-sm">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
            ASSIGNED SECTIONS
          </span>
          <p className="text-2xl font-black text-foreground">3 Teaching Loads</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 space-y-1 shadow-sm">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
            TOTAL ENROLLED STUDENTS
          </span>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">115 Students</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-5 space-y-1 shadow-sm">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
            CONSULTATION OFFICE
          </span>
          <p className="text-sm font-black text-foreground truncate">CCS Faculty Room 205 (2F)</p>
        </div>
      </div>

      {/* Teaching Schedule */}
      <div className="space-y-4">
        <h2 className="text-base font-black text-foreground uppercase tracking-wide flex items-center gap-2">
          <BookOpen className="size-5 text-indigo-500 dark:text-indigo-400" />
          <span>Assigned Teaching Schedule</span>
        </h2>

        <div className="space-y-3">
          {facultyTeachingSchedule.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border bg-card p-5 hover:border-indigo-500/40 shadow-sm transition-all"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-md">
                    {item.courseCode}
                  </span>
                  <span className="text-[11px] font-bold text-muted-foreground bg-muted/40 px-2 py-0.5 rounded-md">
                    {item.day}
                  </span>
                  <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/15 px-2 py-0.5 rounded-md">
                    {item.status}
                  </span>
                </div>

                <h3 className="text-base font-black text-foreground">{item.courseTitle}</h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-bold text-foreground">
                    <Clock className="size-3.5 text-indigo-500 dark:text-indigo-400" />
                    <span>{item.time}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400">
                    <MapPin className="size-3.5" />
                    <span>{item.building} — {item.room}</span>
                  </span>
                  <span>•</span>
                  <span>{item.students} Enrolled</span>
                </div>
              </div>

              <button
                onClick={() => handleNavigate(item.room)}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 text-xs font-black transition-all shadow-md shadow-indigo-600/30 shrink-0"
              >
                <Compass className="size-4" />
                <span>Navigate to Class</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
