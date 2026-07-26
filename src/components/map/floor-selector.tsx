"use client";

import React from "react";
import { Layers } from "lucide-react";

interface FloorSelectorProps {
  floors: number[];
  activeFloor: number;
  onSelectFloor: (floor: number) => void;
}

export function FloorSelector({ floors, activeFloor, onSelectFloor }: FloorSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-1.5 bg-card border border-border rounded-xl p-2 shadow-sm">
      <div className="flex items-center gap-1 text-xs font-bold text-muted-foreground pb-1 px-1 border-b border-border w-full justify-center">
        <Layers className="size-3.5 text-primary" />
        <span>FLOOR</span>
      </div>

      <div className="flex flex-col gap-1 w-full">
        {floors.map((floor) => {
          const isActive = floor === activeFloor;
          return (
            <button
              key={floor}
              onClick={() => onSelectFloor(floor)}
              className={`flex items-center justify-center rounded-lg h-9 w-full px-3 text-xs font-bold transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/50 text-foreground hover:bg-accent hover:text-foreground"
              }`}
              aria-label={`Switch to Floor ${floor}`}
              aria-pressed={isActive}
            >
              {floor}F
            </button>
          );
        })}
      </div>
    </div>
  );
}
