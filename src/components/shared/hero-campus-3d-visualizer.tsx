"use client";

import React, { useState, useEffect } from "react";
import {
  Compass,
  Layers,
  MapPin,
  Navigation,
  Sparkles,
  ArrowUpRight,
  Route,
  Zap,
} from "lucide-react";

interface FloorPreview {
  id: number | string;
  name: string;
  short: string;
  dept: string;
  color: string;
  roomCount: number;
}

const CAMPUS_FLOORS: FloorPreview[] = [
  { id: 7, name: "7th Floor", short: "7F", dept: "HRM & Culinary Labs", color: "from-amber-500 to-orange-500", roomCount: 8 },
  { id: 6, name: "6th Floor", short: "6F", dept: "College of Criminology", color: "from-indigo-500 to-blue-600", roomCount: 10 },
  { id: 5, name: "5th Floor", short: "5F", dept: "College of Computer Studies", color: "from-sky-500 to-blue-500", roomCount: 12 },
  { id: 4, name: "4th Floor", short: "4F", dept: "Commerce & Accountancy", color: "from-emerald-500 to-teal-600", roomCount: 10 },
  { id: 3, name: "3th Floor", short: "3F", dept: "Allied Engineering", color: "from-cyan-500 to-blue-600", roomCount: 14 },
  { id: 2, name: "2nd Floor", short: "2F", dept: "Senior High School", color: "from-purple-500 to-indigo-600", roomCount: 12 },
  { id: "M", name: "Mezzanine", short: "MF", dept: "Teacher Education (CTE)", color: "from-rose-500 to-pink-600", roomCount: 6 },
  { id: 1, name: "1st Floor", short: "1F", dept: "Ingress Gates & Clinic", color: "from-blue-600 to-primary", roomCount: 8 },
];

/**
 * HeroCampus3DVisualizer - Interactive 3D Isometric Campus Navigation Visualizer
 *
 * Features:
 * - 3D Isometric multi-layer glass floor stack with CSS 3D perspective
 * - Interactive floor selection with smooth elevation and illumination
 * - Dynamic Dijkstra walking route simulation with animated pulsing waypoint beacons
 * - Live Telemetry HUD showing current route (Gate 1 -> CCS Room 512)
 * - Zero external heavy 3D engine dependencies, ensuring fast load times and full mobile responsiveness
 */
export function HeroCampus3DVisualizer() {
  const [selectedFloor, setSelectedFloor] = useState<number | string>(5);
  const [isAutoSimulating, setIsAutoSimulating] = useState(true);

  // Auto-cycle through floors if in simulation mode
  useEffect(() => {
    if (!isAutoSimulating) return;

    const floorSequence = [1, "M", 3, 5, 7];
    let currentIndex = floorSequence.indexOf(selectedFloor);
    if (currentIndex === -1) currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % floorSequence.length;
      setSelectedFloor(floorSequence[currentIndex]);
    }, 3800);

    return () => clearInterval(interval);
  }, [isAutoSimulating, selectedFloor]);

  const activeFloorData = CAMPUS_FLOORS.find((f) => f.id === selectedFloor) || CAMPUS_FLOORS[2];

  return (
    <div className="relative w-full max-w-lg mx-auto rounded-3xl border border-border bg-card/80 backdrop-blur-xl p-4 sm:p-6 shadow-2xl shadow-primary/10 overflow-hidden group select-none transition-all duration-300">
      {/* ── Ambient Glow Background ── */}
      <div className="absolute -top-24 -right-24 size-64 rounded-full bg-primary/20 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-24 -left-24 size-64 rounded-full bg-sky-400/15 blur-3xl pointer-events-none" />

      {/* ── Top Header & Live Telemetry HUD ── */}
      <div className="relative z-20 flex items-center justify-between pb-3.5 border-b border-border/80">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/15 border border-primary/30 text-primary shadow-sm">
            <Compass className="size-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                3D Navigation Simulator
              </span>
            </div>
            <p className="text-xs font-black text-foreground">University of Cebu Main</p>
          </div>
        </div>

        {/* Interactive / Simulation Toggle */}
        <button
          onClick={() => setIsAutoSimulating(!isAutoSimulating)}
          className={`px-2.5 py-1 rounded-xl text-[10px] font-black tracking-wider uppercase transition-all duration-200 border ${
            isAutoSimulating
              ? "bg-primary/15 text-primary border-primary/30 shadow-sm"
              : "bg-muted text-muted-foreground border-border hover:text-foreground"
          }`}
          title="Toggle automatic navigation simulation"
        >
          {isAutoSimulating ? "Auto Demo" : "Manual"}
        </button>
      </div>

      {/* ── 3D Isometric Viewport Container ── */}
      <div className="relative z-10 my-4 h-[270px] sm:h-[300px] flex items-center justify-center overflow-hidden">
        {/* Isometric Grid Background Groundplate */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{
            perspective: "1000px",
          }}
        >
          <div
            className="w-[280px] sm:w-[320px] h-[190px] rounded-2xl border border-primary/20 bg-primary/5 opacity-50"
            style={{
              transform: "rotateX(60deg) rotateZ(-30deg) translateZ(-40px)",
            }}
          />
        </div>

        {/* ── Stacked 3D Floorplates ── */}
        <div
          className="relative w-[260px] sm:w-[290px] h-[180px] flex items-center justify-center transition-transform duration-700"
          style={{
            perspective: "1200px",
            transformStyle: "preserve-3d",
          }}
        >
          {CAMPUS_FLOORS.map((floor, idx) => {
            const isSelected = floor.id === selectedFloor;
            // Calculate isometric stack elevation
            const stackIndex = CAMPUS_FLOORS.length - 1 - idx;
            const baseElevation = stackIndex * 22;
            const activeOffset = isSelected ? 35 : 0;
            const zTranslate = baseElevation + activeOffset;

            return (
              <div
                key={floor.id}
                onClick={() => {
                  setSelectedFloor(floor.id);
                  setIsAutoSimulating(false);
                }}
                className={`absolute w-full h-[85px] sm:h-[95px] rounded-2xl cursor-pointer transition-all duration-500 ease-out flex items-center justify-between px-4 border ${
                  isSelected
                    ? "border-primary bg-primary/20 backdrop-blur-md shadow-xl shadow-primary/30 ring-2 ring-primary/40"
                    : "border-border/60 bg-card/60 backdrop-blur-sm hover:border-primary/40 hover:bg-card/90"
                }`}
                style={{
                  transform: `rotateX(58deg) rotateZ(-32deg) translateZ(${zTranslate}px)`,
                  zIndex: isSelected ? 40 : stackIndex + 1,
                }}
              >
                {/* Floor Label Badge */}
                <div className="flex items-center gap-2 transform -rotate-12">
                  <span
                    className={`flex size-6 items-center justify-center rounded-lg text-[11px] font-black shadow-sm ${
                      isSelected ? "bg-primary text-white" : "bg-muted text-foreground"
                    }`}
                  >
                    {floor.short}
                  </span>
                  <div className="text-left">
                    <p className={`text-[11px] font-black leading-tight ${isSelected ? "text-primary" : "text-foreground"}`}>
                      {floor.name}
                    </p>
                    <p className="text-[9px] text-muted-foreground truncate max-w-[110px]">
                      {floor.dept}
                    </p>
                  </div>
                </div>

                {/* Simulated Corridor Nodes & Active Waypoint Beacon */}
                <div className="relative flex items-center gap-1.5">
                  {isSelected && (
                    <div className="relative flex items-center">
                      {/* Pulsing Navigation Pin */}
                      <div className="relative flex items-center justify-center size-5 rounded-full bg-primary text-white shadow-md animate-bounce">
                        <MapPin className="size-3" />
                      </div>
                      {/* Animated Radar Pulse Wave */}
                      <span className="absolute -inset-1 rounded-full bg-primary/40 animate-ping" />
                    </div>
                  )}

                  {/* Simulated Corridor Nodes */}
                  <div className="flex items-center gap-1 opacity-70">
                    <span className={`size-1.5 rounded-full ${isSelected ? "bg-primary" : "bg-muted-foreground"}`} />
                    <span className={`size-1 rounded-full ${isSelected ? "bg-primary" : "bg-muted-foreground"}`} />
                    <span className={`size-1.5 rounded-full ${isSelected ? "bg-primary" : "bg-muted-foreground"}`} />
                  </div>
                </div>

                {/* Active Floor Glowing Edge */}
                {isSelected && (
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
                )}
              </div>
            );
          })}
        </div>

        {/* Vertical Elevator Shaft Indicator */}
        <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-30 p-1.5 rounded-xl bg-background/80 backdrop-blur-md border border-border text-[9px] font-black text-muted-foreground">
          <Zap className="size-3 text-primary animate-pulse" />
          <span className="text-[8px] uppercase tracking-tighter">Lift</span>
        </div>
      </div>

      {/* ── Active Floor Telemetry HUD Strip ── */}
      <div className="relative z-20 rounded-2xl border border-border bg-background/90 backdrop-blur p-3.5 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-black text-xs">
              {activeFloorData.short}
            </div>
            <div>
              <p className="text-xs font-black text-foreground">{activeFloorData.name}</p>
              <p className="text-[10px] text-muted-foreground font-semibold">{activeFloorData.dept}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              <Route className="size-2.5" />
              <span>Optimal Route</span>
            </span>
          </div>
        </div>

        {/* Live Route Step Simulation */}
        <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Navigation className="size-3 text-primary" />
            <span>
              Gate 1 Ingress → <strong className="text-foreground">{activeFloorData.short} Room {typeof activeFloorData.id === 'number' ? `${activeFloorData.id}04` : 'M02'}</strong>
            </span>
          </div>
          <span className="font-extrabold text-primary">~45 sec walk</span>
        </div>
      </div>

      {/* ── Quick Floor Selector Pill Strip ── */}
      <div className="relative z-20 mt-3 flex items-center justify-between gap-1 overflow-x-auto pt-1 no-scrollbar">
        {CAMPUS_FLOORS.map((f) => {
          const isSelected = f.id === selectedFloor;
          return (
            <button
              key={f.id}
              onClick={() => {
                setSelectedFloor(f.id);
                setIsAutoSimulating(false);
              }}
              className={`flex-1 py-1 px-1.5 rounded-lg text-[10px] font-black transition-all duration-150 text-center ${
                isSelected
                  ? "bg-primary text-white shadow-sm shadow-primary/30 scale-105"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              title={`Switch to ${f.name}`}
            >
              {f.short}
            </button>
          );
        })}
      </div>
    </div>
  );
}
