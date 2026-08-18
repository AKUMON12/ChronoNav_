"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Compass,
  LogIn,
  Search,
  Building2,
  MapPin,
  Layers,
  Sparkles,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Info,
  Laptop,
  GraduationCap,
  Briefcase,
  Coffee,
  X,
  Footprints,
} from "lucide-react";
import { SampleCCSGraph, Node } from "@/lib/navigation/pathfinding";
import { InteractiveSVGMap } from "@/components/map/interactive-svg-map";
import { FloorSelector } from "@/components/map/floor-selector";

/**
 * Public Campus Explorer for Unauthenticated Guests
 * Zero-login interactive campus map and facility directory for UC Main Campus (College of Computer Studies).
 */
export default function PublicExplorePage() {
  const graph = useMemo(() => SampleCCSGraph.getSampleGraph(), []);
  const allNodes = useMemo(() => Object.values(graph), [graph]);

  // Active Floor & Map Control States
  const [currentFloor, setCurrentFloor] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Search & Category Filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Selected Room Node State for Floating Detail Modal
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>("F1_MAC_LAB_101");

  // Filter rooms based on search and category
  const filteredNodes = useMemo(() => {
    return allNodes.filter((node) => {
      // Exclude generic hallways, elevators, and stairs from room list directory
      if (node.type === "corridor") return false;

      const matchesFloor = node.floor === currentFloor;
      const matchesSearch =
        !searchQuery.trim() ||
        node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (node.description && node.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        `floor ${node.floor}`.includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        (selectedCategory === "lab" && node.category === "lab") ||
        (selectedCategory === "classroom" && node.category === "classroom") ||
        (selectedCategory === "office" && node.category === "office") ||
        (selectedCategory === "amenity" && (node.category === "amenity" || node.category === "facility"));

      return (searchQuery.trim() ? true : matchesFloor) && matchesSearch && matchesCategory;
    });
  }, [allNodes, currentFloor, searchQuery, selectedCategory]);

  const selectedNode: Node | null = selectedRoomId && graph[selectedRoomId] ? graph[selectedRoomId] : null;

  const handleSelectNode = (nodeId: string) => {
    setSelectedRoomId(nodeId);
    if (graph[nodeId]) {
      setCurrentFloor(graph[nodeId].floor);
    }
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "lab":
        return <Laptop className="size-3.5 text-[#1D7DD7]" />;
      case "classroom":
        return <GraduationCap className="size-3.5 text-emerald-400" />;
      case "office":
        return <Briefcase className="size-3.5 text-indigo-400" />;
      case "amenity":
      case "facility":
        return <Coffee className="size-3.5 text-amber-400" />;
      default:
        return <MapPin className="size-3.5 text-[#507495]" />;
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#0E151B] text-foreground">
      {/* ── Top Header ── */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#507495]/20 bg-[#141E28]/95 backdrop-blur px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-[#1D7DD7] text-white font-bold shadow-lg shadow-[#1D7DD7]/30">
              <Compass className="size-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-white tracking-tight">CHRONONAV</span>
                <span className="rounded-md bg-[#1D7DD7]/20 border border-[#1D7DD7]/40 px-2 py-0.5 text-[10px] font-black text-[#1D7DD7] uppercase tracking-wider">
                  Guest Mode
                </span>
              </div>
              <p className="text-[11px] font-semibold text-[#74777E]">
                University of Cebu • Main Campus (CCS Building)
              </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-xl bg-[#1D7DD7] px-4 py-2 text-xs sm:text-sm font-extrabold text-white hover:bg-[#1D7DD7]/90 shadow-md shadow-[#1D7DD7]/30 transition-all"
          >
            <LogIn className="size-4" />
            <span>Student / Staff Sign In</span>
          </Link>
        </div>
      </header>

      {/* ── Main Explorer Content ── */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Search, Floor Tabs & Room Directory */}
        <div className="space-y-4 lg:col-span-4 flex flex-col">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#74777E]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search classrooms, labs, offices (e.g. 538, Mac Lab)..."
              className="w-full rounded-2xl border border-[#507495]/30 bg-[#141E28] py-3 pl-10 pr-4 text-xs sm:text-sm font-medium text-foreground placeholder:text-[#74777E] focus:outline-none focus:ring-2 focus:ring-[#1D7DD7] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#74777E] hover:text-foreground p-1"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Quick Floor Switcher Tabs */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black text-[#74777E] uppercase tracking-wider block">
              QUICK FLOOR SWITCHER
            </span>
            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map((fl) => (
                <button
                  key={fl}
                  onClick={() => {
                    setCurrentFloor(fl);
                    setSearchQuery("");
                  }}
                  className={`py-2 rounded-xl text-xs font-black transition-all ${
                    currentFloor === fl && !searchQuery
                      ? "bg-[#1D7DD7] text-white shadow-md shadow-[#1D7DD7]/30"
                      : "bg-[#141E28] border border-[#507495]/20 text-[#74777E] hover:bg-[#141E28]/80 hover:text-foreground"
                  }`}
                >
                  {fl}F
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: "all", label: "All Facilities" },
              { id: "lab", label: "Computer Labs" },
              { id: "classroom", label: "Lecture Halls" },
              { id: "office", label: "Offices" },
              { id: "amenity", label: "Amenities" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all shrink-0 ${
                  selectedCategory === cat.id
                    ? "bg-[#1D7DD7]/20 border border-[#1D7DD7] text-[#1D7DD7]"
                    : "bg-[#141E28] border border-[#507495]/20 text-[#74777E] hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Room Cards Directory List */}
          <div className="rounded-3xl border border-[#507495]/20 bg-[#141E28] p-4 flex-1 flex flex-col space-y-3 min-h-[350px]">
            <div className="flex items-center justify-between pb-2 border-b border-[#507495]/20">
              <span className="text-xs font-extrabold text-foreground uppercase tracking-wide">
                {searchQuery ? "Search Results" : `Floor ${currentFloor} Directory`}
              </span>
              <span className="text-[11px] font-black text-[#1D7DD7] bg-[#1D7DD7]/10 px-2 py-0.5 rounded-md">
                {filteredNodes.length} Locations
              </span>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[380px] pr-1">
              {filteredNodes.length > 0 ? (
                filteredNodes.map((node) => {
                  const isSelected = node.id === selectedRoomId;
                  return (
                    <div
                      key={node.id}
                      onClick={() => handleSelectNode(node.id)}
                      className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? "bg-[#1D7DD7]/15 border-[#1D7DD7] text-white shadow-md shadow-[#1D7DD7]/20"
                          : "bg-[#0E151B]/60 border-[#507495]/20 text-[#74777E] hover:bg-[#0E151B] hover:border-[#507495]/40 hover:text-foreground"
                      }`}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-foreground">
                            {getCategoryIcon(node.category)}
                            <span className="text-xs font-extrabold">{node.name}</span>
                          </div>
                          {node.description && (
                            <p className="text-[11px] text-[#74777E] line-clamp-2 leading-relaxed">
                              {node.description}
                            </p>
                          )}
                        </div>
                        <span className="text-[10px] font-black bg-[#141E28] border border-[#507495]/30 px-2 py-0.5 rounded-lg text-[#1D7DD7] shrink-0">
                          {node.floor}F
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center space-y-2">
                  <Info className="size-8 text-[#74777E] mx-auto opacity-50" />
                  <p className="text-xs text-[#74777E] font-medium">
                    No facilities found matching your search criteria.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Map Viewer & Floating Room Detail Card */}
        <div className="space-y-4 lg:col-span-8 flex flex-col">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#141E28] border border-[#507495]/20 p-3 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-[#74777E] uppercase tracking-wider">
                ACTIVE VIEWPORT:
              </span>
              <span className="text-xs font-black text-[#1D7DD7] bg-[#1D7DD7]/10 border border-[#1D7DD7]/30 px-3 py-1 rounded-xl">
                CCS Building • Floor {currentFloor} (Floorplan)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.5))}
                className="p-2 rounded-xl border border-[#507495]/30 bg-[#0E151B] hover:bg-[#141E28] text-foreground shadow-sm transition-colors"
                aria-label="Zoom in"
                title="Zoom In"
              >
                <ZoomIn className="size-4" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
                className="p-2 rounded-xl border border-[#507495]/30 bg-[#0E151B] hover:bg-[#141E28] text-foreground shadow-sm transition-colors"
                aria-label="Zoom out"
                title="Zoom Out"
              >
                <ZoomOut className="size-4" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#507495]/30 bg-[#0E151B] hover:bg-[#141E28] text-xs font-bold text-foreground shadow-sm transition-colors"
                aria-label="Reset zoom"
              >
                <RotateCcw className="size-3.5 text-[#1D7DD7]" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Interactive Map Canvas */}
          <div className="relative flex-1">
            <InteractiveSVGMap
              currentFloor={currentFloor}
              graph={graph}
              waypoints={[]}
              targetNodeId={selectedRoomId || undefined}
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

          {/* Floating Selected Room Detail Card with Turn-by-Turn Navigation Prompt */}
          {selectedNode && (
            <div className="rounded-3xl border border-[#1D7DD7]/40 bg-[#141E28] p-5 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-[#1D7DD7]/20 border border-[#1D7DD7]/40 text-[#1D7DD7] shrink-0">
                    <Building2 className="size-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-white">
                        {selectedNode.name}
                      </h3>
                      <span className="rounded-md bg-[#1D7DD7] px-2 py-0.5 text-[10px] font-black text-white">
                        Floor {selectedNode.floor}
                      </span>
                    </div>
                    <p className="text-xs text-[#74777E] mt-0.5">
                      {selectedNode.description || "College of Computer Studies • University of Cebu Main Campus"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/login?redirect=/map?target=${selectedNode.id}`}
                    className="flex items-center gap-2 rounded-xl bg-[#1D7DD7] px-4 py-2.5 text-xs font-extrabold text-white hover:bg-[#1D7DD7]/90 shadow-lg shadow-[#1D7DD7]/30 transition-all"
                  >
                    <Footprints className="size-4" />
                    <span>Sign In for Turn-by-Turn Routing</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>

              {/* Guest CTA Info Strip */}
              <div className="flex items-center gap-2 rounded-xl bg-[#0E151B]/80 border border-[#507495]/25 p-3 text-[11px] text-[#74777E]">
                <Sparkles className="size-4 text-[#1D7DD7] shrink-0" />
                <span>
                  ChronoNav automatically syncs your enrolled study load and calculates shortest walking paths from gate entrance to classrooms.
                </span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
