# 🧭 ChronoNav — Indoor Navigation & Schedule System

**ChronoNav** is an interactive indoor navigation, OCR schedule extraction, and campus management platform built for the **University of Cebu Main Campus — College of Computer Studies (CCS) Building**.

Powered by a client-side pathfinding engine based on **Dijkstra's Algorithm**, ChronoNav allows students, faculty, and visitors to visualize campus floorplans, calculate optimal routes across multi-floor building layouts, and access turn-by-turn directions with voice guidance.

---

## 🔑 Demo Sample Credentials

Use these sample credentials to sign in and test features across different user roles:

| Role | Name | Email | Default Password | Access Level |
| :--- | :--- | :--- | :--- | :--- |
| 🎓 **Student** | Juan Dela Cruz | `student@uc.edu.ph` | `Password123!` | View schedules, indoor navigation, saved paths |
| 👨‍🏫 **Faculty** | Maria Santos | `faculty@uc.edu.ph` | `Password123!` | View room schedules, faculty navigation, OCR |
| 🛡️ **Admin** | System Administrator | `admin@uc.edu.ph` | `Admin@ChronoNav2026!` | Full admin dashboard, analytics, room & user management |

> **Tip**: The [Login Page](file:///c:/Users/Admin/Documents/Tristan_Programming/Chrononav/ChronoNav_/src/app/%28auth%29/login/page.tsx) includes **1-Click Demo Buttons** for auto-filling these test credentials.

---

## 🚀 Key Features

### 📍 Client-Side Indoor Pathfinding Engine (Phase 5)
- **Dijkstra's Shortest Path Algorithm** ([pathfinding.ts](file:///c:/Users/Admin/Documents/Tristan_Programming/Chrononav/ChronoNav_/src/lib/navigation/pathfinding.ts)): Computes shortest path routes between any origin room and target destination.
- **Multi-Floor Support**: Seamlessly routes through stairwells and elevators when start and target locations reside on different floors (Floors 1–4).
- **Turn-by-Turn Guidance**: Formats ordered step-by-step navigation instructions with total distance calculations in meters and speech synthesis voice alerts.

### 📄 OCR Schedule Extraction Pipeline (Phase 6)
- **Pattern-Matching Study Load Parser** ([parser.ts](file:///c:/Users/Admin/Documents/Tristan_Programming/Chrononav/ChronoNav_/src/lib/ocr/parser.ts)): Extracts Course Codes, Titles, Day schedules (`MWF`, `TTH`, `SAT`), Time ranges, and Room codes (`CCS 401`, `Mac Lab 101`).
- **Drag & Drop / Camera Uploader** ([ocr-upload-modal.tsx](file:///c:/Users/Admin/Documents/Tristan_Programming/Chrononav/ChronoNav_/src/components/schedule/ocr-upload-modal.tsx)): Supports PDF/Image uploads and mobile camera capture.
- **Verification Table**: Allows students to edit misread fields or add rows before saving.
- **Direct Navigation Links**: Parsed schedule cards automatically feature "Get Directions" buttons linking straight to the indoor SVG map.

### 📊 Admin Portal & Analytics Dashboard (Phase 7)
- **Analytics Dashboard** ([dashboard/page.tsx](file:///c:/Users/Admin/Documents/Tristan_Programming/Chrononav/ChronoNav_/src/app/%28admin%29/admin/dashboard/page.tsx)): Displays user counts, peak navigation traffic charts, most visited room leaderboards, and database health metrics.
- **User Management** ([users/page.tsx](file:///c:/Users/Admin/Documents/Tristan_Programming/Chrononav/ChronoNav_/src/app/%28admin%29/admin/users/page.tsx)): Role editor (Student/Faculty/Admin) and account suspension controls.
- **Building & Room Manager** ([rooms/page.tsx](file:///c:/Users/Admin/Documents/Tristan_Programming/Chrononav/ChronoNav_/src/app/%28admin%29/admin/rooms/page.tsx)): Edit room codes, floor assignments, and SVG node coordinates.
- **System Activity Logs & Reports** ([logs/page.tsx](file:///c:/Users/Admin/Documents/Tristan_Programming/Chrononav/ChronoNav_/src/app/%28admin%29/admin/logs/page.tsx)): CSV export and system report generator.
- **Campus Bulletin** ([bulletin/page.tsx](file:///c:/Users/Admin/Documents/Tristan_Programming/Chrononav/ChronoNav_/src/app/%28admin%29/admin/bulletin/page.tsx)): Broadcast campus announcements with emergency priority toggles.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Language**: TypeScript (Strict Mode)
- **Styling**: TailwindCSS (Palette: `#1D7DD7` Primary Blue, `#507495` Secondary Slate)
- **Database & Auth**: [Supabase PostgreSQL](https://supabase.com/) with Row Level Security (RLS)
- **Testing**: Vitest, React Testing Library, Playwright E2E
- **Deployment**: Vercel Free Tier Zero-Cost Hosting

---

## ⚡ Local Setup, Database & Testing Instructions

### 1. Local Development
```bash
# Install dependencies
npm install

# Start Next.js development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Database Migrations (Supabase)
```bash
# Push database schema & RLS policies using Supabase CLI
npx supabase db push

# Or apply manually via Supabase SQL Editor:
# 1. Run supabase/migrations/20260101000000_init_schema.sql
# 2. Run supabase/seed.sql
```

### 3. Automated Testing Suite
```bash
# Run Vitest Unit Tests for Pathfinding & OCR Parser
npm run test

# Run Playwright E2E User Journey Tests
npx playwright test
```

---

## 🌐 Vercel Free-Tier Deployment Guide

1. **Push Code to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy ChronoNav to Vercel"
   git push origin main
   ```

2. **Import Project to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new) and select your GitHub repository `ChronoNav_`.
   - Vercel automatically detects Next.js framework settings from [vercel.json](file:///c:/Users/Admin/Documents/Tristan_Programming/Chrononav/ChronoNav_/vercel.json).

3. **Configure Environment Variables in Vercel**:
   Add the following in **Vercel Project Settings > Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Public Key

4. **Deploy**:
   Click **Deploy**. Your app will build and go live on a zero-cost `.vercel.app` domain!
