"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  SampleCCSGraph,
  findShortestPath,
  PathfindingResult,
  getGraphNodeForRoom,
  FloorLevel,
} from "@/lib/navigation/pathfinding";
import { InteractiveSVGMap } from "@/components/map/interactive-svg-map";
import { FloorSelector } from "@/components/map/floor-selector";
import { MapSkeleton } from "@/components/skeletons/map-skeleton";
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
  Compass,
  ArrowUpDown,
  Footprints,
  Sparkles,
} from "lucide-react";

function InteractiveMapContent() {
  const graph = useMemo(() => SampleCCSGraph.getSampleGraph(), []);
  const allNodes = useMemo(() => Object.values(graph), [graph]);
  const searchParams = useSearchParams();

  // Origin & Destination states (Defaults to Gate 1 Entrance -> CCS 538 5th Floor)
  const [startNodeId, setStartNodeId] = useState<string>("F1_GATE1");
  const [targetNodeId, setTargetNodeId] = useState<string>("F5_LECTURE_538");

  // Search filters for select menus
  const [startSearch, setStartSearch] = useState<string>("");
  const [targetSearch, setTargetSearch] = useState<string>("");

  // Map floor view & zoom state (All 8 campus levels)
  const [currentFloor, setCurrentFloor] = useState<FloorLevel>(5);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [recenterTrigger, setRecenterTrigger] = useState<number>(0);

  // Settings: Voice Guidance toggle initialized from localStorage (defaults to true)
  const [voiceGuidance, setVoiceGuidance] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("chrononav_voice_guidance");
      return stored !== null ? stored === "true" : true;
    }
    return true;
  });

  // Toggle voice guidance with immediate speech cancellation on disable & localStorage persistence
  const handleToggleVoice = () => {
    setVoiceGuidance((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("chrononav_voice_guidance", String(next));
        if (!next && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
      }
      return next;
    });
  };

  // Helper to speak a given direction instruction
  const speakInstruction = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window && text) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Synchronize search params if passed (e.g. /map?start=F1_GATE1&target=F5_LECTURE_538)
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

  // Voice speech synthesis for turn-by-turn guidance when route updates or voice turns on
  useEffect(() => {
    if (voiceGuidance && pathResult && typeof window !== "undefined" && "speechSynthesis" in window) {
      const firstStep = pathResult.instructions[0];
      if (firstStep) {
        speakInstruction(firstStep);
      }
    } else if (!voiceGuidance && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
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
    setRecenterTrigger((c) => c + 1);
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
                University of Cebu Main Campus • 8 Floors
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <button
            onClick={handleToggleVoice}
            className={`flex items-center gap-1.5 sm:gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ${
              voiceGuidance
                ? "bg-primary/15 text-primary border-primary/40 ring-1 ring-primary/30"
                : "bg-card text-muted-foreground border-border hover:text-foreground"
            }`}
            aria-label={voiceGuidance ? "Turn off voice guidance" : "Turn on voice guidance"}
            aria-pressed={voiceGuidance}
            title={voiceGuidance ? "Voice Guidance is ON" : "Voice Guidance is OFF"}
          >
            {voiceGuidance ? <Volume2 className="size-4 animate-pulse" /> : <VolumeX className="size-4" />}
            <span className="text-xs">Voice: {voiceGuidance ? "ON" : "OFF"}</span>
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
                <span>Find Directions</span>
              </h2>
              {startNodeId && targetNodeId && (
                <button
                  onClick={handleSwapLocations}
                  className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground hover:text-primary transition-colors bg-muted/40 px-2.5 py-1 rounded-lg border border-border"
                  title="Swap Starting Point and Destination"
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
                <span>Starting Point</span>
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
                <option value="">-- Choose Starting Point --</option>
                {filteredStartNodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.floor === "M" ? "Mezzanine" : `Floor ${node.floor}`} — {node.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-primary flex items-center gap-1.5 uppercase">
                <Compass className="size-3.5 text-primary" />
                <span>Destination Room</span>
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
                    {node.floor === "M" ? "Mezzanine" : `Floor ${node.floor}`} — {node.name}
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
                <span>Walking Directions</span>
              </h3>

              {pathResult && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                    ~{Math.max(15, Math.round(pathResult.totalDistance * 1.5))} sec
                  </span>
                  <button
                    onClick={() => {
                      if (pathResult.instructions[0]) {
                        speakInstruction(pathResult.instructions[0]);
                      }
                    }}
                    className="p-1.5 rounded-lg border border-border bg-muted/40 hover:bg-accent text-foreground transition-colors"
                    aria-label="Replay current step voice direction"
                    title="Play voice direction"
                  >
                    <Volume2 className="size-3.5 text-primary" />
                  </button>
                </div>
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
                      {pathResult.floorsTraversed.map(f => f === "M" ? "MF" : `${f}F`).join(" → ")}
                    </p>
                  </div>
                </div>

                {/* Step-by-Step Instructions List */}
                <div className="space-y-2.5 overflow-y-auto max-h-[300px] pr-1">
                  {pathResult.instructions.map((step, idx) => (
                    <div
                      key={idx}
                      className="group flex items-start justify-between gap-3 p-3 rounded-2xl bg-muted/30 hover:bg-muted/50 border border-border text-xs leading-relaxed transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-white font-black text-[11px]">
                          {idx + 1}
                        </div>
                        <p className="text-foreground font-medium pt-0.5">{step}</p>
                      </div>
                      <button
                        onClick={() => speakInstruction(step)}
                        className="opacity-60 group-hover:opacity-100 p-1 rounded-md text-muted-foreground hover:text-primary transition-all shrink-0"
                        aria-label={`Speak step ${idx + 1}`}
                        title="Speak this step"
                      >
                        <Volume2 className="size-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Accessible Route Tip */}
                <div className="flex items-center gap-2 rounded-2xl bg-primary/10 border border-primary/30 p-3 text-[11px] text-muted-foreground">
                  <Sparkles className="size-4 text-primary shrink-0" />
                  <span>
                    Path utilizes central concrete staircases and high-capacity elevators for smooth transition between campus levels.
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-2">
                <Compass className="size-10 text-muted-foreground mx-auto opacity-40" />
                <p className="text-xs text-muted-foreground font-medium">
                  Select an origin and destination to generate turn-by-turn indoor routing across campus.
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
                UC Main Campus • {currentFloor === "M" ? "Mezzanine Floor" : `Floor ${currentFloor}`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 3.0))}
                className="p-2 rounded-xl border border-border bg-card hover:bg-accent text-foreground shadow-sm transition-colors"
                aria-label="Zoom in"
                title="Zoom In"
              >
                <ZoomIn className="size-4" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.6))}
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
              startNodeId={startNodeId}
              targetNodeId={targetNodeId}
              onSelectNode={handleSelectNode}
              zoomLevel={zoomLevel}
              recenterTrigger={recenterTrigger}
            />

            {/* Vertical Multi-Floor Selector Component (All 8 Floors) */}
            <div className="absolute top-4 right-4 z-20">
              <FloorSelector
                floors={[7, 6, 5, 4, 3, 2, "M", 1]}
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

export default function MapPage() {
  return (
    <Suspense fallback={<MapSkeleton />}>
      <InteractiveMapContent />
    </Suspense>
  );
}
