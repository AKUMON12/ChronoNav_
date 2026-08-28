# 🚀 ChronoNav Enterprise — 100% Free Fullstack Deployment Guide

This guide provides a comprehensive, step-by-step walkthrough to deploy the entire **ChronoNav** system (**Frontend, Backend, Database, Authentication, and File Storage**) completely **FREE** forever with zero credit card required.

---

## 🏗️ System Architecture Overview

| Component | Platform | Free Tier Inclusions | Cost |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | **Vercel** | Global Edge CDN, Unlimited Bandwidth (100 GB/mo), Automatic SSL | **$0 / month** |
| **Backend API & OCR** | **Vercel (Serverless)** | Serverless Functions for all `/api/*` endpoints (Admin APIs, OCR Parser, Session Engine) | **$0 / month** |
| **Database (PostgreSQL)** | **Supabase** | 500 MB Postgres DB, Realtime subscriptions, automated backups | **$0 / month** |
| **Authentication** | **Supabase Auth** | 50,000 Monthly Active Users, JWT verification, RBAC | **$0 / month** |
| **Storage (PDFs/Images)** | **Supabase Storage** | 1 GB Free File Storage for OCR study loads and campus assets | **$0 / month** |

> [!NOTE]
> **Why Vercel is Fullstack:**
> Many people assume Vercel only hosts frontends. Because ChronoNav is built with **Next.js App Router**, Vercel automatically deploys your frontend pages as static/SSR edge components **AND** compiles all your backend endpoints (`src/app/api/...`) into **Vercel Serverless Functions**. You do **NOT** need to pay for or maintain a separate Node.js / Express server!

---

## 📋 Table of Contents
1. [Phase 1: Setup Free Database & Auth on Supabase](#phase-1-setup-free-database--auth-on-supabase)
2. [Phase 2: Deploy Frontend & Backend on Vercel](#phase-2-deploy-frontend--backend-on-vercel)
3. [Phase 3: Connect Environment Variables](#phase-3-connect-environment-variables)
4. [Phase 4: Verify Live Production & Accounts](#phase-4-verify-live-production--accounts)
5. [Phase 5: Continuous Deployment Workflow](#phase-5-continuous-deployment-workflow)

---

## Phase 1: Setup Free Database & Auth on Supabase

### 1. Create a Supabase Project
1. Navigate to **[https://supabase.com](https://supabase.com)** and click **"Start your project"** (Sign in with your GitHub account).
2. Click **"New Project"**.
3. Fill in the project details:
   - **Name:** `ChronoNav-Production`
   - **Database Password:** Choose a strong password and save it in a safe place.
   - **Region:** Select `Southeast Asia (Singapore)` for the fastest response times from the Philippines / Cebu.
   - **Pricing Plan:** Select **Free ($0/month)**.
4. Click **"Create new project"** (Provisioning takes ~1-2 minutes).

---

### 2. Execute SQL Database Migrations
1. In your Supabase dashboard sidebar, click the **SQL Editor** icon (the `>_` terminal icon).
2. Click **"New query"**.
3. Open the file [`supabase/migrations/20260101000000_init_schema.sql`](file:///c:/Users/Admin/Documents/Tristan_Programming/Chrononav/ChronoNav_/supabase/migrations/20260101000000_init_schema.sql) from your local repository, copy the entire SQL script, and paste it into the Supabase SQL Editor.
4. Click **"Run"** (or `Ctrl + Enter`). You will see `Success. No rows returned`.
5. Next, open [`supabase/seed.sql`](file:///c:/Users/Admin/Documents/Tristan_Programming/Chrononav/ChronoNav_/supabase/seed.sql), paste it into a new SQL query, and click **"Run"** to populate initial campus rooms and sample data.

---

### 3. Create Storage Bucket (For Study Load OCR Uploads)
1. In the Supabase sidebar, click **Storage** (bucket icon).
2. Click **"New bucket"**.
3. Name it: `study-loads`.
4. Toggle **"Public bucket"** to **ON** (so students/instructors can preview their uploaded documents).
5. Click **"Save"**.

---

### 4. Obtain Your Supabase API Credentials
1. In the Supabase sidebar, click the **Settings** gear icon at the bottom.
2. Click on **API** in the settings sub-menu.
3. Keep this page open or copy the following two values:
   - **Project URL:** `https://xxxxxxxxxxxxxxxxxxxx.supabase.co`
   - **Project API Keys (`anon` / `public`):** `eyJhbGciOiJIUzI1NiIsInR5cCI6...`

---

## Phase 2: Deploy Frontend & Backend on Vercel

### 1. Sign in to Vercel
1. Navigate to **[https://vercel.com](https://vercel.com)**.
2. Click **"Sign Up"** or **"Log In"** using your **GitHub account** (`AKUMON12`).

### 2. Import the ChronoNav Repository
1. On your Vercel Dashboard, click **"Add New..."** -> **"Project"**.
2. Under "Import Git Repository", find `AKUMON12/ChronoNav_` and click **"Import"**.
3. Configure Project Settings:
   - **Project Name:** `chrononav` (or any name you prefer)
   - **Framework Preset:** `Next.js` (automatically detected)
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)

---

## Phase 3: Connect Environment Variables

Before clicking Deploy, expand the **"Environment Variables"** accordion section on Vercel:

| Key | Value (Your Provisioned Supabase Instance) |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://pivpvhyphmxwbiibsjcg.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_6WKoEJSk-tbEo445kEqikA_KivXq9wu` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_6WKoEJSk-tbEo445kEqikA_KivXq9wu` |

*(Optional)*: If you want to enable Google Cloud Vision OCR for live OCR image text extraction:
| Key | Value |
| :--- | :--- |
| `GOOGLE_VISION_API_KEY` | `your-optional-google-vision-key` |

*(Note: ChronoNav has a built-in intelligent fallback parser, so the OCR pipeline works even without external API keys).*

---

### Click Deploy
Click **"Deploy"**. Vercel will now:
- Install dependencies (`npm install`)
- Build all 33 production pages (`npm run build`)
- Compile API routes into serverless backend functions
- Provision a free SSL HTTPS domain (`https://chrononav.vercel.app` or similar)

Deployment completes in approximately **60 to 90 seconds**! 🎉

---

## Phase 4: Verify Live Production & Accounts

Once deployment completes, open your live Vercel URL and verify the pre-configured accounts:

### 🛡️ 1. Administrator Account
- **Email / Identifier:** `admin@uc.edu.ph` (or `admin` / `20194821`)
- **Password:** `Admin@ChronoNav2026!`
- **Access:** Full System Control, User Provisioning, Room Master Catalog, System Logs at `/admin/dashboard` & `/admin/users`.

### 👨‍🏫 2. Faculty Account
- **Email / Identifier:** `maria.santos@uc.edu.ph` (or `21589412`)
- **Password:** `Faculty@ChronoNav2026!`
- **Access:** Instructor Portal, Teaching Schedules, CCS Lab Access.

### 🎓 3. Official Student Account (Vince Andrew Santoya)
- **Email / Identifier:** `22682702@uc.edu.ph` (or `22682702`)
- **Password:** `Student@ChronoNav2026!`
- **Access:** Official 7 Enrolled Classes (15 Units), Study Load Attachment, Wayfinding Navigation.

### 🎓 4. Official Student Account (Tristan Developer)
- **Email / Identifier:** `22684955@uc.edu.ph` (or `22684955`)
- **Password:** `Student@ChronoNav2026!`
- **Access:** 18 Units, BSCS Wayfinding & Navigation.

---

## Phase 5: Continuous Deployment Workflow

Your project is now linked with your GitHub repository:
- Any time you make changes locally and run:
  ```bash
  git add .
  git commit -m "Your update message"
  git push origin main
  ```
- **Vercel automatically triggers a zero-downtime deployment** within seconds.
- You can monitor real-time build logs directly from your Vercel Dashboard.

---

## 🔒 Free Tier Longevity & Maintenance Tips

1. **Supabase Inactivity Pausing:**
   Free Supabase projects will pause after 7 days of complete inactivity. Visiting the application or logging in periodically resets this timer.
2. **Bandwidth & Limits:**
   Vercel's Hobby tier provides 100 GB of free monthly bandwidth and 100,000 monthly serverless function invocations, which is more than enough for capstone defenses, enterprise demos, and university trials.
3. **Custom Domain (Optional):**
   If you have a custom university domain (e.g. `chrononav.uc.edu.ph`), you can link it for free under Vercel **Project Settings -> Domains**.

---
*Generated for ChronoNav University Indoor Navigation & Academic Management Suite*
