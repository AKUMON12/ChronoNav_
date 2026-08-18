"use client";

import React, { useState } from "react";
import {
  Building2,
  MapPin,
  Plus,
  Edit3,
  Trash2,
  Layers,
  Save,
  Compass,
  CheckCircle2,
  Sliders,
  X,
  Sparkles,
} from "lucide-react";

interface ManagedRoom {
  id: string;
  code: string;
  name: string;
  building: string;
  floor: number;
  type: "room" | "corridor" | "stairs" | "elevator" | "facility" | "restroom";
  capacity?: number;
  x: number;
  y: number;
}

const initialRooms: ManagedRoom[] = [
  // Floor 1
  { id: "F1_MAC_LAB_101", code: "MAC LAB 101", name: "CCS Mac Laboratory 101", building: "CCS Building", floor: 1, type: "room", capacity: 45, x: 220, y: 260 },
  { id: "F1_CANTEEN", code: "CANTEEN", name: "CCS Canteen & Lounge", building: "CCS Building", floor: 1, type: "facility", capacity: 80, x: 100, y: 200 },
  { id: "F1_ENTRANCE", code: "GATE 1", name: "Main Campus Entrance", building: "CCS Building", floor: 1, type: "facility", capacity: 100, x: 280, y: 480 },
  // Floor 2
  { id: "F2_PROG_LAB_201", code: "CCS 201", name: "Programming Lab 201", building: "CCS Building", floor: 2, type: "room", capacity: 40, x: 350, y: 260 },
  { id: "F2_LECTURE_202", code: "ROOM 202", name: "Lecture Room 202", building: "CCS Building", floor: 2, type: "room", capacity: 50, x: 180, y: 300 },
  { id: "F2_FACULTY", code: "FACULTY 205", name: "CCS Faculty Office Suite", building: "CCS Building", floor: 2, type: "facility", capacity: 25, x: 350, y: 150 },
  // Floor 3
  { id: "F3_DEAN_OFFICE", code: "DEAN SUITE", name: "CCS Dean's Office Suite", building: "CCS Building", floor: 3, type: "facility", capacity: 15, x: 350, y: 200 },
  { id: "F3_NETWORK_LAB_301", code: "CCS 301", name: "Cisco Networking Lab 301", building: "CCS Building", floor: 3, type: "room", capacity: 40, x: 180, y: 280 },
  { id: "F3_LECTURE_302", code: "CCS 302", name: "Lecture Room 302", building: "CCS Building", floor: 3, type: "room", capacity: 45, x: 180, y: 160 },
  // Floor 4
  { id: "F4_AV_HALL_401", code: "AV 401", name: "Multipurpose AV Hall 401", building: "CCS Building", floor: 4, type: "facility", capacity: 120, x: 350, y: 220 },
  { id: "F4_AI_LAB_402", code: "AI LAB 402", name: "AI & Machine Learning Lab", building: "CCS Building", floor: 4, type: "room", capacity: 40, x: 180, y: 280 },
  // Floor 5
  { id: "F5_LECTURE_538", code: "CCS 538", name: "Software Engineering Lecture 538", building: "CCS Building", floor: 5, type: "room", capacity: 55, x: 360, y: 160 },
  { id: "F5_INNOVATION_LAB_501", code: "INNOV 501", name: "CCS Innovation & Startup Lab", building: "CCS Building", floor: 5, type: "room", capacity: 35, x: 180, y: 160 },
  { id: "F5_NETWORKS_502", code: "NET 502", name: "Advanced Networking Center", building: "CCS Building", floor: 5, type: "room", capacity: 35, x: 180, y: 280 },
  { id: "F5_CONFERENCE_ROOM", code: "CONF 503", name: "Executive Conference Room", building: "CCS Building", floor: 5, type: "facility", capacity: 20, x: 360, y: 280 },
];

export default function BuildingRoomManagerPage() {
  const [rooms, setRooms] = useState<ManagedRoom[]>(initialRooms);
  const [activeFloor, setActiveFloor] = useState<number>(1);
  const [editingRoom, setEditingRoom] = useState<ManagedRoom | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // New Room Form States
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newBuilding, setNewBuilding] = useState("CCS Building");
  const [newType, setNewType] = useState<ManagedRoom["type"]>("room");
  const [newCapacity, setNewCapacity] = useState(40);
  const [newX, setNewX] = useState(250);
  const [newY, setNewY] = useState(250);

  const floorRooms = rooms.filter((r) => r.floor === activeFloor);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newName.trim()) return;

    const newRoom: ManagedRoom = {
      id: `F${activeFloor}_${newCode.replace(/\s+/g, "_").toUpperCase()}_${Date.now()}`,
      code: newCode.trim().toUpperCase(),
      name: newName.trim(),
      building: newBuilding,
      floor: activeFloor,
      type: newType,
      capacity: Number(newCapacity) || 40,
      x: Number(newX) || 250,
      y: Number(newY) || 250,
    };

    setRooms((prev) => [...prev, newRoom]);
    setIsCreateOpen(false);
    setNewCode("");
    setNewName("");
    showToast(`Added ${newRoom.name} (${newRoom.code}) to Floor ${activeFloor}.`);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;

    setRooms((prev) =>
      prev.map((r) => (r.id === editingRoom.id ? editingRoom : r))
    );
    showToast(`Saved changes for ${editingRoom.code}.`);
    setEditingRoom(null);
  };

  const handleDeleteRoom = (roomId: string, roomCode: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== roomId));
    showToast(`Deleted ${roomCode} from floor plan.`);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight flex items-center gap-2.5">
            <Building2 className="size-7 text-primary" />
            <span>Campus Rooms & POI Calibrator</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Create, calibrate, and edit rooms and coordinate waypoints for Floors 1 to 5 in the CCS Building.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-2.5 text-xs font-black text-white hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all shrink-0"
        >
          <Plus className="size-4" />
          <span>Add New Room / POI</span>
        </button>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-3.5 text-xs text-emerald-500 font-bold animate-in fade-in">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Floor Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[1, 2, 3, 4, 5].map((fl) => (
          <button
            key={fl}
            onClick={() => setActiveFloor(fl)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 ${
              activeFloor === fl
                ? "bg-primary text-white shadow-lg shadow-primary/30 scale-[1.02]"
                : "bg-card border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            <Layers className="size-4" />
            <span>Floor {fl}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] ${
                activeFloor === fl
                  ? "bg-white/20 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {rooms.filter((r) => r.floor === fl).length} POIs
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Floor Rooms Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-xl">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="text-xs font-black text-foreground uppercase tracking-wide">
                Floor {activeFloor} Registered Facilities ({floorRooms.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/40 text-muted-foreground uppercase font-black tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Room Code</th>
                    <th className="py-3 px-4">Facility Name</th>
                    <th className="py-3 px-4">Coordinates (X, Y)</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {floorRooms.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">
                        No facilities registered on Floor {activeFloor}.
                      </td>
                    </tr>
                  ) : (
                    floorRooms.map((room) => (
                      <tr key={room.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-primary">
                          {room.code}
                        </td>
                        <td className="py-3 px-4 font-bold text-foreground">{room.name}</td>
                        <td className="py-3 px-4 font-mono text-muted-foreground">
                          ({room.x}, {room.y})
                        </td>
                        <td className="py-3 px-4">
                          <span className="rounded-md bg-muted/60 px-2 py-0.5 text-[10px] font-bold text-muted-foreground uppercase">
                            {room.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingRoom(room)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                              title="Edit Room"
                            >
                              <Edit3 className="size-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteRoom(room.id, room.code)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                              title="Delete Room"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Coordinate Map Canvas Calibrator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl border border-border bg-card p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-xs font-black text-foreground uppercase tracking-wide flex items-center gap-2">
                <Compass className="size-4 text-primary" />
                <span>Floor {activeFloor} Waypoint Visualizer</span>
              </h3>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                Live Preview
              </span>
            </div>

            {/* Interactive Coordinate Preview Canvas */}
            <div className="relative w-full aspect-square bg-muted/30 rounded-2xl border border-border overflow-hidden p-2">
              <svg viewBox="0 0 500 500" className="w-full h-full">
                {/* Background Grid */}
                <defs>
                  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Outer Wall Boundaries */}
                <rect x="40" y="40" width="420" height="420" rx="16" fill="none" stroke="currentColor" strokeWidth="3" className="text-primary/40" />

                {/* Central Hallway Line */}
                <line x1="250" y1="50" x2="250" y2="450" stroke="currentColor" strokeWidth="4" strokeDasharray="6 6" className="text-primary/30" />

                {/* POI Waypoint Markers */}
                {floorRooms.map((room) => {
                  const isSelected = editingRoom?.id === room.id;
                  return (
                    <g
                      key={room.id}
                      className="cursor-pointer transition-transform hover:scale-110"
                      onClick={() => setEditingRoom(room)}
                    >
                      <circle
                        cx={room.x}
                        cy={room.y}
                        r={isSelected ? 14 : 9}
                        fill={isSelected ? "#1D7DD7" : "currentColor"}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        className={isSelected ? "" : "text-muted-foreground"}
                      />
                      <text
                        x={room.x}
                        y={room.y - 12}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="bold"
                        fill="currentColor"
                        className="text-foreground"
                      >
                        {room.code}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <p className="text-[11px] text-muted-foreground text-center">
              Click any node marker above to edit its Dijkstra waypoint coordinates.
            </p>
          </div>
        </div>
      </div>

      {/* Edit Room Modal */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-black text-foreground">Edit Facility: {editingRoom.code}</h3>
              <button
                onClick={() => setEditingRoom(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-extrabold text-muted-foreground uppercase">Facility Name</label>
                <input
                  type="text"
                  value={editingRoom.name}
                  onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background p-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold text-muted-foreground uppercase">X Coordinate (px)</label>
                  <input
                    type="number"
                    value={editingRoom.x}
                    onChange={(e) => setEditingRoom({ ...editingRoom, x: Number(e.target.value) })}
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold text-muted-foreground uppercase">Y Coordinate (px)</label>
                  <input
                    type="number"
                    value={editingRoom.y}
                    onChange={(e) => setEditingRoom({ ...editingRoom, y: Number(e.target.value) })}
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingRoom(null)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-xs font-black text-white hover:bg-primary/90 shadow-md shadow-primary/30"
                >
                  <Save className="size-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Room Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-black text-foreground">Add New Facility to Floor {activeFloor}</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold text-muted-foreground uppercase">Room Code</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="e.g. CCS 538"
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-foreground font-bold focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold text-muted-foreground uppercase">Facility Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                  >
                    <option value="room">Classroom / Lab</option>
                    <option value="facility">Office / Facility</option>
                    <option value="stairs">Stairway</option>
                    <option value="elevator">Elevator</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-extrabold text-muted-foreground uppercase">Facility Full Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Software Engineering Lab"
                  className="w-full rounded-xl border border-border bg-background p-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold text-muted-foreground uppercase">X Coordinate</label>
                  <input
                    type="number"
                    value={newX}
                    onChange={(e) => setNewX(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-extrabold text-muted-foreground uppercase">Y Coordinate</label>
                  <input
                    type="number"
                    value={newY}
                    onChange={(e) => setNewY(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-background p-2.5 text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-xs font-black text-white hover:bg-primary/90 shadow-md shadow-primary/30"
                >
                  <Plus className="size-3.5" />
                  <span>Create Facility</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
