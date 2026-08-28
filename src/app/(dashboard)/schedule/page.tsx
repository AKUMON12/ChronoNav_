"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Plus,
  Compass,
  ArrowRight,
  Sparkles,
  Layers,
  LayoutGrid,
  ListFilter,
  CheckCircle2,
  AlertCircle,
  Building2,
  Trash2,
  Edit2,
  BookOpen,
  List,
  Filter,
  ArrowUpDown,
  CalendarDays,
  Shield,
  GraduationCap,
} from "lucide-react";
import { ClassScheduleItem } from "@/types/schedule";
import { ScheduleCRUDModal } from "@/components/schedule/schedule-crud-modal";
import { ScheduleSkeleton } from "@/components/skeletons/schedule-skeleton";
import { AcademicCalendarView } from "@/components/schedule/academic-calendar-view";
import { getGraphNodeForRoom } from "@/lib/navigation/pathfinding";
import {
  sortScheduleItems,
  SortOption,
  isMajorSubject,
} from "@/lib/schedule/time";
import { getEventsForDate, getHolidayForDate, getDayNameShort } from "@/lib/schedule/academic-calendar";

/** Initial Student Schedule fallback with real university classes */
const initialSchedules: ClassScheduleItem[] = [
  {
    id: "sched-1",
    courseCode: "CS 301",
    courseTitle: "Data Structures and Algorithms",
    instructor: "Dr. Maria Santos",
    building: "CCS Building",
    room: "CCS 538",
    dayOfWeek: "Mon",
    startTime: "08:00 AM",
    endTime: "10:30 AM",
    section: "BSCS-3A",
  },
  {
    id: "sched-2",
    courseCode: "CS 302",
    courseTitle: "Operating Systems & Architecture",
    instructor: "Engr. Pedro Cruz",
    building: "CCS Building",
    room: "Mac Lab 101",
    dayOfWeek: "Mon",
    startTime: "10:30 AM",
    endTime: "12:00 PM",
    section: "BSCS-3A",
  },
  {
    id: "sched-3",
    courseCode: "IT-NETWORKING31",
    courseTitle: "Cisco Enterprise Networking",
    instructor: "Prof. Ana Reyes",
    building: "CCS Building",
    room: "CCS 301",
    dayOfWeek: "Mon",
    startTime: "01:00 PM",
    endTime: "03:30 PM",
    section: "BSCS-3A",
  },
  {
    id: "sched-4",
    courseCode: "CS 304",
    courseTitle: "Database Management Systems",
    instructor: "Prof. Roberto Gomez",
    building: "CCS Building",
    room: "CCS 201",
    dayOfWeek: "Tue",
    startTime: "08:00 AM",
    endTime: "10:30 AM",
    section: "BSCS-3A",
  },
  {
    id: "sched-5",
    courseCode: "CS 305",
    courseTitle: "Web Systems and Technologies",
    instructor: "Engr. Elena Bautista",
    building: "CCS Building",
    room: "AV Hall 401",
    dayOfWeek: "Wed",
    startTime: "01:00 PM",
    endTime: "03:30 PM",
    section: "BSCS-3A",
  },
  {
    id: "sched-6",
    courseCode: "CS 306",
    courseTitle: "Software Engineering 1",
    instructor: "Dr. Maria Santos",
    building: "CCS Building",
    room: "CCS 538",
    dayOfWeek: "Thu",
    startTime: "08:00 AM",
    endTime: "10:30 AM",
    section: "BSCS-3A",
  },
  {
    id: "sched-7",
    courseCode: "CS 307",
    courseTitle: "Artificial Intelligence & ML",
    instructor: "Dr. Maria Santos",
    building: "CCS Building",
    room: "Innovation Lab 501",
    dayOfWeek: "Fri",
    startTime: "10:30 AM",
    endTime: "01:00 PM",
    section: "BSCS-3A",
  },
];

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function ScheduleContent() {
  const router = useRouter();

  // Schedule list initialized from persistent student study load store or default
  const [schedules, setSchedules] = useState<ClassScheduleItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("chrononav_student_schedule");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (e) {
        console.error("Error reading stored schedule:", e);
      }
    }
    return initialSchedules;
  });

  // Calendar Date State & Filter Modes
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"daily" | "weekly" | "calendar">("daily");
  const [sortMode, setSortMode] = useState<SortOption>("time_asc");
  const [subjectTypeFilter, setSubjectTypeFilter] = useState<"all" | "major" | "minor">("all");

  // CRUD Modal State
  const [isCRUDModalOpen, setIsCRUDModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<ClassScheduleItem | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync state to localStorage whenever schedules change
  useEffect(() => {
    if (typeof window !== "undefined" && schedules.length > 0) {
      try {
        localStorage.setItem("chrononav_student_schedule", JSON.stringify(schedules));
      } catch (err) {
        console.error("Error persisting schedule:", err);
      }
    }
  }, [schedules]);

  // Handle date selection from academic calendar
  const handleSelectCalendarDate = (date: Date) => {
    setSelectedDate(date);
    const dayName = getDayNameShort(date);
    setSelectedDay(dayName);
  };

  // Filtered & Sorted Schedules for Daily Timeline View
  const filteredAndSortedSchedules = useMemo(() => {
    let list = schedules;

    // Filter by day of week if not "All"
    if (selectedDay !== "All") {
      list = list.filter(
        (s) => s.dayOfWeek.toLowerCase() === selectedDay.toLowerCase()
      );
    }

    // Filter by Major vs Minor subject
    if (subjectTypeFilter === "major") {
      list = list.filter((s) => isMajorSubject(s.courseCode, s.courseTitle));
    } else if (subjectTypeFilter === "minor") {
      list = list.filter((s) => !isMajorSubject(s.courseCode, s.courseTitle));
    }

    // Apply deterministic multi-tier sorting
    return sortScheduleItems(list, sortMode);
  }, [schedules, selectedDay, subjectTypeFilter, sortMode]);

  const handleNavigateToRoom = (roomCode: string) => {
    const targetNode = getGraphNodeForRoom(roomCode);
    router.push(`/map?start=F1_ENTRANCE&target=${targetNode}`);
  };

  const handleSaveSchedule = (item: ClassScheduleItem) => {
    setSchedules((prev) => {
      const exists = prev.some((s) => s.id === item.id);
      if (exists) {
        return prev.map((s) => (s.id === item.id ? item : s));
      }
      return [item, ...prev];
    });
    setNotification(`Saved class schedule for ${item.courseCode}.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDeleteSubject = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    setNotification("Subject removed from your timetable.");
    setTimeout(() => setNotification(null), 3000);
  };

  const activeHoliday = useMemo(() => {
    return getHolidayForDate(selectedDate);
  }, [selectedDate]);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full transition-colors duration-200">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <BookOpen className="size-8 text-primary" />
            <span>Academic Calendar & Class Timetable</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            View chronological class schedules, academic events, holidays, and navigate directly to your classrooms.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* View Mode Switcher */}
          <div className="flex items-center rounded-2xl bg-card border border-border p-1">
            <button
              onClick={() => setViewMode("daily")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                viewMode === "daily"
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="size-3.5" />
              <span>Daily List</span>
            </button>
            <button
              onClick={() => setViewMode("weekly")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                viewMode === "weekly"
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="size-3.5" />
              <span>Weekly Matrix</span>
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                viewMode === "calendar"
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CalendarIcon className="size-3.5" />
              <span>Academic Calendar</span>
            </button>
          </div>

          <button
            onClick={() => {
              setEditingItem(null);
              setIsCRUDModalOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-2xl border border-border bg-card px-3.5 py-2 text-xs font-black text-foreground hover:bg-accent transition-colors shadow-sm"
          >
            <Plus className="size-4 text-primary" />
            <span>Add Class</span>
          </button>
        </div>
      </div>

      {/* ── Success Notification Banner ── */}
      {notification && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 p-4 text-xs font-black text-emerald-500 animate-in fade-in">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* ── Summary Metrics ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-3xl border border-border bg-card p-4 space-y-1 shadow-sm">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
            TOTAL SUBJECTS
          </span>
          <p className="text-xl sm:text-2xl font-black text-foreground">{schedules.length}</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-4 space-y-1 shadow-sm">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
            TOTAL UNITS
          </span>
          <p className="text-xl sm:text-2xl font-black text-primary">
            {schedules.length * 3} Units
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-4 space-y-1 shadow-sm">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
            CURRENT SEMESTER
          </span>
          <p className="text-sm sm:text-base font-black text-foreground">1st Sem. SY 2025-2026</p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-4 space-y-1 shadow-sm">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
            OFFICIAL STUDY LOAD
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black text-emerald-500">Verified & Calibrated</span>
          </div>
        </div>
      </div>

      {/* ── FULL ACADEMIC CALENDAR VIEW ── */}
      {viewMode === "calendar" && (
        <div className="space-y-6">
          <AcademicCalendarView
            schedules={schedules}
            selectedDate={selectedDate}
            onSelectDate={handleSelectCalendarDate}
          />
        </div>
      )}

      {/* ── DAILY TIMELINE VIEW WITH SIDEBAR CALENDAR ── */}
      {viewMode === "daily" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (Desktop 5 cols): Interactive Mini Academic Calendar */}
          <div className="lg:col-span-5 space-y-4">
            <AcademicCalendarView
              schedules={schedules}
              selectedDate={selectedDate}
              onSelectDate={handleSelectCalendarDate}
              compact={true}
            />
          </div>

          {/* Right Column (Desktop 7 cols): Filtered & Chronologically Sorted Classes */}
          <div className="lg:col-span-7 space-y-4">
            {/* Sorting & Filter Controls Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-card border border-border p-3">
              {/* Day of the Week Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                {["All", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => {
                  const count =
                    day === "All"
                      ? schedules.length
                      : schedules.filter((s) => s.dayOfWeek.toLowerCase() === day.toLowerCase())
                          .length;

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 ${
                        selectedDay === day
                          ? "bg-primary text-white shadow-sm"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      <span>{day}</span>
                      <span
                        className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                          selectedDay === day
                            ? "bg-white/20 text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Sorting & Subject Type Dropdowns */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                {/* Major / Minor Filter */}
                <select
                  value={subjectTypeFilter}
                  onChange={(e) => setSubjectTypeFilter(e.target.value as "all" | "major" | "minor")}
                  className="rounded-xl border border-border bg-background px-2.5 py-1.5 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                  aria-label="Filter by subject classification"
                >
                  <option value="all">All Subjects</option>
                  <option value="major">Major Only</option>
                  <option value="minor">Minor Only</option>
                </select>

                {/* Sort Order Dropdown */}
                <div className="flex items-center gap-1 bg-background border border-border rounded-xl px-2 py-1 shadow-sm">
                  <ArrowUpDown className="size-3 text-primary shrink-0" />
                  <select
                    value={sortMode}
                    onChange={(e) => setSortMode(e.target.value as SortOption)}
                    className="bg-transparent text-xs font-bold text-foreground focus:outline-none"
                    aria-label="Sort schedules order"
                  >
                    <option value="time_asc">Earliest First (Default)</option>
                    <option value="time_desc">Latest First</option>
                    <option value="priority_major">Major Subjects First</option>
                    <option value="course_code">Course Code (A–Z)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Holiday / Event Banner if selected day has one */}
            {activeHoliday && (
              <div className="flex items-center gap-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 p-3.5 text-xs text-amber-600 dark:text-amber-400 font-bold animate-in fade-in">
                <AlertCircle className="size-4 shrink-0" />
                <span>
                  {activeHoliday.title}: No regular university classes scheduled.
                </span>
              </div>
            )}

            {/* Daily Schedule List Cards */}
            <div className="space-y-3">
              {filteredAndSortedSchedules.length > 0 ? (
                filteredAndSortedSchedules.map((item) => {
                  const isMajor = isMajorSubject(item.courseCode, item.courseTitle);

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border bg-card p-5 hover:border-primary/50 shadow-sm transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        {/* Time Slot Container */}
                        <div className="flex flex-col items-center justify-center rounded-2xl bg-muted/40 border border-border px-3.5 py-2.5 text-center min-w-[95px] shrink-0">
                          <span className="text-xs font-black text-foreground">{item.startTime}</span>
                          <span className="text-[10px] font-bold text-muted-foreground">to</span>
                          <span className="text-[11px] font-bold text-muted-foreground">{item.endTime}</span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-black text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md">
                              {item.courseCode}
                            </span>
                            <span className="text-[10px] font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">
                              {item.dayOfWeek}
                            </span>
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
                                isMajor
                                  ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400"
                                  : "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400"
                              }`}
                            >
                              {isMajor ? "Major Core" : "General Ed"}
                            </span>
                          </div>

                          <h3 className="text-base font-black text-foreground leading-snug">
                            {item.courseTitle}
                          </h3>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
                            <span className="flex items-center gap-1 font-black text-foreground">
                              <MapPin className="size-3.5 text-primary" />
                              {item.building} — <span className="text-primary">{item.room}</span>
                            </span>
                            {item.instructor && (
                              <>
                                <span>•</span>
                                <span className="text-muted-foreground font-medium">
                                  {item.instructor}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => handleNavigateToRoom(item.room)}
                          className="flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 text-white px-4 py-2.5 text-xs font-black transition-all shadow-md shadow-primary/25"
                        >
                          <Compass className="size-4" />
                          <span>Get Directions</span>
                          <ArrowRight className="size-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setIsCRUDModalOpen(true);
                          }}
                          className="p-2.5 rounded-xl border border-border bg-muted/30 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                          title="Edit Subject"
                        >
                          <Edit2 className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSubject(item.id)}
                          className="p-2.5 rounded-xl border border-border bg-muted/30 text-muted-foreground hover:text-rose-500 hover:border-rose-500/30 transition-colors"
                          title="Remove Subject"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center space-y-3">
                  <CalendarIcon className="size-10 text-muted-foreground mx-auto opacity-40" />
                  <p className="text-sm font-black text-foreground">
                    No classes scheduled for {selectedDay === "All" ? "your timetable" : selectedDay}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Add custom classes or verify your study load registration.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── WEEKLY CALENDAR MATRIX GRID VIEW ── */}
      {viewMode === "weekly" && (
        <div className="rounded-3xl border border-border bg-card p-5 shadow-xl overflow-x-auto space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <LayoutGrid className="size-5 text-primary" />
              <h3 className="text-sm font-black text-foreground uppercase tracking-wide">
                Weekly Class Timetable Matrix
              </h3>
            </div>
            <span className="text-[11px] font-bold text-muted-foreground">
              Sorted Chronologically (Mon to Sat) • Click class for room routing
            </span>
          </div>

          <div className="min-w-[800px] grid grid-cols-6 gap-3">
            {WEEKDAYS.map((day) => {
              const daySchedules = sortScheduleItems(
                schedules.filter((s) => s.dayOfWeek.toLowerCase() === day.toLowerCase()),
                "time_asc"
              );

              return (
                <div key={day} className="space-y-3">
                  <div className="rounded-2xl bg-muted/40 border border-border p-2.5 text-center">
                    <span className="text-xs font-black text-foreground">{day}</span>
                    <span className="text-[10px] font-bold text-muted-foreground block">
                      {daySchedules.length} Classes
                    </span>
                  </div>

                  <div className="space-y-2">
                    {daySchedules.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleNavigateToRoom(item.room)}
                        className="rounded-2xl border border-border bg-card p-3 text-xs space-y-1.5 cursor-pointer hover:border-primary hover:scale-[1.02] transition-all shadow-sm group"
                      >
                        <span className="text-[10px] font-black text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                          {item.courseCode}
                        </span>
                        <h4 className="font-bold text-foreground leading-tight line-clamp-2">
                          {item.courseTitle}
                        </h4>
                        <div className="text-[10px] text-muted-foreground space-y-0.5 pt-1">
                          <p className="flex items-center gap-1 font-semibold text-foreground">
                            <Clock className="size-3 text-primary" />
                            <span>{item.startTime}</span>
                          </p>
                          <p className="flex items-center gap-1 font-bold text-primary">
                            <MapPin className="size-3" />
                            <span>{item.room}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── SCHEDULE CRUD MODAL ── */}
      <ScheduleCRUDModal
        isOpen={isCRUDModalOpen}
        item={editingItem}
        onClose={() => setIsCRUDModalOpen(false)}
        onSave={handleSaveSchedule}
      />
    </div>
  );
}

export default function SchedulePage() {
  return (
    <Suspense fallback={<ScheduleSkeleton />}>
      <ScheduleContent />
    </Suspense>
  );
}
