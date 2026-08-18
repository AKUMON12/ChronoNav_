"use client";

import React from "react";
import { Layers, Footprints } from "lucide-react";

interface FloorSelectorProps {
  floors?: number[];
  activeFloor: number;
  onSelectFloor: (floor: number) => void;
  floorsInRoute?: number[]; // Floors that the active pathfinding route passes through
}

export function FloorSelector({
  floors = [1, 2, 3, 4, 5],
  activeFloor,
  onSelectFloor,
  floorsInRoute = [],
}: FloorSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-2 bg-card/95 backdrop-blur border border-border rounded-2xl p-2.5 shadow-2xl w-24 transition-colors duration-200">
      {/* Header Label */}
      <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground pb-1.5 px-1 border-b border-border w-full justify-center tracking-wider">
        <Layers className="size-3.5 text-primary" />
        <span>FLOOR</span>
      </div>

      {/* Vertical Floor Buttons Stack (5F down to 1F) */}
      <div className="flex flex-col gap-1.5 w-full">
        {floors
          .slice()
          .sort((a, b) => b - a)
          .map((floor) => {
            const isActive = floor === activeFloor;
            const isRouteFloor = floorsInRoute.includes(floor);

            return (
              <button
                key={floor}
                onClick={() => onSelectFloor(floor)}
                className={`relative flex items-center justify-between rounded-xl h-10 w-full px-3 text-xs font-black transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/35 scale-[1.04]"
                    : isRouteFloor
                    ? "bg-primary/10 text-primary border border-primary/50 hover:bg-primary/20"
                    : "bg-muted/40 text-muted-foreground border border-border hover:bg-accent hover:text-foreground"
                }`}
                aria-label={`Switch to Floor ${floor}`}
                aria-pressed={isActive}
              >
                <span>{floor}F</span>

                {/* Indicator Badge for Route Floors */}
                {isRouteFloor && !isActive && (
                  <span className="flex items-center justify-center size-4 rounded-full bg-primary/20 text-primary animate-pulse">
                    <Footprints className="size-2.5" />
                  </span>
                )}

                {/* Active Floor Marker */}
                {isActive && (
                  <span className="size-2 rounded-full bg-white shadow-sm" />
                )}
              </button>
            );
          })}
      </div>
    </div>
  );
}
