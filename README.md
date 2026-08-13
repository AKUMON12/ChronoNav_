# 🧭 ChronoNav — Indoor Navigation & Schedule System

**ChronoNav** is an interactive indoor navigation and schedule management platform built for the **University of Cebu Main Campus — College of Computer Studies (CCS) Building**.

Powered by a client-side pathfinding engine based on **Dijkstra's Algorithm**, ChronoNav allows students, faculty, and visitors to visualize campus floorplans, calculate optimal routes across multi-floor building layouts, and access turn-by-turn directions with voice guidance.

---

## 🔑 Demo Sample Credentials

Use these sample credentials to sign in and test features across different user roles:

| Role | Name | Email | Default Password | Access Level |
| :--- | :--- | :--- | :--- | :--- |
| 🎓 **Student** | Juan Dela Cruz | `student@uc.edu.ph` | `Password123!` | View schedules, indoor navigation, saved paths |
| 👨‍🏫 **Faculty** | Maria Santos | `faculty@uc.edu.ph` | `Password123!` | View room schedules, faculty navigation, OCR |
| 🛡️ **Admin** | System Administrator | `admin@uc.edu.ph` | `Password123!` | Full admin dashboard, user & room management |

> **Tip**: The [Login Page](file:///c:/Users/Admin/Documents/Tristan_Programming/Chrononav/ChronoNav_/src/app/%28auth%29/login/page.tsx) includes **1-Click Demo Buttons** for auto-filling these test credentials.

---

## 🚀 Key Features

### 📍 Client-Side Indoor Pathfinding Engine
- **Dijkstra's Shortest Path Algorithm** ([pathfinding.ts](file:///c:/Users/Admin/Documents/Tristan_Programming/Chrononav/ChronoNav_/src/lib/navigation/pathfinding.ts)): Computes shortest path routes between any origin room and target destination.
- **Multi-Floor Support**: Seamlessly routes through stairwells and elevators when start and target locations reside on different floors (Floors 1–4).
- **Turn-by-Turn Guidance**: Formats ordered step-by-step navigation instructions with total distance calculations in meters.

### 🗺️ Interactive SVG Floorplan & Route Renderer
- **Responsive Blueprint Map** ([interactive-svg-map.tsx](file:///c:/Users/Admin/Documents/Tristan_Programming/Chrononav/ChronoNav_/src/components/map/interactive-svg-map.tsx)): Renders room boundaries, hallways, stairwells, and facilities for the CCS building.
- **Animated Path Overlay**: Draws dynamic glowing route polylines (`stroke="#1D7DD7" strokeWidth="4"`) with animated directional dashes.
- **Interactive Map Selection**: Click directly on room nodes or blueprint rooms to pick starting points and destinations.
- **Pan & Zoom Controls**: Mouse drag panning and zoom scaling controls.

### 🏢 Multi-Floor Selector
- **Floor Switcher** ([floor-selector.tsx](file:///c:/Users/Admin/Documents/Tristan_Programming/Chrononav/ChronoNav_/src/components/map/floor-selector.tsx)): Switch between active floor views matching the `#1D7DD7` primary and `#507495` secondary color palette.
- **Route Badges**: Highlights floors involved in the active multi-floor route with footprint indicators.

### 🔊 Voice Guidance & Map View Assembly
- **Voice Guidance** ([page.tsx](file:///c:/Users/Admin/Documents/Tristan_Programming/Chrononav/ChronoNav_/src/app/%28navigation%29/map/page.tsx)): Uses browser Web Speech Synthesis for audio turn-by-turn navigation alerts.
- **Searchable Location Combos**: Filter rooms easily by name or floor.
- **Location Swap**: One-click swapping of Origin and Destination.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Language**: TypeScript (Strict Mode)
- **Styling**: TailwindCSS + Vanilla CSS (Palette: `#1D7DD7` Primary, `#507495` Secondary)
- **Database & Auth**: [Supabase PostgreSQL](https://supabase.com/) with Row Level Security (RLS)
- **Icons**: Lucide React
- **Algorithms**: Dijkstra's Shortest Path Algorithm

---

## 📁 Repository Structure

```
ChronoNav/
├── src/
│   ├── app/
│   │   ├── (auth)/             # Authentication pages (Login, Register)
│   │   ├── (navigation)/map/   # Interactive Map & Pathfinding Page
│   │   ├── admin/              # Admin Management Dashboard
│   │   └── page.tsx            # Main Landing Page
│   ├── components/
│   │   ├── map/                # Map components (SVG Map, Floor Selector)
│   │   ├── schedule/           # Class Schedule components
│   │   └── ui/                 # Reusable UI primitives
│   ├── lib/
│   │   ├── navigation/         # Dijkstra Pathfinding Engine
│   │   ├── supabase/           # Supabase Auth & Client setup
│   │   └── ocr/                # OCR Schedule Extractor
│   └── types/                  # Database & Graph TypeScript types
├── supabase/
│   ├── migrations/             # PostgreSQL schema & RLS policies
│   └── seed.sql                # Seed data SQL script
└── README.md
```

---

## ⚡ Local Setup & Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Copy `.env.example` to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Database Migration**:
   Apply SQL schema in Supabase Console using `supabase/migrations/20260101000000_init_schema.sql` and run `supabase/seed.sql` for sample data.
