# ChronoNav Workspace Rules & Architecture Baseline

## 1. System Identity
- **Name**: ChronoNav
- **Domain**: University of Cebu Main Campus Indoor Navigation & Schedule Management Web System
- **Target Audience**: Students, Faculty, and Administrators at UC Main Campus

## 2. Tech Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS & shadcn/ui
- **Icons**: Lucide React
- **Database & Auth**: Supabase (PostgreSQL) with Row-Level Security (RLS)
- **Pathfinding Engine**: Client-Side Graph Algorithms (A* / Dijkstra) over Interactive SVG Floorplans

## 3. Design Tokens & Palette
- **Primary Color**: `#1D7DD7` (UC Chrono Blue)
- **Secondary Color**: `#507495` (Slate Navy)
- **Dark Neutral**: `#0E151B` (Deep Obsidian)
- **Muted Neutral**: `#74777E` (Muted Steel)
- **Background Light**: `#F8FAFB`
- **Card / Surface**: `#FFFFFF`
- **Border / Divider**: `#E8EDF3`

## 4. User Roles & Access Matrix
- **Student**: View imported schedules, access indoor turn-by-turn navigation, view interactive maps, receive class reminders.
- **Faculty**: View teaching schedules, search room availability, locate office/classrooms.
- **Admin**: Manage campus floorplans, SVG nodes/edges, room metadata, user roles, system announcements.

## 5. Core Architectural Modules
1. `(auth)`: Login, registration, role selection, and session management.
2. `(dashboard)`: Student & Faculty timetable view, OCR schedule importer, upcoming event feeds.
3. `(navigation)`: Interactive SVG map viewer, route planner with A*/Dijkstra algorithms, step-by-step turn guidance.
4. `api/`: API routes for serverless functions, schedule processing, and Supabase webhooks.

## 6. Development Rules & Code Standards
- **Feature-First Organization**: Place UI components under `src/components/{domain}` (e.g. `map/`, `schedule/`, `shared/`, `ui/`).
- **Strict Typing**: All database entities, navigation nodes, and schedule items must be explicitly typed in `src/types/`.
- **Absolute Imports**: Always use `@/*` alias for imports within `src/`.
- **Clean Code & SEO**: Semantic HTML5 elements, descriptive titles, unique accessibility IDs, and optimized performance.
