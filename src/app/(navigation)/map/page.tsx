"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  ArrowLeft,
  ArrowUpDown,
  Search,
  CheckCircle2,
  AlertCircle,
  Footprints
} from "lucide-react";

export default function InteractiveMapPage() {
  const graph = useMemo(() => SampleCCSGraph.getSampleGraph(), []);
  const allNodes = useMemo(() => Object.values(graph), [graph]);

  // Origin & Destination states
  const [startNodeId, setStartNodeId] = useState<string>("F1_ENTRANCE");
  const [targetNodeId, setTargetNodeId] = useState<string>("F3_DEAN_OFFICE");

  // Search input filters for combo boxes
  const [startSearch, setStartSearch] = useState<string>("");
  const [targetSearch, setTargetSearch] = useState<string>("");

  // Map floor view & zoom state
  const [currentFloor, setCurrentFloor] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Settings
  const [voiceGuidance, setVoiceGuidance] = useState<boolean>(true);

  // Compute Dijkstra shortest path
  const pathResult: PathfindingResult | null = useMemo(() => {
    if (!startNodeId || !targetNodeId) return null;
    return findShortestPath(graph, startNodeId, targetNodeId);
  }, [graph, startNodeId, targetNodeId]);

  // Speak instructions when voice guidance is enabled and route updates
  useEffect(() => {
    if (voiceGuidance && pathResult && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Stop prior speech
      const firstStep = pathResult.instructions[0];
      if (firstStep) {
        const utterance = new SpeechSynthesisUtterance(firstStep);
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [pathResult, voiceGuidance]);

  // Node selection from SVG map click
  const handleSelectNode = (nodeId: string) => {
    if (!startNodeId || (startNodeId && targetNodeId)) {
      setStartNodeId(nodeId);
      setTargetNodeId("");
    } else {
      setTargetNodeId(nodeId);
    }
  };

  // Switch floor display automatically when origin or destination changes
  const handleStartChange = (id: string) => {
    setStartNodeId(id);
    if (graph[id]) setCurrentFloor(graph[id].floor);
  };

  const handleTargetChange = (id: string) => {
    setTargetNodeId(id);
    if (graph[id]) setCurrentFloor(graph[id].floor);
  };

  const handleSwapLocations = () => {
    const prevStart = startNodeId;
    const prevTarget = targetNodeId;
    setStartNodeId(prevTarget);
    setTargetNodeId(prevStart);
    if (prevTarget && graph[prevTarget]) {
      setCurrentFloor(graph[prevTarget].floor);
    }
  };

  const handleRecenter = () => {
    setZoomLevel(1);
    if (startNodeId && graph[startNodeId]) {
      setCurrentFloor(graph[startNodeId].floor);
    }
  };

  // Filtered node list for searchable combo boxes
  const filteredStartNodes = useMemo(() => {
    if (!startSearch.trim()) return allNodes;
    return allNodes.filter((node) =>
      node.name.toLowerCase().includes(startSearch.toLowerCase()) ||
      `floor ${node.floor}`.includes(startSearch.toLowerCase())
    );
  }, [allNodes, startSearch]);

  const filteredTargetNodes = useMemo(() => {
    if (!targetSearch.trim()) return allNodes;
    return allNodes.filter((node) =>
      node.name.toLowerCase().includes(targetSearch.toLowerCase()) ||
      `floor ${node.floor}`.includes(targetSearch.toLowerCase())
    );
  }, [allNodes, targetSearch]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      {/* Top Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-foreground hover:opacity-90 transition-opacity">
            <ArrowLeft className="size-5 text-muted-foreground" />
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#1D7DD7] text-white font-bold shadow-md shadow-[#1D7DD7]/30">
              <Compass className="size-5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold leading-none">ChronoNav Map</h1>
              <span className="text-[10px] font-semibold text-muted-foreground">UC Main Campus • CCS Building</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setVoiceGuidance(!voiceGuidance)}
            className={`flex items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-all shadow-sm ${
              voiceGuidance 
                ? "bg-[#1D7DD7]/10 text-[#1D7DD7] border-[#1D7DD7]/40 ring-1 ring-[#1D7DD7]/30" 
                : "bg-card text-muted-foreground border-border hover:bg-accent"
            }`}
            aria-label="Toggle Voice Guidance"
          >
            {voiceGuidance ? <Volume2 className="size-4 animate-pulse" /> : <VolumeX className="size-4" />}
            <span className="hidden sm:inline">Voice Guidance: {voiceGuidance ? "ON" : "OFF"}</span>
          </button>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: Route Configurator & Turn-by-Turn Guide */}
        <div className="space-y-6 lg:col-span-4 flex flex-col">
          {/* Route Configurator Card */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-foreground flex items-center gap-2 tracking-wide uppercase">
                <Navigation className="size-4 text-[#1D7DD7]" />
                <span>Indoor Route Selector</span>
              </h2>
              {startNodeId && targetNodeId && (
                <button
                  onClick={handleSwapLocations}
                  className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors bg-muted/60 px-2 py-1 rounded-lg"
                  title="Swap Origin and Destination"
                >
                  <ArrowUpDown className="size-3.5" />
                  <span>Swap</span>
                </button>
              )}
            </div>

            {/* Searchable Origin Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <MapPin className="size-3.5 text-emerald-500" />
                <span>ORIGIN / START LOCATION</span>
              </label>

              <div className="relative">
                <select
                  value={startNodeId}
                  onChange={(e) => handleStartChange(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-[#1D7DD7] shadow-sm"
                >
                  {filteredStartNodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      Floor {node.floor}: {node.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Searchable Destination Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-extrabold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <MapPin className="size-3.5 text-rose-500" />
                <span>DESTINATION TARGET</span>
              </label>

              <div className="relative">
                <select
                  value={targetNodeId}
                  onChange={(e) => handleTargetChange(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-[#1D7DD7] shadow-sm"
                >
                  <option value="">Select Destination...</option>
                  {filteredTargetNodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      Floor {node.floor}: {node.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Calculated Distance & Multi-floor Metrics */}
            {pathResult && (
              <div className="rounded-xl bg-[#1D7DD7]/10 border border-[#1D7DD7]/20 p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs font-extrabold text-[#1D7DD7]">
                  <span>ESTIMATED DISTANCE</span>
                  <span className="text-sm font-black">{pathResult.totalDistance} meters</span>
                </div>
                {pathResult.floorsTraversed.length > 1 && (
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 dark:text-amber-400 pt-1 border-t border-[#1D7DD7]/10">
                    <Footprints className="size-3.5 shrink-0" />
                    <span>Multi-Floor Route: Floors {pathResult.floorsTraversed.join(" → ")}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Turn-by-Turn Navigation Guide Card */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-foreground uppercase tracking-wide">
                Turn-by-Turn Directions
              </h3>
              {pathResult && (
                <span className="text-[10px] font-extrabold bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                  {pathResult.instructions.length} Steps
                </span>
              )}
            </div>

            {pathResult ? (
              <ol className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                {pathResult.instructions.map((step, idx) => {
                  const nodeForStep = pathResult.waypoints[idx];
                  const isCurrentFloorStep = nodeForStep && nodeForStep.floor === currentFloor;

                  return (
                    <li
                      key={idx}
                      onClick={() => {
                        if (nodeForStep) setCurrentFloor(nodeForStep.floor);
                      }}
                      className={`flex items-start gap-3 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        isCurrentFloorStep
                          ? "bg-[#1D7DD7]/10 border-[#1D7DD7]/40 text-foreground font-semibold shadow-sm"
                          : "bg-background/60 border-border/80 text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      <span className={`flex size-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-extrabold ${
                        isCurrentFloorStep ? "bg-[#1D7DD7] text-white" : "bg-muted text-muted-foreground"
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="space-y-0.5 pt-0.5">
                        <p className="leading-snug text-foreground font-medium">{step}</p>
                        {nodeForStep && (
                          <span className="text-[10px] text-muted-foreground font-bold block">
                            Floor {nodeForStep.floor}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <div className="py-8 text-center space-y-2">
                <AlertCircle className="size-8 text-muted-foreground mx-auto opacity-50" />
                <p className="text-xs text-muted-foreground font-medium">Select origin and target destination to generate turn-by-turn indoor directions.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Interactive SVG Map Viewer */}
        <div className="relative space-y-4 lg:col-span-8 flex flex-col">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-card border border-border p-3 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold text-muted-foreground uppercase tracking-wider">VIEWING:</span>
              <span className="text-xs font-black text-[#1D7DD7] bg-[#1D7DD7]/10 border border-[#1D7DD7]/30 px-3 py-1 rounded-xl">
                CCS Building • Floor {currentFloor}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.5))}
                className="p-2 rounded-xl border border-border bg-background hover:bg-accent text-foreground shadow-sm transition-colors"
                aria-label="Zoom In Map"
                title="Zoom In"
              >
                <ZoomIn className="size-4" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
                className="p-2 rounded-xl border border-border bg-background hover:bg-accent text-foreground shadow-sm transition-colors"
                aria-label="Zoom Out Map"
                title="Zoom Out"
              >
                <ZoomOut className="size-4" />
              </button>
              <button
                onClick={handleRecenter}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-background hover:bg-accent text-xs font-bold text-foreground shadow-sm transition-colors"
                aria-label="Recenter Map"
              >
                <RotateCcw className="size-4 text-[#1D7DD7]" />
                <span>Recenter</span>
              </button>
            </div>
          </div>

          {/* Interactive Map View Canvas Container */}
          <div className="relative flex-1">
            <InteractiveSVGMap
              currentFloor={currentFloor}
              graph={graph}
              waypoints={pathResult?.waypoints || []}
              startNodeId={startNodeId}
              targetNodeId={targetNodeId}
              onSelectNode={handleSelectNode}
              zoomLevel={zoomLevel}
            />

            {/* Floating Multi-Floor Selector Component */}
            <div className="absolute top-4 right-4 z-20">
              <FloorSelector
                floors={[1, 2, 3, 4]}
                activeFloor={currentFloor}
                onSelectFloor={(fl) => setCurrentFloor(fl)}
                floorsInRoute={pathResult?.floorsTraversed || []}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

