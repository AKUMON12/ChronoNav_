"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  SampleCCSGraph, 
  findShortestPath, 
  PathfindingResult 
} from "@/lib/navigation/pathfinding";
import { InteractiveSVGMap } from "@/components/map/interactive-svg-map";
import { FloorSelector } from "@/components/map/floor-selector";
import { 
  Navigation, 
  MapPin, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  ArrowRight,
  Compass,
  ArrowLeft
} from "lucide-react";

export default function InteractiveMapPage() {
  const graph = useMemo(() => SampleCCSGraph.getSampleGraph(), []);
  const allNodes = useMemo(() => Object.values(graph), [graph]);

  // Start & Target states
  const [startNodeId, setStartNodeId] = useState<string>("F1_ENTRANCE");
  const [targetNodeId, setTargetNodeId] = useState<string>("F3_DEAN_OFFICE");

  // Floor view & map zoom state
  const [currentFloor, setCurrentFloor] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Settings
  const [voiceGuidance, setVoiceGuidance] = useState<boolean>(true);

  // Compute Dijkstra shortest path
  const pathResult: PathfindingResult | null = useMemo(() => {
    if (!startNodeId || !targetNodeId) return null;
    return findShortestPath(graph, startNodeId, targetNodeId);
  }, [graph, startNodeId, targetNodeId]);

  // Handle auto floor switch when clicking on a node
  const handleSelectNode = (nodeId: string) => {
    if (!startNodeId || (startNodeId && targetNodeId)) {
      setStartNodeId(nodeId);
      setTargetNodeId("");
    } else {
      setTargetNodeId(nodeId);
    }
  };

  // Switch active floor display automatically if destination changes
  const handleStartChange = (id: string) => {
    setStartNodeId(id);
    if (graph[id]) setCurrentFloor(graph[id].floor);
  };

  const handleTargetChange = (id: string) => {
    setTargetNodeId(id);
    if (graph[id]) setCurrentFloor(graph[id].floor);
  };

  const handleRecenter = () => {
    setZoomLevel(1);
    if (startNodeId && graph[startNodeId]) {
      setCurrentFloor(graph[startNodeId].floor);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      {/* Navigation Top Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-foreground hover:opacity-90 transition-opacity">
            <ArrowLeft className="size-5 text-muted-foreground" />
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              <Compass className="size-5" />
            </div>
            <h1 className="text-lg font-bold">ChronoNav Map</h1>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setVoiceGuidance(!voiceGuidance)}
            className={`flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold transition-colors ${
              voiceGuidance ? "bg-primary/10 text-primary border-primary/30" : "bg-card text-muted-foreground"
            }`}
            aria-label="Toggle Voice Guidance"
          >
            {voiceGuidance ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
            <span className="hidden sm:inline">Voice Guidance {voiceGuidance ? "ON" : "OFF"}</span>
          </button>
        </div>
      </header>

      {/* Main Interactive Map Layout */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Route Configurator & Turn-by-Turn Guide */}
        <div className="space-y-6 lg:col-span-1">
          {/* Destination Selector Card */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Navigation className="size-5 text-primary" />
              <span>Campus Route Configurator</span>
            </h2>

            {/* Start Combo */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                <MapPin className="size-3.5 text-emerald-500" />
                <span>START LOCATION</span>
              </label>
              <select
                value={startNodeId}
                onChange={(e) => handleStartChange(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {allNodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    Floor {node.floor}: {node.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Combo */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                <MapPin className="size-3.5 text-rose-500" />
                <span>DESTINATION</span>
              </label>
              <select
                value={targetNodeId}
                onChange={(e) => handleTargetChange(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select Destination...</option>
                {allNodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    Floor {node.floor}: {node.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Path Metrics Summary */}
            {pathResult && (
              <div className="flex items-center justify-between rounded-lg bg-primary/10 p-3 text-xs font-bold text-primary">
                <span>ESTIMATED DISTANCE</span>
                <span>{pathResult.totalDistance} meters</span>
              </div>
            )}
          </div>

          {/* Turn-by-Turn Card List */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-foreground">Turn-by-Turn Directions</h3>

            {pathResult ? (
              <ol className="space-y-2.5">
                {pathResult.instructions.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs text-foreground/90">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-xs text-muted-foreground">Select a start location and destination to view directions.</p>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Map Canvas Viewer */}
        <div className="relative space-y-4 lg:col-span-2">
          {/* Map Viewer Controls Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-card border border-border p-3 rounded-xl shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground">ACTIVE VIEW:</span>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                CCS Building - Floor {currentFloor}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 2))}
                className="p-1.5 rounded-lg border border-border bg-background hover:bg-accent text-foreground"
                aria-label="Zoom In"
              >
                <ZoomIn className="size-4" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
                className="p-1.5 rounded-lg border border-border bg-background hover:bg-accent text-foreground"
                aria-label="Zoom Out"
              >
                <ZoomOut className="size-4" />
              </button>
              <button
                onClick={handleRecenter}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-accent text-xs font-semibold text-foreground"
                aria-label="Recenter Map"
              >
                <RotateCcw className="size-3.5" />
                <span>Recenter</span>
              </button>
            </div>
          </div>

          {/* Interactive SVG Canvas & Overlay Floor Switcher */}
          <div className="relative">
            <InteractiveSVGMap
              currentFloor={currentFloor}
              graph={graph}
              waypoints={pathResult?.waypoints || []}
              startNodeId={startNodeId}
              targetNodeId={targetNodeId}
              onSelectNode={handleSelectNode}
              zoomLevel={zoomLevel}
            />

            {/* Floating Floor Selector Overlay */}
            <div className="absolute top-4 right-4 z-20">
              <FloorSelector
                floors={[1, 2, 3, 4]}
                activeFloor={currentFloor}
                onSelectFloor={(fl) => setCurrentFloor(fl)}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
