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
  };

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
    <div className="flex min-h-screen w-full flex-col bg-[#0E151B] text-foreground">
      {/* ── Top Header ── */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#507495]/20 bg-[#141E28]/95 backdrop-blur px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-foreground hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="size-5 text-[#74777E]" />
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#1D7DD7] text-white font-bold shadow-md shadow-[#1D7DD7]/30">
              <Compass className="size-5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white leading-none">ChronoNav Map</h1>
              <span className="text-[10px] font-semibold text-[#74777E]">
                UC Main Campus • CCS Building (Floors 1-5)
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setVoiceGuidance(!voiceGuidance)}
            className={`flex items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-all shadow-sm ${
              voiceGuidance
                ? "bg-[#1D7DD7]/20 text-[#1D7DD7] border-[#1D7DD7]/50 ring-1 ring-[#1D7DD7]/30"
                : "bg-[#0E151B] text-[#74777E] border-[#507495]/30 hover:text-white"
            }`}
            aria-label="Toggle Voice Guidance"
          >
            {voiceGuidance ? <Volume2 className="size-4 animate-pulse" /> : <VolumeX className="size-4" />}
            <span className="hidden sm:inline">Voice Guidance: {voiceGuidance ? "ON" : "OFF"}</span>
          </button>
        </div>
      </header>

      {/* ── Main Map Content ── */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Route Configurator & Turn-by-Turn Guide */}
        <div className="space-y-6 lg:col-span-4 flex flex-col">
          {/* Route Configurator Card */}
          <div className="rounded-3xl border border-[#507495]/20 bg-[#141E28] p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#507495]/20">
              <h2 className="text-xs font-black text-white flex items-center gap-2 tracking-wide uppercase">
                <Navigation className="size-4 text-[#1D7DD7]" />
                <span>Indoor Route Configurator</span>
              </h2>
              {startNodeId && targetNodeId && (
                <button
                  onClick={handleSwapLocations}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#74777E] hover:text-[#1D7DD7] transition-colors bg-[#0E151B] px-2.5 py-1 rounded-lg border border-[#507495]/20"
                  title="Swap Origin and Destination"
                >
                  <ArrowUpDown className="size-3.5" />
                  <span>Swap</span>
                </button>
              )}
            </div>

            {/* Origin Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-emerald-400 flex items-center gap-1.5 uppercase">
                <MapPin className="size-3.5 text-emerald-400" />
                <span>Origin Start Location</span>
              </label>
              <select
                value={startNodeId}
                onChange={(e) => handleStartChange(e.target.value)}
                className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] px-3.5 py-2.5 text-xs font-black text-white focus:outline-none focus:ring-2 focus:ring-[#1D7DD7] shadow-sm"
              >
                {filteredStartNodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    Floor {node.floor}: {node.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-rose-400 flex items-center gap-1.5 uppercase">
                <MapPin className="size-3.5 text-rose-400" />
                <span>Destination Target Room</span>
              </label>
              <select
                value={targetNodeId}
                onChange={(e) => handleTargetChange(e.target.value)}
                className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] px-3.5 py-2.5 text-xs font-black text-white focus:outline-none focus:ring-2 focus:ring-[#1D7DD7] shadow-sm"
              >
                <option value="">Select Target Destination...</option>
                {filteredTargetNodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    Floor {node.floor}: {node.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Calculated Distance & Multi-Floor Metrics */}
            {pathResult && (
              <div className="rounded-2xl bg-[#1D7DD7]/15 border border-[#1D7DD7]/30 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-[#1D7DD7]">
                  <span>ESTIMATED WALKING DISTANCE</span>
                  <span className="text-sm font-black text-white">{pathResult.totalDistance} meters</span>
                </div>
                {pathResult.floorsTraversed.length > 1 && (
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 pt-1.5 border-t border-[#1D7DD7]/20">
                    <Footprints className="size-3.5 shrink-0" />
                    <span>
                      Multi-Floor Path: Floors {pathResult.floorsTraversed.join(" → ")}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Turn-by-Turn Walking Directions Card */}
          <div className="rounded-3xl border border-[#507495]/20 bg-[#141E28] p-5 shadow-xl space-y-4 flex-1">
            <div className="flex items-center justify-between pb-2 border-b border-[#507495]/20">
              <h3 className="text-xs font-black text-white uppercase tracking-wide">
                Turn-by-Turn Walking Steps
              </h3>
              {pathResult && (
                <span className="text-[10px] font-black bg-[#1D7DD7]/20 text-[#1D7DD7] px-2 py-0.5 rounded-md">
                  {pathResult.instructions.length} Steps
                </span>
              )}
            </div>

            {pathResult ? (
              <ol className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {pathResult.instructions.map((step, idx) => {
                  const nodeForStep = pathResult.waypoints[idx];
                  const isCurrentFloorStep = nodeForStep && nodeForStep.floor === currentFloor;

                  return (
                    <li
                      key={idx}
                      onClick={() => {
                        if (nodeForStep) setCurrentFloor(nodeForStep.floor);
                      }}
                      className={`flex items-start gap-3 p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                        isCurrentFloorStep
                          ? "bg-[#1D7DD7]/20 border-[#1D7DD7] text-white shadow-md shadow-[#1D7DD7]/20 font-semibold"
                          : "bg-[#0E151B]/60 border-[#507495]/20 text-[#74777E] hover:bg-[#0E151B] hover:text-white"
                      }`}
                    >
                      <span
                        className={`flex size-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-black ${
                          isCurrentFloorStep
                            ? "bg-[#1D7DD7] text-white"
                            : "bg-[#141E28] text-[#74777E]"
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <div className="space-y-0.5 pt-0.5">
                        <p className="leading-snug text-white">{step}</p>
                        {nodeForStep && (
                          <span className="text-[10px] text-[#74777E] font-bold block">
                            Floor {nodeForStep.floor}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <div className="py-12 text-center space-y-2">
                <AlertCircle className="size-8 text-[#74777E] mx-auto opacity-50" />
                <p className="text-xs text-[#74777E] font-medium">
                  Select origin and target to calculate Dijkstra shortest path.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive SVG Map Viewer */}
        <div className="space-y-4 lg:col-span-8 flex flex-col">
          {/* Controls Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#141E28] border border-[#507495]/20 p-3 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-[#74777E] uppercase tracking-wider">
                VIEWING:
              </span>
              <span className="text-xs font-black text-[#1D7DD7] bg-[#1D7DD7]/15 border border-[#1D7DD7]/30 px-3 py-1 rounded-xl">
                CCS Building • Floor {currentFloor} (Active Map)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.5))}
                className="p-2 rounded-xl border border-[#507495]/30 bg-[#0E151B] hover:bg-[#141E28] text-white shadow-sm transition-colors"
                aria-label="Zoom In"
                title="Zoom In"
              >
                <ZoomIn className="size-4" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
                className="p-2 rounded-xl border border-[#507495]/30 bg-[#0E151B] hover:bg-[#141E28] text-white shadow-sm transition-colors"
                aria-label="Zoom Out"
                title="Zoom Out"
              >
                <ZoomOut className="size-4" />
              </button>
              <button
                onClick={handleRecenter}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#507495]/30 bg-[#0E151B] hover:bg-[#141E28] text-xs font-bold text-white shadow-sm transition-colors"
                aria-label="Recenter Map"
              >
                <RotateCcw className="size-3.5 text-[#1D7DD7]" />
                <span>Recenter</span>
              </button>
            </div>
          </div>

          {/* Interactive SVG Canvas */}
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

            {/* Vertical Multi-Floor Switcher Component */}
            <div className="absolute top-4 right-4 z-20">
              <FloorSelector
                floors={[1, 2, 3, 4, 5]}
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
    <Suspense
      fallback={
        <div className="p-12 text-center text-sm font-black text-[#74777E]">
          Loading Campus Navigation Engine...
        </div>
      }
    >
      <InteractiveMapContent />
    </Suspense>
  );
}
