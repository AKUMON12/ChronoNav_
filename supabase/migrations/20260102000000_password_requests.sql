-- ChronoNav Enterprise Password Management & Security Migration
-- Implements Password Change & Forgot Password Requests with Admin Approval Workflow

-- 1. Create Enums for Request Type and Status
DO $$ BEGIN
  CREATE TYPE password_request_type AS ENUM ('change_password', 'forgot_password');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE password_request_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED', 'COMPLETED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Create Password Change Requests Table
CREATE TABLE IF NOT EXISTS public.password_change_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  account_identifier VARCHAR(255) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  type password_request_type NOT NULL,
  status password_request_status NOT NULL DEFAULT 'PENDING',
  reset_token VARCHAR(255),
  token_expires_at TIMESTAMPTZ,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by VARCHAR(255),
  completed_at TIMESTAMPTZ,
  reason TEXT
);

-- 3. Create Indexes for High Performance Lookups
CREATE INDEX IF NOT EXISTS idx_pw_req_user_id ON public.password_change_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_pw_req_status ON public.password_change_requests(status);
CREATE INDEX IF NOT EXISTS idx_pw_req_token ON public.password_change_requests(reset_token);
CREATE INDEX IF NOT EXISTS idx_pw_req_created ON public.password_change_requests(requested_at DESC);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.password_change_requests ENABLE ROW LEVEL SECURITY;

-- 5. Strict RLS Policies
-- Users can view their own requests
CREATE POLICY "Users can view own password requests"
  ON public.password_change_requests
  FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all password requests
CREATE POLICY "Admins can manage all password requests"
  ON public.password_change_requests
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );
