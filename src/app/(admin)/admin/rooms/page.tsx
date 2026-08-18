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
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#507495]/20 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Building2 className="size-7 text-[#1D7DD7]" />
            <span>Campus Rooms & POI Calibrator</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#74777E] mt-1">
            Manage UC Main CCS building room entries, floor plans (1F to 5F), and SVG Dijkstra coordinates.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center justify-center gap-2 rounded-2xl bg-[#1D7DD7] px-4 py-2.5 text-xs font-black text-white hover:bg-[#1D7DD7]/90 shadow-lg shadow-[#1D7DD7]/30 transition-all shrink-0"
        >
          <Plus className="size-4" />
          <span>Add Room to Floor {activeFloor}</span>
        </button>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-3.5 text-xs text-emerald-400 font-bold animate-in fade-in">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Floor Filter Tabs (1F to 5F) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-extrabold text-[#74777E] flex items-center gap-1 shrink-0">
          <Layers className="size-4 text-[#1D7DD7]" />
          <span>Floor:</span>
        </span>
        {[1, 2, 3, 4, 5].map((fl) => (
          <button
            key={fl}
            onClick={() => setActiveFloor(fl)}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all shrink-0 ${
              activeFloor === fl
                ? "bg-[#1D7DD7] text-white shadow-md shadow-[#1D7DD7]/30 scale-[1.02]"
                : "bg-[#141E28] border border-[#507495]/25 text-[#74777E] hover:text-white"
            }`}
          >
            {fl}F — Floor {fl}
          </button>
        ))}
      </div>

      {/* Main Grid: Directory Table & Live SVG Coordinate Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Room Directory Table */}
        <div className="rounded-3xl border border-[#507495]/20 bg-[#141E28] p-5 shadow-xl space-y-4 lg:col-span-7">
          <div className="flex items-center justify-between pb-2 border-b border-[#507495]/20">
            <h3 className="text-xs font-black text-white uppercase tracking-wider">
              Floor {activeFloor} Room Directory ({floorRooms.length} Registered Nodes)
            </h3>
            <span className="text-[10px] font-bold text-[#74777E]">
              Building: CCS Main
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#507495]/20">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0E151B] text-[#74777E] font-black uppercase text-[10px] border-b border-[#507495]/20">
                <tr>
                  <th className="p-3">Code</th>
                  <th className="p-3">Room Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Cap</th>
                  <th className="p-3">Coordinates (X, Y)</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#507495]/10">
                {floorRooms.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-[#74777E]">
                      No rooms registered on Floor {activeFloor}.
                    </td>
                  </tr>
                ) : (
                  floorRooms.map((room) => (
                    <tr key={room.id} className="hover:bg-[#0E151B]/40 transition-colors">
                      <td className="p-3 font-mono font-black text-[#1D7DD7]">{room.code}</td>
                      <td className="p-3 font-bold text-white">{room.name}</td>
                      <td className="p-3">
                        <span className="capitalize text-[10px] font-bold text-[#74777E] bg-[#0E151B] px-2 py-0.5 rounded">
                          {room.type}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[#74777E]">{room.capacity || 40}</td>
                      <td className="p-3 font-mono font-bold text-slate-300">
                        ({room.x}, {room.y})
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditingRoom(room)}
                            className="p-1.5 rounded-lg text-[#74777E] hover:text-white hover:bg-[#0E151B] transition-colors"
                            title="Edit Room Coordinates"
                          >
                            <Edit3 className="size-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteRoom(room.id, room.code)}
                            className="p-1.5 rounded-lg text-[#74777E] hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
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

        {/* SVG Node Visualizer */}
        <div className="rounded-3xl border border-[#507495]/20 bg-[#0E151B] p-5 shadow-inner space-y-4 lg:col-span-5 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1D7DD7] flex items-center gap-2">
              <Sliders className="size-4" />
              <span>Floor {activeFloor} Blueprint Coordinates</span>
            </h3>
            <p className="text-[11px] text-[#74777E]">
              Calibrate X & Y anchor waypoints used by the Dijkstra pathfinding algorithm.
            </p>
          </div>

          {/* Canvas */}
          <div className="relative w-full h-[280px] rounded-2xl bg-[#141E28] border border-[#507495]/30 p-2 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 600 600" className="w-full h-full">
              <rect x="40" y="40" width="520" height="520" rx="20" fill="none" stroke="#507495" strokeWidth="2" strokeDasharray="6 6" />
              {floorRooms.map((r) => (
                <g key={r.id} onClick={() => setEditingRoom(r)} className="cursor-pointer group">
                  <circle
                    cx={r.x}
                    cy={r.y}
                    r="12"
                    fill={r.code.includes("538") ? "#38BDF8" : "#1D7DD7"}
                    stroke="#FFF"
                    strokeWidth="2"
                    className="hover:scale-125 transition-transform"
                  />
                  <text
                    x={r.x}
                    y={r.y - 16}
                    textAnchor="middle"
                    fill="#FFF"
                    className="text-[12px] font-black pointer-events-none select-none drop-shadow"
                  >
                    {r.code}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <p className="text-[10px] text-[#74777E] text-center font-bold">
            Click on any circle waypoint to calibrate pathfinding coordinates.
          </p>
        </div>
      </div>

      {/* Add Room Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-[#507495]/30 bg-[#141E28] p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-[#507495]/20">
              <h3 className="text-base font-black text-white">Add Room to Floor {activeFloor}</h3>
              <button onClick={() => setIsCreateOpen(false)} className="p-1 text-[#74777E] hover:text-white">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRoom} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-extrabold text-[#74777E] uppercase">Room Code</label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="e.g. CCS 538"
                    className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] p-2.5 text-white uppercase font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-extrabold text-[#74777E] uppercase">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as ManagedRoom["type"])}
                    className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] p-2.5 text-white"
                  >
                    <option value="room">Classroom / Lab</option>
                    <option value="facility">Office / Facility</option>
                    <option value="stairs">Stairwell</option>
                    <option value="elevator">Elevator</option>
                    <option value="restroom">Restroom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-[#74777E] uppercase">Descriptive Room Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Software Engineering Lecture Hall"
                  className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] p-2.5 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-extrabold text-[#74777E] uppercase">Cap</label>
                  <input
                    type="number"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-extrabold text-[#74777E] uppercase">SVG X</label>
                  <input
                    type="number"
                    value={newX}
                    onChange={(e) => setNewX(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-extrabold text-[#74777E] uppercase">SVG Y</label>
                  <input
                    type="number"
                    value={newY}
                    onChange={(e) => setNewY(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#507495]/20">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#507495]/30 text-[#74777E] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1D7DD7] text-white font-black hover:bg-[#1D7DD7]/90 shadow-md"
                >
                  Create Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl border border-[#507495]/30 bg-[#141E28] p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-[#507495]/20">
              <h3 className="text-base font-black text-white">Edit Room: {editingRoom.code}</h3>
              <button onClick={() => setEditingRoom(null)} className="p-1 text-[#74777E] hover:text-white">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-extrabold text-[#74777E] uppercase">Room Code</label>
                  <input
                    type="text"
                    value={editingRoom.code}
                    onChange={(e) => setEditingRoom({ ...editingRoom, code: e.target.value })}
                    className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] p-2.5 text-white font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-extrabold text-[#74777E] uppercase">Floor</label>
                  <select
                    value={editingRoom.floor}
                    onChange={(e) => setEditingRoom({ ...editingRoom, floor: Number(e.target.value) })}
                    className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] p-2.5 text-white"
                  >
                    {[1, 2, 3, 4, 5].map((fl) => (
                      <option key={fl} value={fl}>Floor {fl}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-[#74777E] uppercase">Room Name</label>
                <input
                  type="text"
                  value={editingRoom.name}
                  onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
                  className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] p-2.5 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-extrabold text-[#74777E] uppercase">SVG X Coordinate</label>
                  <input
                    type="number"
                    value={editingRoom.x}
                    onChange={(e) => setEditingRoom({ ...editingRoom, x: Number(e.target.value) })}
                    className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-extrabold text-[#74777E] uppercase">SVG Y Coordinate</label>
                  <input
                    type="number"
                    value={editingRoom.y}
                    onChange={(e) => setEditingRoom({ ...editingRoom, y: Number(e.target.value) })}
                    className="w-full rounded-xl border border-[#507495]/30 bg-[#0E151B] p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#507495]/20">
                <button
                  type="button"
                  onClick={() => setEditingRoom(null)}
                  className="px-4 py-2 rounded-xl border border-[#507495]/30 text-[#74777E] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#1D7DD7] text-white font-black hover:bg-[#1D7DD7]/90 shadow-md"
                >
                  Save Coordinates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
