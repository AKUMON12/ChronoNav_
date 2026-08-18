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
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { BackButton } from "@/components/shared/back-button";

/**
 * Public Campus Explorer for Unauthenticated Guests
 * Zero-login interactive campus map and facility directory for UC Main Campus.
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
        return <Laptop className="size-3.5 text-primary" />;
      case "classroom":
        return <GraduationCap className="size-3.5 text-emerald-500 dark:text-emerald-400" />;
      case "office":
        return <Briefcase className="size-3.5 text-indigo-500 dark:text-indigo-400" />;
      case "amenity":
      case "facility":
        return <Coffee className="size-3.5 text-amber-500 dark:text-amber-400" />;
      default:
        return <MapPin className="size-3.5 text-muted-foreground" />;
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground transition-colors duration-200">
      {/* ── Top Header with Back Button (Left) & Theme Toggle (Right) ── */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card/90 backdrop-blur px-4 sm:px-8 transition-colors duration-200">
        <div className="flex items-center gap-3">
          <BackButton fallbackUrl="/" showLabel={false} />

          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="flex size-9 items-center justify-center rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/30">
              <Compass className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-black text-foreground tracking-tight">CHRONONAV</span>
                <span className="rounded-md bg-primary/15 border border-primary/30 px-2 py-0.5 text-[9px] sm:text-[10px] font-black text-primary uppercase tracking-wider">
                  Guest Mode
                </span>
              </div>
              <p className="hidden sm:block text-[11px] font-semibold text-muted-foreground">
                University of Cebu • Main Campus (CCS Building)
              </p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <ThemeToggle />

          <Link
            href="/login"
            className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-primary px-3 sm:px-4 py-2 text-xs font-black text-white hover:bg-primary/90 shadow-md shadow-primary/25 transition-all"
          >
            <LogIn className="size-3.5 sm:size-4" />
            <span>Sign In</span>
          </Link>
        </div>
      </header>

      {/* ── Main Explorer Content ── */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Search, Floor Tabs & Room Directory */}
        <div className="space-y-4 lg:col-span-4 flex flex-col">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search classrooms, labs, offices (e.g. 538, Mac Lab)..."
              className="w-full rounded-2xl border border-border bg-card py-3 pl-10 pr-4 text-xs sm:text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Quick Floor Switcher Tabs */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider block">
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
                      ? "bg-primary text-white shadow-md shadow-primary/30 scale-[1.02]"
                      : "bg-card border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
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
                    ? "bg-primary/15 border border-primary text-primary"
                    : "bg-card border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Room Cards Directory List */}
          <div className="rounded-3xl border border-border bg-card p-4 flex-1 flex flex-col space-y-3 min-h-[350px] shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-xs font-extrabold text-foreground uppercase tracking-wide">
                {searchQuery ? "Search Results" : `Floor ${currentFloor} Directory`}
              </span>
              <span className="text-[11px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md">
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
                          ? "bg-primary/15 border-primary text-foreground shadow-md shadow-primary/20"
                          : "bg-muted/30 border-border text-muted-foreground hover:bg-muted/60 hover:border-border hover:text-foreground"
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
                            <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                              {node.description}
                            </p>
                          )}
                        </div>
                        <span className="text-[10px] font-black bg-card border border-border px-2 py-0.5 rounded-lg text-primary shrink-0">
                          {node.floor}F
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center space-y-2">
                  <Info className="size-8 text-muted-foreground mx-auto opacity-50" />
                  <p className="text-xs text-muted-foreground font-medium">
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
          <div className="flex flex-wrap items-center justify-between gap-3 bg-card border border-border p-3 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-muted-foreground uppercase tracking-wider">
                ACTIVE VIEWPORT:
              </span>
              <span className="text-xs font-black text-primary bg-primary/10 border border-primary/30 px-3 py-1 rounded-xl">
                CCS Building • Floor {currentFloor} (Floorplan)
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
                onClick={() => setZoomLevel(1)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card hover:bg-accent text-xs font-bold text-foreground shadow-sm transition-colors"
                aria-label="Reset zoom"
              >
                <RotateCcw className="size-3.5 text-primary" />
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
            <div className="rounded-3xl border border-primary/40 bg-card p-5 shadow-xl space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/15 border border-primary/30 text-primary shrink-0">
                    <Building2 className="size-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-foreground">
                        {selectedNode.name}
                      </h3>
                      <span className="rounded-md bg-primary px-2 py-0.5 text-[10px] font-black text-white">
                        Floor {selectedNode.floor}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {selectedNode.description || "College of Computer Studies • University of Cebu Main Campus"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/login?redirect=/map?target=${selectedNode.id}`}
                    className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-extrabold text-white hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all"
                  >
                    <Footprints className="size-4" />
                    <span>Sign In for Turn-by-Turn Routing</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </div>

              {/* Guest CTA Info Strip */}
              <div className="flex items-center gap-2 rounded-xl bg-muted/40 border border-border p-3 text-[11px] text-muted-foreground">
                <Sparkles className="size-4 text-primary shrink-0" />
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
