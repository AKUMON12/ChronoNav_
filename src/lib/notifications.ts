export interface CampusNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: "announcement" | "reminder" | "navigation" | "system";
  priority: "urgent" | "important" | "normal";
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  roomTarget?: string;
}

export const INITIAL_NOTIFICATIONS: CampusNotification[] = [
  {
    id: "notif-1",
    title: "1st Semester Midterm Examination Rooms Published",
    message: "Midterm room assignments across Floors 1 through 5 of the CCS Building are now active in your student schedule.",
    timestamp: "10 minutes ago",
    category: "announcement",
    priority: "urgent",
    read: false,
    actionUrl: "/schedule",
    actionLabel: "View Schedule",
  },
  {
    id: "notif-2",
    title: "Class Transition: CS 301 - Data Structures & Algorithms",
    message: "Your upcoming lecture begins in 15 minutes at CCS 538 (5th Floor). Tap below for turn-by-turn indoor directions.",
    timestamp: "25 minutes ago",
    category: "reminder",
    priority: "important",
    read: false,
    actionUrl: "/map",
    actionLabel: "Start Navigation",
    roomTarget: "CCS 538",
  },
  {
    id: "notif-3",
    title: "Elevator 2 Scheduled Maintenance",
    message: "Floor 4 elevator servicing scheduled today from 4:00 PM to 6:00 PM. Please use the central stairwell.",
    timestamp: "2 hours ago",
    category: "announcement",
    priority: "normal",
    read: false,
  },
  {
    id: "notif-4",
    title: "Study Load OCR Scanner Synchronized",
    message: "5 courses and 10 classroom slots were automatically parsed and added to your weekly timeline.",
    timestamp: "Yesterday",
    category: "system",
    priority: "normal",
    read: true,
    actionUrl: "/schedule",
    actionLabel: "Open Classes",
  },
  {
    id: "notif-5",
    title: "Innovation Lab 501 Open Hackathon Registration",
    message: "Annual Inter-College Software Development Hackathon is now accepting student applications at the 5th floor.",
    timestamp: "2 days ago",
    category: "announcement",
    priority: "normal",
    read: true,
  },
];

const STORAGE_KEY = "chrononav_campus_notifications";

/** Retrieve persisted notifications with fallback to INITIAL_NOTIFICATIONS */
export function getStoredNotifications(): CampusNotification[] {
  if (typeof window === "undefined") return INITIAL_NOTIFICATIONS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Fallback to initial notifications
  }
  return INITIAL_NOTIFICATIONS;
}

/** Save notifications array to localStorage and notify listeners */
export function saveStoredNotifications(notifications: CampusNotification[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    window.dispatchEvent(new CustomEvent("chrononav:notifications_updated"));
  } catch {
    // Ignore storage quota errors
  }
}
