"use client";

import React, { useState, useMemo } from "react";
import { 
  FileText, 
  Download, 
  Filter, 
  Search, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Activity, 
  FileSpreadsheet, 
  Printer 
} from "lucide-react";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";

interface SystemLogEntry {
  id: string;
  timestamp: string;
  category: "Auth" | "OCR" | "Navigation" | "System";
  event: string;
  user: string;
  status: "Success" | "Warning" | "Error";
  details: string;
}

const initialLogs: SystemLogEntry[] = [
  {
    id: "log-1001",
    timestamp: "2026-08-13 10:45:12",
    category: "Auth",
    event: "User Sign In",
    user: "student@uc.edu.ph",
    status: "Success",
    details: "Authenticated via Supabase Auth Session",
  },
  {
    id: "log-1002",
    timestamp: "2026-08-13 10:42:05",
    category: "OCR",
    event: "Study Load Scan",
    user: "student@uc.edu.ph",
    status: "Success",
    details: "Extracted 5 classes with 96.8% confidence score",
  },
  {
    id: "log-1003",
    timestamp: "2026-08-13 10:38:40",
    category: "Navigation",
    event: "Route Calculation",
    user: "student@uc.edu.ph",
    status: "Success",
    details: "Dijkstra path computed: Gate 1 Entrance -> Dean's Office Suite (Floor 3)",
  },
  {
    id: "log-1004",
    timestamp: "2026-08-13 10:30:15",
    category: "System",
    event: "DB Query Retry",
    user: "system_cron",
    status: "Warning",
    details: "Supabase connection latency spike (120ms), auto-retried",
  },
  {
    id: "log-1005",
    timestamp: "2026-08-13 10:15:00",
    category: "Auth",
    event: "Faculty Sign In",
    user: "faculty@uc.edu.ph",
    status: "Success",
    details: "Faculty portal session started",
  },
  {
    id: "log-1006",
    timestamp: "2026-08-13 09:55:22",
    category: "OCR",
    event: "Image Preprocessing",
    user: "student@uc.edu.ph",
    status: "Success",
    details: "Rotated study load PDF page 1 for Tesseract OCR",
  },
];

export default function SystemLogsPage() {
  const [mounted, setMounted] = useState(false);
  const [logs, setLogs] = useState<SystemLogEntry[]>(initialLogs);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  React.useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("chrononav_system_activity_logs");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setLogs([...parsed, ...initialLogs]);
          }
        }
      } catch {}
    }
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        log.event.toLowerCase().includes(search.toLowerCase()) ||
        log.user.toLowerCase().includes(search.toLowerCase()) ||
        log.details.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "All" || log.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [logs, search, categoryFilter]);

  if (!mounted) {
    return <TableSkeleton rows={6} />;
  }

  // Export logs to CSV
  const handleExportCSV = () => {
    const headers = ["Log ID", "Timestamp", "Category", "Event", "User", "Status", "Details"];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.timestamp,
      l.category,
      `"${l.event}"`,
      l.user,
      l.status,
      `"${l.details}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ChronoNav_System_Logs_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export summary report
  const handleExportReport = () => {
    const reportText = `
CHRONONAV SYSTEM ACTIVITY & OVERSIGHT REPORT
University of Cebu Main Campus — College of Computer Studies
Generated On: ${new Date().toLocaleString()}

SUMMARY METRICS:
----------------------------------------------
Total Logged Events: ${filteredLogs.length}
Auth Events: ${filteredLogs.filter(l => l.category === "Auth").length}
OCR Extractions: ${filteredLogs.filter(l => l.category === "OCR").length}
Navigation Queries: ${filteredLogs.filter(l => l.category === "Navigation").length}
System Warnings/Errors: ${filteredLogs.filter(l => l.status !== "Success").length}

EVENT AUDIT LOG TRAIL:
----------------------------------------------
${filteredLogs.map(l => `[${l.timestamp}] ${l.category.toUpperCase()} | ${l.event} | User: ${l.user} | Status: ${l.status} | Details: ${l.details}`).join("\n")}
`;

    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ChronoNav_System_Report_${Date.now()}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
            <FileText className="size-8 text-[#1D7DD7]" />
            <span>System Activity Logs & Reports</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time system audit logs, login records, OCR extraction logs, and downloadable analytical reports.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-accent text-xs font-bold text-foreground transition-all shadow-sm"
          >
            <FileSpreadsheet className="size-4 text-emerald-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportReport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1D7DD7] text-white text-xs font-extrabold hover:bg-[#1D7DD7]/90 shadow-md shadow-[#1D7DD7]/30 transition-all"
          >
            <Download className="size-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border p-4 rounded-2xl shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events, users, or details..."
            className="w-full pl-9 pr-3 py-2 text-xs font-bold rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-[#1D7DD7]"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
          <Filter className="size-3.5 text-[#1D7DD7]" />
          <span>Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-input bg-background px-3 py-1.5 text-xs font-bold text-foreground focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Auth">Auth & Sign In</option>
            <option value="OCR">OCR Extraction</option>
            <option value="Navigation">Indoor Navigation</option>
            <option value="System">System & Latency</option>
          </select>
        </div>
      </div>

      {/* Log Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted text-muted-foreground font-extrabold uppercase border-b border-border text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Category</th>
                <th className="p-4">Event</th>
                <th className="p-4">User</th>
                <th className="p-4">Status</th>
                <th className="p-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/40 transition-colors">
                  <td className="p-4 font-bold text-muted-foreground whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-4 font-black text-[#1D7DD7]">{log.category}</td>
                  <td className="p-4 font-extrabold text-foreground">{log.event}</td>
                  <td className="p-4 text-foreground font-semibold">{log.user}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-extrabold ${
                        log.status === "Success"
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/30"
                          : log.status === "Warning"
                          ? "bg-amber-500/10 text-amber-600 border border-amber-500/30"
                          : "bg-rose-500/10 text-rose-600 border border-rose-500/30"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground font-medium max-w-xs truncate">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
