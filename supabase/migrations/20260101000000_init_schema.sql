-- ChronoNav PostgreSQL Initial Migration Schema
-- Capstone ERD implementation with RLS and Indexes

-- 1. Create Enums
CREATE TYPE user_role AS ENUM ('student', 'faculty', 'admin');

-- 2. Create Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create Rooms Table
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_name VARCHAR(150) NOT NULL,
  room_number VARCHAR(50) NOT NULL,
  floor INT NOT NULL DEFAULT 1,
  coordinates JSONB DEFAULT '{}'::jsonb,
  CONSTRAINT unique_building_room UNIQUE(building_name, room_number, floor)
);

-- 4. Create Schedules Table
CREATE TABLE IF NOT EXISTS public.schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  course_name VARCHAR(200) NOT NULL,
  day VARCHAR(20) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Create OCR Logs Table
CREATE TABLE IF NOT EXISTS public.ocr_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  image_path TEXT NOT NULL,
  extracted_text TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  upload_time TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Create Reminders Table
CREATE TABLE IF NOT EXISTS public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES public.schedules(id) ON DELETE CASCADE,
  reminder_time TIMESTAMPTZ NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Create Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Create Saved Paths Table
CREATE TABLE IF NOT EXISTS public.saved_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  origin_room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
  destination_room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
  path_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ----------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_schedules_user ON public.schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_schedules_room ON public.schedules(room_id);
CREATE INDEX IF NOT EXISTS idx_ocr_logs_user ON public.ocr_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_reminders_schedule ON public.reminders(schedule_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_saved_paths_user ON public.saved_paths(user_id);

-- ----------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ocr_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_paths ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users RLS
CREATE POLICY "Users can view self or admins view all" ON public.users
  FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Users can update self" ON public.users
  FOR UPDATE USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Admins full management on users" ON public.users
  FOR ALL USING (public.is_admin());

-- Rooms RLS (Public view, Admin write)
CREATE POLICY "Anyone can view rooms" ON public.rooms
  FOR SELECT USING (true);
CREATE POLICY "Admins can manage rooms" ON public.rooms
  FOR ALL USING (public.is_admin());

-- Schedules RLS
CREATE POLICY "Users view own schedules" ON public.schedules
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users manage own schedules" ON public.schedules
  FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- OCR Logs RLS
CREATE POLICY "Users view own ocr logs" ON public.ocr_logs
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users manage own ocr logs" ON public.ocr_logs
  FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- Reminders RLS
CREATE POLICY "Users view own reminders" ON public.reminders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.schedules s WHERE s.id = schedule_id AND s.user_id = auth.uid())
    OR public.is_admin()
  );
CREATE POLICY "Users manage own reminders" ON public.reminders
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.schedules s WHERE s.id = schedule_id AND s.user_id = auth.uid())
    OR public.is_admin()
  );

-- Notifications RLS
CREATE POLICY "Users view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users update own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Admins can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (public.is_admin() OR auth.uid() = user_id);

-- Saved Paths RLS
CREATE POLICY "Users view own saved paths" ON public.saved_paths
  FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users manage own saved paths" ON public.saved_paths
  FOR ALL USING (auth.uid() = user_id OR public.is_admin());
