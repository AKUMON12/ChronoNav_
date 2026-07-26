"use client";

import React from "react";
import { Node, Waypoint } from "@/lib/navigation/pathfinding";

interface InteractiveSVGMapProps {
  currentFloor: number;
  graph: Record<string, Node>;
  waypoints: Waypoint[];
  startNodeId?: string;
  targetNodeId?: string;
  onSelectNode?: (nodeId: string) => void;
  zoomLevel: number;
}

export function InteractiveSVGMap({
  currentFloor,
  graph,
  waypoints,
  startNodeId,
  targetNodeId,
  onSelectNode,
  zoomLevel,
}: InteractiveSVGMapProps) {
  // Filter nodes belonging to the active selected floor
  const floorNodes = Object.values(graph).filter((node) => node.floor === currentFloor);

  // Filter path waypoints belonging to the current floor for drawing line polyline
  const currentFloorWaypoints = waypoints.filter((wp) => wp.floor === currentFloor);

  // Generate SVG path 'd' attribute string connecting current floor waypoints
  const pathDAttribute = currentFloorWaypoints.reduce((acc, wp, idx) => {
    return idx === 0 ? `M ${wp.x} ${wp.y}` : `${acc} L ${wp.x} ${wp.y}`;
  }, "");

  return (
    <div className="relative w-full h-[450px] sm:h-[550px] overflow-hidden rounded-xl border border-border bg-card shadow-inner flex items-center justify-center p-4">
      {/* Background SVG Grid / Canvas */}
      <div 
        className="w-full h-full transition-transform duration-300 ease-out flex items-center justify-center"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <svg
          viewBox="0 0 600 600"
          className="w-full h-full max-w-[600px] max-h-[600px]"
          aria-label={`CCS Building Floor ${currentFloor} Map Plan`}
        >
          {/* Blueprint Layout Rectangles (Representing Rooms & Corridors) */}
          <g className="opacity-70 dark:opacity-50">
            {/* Outer Building Perimeter */}
            <rect x="50" y="50" width="500" height="500" rx="16" fill="none" stroke="currentColor" strokeWidth="2" className="text-secondary/40" />
            
            {/* Room Boundaries */}
            {currentFloor === 1 && (
              <>
                <rect x="80" y="320" width="160" height="160" rx="8" className="fill-muted stroke-border" strokeWidth="2" />
                <text x="160" y="405" textAnchor="middle" className="text-xs font-semibold fill-foreground">Main Entrance</text>

                <rect x="200" y="100" width="180" height="180" rx="8" className="fill-muted stroke-border" strokeWidth="2" />
                <text x="290" y="195" textAnchor="middle" className="text-xs font-semibold fill-foreground">Mac Lab 101</text>
              </>
            )}

            {currentFloor === 2 && (
              <>
                <rect x="220" y="120" width="160" height="160" rx="8" className="fill-muted stroke-border" strokeWidth="2" />
                <text x="300" y="200" textAnchor="middle" className="text-xs font-semibold fill-foreground">Prog Lab 201</text>

                <rect x="70" y="320" width="160" height="160" rx="8" className="fill-muted stroke-border" strokeWidth="2" />
                <text x="150" y="400" textAnchor="middle" className="text-xs font-semibold fill-foreground">Room 202</text>
              </>
            )}

            {currentFloor === 3 && (
              <>
                <rect x="260" y="100" width="180" height="160" rx="8" className="fill-muted stroke-border" strokeWidth="2" />
                <text x="350" y="180" textAnchor="middle" className="text-xs font-semibold fill-foreground">Dean's Office</text>
              </>
            )}

            {currentFloor === 4 && (
              <>
                <rect x="100" y="200" width="220" height="200" rx="8" className="fill-muted stroke-border" strokeWidth="2" />
                <text x="210" y="300" textAnchor="middle" className="text-xs font-semibold fill-foreground">AV Hall 401</text>
              </>
            )}

            {/* Staircase Hub Marker */}
            <rect x="400" y="340" width="100" height="120" rx="6" className="fill-amber-500/10 stroke-amber-500/40" strokeWidth="2" />
            <text x="450" y="405" textAnchor="middle" className="text-[11px] font-bold fill-amber-600 dark:fill-amber-400">Stairs</text>
          </g>

          {/* Animated Navigation Route Overlay */}
          {pathDAttribute && (
            <g className="animate-pulse">
              <path
                d={pathDAttribute}
                stroke="#1D7DD7"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              <path
                d={pathDAttribute}
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeDasharray="8 6"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          )}

          {/* Interactive Graph Node Markers */}
          {floorNodes.map((node) => {
            const isStart = node.id === startNodeId;
            const isTarget = node.id === targetNodeId;
            const isWay = currentFloorWaypoints.some((wp) => wp.x === node.x && wp.y === node.y);

            let nodeFill = "#507495"; // Default node
            if (isStart) nodeFill = "#10B981"; // Start green
            if (isTarget) nodeFill = "#EF4444"; // Target red
            if (isWay && !isStart && !isTarget) nodeFill = "#1D7DD7"; // Route node blue

            return (
              <g
                key={node.id}
                onClick={() => onSelectNode && onSelectNode(node.id)}
                className="cursor-pointer transition-transform hover:scale-125"
                role="button"
                tabIndex={0}
                aria-label={`Select ${node.name}`}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isStart || isTarget ? 12 : 8}
                  fill={nodeFill}
                  className="shadow-md"
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isStart || isTarget ? 16 : 11}
                  fill="none"
                  stroke={nodeFill}
                  strokeWidth="2"
                  className="opacity-40 animate-ping"
                />
                <text
                  x={node.x}
                  y={node.y - 16}
                  textAnchor="middle"
                  className="text-[10px] font-bold fill-foreground select-none pointer-events-none drop-shadow-sm"
                >
                  {node.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 bg-background/90 backdrop-blur border border-border p-2.5 rounded-lg text-xs space-y-1.5 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-emerald-500 inline-block" />
          <span className="text-foreground font-medium">Start Location</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-rose-500 inline-block" />
          <span className="text-foreground font-medium">Destination Target</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-[#1D7DD7] inline-block" />
          <span className="text-foreground font-medium">Calculated Route</span>
        </div>
      </div>
    </div>
  );
}
