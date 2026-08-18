"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  SampleCCSGraph,
  findShortestPath,
  PathfindingResult,
  getGraphNodeForRoom,
} from "@/lib/navigation/pathfinding";
import { InteractiveSVGMap } from "@/components/map/interactive-svg-map";
import { FloorSelector } from "@/components/map/floor-selector";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { BackButton } from "@/components/shared/back-button";
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
  ArrowUpDown,
  Search,
  CheckCircle2,
  AlertCircle,
  Footprints,
  Layers,
  ChevronRight,
  Sparkles,
} from "lucide-react";

function InteractiveMapContent() {
  const graph = useMemo(() => SampleCCSGraph.getSampleGraph(), []);
  const allNodes = useMemo(() => Object.values(graph), [graph]);
  const searchParams = useSearchParams();

  // Origin & Destination states (Defaults to Gate 1 Entrance -> CCS 538 5th Floor)
  const [startNodeId, setStartNodeId] = useState<string>("F1_ENTRANCE");
  const [targetNodeId, setTargetNodeId] = useState<string>("F5_LECTURE_538");

  // Search filters for select menus
  const [startSearch, setStartSearch] = useState<string>("");
  const [targetSearch, setTargetSearch] = useState<string>("");

  // Map floor view & zoom state
  const [currentFloor, setCurrentFloor] = useState<number>(5);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Settings: Voice Guidance toggle
  const [voiceGuidance, setVoiceGuidance] = useState<boolean>(true);

  // Synchronize search params if passed (e.g. /map?start=F1_ENTRANCE&target=F5_LECTURE_538)
  useEffect(() => {
    if (!searchParams) return;
    const startParam = searchParams.get("start") || searchParams.get("origin");
    const targetParam = searchParams.get("target") || searchParams.get("destination");

    if (startParam && graph[startParam]) {
      setStartNodeId(startParam);
      setCurrentFloor(graph[startParam].floor);
    }

    if (targetParam) {
      const resolvedTarget = graph[targetParam] ? targetParam : getGraphNodeForRoom(targetParam);
      if (graph[resolvedTarget]) {
        setTargetNodeId(resolvedTarget);
        setCurrentFloor(graph[resolvedTarget].floor);
      }
    }
  }, [searchParams, graph]);

  // Compute Dijkstra shortest path between start and target
  const pathResult: PathfindingResult | null = useMemo(() => {
    if (!startNodeId || !targetNodeId) return null;
    return findShortestPath(graph, startNodeId, targetNodeId);
  }, [graph, startNodeId, targetNodeId]);

  // Voice speech synthesis for turn-by-turn guidance
  useEffect(() => {
    if (voiceGuidance && pathResult && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const firstStep = pathResult.instructions[0];
      if (firstStep) {
        const utterance = new SpeechSynthesisUtterance(firstStep);
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [pathResult, voiceGuidance]);

  // Node selection from SVG map canvas click
  const handleSelectNode = (nodeId: string) => {
    if (!startNodeId || (startNodeId && targetNodeId)) {
      setStartNodeId(nodeId);
      setTargetNodeId("");
    } else {
      setTargetNodeId(nodeId);
    }
    if (graph[nodeId]) {
      setCurrentFloor(graph[nodeId].floor);
    }
  };

  const handleSwapLocations = () => {
    const prevStart = startNodeId;
    const prevTarget = targetNodeId;
    setStartNodeId(prevTarget);
    setTargetNodeId(prevStart);
    if (graph[prevTarget]) {
      setCurrentFloor(graph[prevTarget].floor);
    }
  };

  const handleRecenter = () => {
    setZoomLevel(1);
    if (targetNodeId && graph[targetNodeId]) {
      setCurrentFloor(graph[targetNodeId].floor);
    } else if (startNodeId && graph[startNodeId]) {
      setCurrentFloor(graph[startNodeId].floor);
    }
  };

  // Filtered node list for combo selectors
  const filteredStartNodes = useMemo(() => {
    if (!startSearch.trim()) return allNodes;
    return allNodes.filter(
      (node) =>
        node.name.toLowerCase().includes(startSearch.toLowerCase()) ||
        `floor ${node.floor}`.includes(startSearch.toLowerCase())
    );
  }, [allNodes, startSearch]);

  const filteredTargetNodes = useMemo(() => {
    if (!targetSearch.trim()) return allNodes;
    return allNodes.filter(
      (node) =>
        node.name.toLowerCase().includes(targetSearch.toLowerCase()) ||
        `floor ${node.floor}`.includes(targetSearch.toLowerCase())
    );
  }, [allNodes, targetSearch]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground transition-colors duration-200">
      {/* ── Top Header with Back Button (Left) & Theme Toggle (Right) ── */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card/90 backdrop-blur px-4 sm:px-8 transition-colors duration-200">
        <div className="flex items-center gap-3">
          <BackButton fallbackUrl="/dashboard" showLabel={false} />

          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-foreground hover:opacity-90 transition-opacity"
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-white font-bold shadow-md shadow-primary/30">
              <Compass className="size-5" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-foreground leading-none">ChronoNav Map</h1>
              <span className="text-[10px] font-semibold text-muted-foreground">
                UC Main Campus • CCS Building (Floors 1-5)
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <button
            onClick={() => setVoiceGuidance(!voiceGuidance)}
            className={`flex items-center gap-1.5 sm:gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all shadow-sm ${
              voiceGuidance
                ? "bg-primary/15 text-primary border-primary/40 ring-1 ring-primary/30"
                : "bg-card text-muted-foreground border-border hover:text-foreground"
            }`}
            aria-label="Toggle Voice Guidance"
          >
            {voiceGuidance ? <Volume2 className="size-4 animate-pulse" /> : <VolumeX className="size-4" />}
            <span className="hidden md:inline">Voice: {voiceGuidance ? "ON" : "OFF"}</span>
          </button>
        </div>
      </header>

      {/* ── Main Map Content ── */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Route Configurator & Turn-by-Turn Guide */}
        <div className="space-y-6 lg:col-span-4 flex flex-col">
          {/* Route Configurator Card */}
          <div className="rounded-3xl border border-border bg-card p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h2 className="text-xs font-black text-foreground flex items-center gap-2 tracking-wide uppercase">
                <Navigation className="size-4 text-primary" />
                <span>Indoor Route Configurator</span>
              </h2>
              {startNodeId && targetNodeId && (
                <button
                  onClick={handleSwapLocations}
                  className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors bg-muted/40 px-2.5 py-1 rounded-lg border border-border"
                  title="Swap Origin and Destination"
                >
                  <ArrowUpDown className="size-3.5" />
                  <span>Swap</span>
                </button>
              )}
            </div>

            {/* Origin Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-emerald-500 flex items-center gap-1.5 uppercase">
                <MapPin className="size-3.5 text-emerald-500" />
                <span>Origin Start Location</span>
              </label>
              <select
                value={startNodeId}
                onChange={(e) => {
                  setStartNodeId(e.target.value);
                  if (graph[e.target.value]) {
                    setCurrentFloor(graph[e.target.value].floor);
                  }
                }}
                className="w-full rounded-2xl border border-border bg-background px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              >
                <option value="">-- Choose Origin Point --</option>
                {filteredStartNodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    Floor {node.floor} — {node.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-primary flex items-center gap-1.5 uppercase">
                <Compass className="size-3.5 text-primary" />
                <span>Destination Target Room</span>
              </label>
              <select
                value={targetNodeId}
                onChange={(e) => {
                  setTargetNodeId(e.target.value);
                  if (graph[e.target.value]) {
                    setCurrentFloor(graph[e.target.value].floor);
                  }
                }}
                className="w-full rounded-2xl border border-border bg-background px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              >
                <option value="">-- Choose Destination --</option>
                {filteredTargetNodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    Floor {node.floor} — {node.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Turn-by-Turn Guidance Card */}
          <div className="rounded-3xl border border-border bg-card p-5 shadow-xl flex-1 flex flex-col space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-xs font-black text-foreground uppercase tracking-wide flex items-center gap-2">
                <Footprints className="size-4 text-primary" />
                <span>Turn-by-Turn Navigation Guide</span>
              </h3>
              {pathResult && (
                <span className="text-[11px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                  ~{Math.max(15, Math.round(pathResult.totalDistance * 1.5))} sec
                </span>
              )}
            </div>

            {pathResult && pathResult.waypoints.length > 0 ? (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                {/* Distance & Floors Summary */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-3 rounded-2xl bg-muted/40 border border-border space-y-0.5">
                    <span className="text-[10px] font-black text-muted-foreground uppercase">Estimated Time</span>
                    <p className="font-extrabold text-primary text-sm">
                      {Math.ceil(Math.max(15, Math.round(pathResult.totalDistance * 1.5)) / 60)} min ({Math.max(15, Math.round(pathResult.totalDistance * 1.5))}s)
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-muted/40 border border-border space-y-0.5">
                    <span className="text-[10px] font-black text-muted-foreground uppercase">Floors Traversed</span>
                    <p className="font-extrabold text-foreground text-sm">
                      {pathResult.floorsTraversed.join("F → ")}F
                    </p>
                  </div>
                </div>

                {/* Step-by-Step Instructions List */}
                <div className="space-y-2.5 overflow-y-auto max-h-[300px] pr-1">
                  {pathResult.instructions.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-2xl bg-muted/30 border border-border text-xs leading-relaxed"
                    >
                      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-white font-black text-[11px]">
                        {idx + 1}
                      </div>
                      <p className="text-foreground font-medium pt-0.5">{step}</p>
                    </div>
                  ))}
                </div>

                {/* Accessible Route Tip */}
                <div className="flex items-center gap-2 rounded-2xl bg-primary/10 border border-primary/30 p-3 text-[11px] text-muted-foreground">
                  <Sparkles className="size-4 text-primary shrink-0" />
                  <span>
                    Path utilizes central concrete staircases and elevator banks for smooth transition between floors.
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-2">
                <Compass className="size-10 text-muted-foreground mx-auto opacity-40" />
                <p className="text-xs text-muted-foreground font-medium">
                  Select an origin and destination to generate turn-by-turn indoor routing.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Map Canvas Viewer */}
        <div className="space-y-4 lg:col-span-8 flex flex-col">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-card border border-border p-3 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-muted-foreground uppercase tracking-wider">
                CURRENT FLOOR:
              </span>
              <span className="text-xs font-black text-primary bg-primary/10 border border-primary/30 px-3 py-1 rounded-xl">
                CCS Building • Floor {currentFloor}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.5))}
                className="p-2 rounded-xl border border-border bg-card hover:bg-accent text-foreground shadow-sm transition-colors"
                aria-label="Zoom in"
                title="Zoom In"
              >
                <ZoomIn className="size-4" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
                className="p-2 rounded-xl border border-border bg-card hover:bg-accent text-foreground shadow-sm transition-colors"
                aria-label="Zoom out"
                title="Zoom Out"
              >
                <ZoomOut className="size-4" />
              </button>
              <button
                onClick={handleRecenter}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card hover:bg-accent text-xs font-bold text-foreground shadow-sm transition-colors"
                aria-label="Reset zoom and center"
              >
                <RotateCcw className="size-3.5 text-primary" />
                <span>Center</span>
              </button>
            </div>
          </div>

          {/* Interactive Map Canvas Container */}
          <div className="relative flex-1">
            <InteractiveSVGMap
              currentFloor={currentFloor}
              graph={graph}
              waypoints={pathResult?.waypoints || []}
              targetNodeId={targetNodeId}
              onSelectNode={handleSelectNode}
              zoomLevel={zoomLevel}
            />

            {/* Vertical Multi-Floor Selector Component */}
            <div className="absolute top-4 right-4 z-20">
              <FloorSelector
                floors={[1, 2, 3, 4, 5]}
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

export default function MapPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-sm font-black text-muted-foreground">
          Loading Campus Navigation Map...
        </div>
      }
    >
      <InteractiveMapContent />
    </Suspense>
  );
}
