"use client";

import React from "react";
import { Layers, Footprints } from "lucide-react";

interface FloorSelectorProps {
  floors: number[];
  activeFloor: number;
  onSelectFloor: (floor: number) => void;
  floorsInRoute?: number[]; // Floors that the active pathfinding route passes through
}

export function FloorSelector({
  floors,
  activeFloor,
  onSelectFloor,
  floorsInRoute = [],
}: FloorSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-2 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-2xl p-2.5 shadow-xl w-24">
      {/* Header Label */}
      <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 pb-1.5 px-1 border-b border-slate-800 w-full justify-center tracking-wider">
        <Layers className="size-3.5 text-[#1D7DD7]" />
        <span>FLOOR</span>
      </div>

      {/* Vertical Floor Buttons Stack */}
      <div className="flex flex-col gap-1.5 w-full">
        {floors.map((floor) => {
          const isActive = floor === activeFloor;
          const isRouteFloor = floorsInRoute.includes(floor);

          return (
            <button
              key={floor}
              onClick={() => onSelectFloor(floor)}
              className={`relative flex items-center justify-between rounded-xl h-10 w-full px-3 text-xs font-bold transition-all duration-200 ${
                isActive
                  ? "bg-[#1D7DD7] text-white shadow-lg shadow-[#1D7DD7]/30 scale-[1.03]"
                  : isRouteFloor
                  ? "bg-slate-800/80 text-[#1D7DD7] border border-[#1D7DD7]/40 hover:bg-slate-800"
                  : "bg-slate-950/60 text-slate-400 border border-slate-800/60 hover:bg-slate-800 hover:text-slate-200"
              }`}
              aria-label={`Switch to Floor ${floor}`}
              aria-pressed={isActive}
            >
              <span>{floor}F</span>

              {/* Indicator Badge for Route Floors */}
              {isRouteFloor && !isActive && (
                <span className="flex items-center justify-center size-4 rounded-full bg-[#1D7DD7]/20 text-[#1D7DD7] animate-pulse">
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

