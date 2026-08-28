"use client";

import React, { useState, useRef, useEffect } from "react";
import { Node, Waypoint, FloorLevel } from "@/lib/navigation/pathfinding";
import { CAMPUS_FLOORS_CONFIG } from "@/types/navigation";

interface InteractiveSVGMapProps {
  currentFloor: FloorLevel;
  graph: Record<string, Node>;
  waypoints: Waypoint[];
  startNodeId?: string;
  targetNodeId?: string;
  onSelectNode?: (nodeId: string) => void;
  zoomLevel: number;
  interactive?: boolean;
}

export function InteractiveSVGMap({
  currentFloor,
  graph,
  waypoints,
  startNodeId,
  targetNodeId,
  onSelectNode,
  zoomLevel,
  interactive = true,
}: InteractiveSVGMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Pan offset state for dragging
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Touch gesture state for mobile pinch-to-zoom and pan
  const touchDistanceRef = useRef<number | null>(null);

  // Reset pan when switching floors or recentering
  const activeFloorConfig = CAMPUS_FLOORS_CONFIG.find((f) => f.id === currentFloor) || CAMPUS_FLOORS_CONFIG[7];

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !interactive) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch gesture handlers for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!interactive) return;
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchDistanceRef.current = Math.hypot(dx, dy);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!interactive) return;
    if (e.touches.length === 1 && isDragging) {
      setPan({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchDistanceRef.current = null;
  };

  // Filter nodes belonging to active floor
  const floorNodes = Object.values(graph).filter((node) => node.floor === currentFloor);

  // Filter path waypoints belonging to current floor
  const currentFloorWaypoints = waypoints.filter((wp) => wp.floor === currentFloor);

  // Generate SVG path 'd' string connecting waypoints on this floor
  const pathDAttribute = currentFloorWaypoints.reduce((acc, wp, idx) => {
    return idx === 0 ? `M ${wp.x} ${wp.y}` : `${acc} L ${wp.x} ${wp.y}`;
  }, "");

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: "none" }}
      className={`relative w-full h-[450px] sm:h-[550px] lg:h-[620px] overflow-hidden rounded-3xl border border-border bg-slate-50 dark:bg-[#090E14] shadow-2xl flex items-center justify-center p-2 select-none transition-colors ${
        isDragging ? "cursor-grabbing" : interactive ? "cursor-grab" : "cursor-default"
      }`}
    >
      {/* Background Architectural Blueprint Grid Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-15 dark:opacity-10 pointer-events-none">
        <defs>
          <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-400 dark:text-[#507495]" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>

      {/* SVG Map Canvas with Zoom & Pan Transform */}
      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-75 ease-out origin-center"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
        }}
      >
        <svg
          viewBox="0 0 1191 842"
          className="w-full h-full max-w-full max-h-full drop-shadow-md dark:drop-shadow-2xl"
          aria-label={`University of Cebu Main Campus — ${activeFloorConfig.name} Map`}
        >
          <defs>
            {/* Glowing route effect */}
            <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Gradients for UI Nodes */}
            <linearGradient id="roomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#F1F5F9" stopOpacity="0.95" />
            </linearGradient>

            <linearGradient id="highlightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1D7DD7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* ════════ LAYER 1: Base Architectural SVG Blueprint ════════ */}
          <image
            href={activeFloorConfig.svgFile}
            x="0"
            y="0"
            width="1191"
            height="842"
            preserveAspectRatio="xMidYMid meet"
            className="opacity-95 dark:opacity-85 filter contrast-125 dark:contrast-100"
          />

          {/* ════════ LAYER 2: Animated Dijkstra Walking Route Polyline ════════ */}
          {pathDAttribute && (
            <g className="route-overlay pointer-events-none">
              {/* Outer Glow Polyline */}
              <path
                d={pathDAttribute}
                stroke="#1D7DD7"
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity="0.5"
                filter="url(#route-glow)"
              />
              {/* Main Solid Primary Color Path */}
              <path
                d={pathDAttribute}
                stroke="#1D7DD7"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              {/* Dashed White Inner Animated Directional Track */}
              <path
                d={pathDAttribute}
                stroke="#FFFFFF"
                strokeWidth="3"
                strokeDasharray="14 10"
                strokeLinecap="round"
                fill="none"
                className="animate-pulse"
              />
            </g>
          )}

          {/* ════════ LAYER 3: Interactive Graph Node Markers & POIs ════════ */}
          <g className="graph-nodes">
            {floorNodes.map((node) => {
              const isStart = node.id === startNodeId;
              const isTarget = node.id === targetNodeId;
              const isWay = currentFloorWaypoints.some((wp) => wp.x === node.x && wp.y === node.y);

              let nodeFill = "#1D7DD7"; // ChronoNav Primary Blue
              let ringColor = "#38BDF8";
              let radius = 10;

              if (isStart) {
                nodeFill = "#10B981"; // Emerald Green for Ingress/Start
                ringColor = "#34D399";
                radius = 14;
              } else if (isTarget) {
                nodeFill = "#EF4444"; // Crimson Red for Target Destination
                ringColor = "#F87171";
                radius = 14;
              } else if (node.type === "stairs") {
                nodeFill = "#6366F1"; // Indigo for Stairwells
                ringColor = "#818CF8";
                radius = 11;
              } else if (node.type === "elevator") {
                nodeFill = "#059669"; // Jade for Elevators
                ringColor = "#10B981";
                radius = 11;
              } else if (node.type === "entrance") {
                nodeFill = "#10B981";
                radius = 12;
              }

              return (
                <g
                  key={node.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectNode) onSelectNode(node.id);
                  }}
                  className="cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                  role="button"
                  tabIndex={0}
                  aria-label={`Select ${node.name}`}
                >
                  {/* Outer Pulsing Beacon Aura for Active Route / Selection */}
                  {(isStart || isTarget || isWay) && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={radius + 12}
                      fill="none"
                      stroke={ringColor}
                      strokeWidth="2.5"
                      className="opacity-75 animate-ping origin-center"
                    />
                  )}

                  {/* Solid Central Node Circle with Drop Shadow */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius}
                    fill={nodeFill}
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                    className="shadow-xl"
                  />

                  {/* Node Label Pill Background & Text */}
                  <g className="pointer-events-none select-none">
                    <rect
                      x={node.x - Math.max(35, node.name.length * 3.8)}
                      y={node.y - 32}
                      width={Math.max(70, node.name.length * 7.6)}
                      height="20"
                      rx="6"
                      fill="#FFFFFF"
                      fillOpacity="0.95"
                      stroke="#CBD5E1"
                      strokeWidth="1"
                      className="dark:fill-[#0B1015] dark:fill-opacity-90 dark:stroke-[#507495] shadow-sm"
                    />
                    <text
                      x={node.x}
                      y={node.y - 18}
                      textAnchor="middle"
                      fill="#0F172A"
                      className="dark:fill-[#F8FAFC] text-[11px] font-black tracking-tight"
                    >
                      {node.name}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* ── Floor Badge & Departments Watermark (Top Left) ── */}
      <div className="absolute top-3 left-3 bg-white/95 dark:bg-[#0B1015]/90 backdrop-blur border border-border dark:border-[#507495]/30 px-3.5 py-2 rounded-2xl text-xs space-y-0.5 shadow-lg pointer-events-none max-w-[280px] hidden sm:block">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-[#1D7DD7] inline-block animate-pulse" />
          <span className="text-foreground text-xs font-black tracking-tight">
            {activeFloorConfig.name}
          </span>
        </div>
        <p className="text-[10px] font-semibold text-muted-foreground truncate">
          {activeFloorConfig.departments.slice(0, 2).join(" • ")}
        </p>
      </div>

      {/* ── Interactive Map Legend (Bottom Left) ── */}
      <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-[#0B1015]/90 backdrop-blur border border-border dark:border-[#507495]/30 px-3 py-2 rounded-2xl text-xs space-y-1 shadow-lg pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500 inline-block shadow-sm" />
          <span className="text-foreground text-[10px] font-bold">Start Origin</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-rose-500 inline-block shadow-sm" />
          <span className="text-foreground text-[10px] font-bold">Destination</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-[#1D7DD7] inline-block shadow-sm" />
          <span className="text-foreground text-[10px] font-bold">Dijkstra Walking Path</span>
        </div>
      </div>
    </div>
  );
}
