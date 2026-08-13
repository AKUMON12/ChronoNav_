"use client";

import React, { useState } from "react";
import { Settings, Shield, Bell, Database, Server, CheckCircle2, Save } from "lucide-react";

export default function AdminSettingsPage() {
  const [voiceGuidanceDefault, setVoiceGuidanceDefault] = useState(true);
  const [autoOcrParse, setAutoOcrParse] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <Settings className="size-7 text-[#1D7DD7]" />
            <span>Admin System Settings</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Configure global indoor navigation, OCR engine parameters, and security policies.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1D7DD7] text-white text-xs font-bold hover:bg-[#1D7DD7]/90 shadow-md shadow-[#1D7DD7]/30"
        >
          <Save className="size-4" />
          <span>Save Settings</span>
        </button>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs font-bold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-4" />
          <span>System configuration updated successfully!</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Navigation & Map Settings */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
          <h3 className="text-sm font-black uppercase text-foreground flex items-center gap-2">
            <Server className="size-4 text-[#1D7DD7]" />
            <span>Indoor Navigation Engine Settings</span>
          </h3>

          <div className="space-y-3 text-xs font-bold">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground">Enable Voice Guidance Speech Synthesis by Default</p>
                <p className="text-[11px] text-muted-foreground font-normal">Automatically trigger speech synthesis on map route generation.</p>
              </div>
              <input
                type="checkbox"
                checked={voiceGuidanceDefault}
                onChange={(e) => setVoiceGuidanceDefault(e.target.checked)}
                className="size-4 rounded accent-[#1D7DD7]"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div>
                <p className="text-foreground">Automatic OCR Study Load Auto-Parse</p>
                <p className="text-[11px] text-muted-foreground font-normal">Pre-populate parsed schedules immediately upon file selection.</p>
              </div>
              <input
                type="checkbox"
                checked={autoOcrParse}
                onChange={(e) => setAutoOcrParse(e.target.checked)}
                className="size-4 rounded accent-[#1D7DD7]"
              />
            </div>
          </div>
        </div>

        {/* Security & Maintenance */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
          <h3 className="text-sm font-black uppercase text-foreground flex items-center gap-2">
            <Shield className="size-4 text-rose-500" />
            <span>Maintenance & Access Control</span>
          </h3>

          <div className="flex items-center justify-between text-xs font-bold">
            <div>
              <p className="text-foreground">Enable Maintenance Mode</p>
              <p className="text-[11px] text-muted-foreground font-normal">Restricts student access while database migrations are in progress.</p>
            </div>
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="size-4 rounded accent-rose-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
