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
  Sliders
} from "lucide-react";
import { SampleCCSGraph } from "@/lib/navigation/pathfinding";

interface ManagedRoom {
  id: string;
  code: string;
  name: string;
  floor: number;
  type: "room" | "corridor" | "stairs" | "elevator" | "facility" | "restroom";
  x: number;
  y: number;
}

const initialRooms: ManagedRoom[] = [
  { id: "F1_MAC_LAB_101", code: "MAC LAB 101", name: "CCS Mac Laboratory 101", floor: 1, type: "room", x: 220, y: 260 },
  { id: "F1_CANTEEN", code: "CANTEEN", name: "CCS Canteen & Refreshments", floor: 1, type: "facility", x: 100, y: 200 },
  { id: "F2_PROG_LAB_201", code: "CCS 201", name: "Programming Lab 201", floor: 2, type: "room", x: 350, y: 260 },
  { id: "F2_LECTURE_202", code: "ROOM 202", name: "Lecture Room 202", floor: 2, type: "room", x: 180, y: 300 },
  { id: "F3_DEAN_OFFICE", code: "DEAN SUITE", name: "CCS Dean's Office Suite", floor: 3, type: "facility", x: 350, y: 200 },
  { id: "F3_NETWORK_LAB_301", code: "CCS 301", name: "Cisco Networking Lab 301", floor: 3, type: "room", x: 180, y: 280 },
  { id: "F4_AV_HALL_401", code: "CCS 401", name: "Multipurpose AV Hall 401", floor: 4, type: "facility", x: 350, y: 220 },
  { id: "F4_AI_LAB_402", code: "CCS 538", name: "AI & Data Science Lab 402", floor: 4, type: "room", x: 180, y: 280 },
];

export default function BuildingRoomManagerPage() {
  const [rooms, setRooms] = useState<ManagedRoom[]>(initialRooms);
  const [activeFloor, setActiveFloor] = useState<number>(1);
  const [editingRoom, setEditingRoom] = useState<ManagedRoom | null>(null);

  // Filter rooms by floor
  const floorRooms = rooms.filter((r) => r.floor === activeFloor);

  const handleUpdateCoordinates = (roomId: string, newX: number, newY: number) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, x: newX, y: newY } : r))
    );
  };

  const handleSaveRoom = (updated: ManagedRoom) => {
    setRooms((prev) => {
      const exists = prev.some((r) => r.id === updated.id);
      if (exists) {
        return prev.map((r) => (r.id === updated.id ? updated : r));
      }
      return [...prev, updated];
    });
    setEditingRoom(null);
  };

  const handleDeleteRoom = (roomId: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== roomId));
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
            <Building2 className="size-8 text-[#1D7DD7]" />
            <span>Building & Room Manager</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage UC Main CCS building room codes, POIs, floor levels, and SVG node coordinates.
          </p>
        </div>

        <button
          onClick={() =>
            setEditingRoom({
              id: `ROOM_${Date.now()}`,
              code: "NEW 101",
              name: "New Classroom Entry",
              floor: activeFloor,
              type: "room",
              x: 300,
              y: 300,
            })
          }
          className="flex items-center gap-2 rounded-xl bg-[#1D7DD7] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1D7DD7]/90 shadow-md shadow-[#1D7DD7]/30 transition-all shrink-0"
        >
          <Plus className="size-4" />
          <span>Add New Room Entry</span>
        </button>
      </div>

      {/* Floor Filter Controls */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-extrabold text-muted-foreground flex items-center gap-1">
          <Layers className="size-4 text-[#1D7DD7]" />
          <span>Select Floor Level:</span>
        </span>
        {[1, 2, 3, 4].map((fl) => (
          <button
            key={fl}
            onClick={() => setActiveFloor(fl)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeFloor === fl
                ? "bg-[#1D7DD7] text-white shadow-md shadow-[#1D7DD7]/30"
                : "bg-card border border-border text-muted-foreground hover:bg-accent"
            }`}
          >
            Floor {fl}
          </button>
        ))}
      </div>

      {/* Layout Grid: Left Room Table, Right Interactive Node Coordinate Adjuster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Room Entries Table */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 lg:col-span-7">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-foreground uppercase tracking-wide">
              Floor {activeFloor} Room Directory ({floorRooms.length} Entries)
            </h3>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted text-muted-foreground font-extrabold uppercase border-b border-border text-[10px]">
                <tr>
                  <th className="p-3">Room Code</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">SVG Node (X, Y)</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {floorRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-muted/40 transition-colors">
                    <td className="p-3 font-black text-[#1D7DD7]">{room.code}</td>
                    <td className="p-3 font-bold text-foreground">{room.name}</td>
                    <td className="p-3 capitalize font-semibold text-muted-foreground">{room.type}</td>
                    <td className="p-3 font-extrabold text-foreground">
                      ({room.x}, {room.y})
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setEditingRoom(room)}
                          className="p-1 text-muted-foreground hover:text-foreground"
                          title="Edit Room Details"
                        >
                          <Edit3 className="size-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRoom(room.id)}
                          className="p-1 text-rose-500 hover:text-rose-600"
                          title="Delete Room"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SVG Node Coordinate Calibration Tool */}
        <div className="rounded-2xl border border-border bg-slate-950 p-5 shadow-inner space-y-4 lg:col-span-5 text-slate-100 flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-black uppercase tracking-wide text-[#1D7DD7] flex items-center gap-2">
              <Sliders className="size-4" />
              <span>SVG Map Node Calibrator</span>
            </h3>
            <p className="text-xs text-slate-400">
              Interactive node coordinates linked to Dijkstra shortest path graph.
            </p>
          </div>

          {/* Blueprint SVG Preview */}
          <div className="relative w-full h-[300px] border border-slate-800 rounded-xl bg-slate-900 flex items-center justify-center">
            <svg viewBox="0 0 600 600" className="w-full h-full p-2">
              <rect x="40" y="40" width="520" height="520" rx="16" fill="none" stroke="#507495" strokeWidth="3" />
              {floorRooms.map((r) => (
                <g key={r.id} className="cursor-pointer">
                  <circle cx={r.x} cy={r.y} r="10" fill="#1D7DD7" stroke="#FFF" strokeWidth="2" />
                  <text x={r.x} y={r.y - 14} textAnchor="middle" fill="#FFF" className="text-[11px] font-bold">
                    {r.code}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="text-xs text-slate-400 font-medium text-center">
            Click on any room entry to edit X & Y pathfinding graph coordinates.
          </div>
        </div>
      </div>

      {/* Edit Room Modal */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-foreground">Edit Room Entry</h3>

            <div className="space-y-3 text-xs font-bold">
              <div>
                <label className="text-muted-foreground">Room Code</label>
                <input
                  type="text"
                  value={editingRoom.code}
                  onChange={(e) => setEditingRoom({ ...editingRoom, code: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background p-2.5 text-foreground mt-1"
                />
              </div>

              <div>
                <label className="text-muted-foreground">Room Name</label>
                <input
                  type="text"
                  value={editingRoom.name}
                  onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
                  className="w-full rounded-xl border border-input bg-background p-2.5 text-foreground mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-muted-foreground">SVG Node X</label>
                  <input
                    type="number"
                    value={editingRoom.x}
                    onChange={(e) => setEditingRoom({ ...editingRoom, x: Number(e.target.value) })}
                    className="w-full rounded-xl border border-input bg-background p-2.5 text-foreground mt-1"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground">SVG Node Y</label>
                  <input
                    type="number"
                    value={editingRoom.y}
                    onChange={(e) => setEditingRoom({ ...editingRoom, y: Number(e.target.value) })}
                    className="w-full rounded-xl border border-input bg-background p-2.5 text-foreground mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingRoom(null)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-accent"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveRoom(editingRoom)}
                className="px-4 py-2 rounded-xl bg-[#1D7DD7] text-white text-xs font-bold hover:bg-[#1D7DD7]/90 shadow-sm"
              >
                Save Room Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
