"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Map, ScanLine, CalendarDays, Settings, ArrowRight, Clock, BookOpen } from "lucide-react";
import { ScheduleList } from "@/components/schedule/schedule-list";
import { ClassScheduleItem } from "@/types/schedule";
import { getGraphNodeForRoom } from "@/lib/navigation/pathfinding";

/**
 * Student Dashboard Page — the primary post-login home screen for students.
 * Shows today's schedule, next class CTA, and quick links to key features.
 * Sidebar, header, and bottom nav are handled by (dashboard)/layout.tsx.
 *
 * TODO: Replace mock data with real data from Supabase once auth + DB are connected.
 */

/** Mock schedule data for demonstration purposes */
const mockSchedule: ClassScheduleItem[] = [
  {
    id: "1",
    courseCode: "CS 301",
    courseTitle: "Data Structures and Algorithms",
    instructor: "Dr. Maria Santos",
    room: "CL3",
    building: "CCS Building",
    dayOfWeek: "Mon",
    startTime: "08:00",
    endTime: "10:30",
  },
  {
    id: "2",
    courseCode: "CS 302",
    courseTitle: "Operating Systems",
    instructor: "Engr. Pedro Cruz",
    room: "CL5",
    building: "CCS Building",
    dayOfWeek: "Mon",
    startTime: "10:30",
    endTime: "12:00",
  },
  {
    id: "3",
    courseCode: "GE 104",
    courseTitle: "Science, Technology & Society",
    instructor: "Prof. Ana Reyes",
    room: "LH2",
    building: "Main Building",
    dayOfWeek: "Mon",
    startTime: "13:00",
    endTime: "14:30",
  },
  {
    id: "4",
    courseCode: "CS 305",
    courseTitle: "Software Engineering",
    instructor: "Dr. Ramon Garcia",
    room: "CL2",
    building: "CCS Building",
    dayOfWeek: "Mon",
    startTime: "14:30",
    endTime: "16:00",
  },
];

export default function StudentDashboardPage() {
  const router = useRouter();
  const nextClassId = "1"; // TODO: Calculate dynamically from current time

  const handleNavigate = (item: ClassScheduleItem) => {
    const targetNode = getGraphNodeForRoom(item.room);
    router.push(`/map?start=F1_ENTRANCE&target=${targetNode}`);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full">
      {/* Welcome section */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Good Morning, Juan 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          Here&apos;s your schedule for today. You have {mockSchedule.length} classes.
        </p>
      </div>

      {/* Next Class CTA Banner */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
            <Clock className="size-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Next Class: {mockSchedule[0].courseTitle}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {mockSchedule[0].startTime} – {mockSchedule[0].endTime} · {mockSchedule[0].building}, {mockSchedule[0].room}
            </p>
          </div>
        </div>
        <Link
          href={`/map?start=F1_ENTRANCE&target=${getGraphNodeForRoom(mockSchedule[0].room)}`}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm shrink-0"
        >
          <span>Navigate Now</span>
          <ArrowRight className="size-4" />
        </Link>
      </div>

      {/* Quick Links Grid */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickLinkCard icon={ScanLine} title="Upload Schedule" href="/student/schedule" />
          <QuickLinkCard icon={CalendarDays} title="Full Schedule" href="/student/schedule" />
          <QuickLinkCard icon={Map} title="Campus Map" href="/map" />
          <QuickLinkCard icon={Settings} title="Settings" href="/student/settings" />
        </div>
      </section>

      {/* Today's Schedule */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <BookOpen className="size-5 text-primary" />
            Today&apos;s Schedule
          </h2>
          <Link
            href="/student/schedule"
            className="text-xs font-bold text-primary hover:underline"
          >
            View All →
          </Link>
        </div>
        <ScheduleList
          items={mockSchedule}
          activeItemId={nextClassId}
          onNavigate={handleNavigate}
        />
      </section>
    </div>
  );
}

/** Quick link card for the action grid */
function QuickLinkCard({ icon: Icon, title, href }: { icon: React.ElementType; title: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 hover:bg-accent/50 transition-colors text-center"
    >
      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" />
      </div>
      <span className="text-xs font-semibold text-foreground">{title}</span>
    </Link>
  );
}
