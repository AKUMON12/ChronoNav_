/**
 * University of Cebu Academic Calendar, Holidays & Institutional Events Data Engine
 * Defines official Philippine national holidays, university charter days, exam periods,
 * and academic milestones for the 2025-2026 / 2026-2027 school years.
 */

export interface CalendarEvent {
  id: string;
  title: string;
  type: "holiday" | "academic" | "exam" | "announcement";
  date: string; // "YYYY-MM-DD"
  description?: string;
  badge?: string;
  isNoClass?: boolean;
}

export const UC_ACADEMIC_EVENTS: CalendarEvent[] = [
  // ── August 2026 ──
  {
    id: "evt-aug-09",
    title: "1st Semester Classes Officially Begin",
    type: "academic",
    date: "2026-08-09",
    description: "Official start of regular lecture and lab classes across all departments.",
    badge: "Semester Start",
  },
  {
    id: "evt-aug-21",
    title: "Ninoy Aquino Day (Special Non-Working Holiday)",
    type: "holiday",
    date: "2026-08-21",
    description: "National holiday. No classes and university administrative offices closed.",
    badge: "National Holiday",
    isNoClass: true,
  },
  {
    id: "evt-aug-31",
    title: "National Heroes Day (Regular Holiday)",
    type: "holiday",
    date: "2026-08-31",
    description: "National holiday celebrating Philippine heroes. University closed.",
    badge: "Regular Holiday",
    isNoClass: true,
  },

  // ── September 2026 ──
  {
    id: "evt-sep-09",
    title: "President Sergio Osmeña Day (Cebu Special Holiday)",
    type: "holiday",
    date: "2026-09-09",
    description: "Special non-working holiday in the Province and City of Cebu.",
    badge: "Local Holiday",
    isNoClass: true,
  },
  {
    id: "evt-sep-21",
    title: "Preliminary Examinations Period",
    type: "exam",
    date: "2026-09-21",
    description: "College of Computer Studies Prelim Examination Week.",
    badge: "Exam Week",
  },
  {
    id: "evt-sep-22",
    title: "Preliminary Examinations Period",
    type: "exam",
    date: "2026-09-22",
    description: "College of Computer Studies Prelim Examination Week.",
    badge: "Exam Week",
  },

  // ── October 2026 ──
  {
    id: "evt-oct-15",
    title: "University of Cebu Founding Anniversary & CCS Tech Summit",
    type: "academic",
    date: "2026-10-15",
    description: "University-wide foundation anniversary programs and tech exhibition.",
    badge: "University Event",
  },
  {
    id: "evt-oct-26",
    title: "Midterm Examinations Period",
    type: "exam",
    date: "2026-10-26",
    description: "1st Semester Midterm examinations across all colleges.",
    badge: "Midterm Exams",
  },

  // ── November 2026 ──
  {
    id: "evt-nov-01",
    title: "All Saints' Day",
    type: "holiday",
    date: "2026-11-01",
    description: "Special non-working holiday.",
    badge: "National Holiday",
    isNoClass: true,
  },
  {
    id: "evt-nov-02",
    title: "All Souls' Day",
    type: "holiday",
    date: "2026-11-02",
    description: "Special non-working holiday.",
    badge: "National Holiday",
    isNoClass: true,
  },
  {
    id: "evt-nov-30",
    title: "Bonifacio Day",
    type: "holiday",
    date: "2026-11-30",
    description: "Regular national holiday. No classes.",
    badge: "Regular Holiday",
    isNoClass: true,
  },

  // ── December 2026 ──
  {
    id: "evt-dec-08",
    title: "Feast of the Immaculate Conception",
    type: "holiday",
    date: "2026-12-08",
    description: "Special non-working holiday.",
    badge: "National Holiday",
    isNoClass: true,
  },
  {
    id: "evt-dec-14",
    title: "Final Examinations Week",
    type: "exam",
    date: "2026-12-14",
    description: "1st Semester Final examinations and capstone defense completions.",
    badge: "Final Exams",
  },
  {
    id: "evt-dec-25",
    title: "Christmas Day",
    type: "holiday",
    date: "2026-12-25",
    description: "Christmas Day national holiday. University Christmas break.",
    badge: "Holiday",
    isNoClass: true,
  },
];

/**
 * Format a Date object to "YYYY-MM-DD" local format.
 */
export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Retrieves all academic events, holidays, and announcements for a specific date.
 */
export function getEventsForDate(date: Date): CalendarEvent[] {
  const key = formatDateKey(date);
  return UC_ACADEMIC_EVENTS.filter((e) => e.date === key);
}

/**
 * Checks if a date has a holiday or no-class status.
 */
export function getHolidayForDate(date: Date): CalendarEvent | undefined {
  const key = formatDateKey(date);
  return UC_ACADEMIC_EVENTS.find((e) => e.date === key && e.type === "holiday");
}

/**
 * Checks if a given day name (e.g. "Mon") has classes scheduled.
 */
export function getDayNameShort(date: Date): "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" {
  const dayNames: ("Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat")[] = [
    "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
  ];
  return dayNames[date.getDay()];
}
