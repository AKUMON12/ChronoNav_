-- ChronoNav Supabase Seed Data SQL
-- Sample credentials and default users for Student, Faculty, and Admin roles

-- Note: In Supabase, auth.users records are typically created via Supabase Auth API or console.
-- Below are standard public.users profiles corresponding to test accounts:

INSERT INTO public.users (id, first_name, last_name, email, role)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Juan', 'Dela Cruz', 'student@uc.edu.ph', 'student'),
  ('00000000-0000-0000-0000-000000000002', 'Maria', 'Santos', 'faculty@uc.edu.ph', 'faculty'),
  ('00000000-0000-0000-0000-000000000003', 'System', 'Administrator', 'admin@uc.edu.ph', 'admin')
ON CONFLICT (email) DO UPDATE
  SET first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      role = EXCLUDED.role;
