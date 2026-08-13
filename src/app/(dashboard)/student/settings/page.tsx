"use client";

import React, { useState } from "react";
import { Settings, Volume2, Bell, Shield, Save, CheckCircle2 } from "lucide-react";

export default function StudentSettingsPage() {
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [classReminders, setClassReminders] = useState(true);
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
            <span>Student Settings</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Customize navigation preferences, voice guidance, and schedule notifications.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1D7DD7] text-white text-xs font-bold hover:bg-[#1D7DD7]/90 shadow-md shadow-[#1D7DD7]/30"
        >
          <Save className="size-4" />
          <span>Save Preferences</span>
        </button>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs font-bold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="size-4" />
          <span>Preferences saved successfully!</span>
        </div>
      )}

      <div className="space-y-4">
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
          <h3 className="text-sm font-black uppercase text-foreground flex items-center gap-2">
            <Volume2 className="size-4 text-[#1D7DD7]" />
            <span>Map Voice Guidance</span>
          </h3>

          <div className="flex items-center justify-between text-xs font-bold">
            <div>
              <p className="text-foreground">Enable Voice Turn-by-Turn Audio Guidance</p>
              <p className="text-[11px] text-muted-foreground font-normal">Speaks navigation instructions as you walk between floors.</p>
            </div>
            <input
              type="checkbox"
              checked={voiceEnabled}
              onChange={(e) => setVoiceEnabled(e.target.checked)}
              className="size-4 rounded accent-[#1D7DD7]"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
          <h3 className="text-sm font-black uppercase text-foreground flex items-center gap-2">
            <Bell className="size-4 text-[#1D7DD7]" />
            <span>Schedule Reminders</span>
          </h3>

          <div className="flex items-center justify-between text-xs font-bold">
            <div>
              <p className="text-foreground">Send 15-Minute Class Reminders</p>
              <p className="text-[11px] text-muted-foreground font-normal">Receive push alerts before your next scheduled class starts.</p>
            </div>
            <input
              type="checkbox"
              checked={classReminders}
              onChange={(e) => setClassReminders(e.target.checked)}
              className="size-4 rounded accent-[#1D7DD7]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
