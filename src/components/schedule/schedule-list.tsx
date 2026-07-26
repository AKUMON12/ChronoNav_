import React from "react";
import { Clock, MapPin, ArrowRight } from "lucide-react";
import { ClassScheduleItem } from "@/types/schedule";

interface ScheduleListProps {
  /** Array of class schedule items to display */
  items: ClassScheduleItem[];
  /** ID of the currently active/next class (highlighted) */
  activeItemId?: string;
  /** Callback when "Navigate" is clicked on a schedule item */
  onNavigate?: (item: ClassScheduleItem) => void;
}

/**
 * Renders a list of class schedule cards for the student dashboard.
 * Highlights the current/next class and provides a quick "Navigate" action.
 * Uses ChronoNav design tokens from globals.css.
 */
export function ScheduleList({ items, activeItemId, onNavigate }: ScheduleListProps) {
  if (items.length === 0) {
    return (
      <div className="w-full rounded-xl border border-border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">
          No classes scheduled. Upload your study load to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isActive = item.id === activeItemId;

        return (
          <div
            key={item.id}
            className={`flex items-center justify-between gap-4 rounded-xl border p-4 transition-colors ${
              isActive
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border bg-card hover:bg-accent/30"
            }`}
          >
            {/* Left: Time block */}
            <div className="flex items-start gap-3">
              <div
                className={`flex flex-col items-center justify-center rounded-lg px-3 py-2 text-xs font-bold ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <span>{item.startTime}</span>
                <span className="text-[10px] opacity-70">to</span>
                <span>{item.endTime}</span>
              </div>

              {/* Center: Course details */}
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground leading-tight">
                  {item.courseTitle}
                </p>
                <p className="text-xs text-muted-foreground">{item.courseCode}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground pt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" />
                    {item.building} — {item.room}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {item.dayOfWeek}
                  </span>
                </div>
                {item.instructor && (
                  <p className="text-xs text-muted-foreground">
                    Instructor: {item.instructor}
                  </p>
                )}
              </div>
            </div>

            {/* Right: Navigate action */}
            {onNavigate && (
              <button
                onClick={() => onNavigate(item)}
                className={`flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-bold transition-colors shrink-0 ${
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-foreground hover:bg-accent"
                }`}
                aria-label={`Navigate to ${item.room}`}
              >
                <span className="hidden sm:inline">Navigate</span>
                <ArrowRight className="size-3.5" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
