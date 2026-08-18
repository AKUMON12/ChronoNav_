"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ScanLine,
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  ArrowRight,
  Plus,
  CheckCircle2,
  Navigation,
  Compass,
  LayoutGrid,
  List,
  Filter,
  X,
  User,
  Building2,
  Trash2,
} from "lucide-react";
import { ClassScheduleItem, ParsedScheduleItem, DayOfWeek } from "@/types/schedule";
import { OCRUploadModal } from "@/components/schedule/ocr-upload-modal";
import { getGraphNodeForRoom } from "@/lib/navigation/pathfinding";

/** Initial Student Schedule with CCS 538 and other real university classes */
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
  },
  {
    id: "sched-2",
    courseCode: "CS 302",
    courseTitle: "Operating Systems & Architecture",
    instructor: "Engr. Pedro Cruz",
    building: "CCS Building",
    room: "Mac Lab 101",
    dayOfWeek: "Tue",
    startTime: "10:30 AM",
    endTime: "12:00 PM",
  },
  {
    id: "sched-3",
    courseCode: "IT-NETWORKING31",
    courseTitle: "Cisco Enterprise Networking",
    instructor: "Prof. Ana Reyes",
    building: "CCS Building",
    room: "CCS 301",
    dayOfWeek: "Wed",
    startTime: "01:00 PM",
    endTime: "03:00 PM",
  },
  {
    id: "sched-4",
    courseCode: "IT-CPSTONE41",
    courseTitle: "Capstone Project and Research 1",
    instructor: "Dr. Ramon Garcia",
    building: "CCS Building",
    room: "AV Hall 401",
    dayOfWeek: "Thu",
    startTime: "02:30 PM",
    endTime: "04:30 PM",
  },
  {
    id: "sched-5",
    courseCode: "CS 305",
    courseTitle: "Software Engineering Studio",
    instructor: "Engr. Juan Dela Cruz",
    building: "CCS Building",
    room: "CCS 302",
    dayOfWeek: "Fri",
    startTime: "09:00 AM",
    endTime: "11:30 AM",
  },
  {
    id: "sched-6",
    courseCode: "GE 104",
    courseTitle: "Science, Technology, and Society",
    instructor: "Prof. Carlos Tan",
    building: "CCS Building",
    room: "Lecture 202",
    dayOfWeek: "Sat",
    startTime: "08:00 AM",
    endTime: "11:00 AM",
  },
];

const DAYS_LIST = ["All", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TIME_SLOTS = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

function ScheduleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [schedules, setSchedules] = useState<ClassScheduleItem[]>(initialSchedules);
  const [selectedDay, setSelectedDay] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"daily" | "weekly">("daily");
  const [isOCRModalOpen, setIsOCRModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form states for manual subject addition
  const [newCourseCode, setNewCourseCode] = useState<string>("");
  const [newCourseTitle, setNewCourseTitle] = useState<string>("");
  const [newInstructor, setNewInstructor] = useState<string>("");
  const [newRoom, setNewRoom] = useState<string>("CCS 538");
  const [newDay, setNewDay] = useState<DayOfWeek>("Mon");
  const [newStartTime, setNewStartTime] = useState<string>("08:00 AM");
  const [newEndTime, setNewEndTime] = useState<string>("10:30 AM");

  // Automatically trigger OCR modal if `?ocr=open` is in search params
  useEffect(() => {
    if (searchParams?.get("ocr") === "open") {
      setIsOCRModalOpen(true);
    }
  }, [searchParams]);

  // Filtered schedules for daily view
  const filteredSchedules = useMemo(() => {
    if (selectedDay === "All") return schedules;
    return schedules.filter(
      (s) => s.dayOfWeek.toLowerCase() === selectedDay.toLowerCase()
    );
  }, [schedules, selectedDay]);

  const handleNavigateToRoom = (roomCode: string) => {
    const targetNode = getGraphNodeForRoom(roomCode);
    router.push(`/map?start=F1_ENTRANCE&target=${targetNode}`);
  };

  const handleConfirmOCRSchedule = async (parsedItems: ParsedScheduleItem[]) => {
    const newItems: ClassScheduleItem[] = parsedItems.map((item) => ({
      id: item.id || `ocr-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      courseCode: item.courseCode,
      courseTitle: item.courseTitle,
      instructor: item.instructor,
      building: item.building || "CCS Building",
      room: item.room,
      dayOfWeek: item.dayOfWeek,
      startTime: item.startTime,
      endTime: item.endTime,
    }));

    setSchedules((prev) => [...newItems, ...prev]);
    setNotification(`Successfully imported ${newItems.length} courses from Study Load!`);
    setTimeout(() => setNotification(null), 5000);
  };

  const handleAddManualSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseCode || !newCourseTitle) return;

    const newItem: ClassScheduleItem = {
      id: `manual-${Date.now()}`,
      courseCode: newCourseCode.trim().toUpperCase(),
      courseTitle: newCourseTitle.trim(),
      instructor: newInstructor.trim() || "CCS Faculty",
      building: "CCS Building",
      room: newRoom.trim() || "CCS 538",
      dayOfWeek: newDay,
      startTime: newStartTime,
      endTime: newEndTime,
    };

    setSchedules((prev) => [newItem, ...prev]);
    setIsAddModalOpen(false);
    setNewCourseCode("");
    setNewCourseTitle("");
    setNewInstructor("");
    setNotification(`Added ${newItem.courseCode} to your schedule.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDeleteSubject = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#507495]/20 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            <BookOpen className="size-8 text-[#1D7DD7]" />
            <span>Class Schedule & Study Load</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#74777E] mt-1">
            Manage your enrolled courses, view weekly timetable grids, and navigate directly to your classrooms.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* View Mode Switcher */}
          <div className="flex items-center rounded-2xl bg-[#141E28] border border-[#507495]/25 p-1">
            <button
              onClick={() => setViewMode("daily")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                viewMode === "daily"
                  ? "bg-[#1D7DD7] text-white shadow-md shadow-[#1D7DD7]/30"
                  : "text-[#74777E] hover:text-white"
              }`}
            >
              <List className="size-3.5" />
              <span>Daily List</span>
            </button>
            <button
              onClick={() => setViewMode("weekly")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                viewMode === "weekly"
                  ? "bg-[#1D7DD7] text-white shadow-md shadow-[#1D7DD7]/30"
                  : "text-[#74777E] hover:text-white"
              }`}
            >
              <LayoutGrid className="size-3.5" />
              <span>Weekly Grid</span>
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-2xl border border-[#507495]/30 bg-[#141E28] px-3.5 py-2 text-xs font-black text-white hover:bg-[#0E151B] transition-colors"
          >
            <Plus className="size-4 text-[#1D7DD7]" />
            <span>Add Class</span>
          </button>

          <button
            onClick={() => setIsOCRModalOpen(true)}
            className="flex items-center gap-2 rounded-2xl bg-[#1D7DD7] px-4 py-2 text-xs font-black text-white hover:bg-[#1D7DD7]/90 shadow-lg shadow-[#1D7DD7]/30 transition-all"
          >
            <ScanLine className="size-4" />
            <span>Scan Study Load (OCR)</span>
          </button>
        </div>
      </div>

      {/* ── Success Notification Banner ── */}
      {notification && (
        <div className="flex items-center gap-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 p-4 text-xs font-black text-emerald-400 animate-in fade-in">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* ── Summary Metrics ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="rounded-3xl border border-[#507495]/20 bg-[#141E28] p-4 space-y-1 shadow-sm">
          <span className="text-[10px] font-black text-[#74777E] uppercase tracking-wider block">
            TOTAL SUBJECTS
          </span>
          <p className="text-xl sm:text-2xl font-black text-white">{schedules.length}</p>
        </div>

        <div className="rounded-3xl border border-[#507495]/20 bg-[#141E28] p-4 space-y-1 shadow-sm">
          <span className="text-[10px] font-black text-[#74777E] uppercase tracking-wider block">
            TOTAL UNITS
          </span>
          <p className="text-xl sm:text-2xl font-black text-[#1D7DD7]">
            {schedules.length * 3} Units
          </p>
        </div>

        <div className="rounded-3xl border border-[#507495]/20 bg-[#141E28] p-4 space-y-1 shadow-sm">
          <span className="text-[10px] font-black text-[#74777E] uppercase tracking-wider block">
            COLLEGE CAMPUS
          </span>
          <p className="text-sm font-black text-white truncate">UC Main • CCS</p>
        </div>

        <div className="rounded-3xl border border-[#507495]/20 bg-[#141E28] p-4 space-y-1 shadow-sm">
          <span className="text-[10px] font-black text-[#74777E] uppercase tracking-wider block">
            CURRENT SEMESTER
          </span>
          <p className="text-xs sm:text-sm font-black text-emerald-400">1st Sem 2026-2027</p>
        </div>
      </div>

      {/* ── DAILY TIMELINE VIEW ── */}
      {viewMode === "daily" && (
        <div className="space-y-4">
          {/* Day Filter Switcher */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {DAYS_LIST.map((day) => {
              const isActive = selectedDay === day;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-2xl text-xs font-black transition-all shrink-0 ${
                    isActive
                      ? "bg-[#1D7DD7] text-white shadow-md shadow-[#1D7DD7]/30"
                      : "bg-[#141E28] border border-[#507495]/20 text-[#74777E] hover:text-white"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Daily Schedule List Cards */}
          <div className="space-y-3">
            {filteredSchedules.length > 0 ? (
              filteredSchedules.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-[#507495]/20 bg-[#141E28] p-5 hover:border-[#1D7DD7]/50 shadow-md transition-all group"
                >
                  <div className="flex items-start gap-4">
                    {/* Time Slot Container */}
                    <div className="flex flex-col items-center justify-center rounded-2xl bg-[#0E151B] border border-[#507495]/25 px-3.5 py-2.5 text-center min-w-[95px] shrink-0">
                      <span className="text-xs font-black text-white">{item.startTime}</span>
                      <span className="text-[10px] font-bold text-[#74777E]">to</span>
                      <span className="text-[11px] font-bold text-[#74777E]">{item.endTime}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#1D7DD7] bg-[#1D7DD7]/15 border border-[#1D7DD7]/30 px-2 py-0.5 rounded-md">
                          {item.courseCode}
                        </span>
                        <span className="text-[11px] font-bold text-[#74777E] bg-[#0E151B] px-2 py-0.5 rounded-md">
                          {item.dayOfWeek}
                        </span>
                      </div>

                      <h3 className="text-base font-black text-white leading-snug">
                        {item.courseTitle}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#74777E] pt-1">
                        <span className="flex items-center gap-1 font-black text-white">
                          <MapPin className="size-3.5 text-[#1D7DD7]" />
                          {item.building} — <span className="text-[#1D7DD7]">{item.room}</span>
                        </span>
                        {item.instructor && (
                          <>
                            <span>•</span>
                            <span className="text-slate-300 font-medium">
                              Instructor: {item.instructor}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleNavigateToRoom(item.room)}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#1D7DD7] hover:bg-[#1D7DD7]/90 text-white px-4 py-2.5 text-xs font-black transition-all shadow-md shadow-[#1D7DD7]/25"
                    >
                      <Compass className="size-4" />
                      <span>Get Directions</span>
                      <ArrowRight className="size-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSubject(item.id)}
                      className="p-2.5 rounded-xl border border-[#507495]/20 bg-[#0E151B] text-[#74777E] hover:text-rose-400 hover:border-rose-500/30 transition-colors"
                      title="Remove Subject"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-[#507495]/20 bg-[#141E28] p-12 text-center space-y-3">
                <Calendar className="size-10 text-[#74777E] mx-auto opacity-40" />
                <p className="text-sm font-black text-white">No classes scheduled for {selectedDay}</p>
                <p className="text-xs text-[#74777E]">
                  Use the Study Load OCR scanner or add subjects manually to populate your timetable.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── WEEKLY CALENDAR MATRIX GRID VIEW ── */}
      {viewMode === "weekly" && (
        <div className="rounded-3xl border border-[#507495]/20 bg-[#141E28] p-5 shadow-xl overflow-x-auto space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#507495]/20">
            <h3 className="text-xs font-black text-white uppercase tracking-wide flex items-center gap-2">
              <LayoutGrid className="size-4 text-[#1D7DD7]" />
              <span>Weekly Class Timetable Matrix</span>
            </h3>
            <span className="text-[11px] font-bold text-[#74777E]">
              Mon to Sat • Click class for room routing
            </span>
          </div>

          <div className="min-w-[800px] grid grid-cols-6 gap-3">
            {WEEKDAYS.map((day) => {
              const daySchedules = schedules.filter(
                (s) => s.dayOfWeek.toLowerCase() === day.toLowerCase()
              );

              return (
                <div key={day} className="space-y-3">
                  <div className="rounded-xl bg-[#0E151B] border border-[#507495]/25 p-2 text-center">
                    <span className="text-xs font-black text-white">{day}</span>
                    <span className="text-[10px] font-bold text-[#74777E] block">
                      {daySchedules.length} Classes
                    </span>
                  </div>

                  <div className="space-y-2">
                    {daySchedules.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleNavigateToRoom(item.room)}
                        className="rounded-2xl border border-[#507495]/30 bg-[#0E151B]/90 p-3 text-xs space-y-1.5 cursor-pointer hover:border-[#1D7DD7] hover:scale-[1.02] transition-all shadow-sm group"
                      >
                        <span className="text-[10px] font-black text-[#1D7DD7] bg-[#1D7DD7]/15 px-1.5 py-0.5 rounded">
                          {item.courseCode}
                        </span>
                        <h4 className="font-bold text-white leading-tight line-clamp-2">
                          {item.courseTitle}
                        </h4>
                        <div className="text-[10px] text-[#74777E] space-y-0.5 pt-1">
                          <p className="flex items-center gap-1 font-semibold text-slate-300">
                            <Clock className="size-3 text-[#1D7DD7]" />
                            <span>{item.startTime}</span>
                          </p>
                          <p className="flex items-center gap-1 font-bold text-[#1D7DD7]">
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

      {/* ── ADD SUBJECT MANUALLY MODAL ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-[#507495]/30 bg-[#141E28] p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-[#507495]/20">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Plus className="size-5 text-[#1D7DD7]" />
                <span>Add Class Manually</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-[#74777E] hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleAddManualSubject} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-extrabold text-[#74777E] uppercase">Course Code</label>
                <input
                  type="text"
                  value={newCourseCode}
                  onChange={(e) => setNewCourseCode(e.target.value)}
                  placeholder="e.g. CS 301 or IT-CPSTONE41"
                  className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#1D7DD7]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-[#74777E] uppercase">Course Title</label>
                <input
                  type="text"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  placeholder="e.g. Data Structures and Algorithms"
                  className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#1D7DD7]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-extrabold text-[#74777E] uppercase">Assigned Room</label>
                  <select
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#1D7DD7]"
                  >
                    <option value="CCS 538">CCS 538 (5F)</option>
                    <option value="Mac Lab 101">Mac Lab 101 (1F)</option>
                    <option value="CCS 201">CCS 201 (2F)</option>
                    <option value="Lecture 202">Lecture 202 (2F)</option>
                    <option value="CCS 301">CCS 301 (3F)</option>
                    <option value="CCS 302">CCS 302 (3F)</option>
                    <option value="AV Hall 401">AV Hall 401 (4F)</option>
                    <option value="Innovation 501">Innovation 501 (5F)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-[#74777E] uppercase">Day of Week</label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value as DayOfWeek)}
                    className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] p-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#1D7DD7]"
                  >
                    <option value="Mon">Mon</option>
                    <option value="Tue">Tue</option>
                    <option value="Wed">Wed</option>
                    <option value="Thu">Thu</option>
                    <option value="Fri">Fri</option>
                    <option value="Sat">Sat</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-extrabold text-[#74777E] uppercase">Start Time</label>
                  <input
                    type="text"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    placeholder="08:00 AM"
                    className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] p-2.5 text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-extrabold text-[#74777E] uppercase">End Time</label>
                  <input
                    type="text"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    placeholder="10:30 AM"
                    className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-extrabold text-[#74777E] uppercase">Instructor Name</label>
                <input
                  type="text"
                  value={newInstructor}
                  onChange={(e) => setNewInstructor(e.target.value)}
                  placeholder="e.g. Dr. Maria Santos"
                  className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#507495]/20">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#507495]/30 text-[#74777E] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1D7DD7] text-white font-black hover:bg-[#1D7DD7]/90 shadow-md shadow-[#1D7DD7]/30"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── OCR UPLOAD MODAL ── */}
      <OCRUploadModal
        isOpen={isOCRModalOpen}
        onClose={() => setIsOCRModalOpen(false)}
        onConfirmSchedule={handleConfirmOCRSchedule}
      />
    </div>
  );
}

export default function SchedulePage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-sm font-black text-[#74777E]">
          Loading Schedule Manager...
        </div>
      }
    >
      <ScheduleContent />
    </Suspense>
  );
}
