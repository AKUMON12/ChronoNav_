"use client";

import React, { useState, useRef } from "react";
import { 
  UploadCloud, 
  Camera, 
  FileText, 
  X, 
  Loader2, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  ScanLine, 
  Sparkles,
  AlertCircle
} from "lucide-react";
import { ParsedScheduleItem } from "@/types/schedule";
import { processOCRFile } from "@/lib/ocr/parser";

interface OCRUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSchedule: (items: ParsedScheduleItem[]) => void;
}

export function OCRUploadModal({
  isOpen,
  onClose,
  onConfirmSchedule,
}: OCRUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Upload steps: 'upload' | 'scanning' | 'verify'
  const [step, setStep] = useState<"upload" | "scanning" | "verify">("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>("Initializing OCR Scanner...");
  const [parsedItems, setParsedItems] = useState<ParsedScheduleItem[]>([]);
  const [confidence, setConfidence] = useState<number>(0.95);

  if (!isOpen) return null;

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setStep("scanning");
    setScanProgress(15);
    setStatusMessage("Uploading study load document...");

    // Simulate progress ticks
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 85) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 400);

    try {
      setStatusMessage("Running optical character recognition (OCR)...");
      const result = await processOCRFile(file);
      clearInterval(interval);
      setScanProgress(100);
      setParsedItems(result.parsedItems);
      setConfidence(result.confidence);

      setTimeout(() => {
        setStep("verify");
      }, 500);
    } catch (err) {
      clearInterval(interval);
      setStep("upload");
      alert("Failed to extract study load. Please try again.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleCellChange = (
    index: number,
    field: keyof ParsedScheduleItem,
    value: string
  ) => {
    const updated = [...parsedItems];
    updated[index] = { ...updated[index], [field]: value };
    setParsedItems(updated);
  };

  const handleAddRow = () => {
    const newItem: ParsedScheduleItem = {
      id: `ocr-manual-${Date.now()}`,
      courseCode: "CS 101",
      courseTitle: "Introduction to Computing",
      instructor: "Faculty TBA",
      dayOfWeek: "Mon",
      startTime: "08:00 AM",
      endTime: "10:30 AM",
      building: "CCS Building",
      room: "CCS 301",
      confidence: 1.0,
    };
    setParsedItems([...parsedItems, newItem]);
  };

  const handleDeleteRow = (index: number) => {
    setParsedItems(parsedItems.filter((_, idx) => idx !== index));
  };

  const handleSave = () => {
    onConfirmSchedule(parsedItems);
    onClose();
  };

  const resetModal = () => {
    setStep("upload");
    setSelectedFile(null);
    setScanProgress(0);
    setParsedItems([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[#1D7DD7] text-white font-bold shadow-md shadow-[#1D7DD7]/30">
              <ScanLine className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground leading-none">
                Study Load OCR Scanner
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Upload your UC Study Load to automatically extract class schedule details
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              resetModal();
              onClose();
            }}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* STEP 1: Upload File or Camera */}
        {step === "upload" && (
          <div className="space-y-6 py-4">
            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-border hover:border-[#1D7DD7] bg-muted/30 hover:bg-[#1D7DD7]/5 rounded-2xl p-10 cursor-pointer transition-all text-center"
            >
              <div className="flex size-14 items-center justify-center rounded-2xl bg-[#1D7DD7]/10 text-[#1D7DD7]">
                <UploadCloud className="size-8" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground">
                  Drag & Drop Study Load PDF or Image here
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports PDF, PNG, JPG, or JPEG official University of Cebu enrollment forms
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/png,image/jpeg,image/jpg"
                onChange={handleInputChange}
                className="hidden"
              />
            </div>

            {/* Mobile Camera Option */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border bg-background">
              <div className="flex items-center gap-3">
                <Camera className="size-5 text-[#1D7DD7]" />
                <div>
                  <p className="text-xs font-bold text-foreground">Mobile Camera Capture</p>
                  <p className="text-[11px] text-muted-foreground">Take a photo of your printed study load</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1D7DD7] text-white text-xs font-bold hover:bg-[#1D7DD7]/90 shadow-sm"
              >
                <Camera className="size-3.5" />
                <span>Open Camera</span>
              </button>

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleInputChange}
                className="hidden"
              />
            </div>
          </div>
        )}

        {/* STEP 2: OCR Scanning Animation */}
        {step === "scanning" && (
          <div className="py-12 space-y-6 text-center">
            <div className="relative flex justify-center">
              <div className="relative flex size-20 items-center justify-center rounded-3xl bg-[#1D7DD7]/10 text-[#1D7DD7] animate-pulse">
                <Sparkles className="size-10 text-[#1D7DD7] animate-spin" />
              </div>
            </div>

            <div className="space-y-2 max-w-sm mx-auto">
              <h3 className="text-base font-bold text-foreground">{statusMessage}</h3>
              {selectedFile && (
                <p className="text-xs text-muted-foreground font-medium truncate">
                  File: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto space-y-1.5">
              <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-[#1D7DD7] transition-all duration-300 rounded-full"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                <span>OCR Processing</span>
                <span>{scanProgress}%</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Verification & Editable Table */}
        {step === "verify" && (
          <div className="space-y-5 py-2">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1D7DD7]/10 border border-[#1D7DD7]/20 p-3 rounded-xl">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-emerald-500" />
                <span className="text-xs font-extrabold text-foreground">
                  Extracted {parsedItems.length} Classes Successfully
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#1D7DD7] bg-card px-2.5 py-1 rounded-lg border border-[#1D7DD7]/30">
                Confidence Accuracy: {Math.round(confidence * 100)}%
              </span>
            </div>

            {/* Editable Schedule Table */}
            <div className="overflow-x-auto max-h-[320px] rounded-xl border border-border">
              <table className="w-full text-left text-xs">
                <thead className="bg-muted text-muted-foreground font-extrabold uppercase border-b border-border text-[10px]">
                  <tr>
                    <th className="p-3">Course Code</th>
                    <th className="p-3">Course Title</th>
                    <th className="p-3">Day</th>
                    <th className="p-3">Start Time</th>
                    <th className="p-3">End Time</th>
                    <th className="p-3">Room</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {parsedItems.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                      <td className="p-2.5">
                        <input
                          type="text"
                          value={item.courseCode}
                          onChange={(e) => handleCellChange(idx, "courseCode", e.target.value)}
                          className="w-28 rounded-lg border border-input bg-background px-2 py-1 font-bold text-foreground"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="text"
                          value={item.courseTitle}
                          onChange={(e) => handleCellChange(idx, "courseTitle", e.target.value)}
                          className="w-48 rounded-lg border border-input bg-background px-2 py-1 text-foreground"
                        />
                      </td>
                      <td className="p-2.5">
                        <select
                          value={item.dayOfWeek}
                          onChange={(e) => handleCellChange(idx, "dayOfWeek", e.target.value as any)}
                          className="w-20 rounded-lg border border-input bg-background px-2 py-1 font-bold text-foreground"
                        >
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2.5">
                        <input
                          type="text"
                          value={item.startTime}
                          onChange={(e) => handleCellChange(idx, "startTime", e.target.value)}
                          className="w-24 rounded-lg border border-input bg-background px-2 py-1 text-foreground"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="text"
                          value={item.endTime}
                          onChange={(e) => handleCellChange(idx, "endTime", e.target.value)}
                          className="w-24 rounded-lg border border-input bg-background px-2 py-1 text-foreground"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="text"
                          value={item.room}
                          onChange={(e) => handleCellChange(idx, "room", e.target.value)}
                          className="w-24 rounded-lg border border-input bg-background px-2 py-1 font-extrabold text-[#1D7DD7]"
                        />
                      </td>
                      <td className="p-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(idx)}
                          className="p-1 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleAddRow}
                className="flex items-center gap-1.5 text-xs font-bold text-[#1D7DD7] hover:underline"
              >
                <Plus className="size-4" />
                <span>Add Class Row</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={resetModal}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:bg-accent"
                >
                  Re-upload
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#1D7DD7] text-white text-xs font-extrabold hover:bg-[#1D7DD7]/90 shadow-md shadow-[#1D7DD7]/30"
                >
                  <CheckCircle2 className="size-4" />
                  <span>Confirm & Save Schedule</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
