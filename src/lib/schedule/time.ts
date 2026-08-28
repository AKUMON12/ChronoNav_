import { ClassScheduleItem, DayOfWeek } from "@/types/schedule";

/**
 * ChronoNav Time Parsing & Scheduling Engine
 * Normalizes time strings into minutes from midnight (0 to 1439).
 * Correctly handles 12-hour AM/PM, 24-hour formats, noon (12:00 PM), midnight (12:00 AM),
 * and cross-midnight periods.
 */

export type SortOption = "time_asc" | "time_desc" | "priority_major" | "course_code";

const DAY_ORDER: Record<string, number> = {
  "mon": 1,
  "monday": 1,
  "tue": 2,
  "tues": 2,
  "tuesday": 2,
  "wed": 3,
  "wednesday": 3,
  "thu": 4,
  "thursday": 4,
  "fri": 5,
  "friday": 5,
  "sat": 6,
  "saturday": 6,
  "sun": 7,
  "sunday": 7,
};

/**
 * Parses any time string (e.g. "08:00 AM", "12:00 PM", "12:00 AM", "1:30 PM", "14:30")
 * into total minutes from midnight (0 to 1439).
 */
export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr || typeof timeStr !== "string") return 0;

  const clean = timeStr.trim().toUpperCase();
  const isPM = clean.includes("PM");
  const isAM = clean.includes("AM");

  // Extract hours and minutes digits
  const match = clean.match(/(\d{1,2}):(\d{2})/);
  if (!match) return 0;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);

  if (isAM) {
    if (hours === 12) hours = 0; // 12:00 AM is 00:00 (midnight)
  } else if (isPM) {
    if (hours !== 12) hours += 12; // 12:00 PM is 12:00 (noon), 1:00 PM is 13:00
  }

  return (hours * 60 + minutes) % 1440;
}

/**
 * Classifies whether a course is a Major Subject (Computer Studies / Engineering Core)
 * versus a Minor / General Education subject.
 */
export function isMajorSubject(courseCode: string, courseTitle?: string): boolean {
  const code = (courseCode || "").toUpperCase();
  const title = (courseTitle || "").toUpperCase();

  // Major prefixes / keywords
  const majorPatterns = [
    /^CS\b/,
    /^IT[- ]/,
    /^IS\b/,
    /^CPE\b/,
    /CAPSTONE/,
    /DATA STRUCTURE/,
    /ALGORITHM/,
    /OPERATING SYSTEM/,
    /NETWORKING/,
    /DATABASE/,
    /SOFTWARE ENG/,
    /MACHINE LEARNING/,
    /ARTIFICIAL INTELLIGENCE/,
    /WEB SYSTEM/,
    /PROGRAMMING/,
    /ELEMSYS/,
    /ELAI/,
    /FRELEAN/,
  ];

  // Minor prefixes
  const minorPatterns = [
    /^GE\b/,
    /^LIT\b/,
    /^MATH\b/,
    /^ENG\b/,
    /^PE\b/,
    /^PATHFIT\b/,
    /^NSTP\b/,
    /^FIL\b/,
    /^HUM\b/,
    /^SOC\b/,
    /^HIST\b/,
    /^RIZAL\b/,
  ];

  for (const pattern of minorPatterns) {
    if (pattern.test(code) || pattern.test(title)) return false;
  }

  for (const pattern of majorPatterns) {
    if (pattern.test(code) || pattern.test(title)) return true;
  }

  return true; // Default to major if unspecified in specialized CCS timetable
}

/**
 * Deterministic multi-tier comparator for class schedule items.
 */
export function compareScheduleItems(
  a: ClassScheduleItem,
  b: ClassScheduleItem,
  sortMode: SortOption = "time_asc"
): number {
  // 1. If sorting by Course Code A-Z
  if (sortMode === "course_code") {
    const codeCmp = a.courseCode.localeCompare(b.courseCode);
    if (codeCmp !== 0) return codeCmp;
    return parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime);
  }

  // 2. If sorting by Priority (Major First, then Minor)
  if (sortMode === "priority_major") {
    const aMajor = isMajorSubject(a.courseCode, a.courseTitle);
    const bMajor = isMajorSubject(b.courseCode, b.courseTitle);

    if (aMajor && !bMajor) return -1;
    if (!aMajor && bMajor) return 1;

    // Within same priority group, sort chronologically by start time
    const timeDiff = parseTimeToMinutes(a.startTime) - parseTimeToMinutes(b.startTime);
    if (timeDiff !== 0) return timeDiff;

    const endDiff = parseTimeToMinutes(a.endTime) - parseTimeToMinutes(b.endTime);
    if (endDiff !== 0) return endDiff;

    return a.courseCode.localeCompare(b.courseCode);
  }

  // 3. Chronological Time Sorting
  const aMinutes = parseTimeToMinutes(a.startTime);
  const bMinutes = parseTimeToMinutes(b.startTime);

  if (sortMode === "time_desc") {
    const diff = bMinutes - aMinutes;
    if (diff !== 0) return diff;
    return parseTimeToMinutes(b.endTime) - parseTimeToMinutes(a.endTime);
  }

  // Default: "time_asc" (Earliest to Latest)
  const diff = aMinutes - bMinutes;
  if (diff !== 0) return diff;

  // Secondary tie-breaker: End Time
  const endDiff = parseTimeToMinutes(a.endTime) - parseTimeToMinutes(b.endTime);
  if (endDiff !== 0) return endDiff;

  // Tertiary tie-breaker: Course Code
  return a.courseCode.localeCompare(b.courseCode);
}

/**
 * Sorts an array of schedule items deterministically.
 */
export function sortScheduleItems(
  items: ClassScheduleItem[],
  sortMode: SortOption = "time_asc"
): ClassScheduleItem[] {
  return [...items].sort((a, b) => compareScheduleItems(a, b, sortMode));
}

/**
 * Maps day of week string to canonical DayOfWeek type.
 */
export function normalizeDayOfWeek(day: string): DayOfWeek {
  const clean = day.trim().toLowerCase();
  if (clean.startsWith("mon")) return "Mon";
  if (clean.startsWith("tue")) return "Tue";
  if (clean.startsWith("wed")) return "Wed";
  if (clean.startsWith("thu")) return "Thu";
  if (clean.startsWith("fri")) return "Fri";
  if (clean.startsWith("sat")) return "Sat";
  return "Sun";
}
