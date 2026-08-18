"use client";

import React, { useState, useRef } from "react";
import { Node, Waypoint } from "@/lib/navigation/pathfinding";

interface InteractiveSVGMapProps {
  currentFloor: number;
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
      className={`relative w-full h-[450px] sm:h-[550px] lg:h-[600px] overflow-hidden rounded-3xl border border-[#507495]/25 bg-[#0E151B] shadow-2xl flex items-center justify-center p-4 select-none ${
        isDragging ? "cursor-grabbing" : interactive ? "cursor-grab" : "cursor-default"
      }`}
    >
      {/* Background Architectural Blueprint Grid Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none">
        <defs>
          <pattern id="grid-pattern" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#507495" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>

      {/* SVG Map Canvas with Zoom & Pan Transform */}
      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-100 ease-out origin-center"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel})`,
        }}
      >
        <svg
          viewBox="0 0 600 600"
          className="w-full h-full max-w-[600px] max-h-[600px] drop-shadow-2xl"
          aria-label={`University of Cebu CCS Building Floor ${currentFloor} Blueprint Map`}
        >
          <defs>
            {/* Glowing route effect */}
            <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Gradient for Rooms */}
            <linearGradient id="roomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#141E28" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0B1015" stopOpacity="0.95" />
            </linearGradient>

            {/* Gradient for Highlighted Room */}
            <linearGradient id="highlightRoomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1D7DD7" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#141E28" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {/* Building Blueprint Base Floorplan Outline */}
          <g className="floorplan-base">
            {/* Outer Wall Boundary */}
            <rect
              x="40"
              y="40"
              width="520"
              height="520"
              rx="24"
              fill="#090E13"
              stroke="#507495"
              strokeWidth="4"
              opacity="0.95"
            />

            {/* Common Hallways & Corridors Track */}
            <rect x="150" y="420" width="270" height="60" rx="12" fill="#141E28" stroke="#507495" strokeWidth="1" opacity="0.6" />
            <rect x="420" y="350" width="100" height="130" rx="12" fill="#141E28" stroke="#507495" strokeWidth="1" opacity="0.6" />

            {/* ════════ FLOOR 1 LAYOUT ════════ */}
            {currentFloor === 1 && (
              <g id="floor-1-rooms">
                {/* Gate 1 Entrance */}
                <rect x="60" y="410" width="80" height="80" rx="12" fill="url(#roomGrad)" stroke="#1D7DD7" strokeWidth="2.5" />
                <text x="100" y="455" textAnchor="middle" fill="#38BDF8" className="text-[11px] font-black">Gate 1 Entrance</text>

                {/* Security Desk */}
                <rect x="90" y="350" width="60" height="50" rx="8" fill="url(#roomGrad)" stroke="#507495" strokeWidth="1.5" />
                <text x="120" y="380" textAnchor="middle" fill="#94A3B8" className="text-[10px] font-bold">Guard Desk</text>

                {/* Mac Lab 101 */}
                <rect x="160" y="160" width="120" height="180" rx="14" fill="url(#roomGrad)" stroke="#1D7DD7" strokeWidth="2" />
                <text x="220" y="245" textAnchor="middle" fill="#38BDF8" className="text-[13px] font-black">Mac Lab 101</text>
                <text x="220" y="265" textAnchor="middle" fill="#74777E" className="text-[9px] font-semibold">45 Apple Workstations</text>

                {/* Canteen */}
                <rect x="60" y="120" width="80" height="160" rx="14" fill="url(#roomGrad)" stroke="#507495" strokeWidth="2" />
                <text x="100" y="200" textAnchor="middle" fill="#E2E8F0" className="text-[11px] font-bold">CCS Canteen</text>

                {/* Student Affairs */}
                <rect x="320" y="160" width="120" height="180" rx="14" fill="url(#roomGrad)" stroke="#507495" strokeWidth="2" />
                <text x="380" y="250" textAnchor="middle" fill="#E2E8F0" className="text-[11px] font-bold">Student Affairs</text>

                {/* Ground Restrooms */}
                <rect x="440" y="470" width="80" height="60" rx="10" fill="url(#roomGrad)" stroke="#507495" strokeWidth="1.5" />
                <text x="480" y="505" textAnchor="middle" fill="#74777E" className="text-[10px] font-bold">Restrooms</text>
              </g>
            )}

            {/* ════════ FLOOR 2 LAYOUT ════════ */}
            {currentFloor === 2 && (
              <g id="floor-2-rooms">
                {/* Programming Lab 201 */}
                <rect x="290" y="160" width="120" height="180" rx="14" fill="url(#roomGrad)" stroke="#1D7DD7" strokeWidth="2" />
                <text x="350" y="245" textAnchor="middle" fill="#38BDF8" className="text-[13px] font-black">Prog Lab 201</text>
                <text x="350" y="265" textAnchor="middle" fill="#74777E" className="text-[9px] font-semibold">CL2 • Code Studio</text>

                {/* Lecture 202 */}
                <rect x="120" y="220" width="120" height="120" rx="14" fill="url(#roomGrad)" stroke="#507495" strokeWidth="2" />
                <text x="180" y="280" textAnchor="middle" fill="#E2E8F0" className="text-[11px] font-bold">Lecture 202 (LH2)</text>

                {/* Systems Lab 203 */}
                <rect x="60" y="390" width="90" height="100" rx="12" fill="url(#roomGrad)" stroke="#507495" strokeWidth="2" />
                <text x="105" y="445" textAnchor="middle" fill="#E2E8F0" className="text-[10px] font-bold">Systems Lab 203</text>

                {/* Faculty Room 205 */}
                <rect x="430" y="160" width="100" height="180" rx="14" fill="url(#roomGrad)" stroke="#507495" strokeWidth="2" />
                <text x="480" y="250" textAnchor="middle" fill="#E2E8F0" className="text-[11px] font-bold">Faculty 205</text>
              </g>
            )}

            {/* ════════ FLOOR 3 LAYOUT ════════ */}
            {currentFloor === 3 && (
              <g id="floor-3-rooms">
                {/* Dean's Office */}
                <rect x="280" y="120" width="140" height="160" rx="16" fill="url(#highlightRoomGrad)" stroke="#1D7DD7" strokeWidth="2.5" />
                <text x="350" y="195" textAnchor="middle" fill="#38BDF8" className="text-[13px] font-black">Dean's Office</text>
                <text x="350" y="215" textAnchor="middle" fill="#74777E" className="text-[9px] font-semibold">CCS Administration</text>

                {/* Cisco Networking Lab 301 */}
                <rect x="120" y="200" width="120" height="140" rx="14" fill="url(#roomGrad)" stroke="#507495" strokeWidth="2" />
                <text x="180" y="270" textAnchor="middle" fill="#E2E8F0" className="text-[11px] font-bold">Network Lab 301</text>
                <text x="180" y="288" textAnchor="middle" fill="#74777E" className="text-[9px] font-semibold">CL3 • Cisco Rack</text>

                {/* Software Eng Lab 302 */}
                <rect x="50" y="380" width="90" height="110" rx="12" fill="url(#roomGrad)" stroke="#507495" strokeWidth="2" />
                <text x="95" y="440" textAnchor="middle" fill="#E2E8F0" className="text-[10px] font-bold">SE Lab 302</text>

                {/* Computer Research Lab 303 */}
                <rect x="430" y="140" width="100" height="160" rx="14" fill="url(#roomGrad)" stroke="#507495" strokeWidth="2" />
                <text x="480" y="220" textAnchor="middle" fill="#E2E8F0" className="text-[11px] font-bold">Research 303</text>
              </g>
            )}

            {/* ════════ FLOOR 4 LAYOUT ════════ */}
            {currentFloor === 4 && (
              <g id="floor-4-rooms">
                {/* Multipurpose AV Hall 401 */}
                <rect x="260" y="120" width="180" height="180" rx="16" fill="url(#highlightRoomGrad)" stroke="#1D7DD7" strokeWidth="2.5" />
                <text x="350" y="200" textAnchor="middle" fill="#38BDF8" className="text-[14px] font-black">AV Hall 401</text>
                <text x="350" y="220" textAnchor="middle" fill="#74777E" className="text-[9px] font-semibold">Auditorium & Events (Cap: 180)</text>

                {/* AI & Data Science Lab 402 */}
                <rect x="120" y="200" width="120" height="140" rx="14" fill="url(#roomGrad)" stroke="#507495" strokeWidth="2" />
                <text x="180" y="270" textAnchor="middle" fill="#E2E8F0" className="text-[11px] font-bold">AI Lab 402</text>

                {/* Cybersecurity Lab 403 */}
                <rect x="50" y="380" width="90" height="110" rx="12" fill="url(#roomGrad)" stroke="#507495" strokeWidth="2" />
                <text x="95" y="440" textAnchor="middle" fill="#E2E8F0" className="text-[10px] font-bold">CyberSec Lab</text>

                {/* Senior Student Lounge */}
                <rect x="440" y="160" width="90" height="140" rx="14" fill="url(#roomGrad)" stroke="#507495" strokeWidth="2" />
                <text x="485" y="230" textAnchor="middle" fill="#E2E8F0" className="text-[10px] font-bold">Student Lounge</text>
              </g>
            )}

            {/* ════════ FLOOR 5 LAYOUT ════════ */}
            {currentFloor === 5 && (
              <g id="floor-5-rooms">
                {/* CCS Lecture Hall 538 */}
                <rect x="260" y="120" width="180" height="180" rx="16" fill="url(#highlightRoomGrad)" stroke="#1D7DD7" strokeWidth="3" />
                <text x="350" y="195" textAnchor="middle" fill="#38BDF8" className="text-[14px] font-black">CCS Lecture 538</text>
                <text x="350" y="215" textAnchor="middle" fill="#E2E8F0" className="text-[10px] font-bold">Smart Classroom (5th Floor)</text>
                <text x="350" y="235" textAnchor="middle" fill="#74777E" className="text-[9px] font-semibold">Cap: 65 Students</text>

                {/* Advanced Innovation Lab 501 */}
                <rect x="120" y="200" width="120" height="140" rx="14" fill="url(#roomGrad)" stroke="#507495" strokeWidth="2" />
                <text x="180" y="265" textAnchor="middle" fill="#E2E8F0" className="text-[11px] font-bold">Innovation 501</text>
                <text x="180" y="285" textAnchor="middle" fill="#74777E" className="text-[9px] font-semibold">Robotics & Startup</text>

                {/* IoT & Cloud Systems Lab 502 */}
                <rect x="50" y="380" width="90" height="110" rx="12" fill="url(#roomGrad)" stroke="#507495" strokeWidth="2" />
                <text x="95" y="435" textAnchor="middle" fill="#E2E8F0" className="text-[10px] font-bold">IoT Lab 502</text>
                <text x="95" y="450" textAnchor="middle" fill="#74777E" className="text-[8.5px]">Cloud Edge</text>

                {/* Executive Conference Room */}
                <rect x="440" y="160" width="90" height="140" rx="14" fill="url(#roomGrad)" stroke="#507495" strokeWidth="2" />
                <text x="485" y="225" textAnchor="middle" fill="#E2E8F0" className="text-[10px] font-bold">Conference</text>
                <text x="485" y="245" textAnchor="middle" fill="#74777E" className="text-[8.5px]">Executive Board</text>
              </g>
            )}

            {/* Vertical Transportation Hub (Stairs & Elevator across all floors) */}
            <g id="vertical-transport">
              {/* Staircase Block */}
              <rect x="445" y="350" width="70" height="60" rx="10" fill="#1E1B4B" stroke="#818CF8" strokeWidth="2" />
              <text x="480" y="385" textAnchor="middle" fill="#C7D2FE" className="text-[10px] font-extrabold">Stairwell</text>

              {/* Elevator Block */}
              <rect x="495" y="420" width="50" height="60" rx="10" fill="#064E3B" stroke="#34D399" strokeWidth="2" />
              <text x="520" y="455" textAnchor="middle" fill="#A7F3D0" className="text-[9.5px] font-extrabold">Elevator</text>
            </g>
          </g>

          {/* Animated SVG Route Overlay */}
          {pathDAttribute && (
            <g className="route-overlay">
              {/* Outer Glow Polyline */}
              <path
                d={pathDAttribute}
                stroke="#1D7DD7"
                strokeWidth="8"
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
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              {/* Dashed White Inner Animated Track */}
              <path
                d={pathDAttribute}
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeDasharray="10 8"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          )}

          {/* Interactive Graph Node Markers */}
          <g className="graph-nodes">
            {floorNodes.map((node) => {
              const isStart = node.id === startNodeId;
              const isTarget = node.id === targetNodeId;
              const isWay = currentFloorWaypoints.some((wp) => wp.x === node.x && wp.y === node.y);

              let nodeFill = "#507495"; // Default secondary palette
              if (isStart) nodeFill = "#10B981"; // Emerald green start
              if (isTarget) nodeFill = "#EF4444"; // Crimson red target
              if (isWay && !isStart && !isTarget) nodeFill = "#1D7DD7"; // Primary blue route waypoint

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
                  {/* Outer Pulsing Aura */}
                  {(isStart || isTarget || isWay) && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isStart || isTarget ? 18 : 12}
                      fill="none"
                      stroke={nodeFill}
                      strokeWidth="2"
                      className="opacity-70 animate-ping origin-center"
                    />
                  )}

                  {/* Solid Central Node Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isStart || isTarget ? 11 : 7}
                    fill={nodeFill}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="shadow-lg"
                  />

                  {/* Label Text */}
                  <text
                    x={node.x}
                    y={node.y - 14}
                    textAnchor="middle"
                    fill="#F8FAFC"
                    className="text-[10px] font-black select-none pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Map Interactive Legend & Hints */}
      <div className="absolute bottom-3 left-3 bg-[#141E28]/95 backdrop-blur border border-[#507495]/30 px-3.5 py-2.5 rounded-2xl text-xs space-y-1.5 shadow-xl pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-emerald-500 inline-block shadow-sm" />
          <span className="text-slate-200 text-[11px] font-bold">Start Origin</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-rose-500 inline-block shadow-sm" />
          <span className="text-slate-200 text-[11px] font-bold">Destination</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[#1D7DD7] inline-block shadow-sm" />
          <span className="text-slate-200 text-[11px] font-bold">Dijkstra Route</span>
        </div>
      </div>
    </div>
  );
}
