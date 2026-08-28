# 🧭 ChronoNav — Indoor Navigation & Schedule System

**ChronoNav** is an interactive indoor navigation, OCR schedule extraction, and campus management platform built for the **University of Cebu Main Campus — College of Computer Studies (CCS) Building**.

Powered by a client-side pathfinding engine based on **Dijkstra's Algorithm**, ChronoNav allows students, faculty, and visitors to visualize campus floorplans, calculate optimal routes across multi-floor building layouts, and access turn-by-turn directions with voice guidance.

---

## 🔑 Demo Sample Credentials

Use these sample credentials to sign in and test features across different user roles:

| Role | Name | Email | Default Password | Access Level |
| :--- | :--- | :--- | :--- | :--- |
| 🎓 **Student** | Juan Dela Cruz | `student@uc.edu.ph` | `Password123!` | View schedules, indoor navigation, saved paths |
| 👨‍🏫 **Faculty** | Maria Santos | `faculty@uc.edu.ph` | `Faculty@ChronoNav2026!` | View room schedules, faculty navigation, OCR |
| 🛡️ **Admin** | System Administrator | `admin@uc.edu.ph` | `Admin@ChronoNav2026!` | Full admin dashboard, analytics, room & user management |

Here is the complete directory of all pre-configured accounts in the **ChronoNav** system, categorized by role:

---

### 🛡️ 1. Administrator Account (Full System Control)

| Field | Detail |
| :--- | :--- |
| **Full Name** | Admin Superuser |
| **Role** | `admin` |
| **Department** | College of Computer Studies (CCS Administration) |
| **UC ID Number** | `20194821` |
| **Email** | `admin@uc.edu.ph` |
| **Accepted Login Identifiers** | `admin@uc.edu.ph` **or** `admin` **or** `20194821` |
| **Password** | `Admin@ChronoNav2026!` |
| **Access & Privileges** | System Overview, User Directory Management, Room Catalog, Master Schedule, Campus Logs |

---

### 👨‍🏫 2. Faculty Accounts (Instructors & Professors)

#### Account A: Dr. Maria Santos
| Field | Detail |
| :--- | :--- |
| **Full Name** | Dr. Maria Santos |
| **Role** | `faculty` |
| **Department** | Computer Science Dept. (CCS) |
| **UC ID Number** | `21589412` |
| **Email** | `maria.santos@uc.edu.ph` |
| **Accepted Login Identifiers** | `maria.santos@uc.edu.ph` **or** `maria.santos` **or** `21589412` |
| **Password** | `Faculty@ChronoNav2026!` |
| **Teaching Load** | Data Structures, Algorithms, Software Engineering |

#### Account B: Prof. Ana Reyes
| Field | Detail |
| :--- | :--- |
| **Full Name** | Prof. Ana Reyes |
| **Role** | `faculty` |
| **Department** | Information Technology Dept. (CCS) |
| **UC ID Number** | `22490123` |
| **Email** | `ana.reyes@uc.edu.ph` |
| **Accepted Login Identifiers** | `ana.reyes@uc.edu.ph` **or** `ana.reyes` **or** `22490123` |
| **Password** | `Faculty@ChronoNav2026!` |
| **Teaching Load** | Enterprise Networking, Cisco & Cybersecurity |

---

### 🎓 3. Student Accounts

#### Account A: Vince Andrew D. Santoya *(Official UC Study Load Account)*
| Field | Detail |
| :--- | :--- |
| **Full Name** | Vince Andrew D. Santoya |
| **Role** | `student` |
| **Program & Year** | BSIT, 4th Year |
| **UC ID Number** | `22682702` |
| **Email** | `22682702@uc.edu.ph` |
| **Accepted Login Identifiers** | `22682702@uc.edu.ph` **or** `22682702` |
| **Password** | `Student@ChronoNav2026!` |
| **Enrolled Schedule** | **7 Classes / 15 Units** (LIT 101, IT-FRELEAN, IT-ELAI, MATH-MS102, HUM 2, SOCIO 101, IT-CPSTONE40) |

#### Account B: Tristan Developer *(BSCS Student & Developer Profile)*
| Field | Detail |
| :--- | :--- |
| **Full Name** | Tristan Developer |
| **Role** | `student` |
| **Program & Year** | BSCS, 3rd Year |
| **UC ID Number** | `22684955` |
| **Email** | `22684955@uc.edu.ph` |
| **Accepted Login Identifiers** | `22684955@uc.edu.ph` **or** `22684955` |
| **Password** | `Student@ChronoNav2026!` |
| **Enrolled Schedule** | **5 Classes / 18 Units** (CS 301, CS 302, CS 304, etc.) |

#### Account C: Pedro Cruz
| Field | Detail |
| :--- | :--- |
| **Full Name** | Pedro Cruz |
| **Role** | `student` |
| **Program & Year** | BSIT, 3rd Year |
| **UC ID Number** | `22784910` |
| **Email** | `22784910@uc.edu.ph` |
| **Accepted Login Identifiers** | `22784910@uc.edu.ph` **or** `22784910` |
| **Password** | `Student@ChronoNav2026!` |
| **Status** | Active |

#### Account D: Carlos Tan *(Suspended Account for Security Testing)*
| Field | Detail |
| :--- | :--- |
| **Full Name** | Carlos Tan |
| **Role** | `student` |
| **Program & Year** | ACT, 2nd Year |
| **UC ID Number** | `21984712` |
| **Email** | `21984712@uc.edu.ph` |
| **Accepted Login Identifiers** | `21984712@uc.edu.ph` **or** `21984712` |
| **Password** | `Student@ChronoNav2026!` |
| **Status** | `Suspended` *(Login is blocked by security policy until un-suspended by Admin)* |

---

### 💡 Quick Evaluation Notes
- **Flexible Login**: You can sign in using **either** the full institutional email (e.g. `22682702@uc.edu.ph`) or just the **Student/Employee ID number** (e.g. `22682702` or `admin`).
- **Demo Fallback Passwords**: Standard developer passwords (e.g. `password123`, `admin123`, `student123`) are also recognized for seed accounts.

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
