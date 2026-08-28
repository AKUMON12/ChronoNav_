"use client";

import React from "react";
import { Layers, Footprints } from "lucide-react";
import { FloorLevel } from "@/lib/navigation/pathfinding";

interface FloorSelectorProps {
  floors?: FloorLevel[];
  activeFloor: FloorLevel;
  onSelectFloor: (floor: FloorLevel) => void;
  floorsInRoute?: FloorLevel[]; // Floors that the active pathfinding route passes through
}

export function FloorSelector({
  floors = [7, 6, 5, 4, 3, 2, "M", 1],
  activeFloor,
  onSelectFloor,
  floorsInRoute = [],
}: FloorSelectorProps) {
  // Ordered top to bottom: 7F -> 6F -> 5F -> 4F -> 3F -> 2F -> MF -> 1F
  const defaultOrder: FloorLevel[] = [7, 6, 5, 4, 3, 2, "M", 1];
  const sortedFloors = defaultOrder.filter((f) => floors.includes(f));

  return (
    <div className="flex flex-col items-center gap-1.5 bg-card/95 backdrop-blur border border-border rounded-2xl p-2 shadow-2xl w-20 sm:w-24 transition-colors duration-200">
      {/* Header Label */}
      <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-black text-muted-foreground pb-1 px-1 border-b border-border w-full justify-center tracking-wider">
        <Layers className="size-3 text-primary" />
        <span>FLOOR</span>
      </div>

      {/* Vertical Floor Buttons Stack (7F down to 1F) */}
      <div className="flex flex-col gap-1 w-full max-h-[320px] sm:max-h-[380px] overflow-y-auto pr-0.5">
        {sortedFloors.map((floor) => {
          const isActive = floor === activeFloor;
          const isRouteFloor = floorsInRoute.includes(floor);
          const label = floor === "M" ? "MF" : `${floor}F`;

          return (
            <button
              key={String(floor)}
              onClick={() => onSelectFloor(floor)}
              className={`relative flex items-center justify-between rounded-xl h-8 sm:h-9 w-full px-2.5 text-xs font-black transition-all duration-200 ${
                isActive
                  ? "bg-primary text-white shadow-md shadow-primary/35 scale-[1.03]"
                  : isRouteFloor
                  ? "bg-primary/15 text-primary border border-primary/50 hover:bg-primary/25"
                  : "bg-muted/40 text-muted-foreground border border-border hover:bg-accent hover:text-foreground"
              }`}
              aria-label={`Switch to ${floor === "M" ? "Mezzanine Floor" : `Floor ${floor}`}`}
              aria-pressed={isActive}
            >
              <span>{label}</span>

              {/* Indicator Badge for Route Floors */}
              {isRouteFloor && !isActive && (
                <span className="flex items-center justify-center size-3.5 rounded-full bg-primary/20 text-primary animate-pulse">
                  <Footprints className="size-2" />
                </span>
              )}

              {/* Active Floor Dot Marker */}
              {isActive && (
                <span className="size-1.5 rounded-full bg-white shadow-sm" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
