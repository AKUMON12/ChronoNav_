"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Sparkles,
  BookOpen,
  AlertTriangle,
  Info,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { ClassScheduleItem } from "@/types/schedule";
import {
  getEventsForDate,
  getHolidayForDate,
  getDayNameShort,
  formatDateKey,
  CalendarEvent,
} from "@/lib/schedule/academic-calendar";

interface AcademicCalendarViewProps {
  schedules: ClassScheduleItem[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  compact?: boolean;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function AcademicCalendarView({
  schedules,
  selectedDate,
  onSelectDate,
  compact = false,
}: AcademicCalendarViewProps) {
  // Current month view state (defaults to selectedDate's month and year)
  const [viewDate, setViewDate] = useState<Date>(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  );

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  const handlePrevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    onSelectDate(today);
  };

  // Map of classes grouped by DayOfWeek (e.g. "Mon" -> 3 classes)
  const scheduleDayCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Mon: 0,
      Tue: 0,
      Wed: 0,
      Thu: 0,
      Fri: 0,
      Sat: 0,
      Sun: 0,
    };
    schedules.forEach((item) => {
      const day = item.dayOfWeek.trim();
      if (counts[day] !== undefined) {
        counts[day] += 1;
      }
    });
    return counts;
  }, [schedules]);

  // Generate matrix cells for the current month
  const calendarCells = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const cells: {
      date: Date;
      dayNum: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      isSelected: boolean;
      classesCount: number;
      events: CalendarEvent[];
      holiday?: CalendarEvent;
    }[] = [];

    const todayStr = formatDateKey(new Date());
    const selectedStr = formatDateKey(selectedDate);

    // Previous month padding days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - 1, prevMonthDays - i);
      const dStr = formatDateKey(d);
      const dayName = getDayNameShort(d);
      const evts = getEventsForDate(d);
      const hol = getHolidayForDate(d);
      cells.push({
        date: d,
        dayNum: prevMonthDays - i,
        isCurrentMonth: false,
        isToday: dStr === todayStr,
        isSelected: dStr === selectedStr,
        classesCount: scheduleDayCounts[dayName] || 0,
        events: evts,
        holiday: hol,
      });
    }

    // Current month days
    for (let dNum = 1; dNum <= daysInMonth; dNum++) {
      const d = new Date(currentYear, currentMonth, dNum);
      const dStr = formatDateKey(d);
      const dayName = getDayNameShort(d);
      const evts = getEventsForDate(d);
      const hol = getHolidayForDate(d);
      cells.push({
        date: d,
        dayNum: dNum,
        isCurrentMonth: true,
        isToday: dStr === todayStr,
        isSelected: dStr === selectedStr,
        classesCount: scheduleDayCounts[dayName] || 0,
        events: evts,
        holiday: hol,
      });
    }

    // Next month padding days to complete 35 or 42 grid slots
    const totalSlots = cells.length > 35 ? 42 : 35;
    const remainingSlots = totalSlots - cells.length;
    for (let i = 1; i <= remainingSlots; i++) {
      const d = new Date(currentYear, currentMonth + 1, i);
      const dStr = formatDateKey(d);
      const dayName = getDayNameShort(d);
      const evts = getEventsForDate(d);
      const hol = getHolidayForDate(d);
      cells.push({
        date: d,
        dayNum: i,
        isCurrentMonth: false,
        isToday: dStr === todayStr,
        isSelected: dStr === selectedStr,
        classesCount: scheduleDayCounts[dayName] || 0,
        events: evts,
        holiday: hol,
      });
    }

    return cells;
  }, [currentYear, currentMonth, selectedDate, scheduleDayCounts]);

  const selectedDateEvents = useMemo(() => {
    return getEventsForDate(selectedDate);
  }, [selectedDate]);

  const selectedHoliday = useMemo(() => {
    return getHolidayForDate(selectedDate);
  }, [selectedDate]);

  return (
    <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-xl space-y-4 transition-colors">
      {/* ── Month & Year Controls Header ── */}
      <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <CalendarIcon className="size-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-foreground">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h3>
            <p className="text-[11px] text-muted-foreground font-semibold">
              Academic Calendar & Timetable Matrix
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleToday}
            className="px-3 py-1.5 rounded-xl border border-border bg-muted/30 hover:bg-accent text-xs font-black text-foreground transition-colors"
          >
            Today
          </button>
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-2 rounded-xl border border-border bg-muted/30 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Previous Month"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-2 rounded-xl border border-border bg-muted/30 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Next Month"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* ── Legend Bar ── */}
      <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-muted-foreground bg-muted/25 rounded-2xl p-2.5 px-3 border border-border/60">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-primary" />
          <span>Class Scheduled</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-amber-500" />
          <span>Holiday / No Class</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-indigo-500" />
          <span>Exam / Academic Event</span>
        </span>
      </div>

      {/* ── Calendar Grid ── */}
      <div className="space-y-1">
        {/* Weekday Header Columns */}
        <div className="grid grid-cols-7 text-center pb-2 border-b border-border/40">
          {WEEKDAY_NAMES.map((w) => (
            <span
              key={w}
              className={`text-[11px] font-black uppercase tracking-wider ${
                w === "Sun" ? "text-rose-500" : "text-muted-foreground"
              }`}
            >
              {w}
            </span>
          ))}
        </div>

        {/* Month Days Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5 pt-1" role="grid">
          {calendarCells.map((cell, idx) => {
            const hasClasses = cell.classesCount > 0;
            const hasHoliday = !!cell.holiday;
            const hasExams = cell.events.some((e) => e.type === "exam");

            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectDate(cell.date)}
                className={`group relative flex flex-col items-center justify-between p-1.5 sm:p-2 rounded-2xl min-h-[52px] sm:min-h-[64px] border transition-all text-center ${
                  cell.isSelected
                    ? "border-primary bg-primary/10 ring-2 ring-primary/40 font-black shadow-sm scale-[1.02] z-10"
                    : cell.isToday
                    ? "border-primary/40 bg-card font-black ring-1 ring-primary/20"
                    : cell.isCurrentMonth
                    ? "border-border/60 bg-card hover:border-primary/50 hover:bg-accent/40"
                    : "border-transparent bg-muted/20 opacity-40 hover:opacity-75"
                }`}
                aria-label={`${cell.date.toDateString()}${
                  hasHoliday ? ` - Holiday: ${cell.holiday?.title}` : ""
                }`}
              >
                {/* Date Number & Today Tag */}
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs sm:text-sm font-black ${
                      cell.isSelected
                        ? "text-primary"
                        : cell.isToday
                        ? "text-primary"
                        : cell.isCurrentMonth
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {cell.dayNum}
                  </span>

                  {cell.isToday && (
                    <span className="hidden sm:inline-block text-[8px] font-black uppercase bg-primary text-white px-1 py-0.2 rounded">
                      Today
                    </span>
                  )}
                </div>

                {/* Day Indicator Dots */}
                <div className="flex items-center gap-1 mt-auto pt-1">
                  {hasClasses && !hasHoliday && (
                    <span
                      className="size-1.5 sm:size-2 rounded-full bg-primary"
                      title={`${cell.classesCount} Classes Scheduled`}
                    />
                  )}
                  {hasHoliday && (
                    <span
                      className="size-1.5 sm:size-2 rounded-full bg-amber-500"
                      title={cell.holiday?.title}
                    />
                  )}
                  {hasExams && (
                    <span
                      className="size-1.5 sm:size-2 rounded-full bg-indigo-500"
                      title="Examinations Week"
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Selected Date Overview Banner ── */}
      <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-black text-foreground">
              {selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {scheduleDayCounts[getDayNameShort(selectedDate)] > 0 ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-primary/15 border border-primary/30 px-2 py-0.5 text-[10px] font-black text-primary uppercase">
                <BookOpen className="size-3" />
                {scheduleDayCounts[getDayNameShort(selectedDate)]} Classes Scheduled
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md bg-muted border border-border px-2 py-0.5 text-[10px] font-bold text-muted-foreground uppercase">
                No Classes
              </span>
            )}

            {selectedHoliday && (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase">
                <AlertTriangle className="size-3" />
                {selectedHoliday.badge || "Holiday"}
              </span>
            )}
          </div>
        </div>

        {/* Holiday / Event Description if present */}
        {selectedDateEvents.map((evt) => (
          <div
            key={evt.id}
            className="flex items-start gap-2 text-xs rounded-xl bg-card border border-border p-2.5"
          >
            <Info className="size-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-foreground">{evt.title}</p>
              {evt.description && (
                <p className="text-[11px] text-muted-foreground mt-0.5">{evt.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
