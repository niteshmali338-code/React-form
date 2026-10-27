-- =======================================================
-- Supabase Database Setup Script for Application Form
-- Target Table: public.employee_applications
-- =======================================================

-- 1. Create employee_applications table if it does not exist
CREATE TABLE IF NOT EXISTS public.employee_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application JSONB NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Add comments for clarity
COMMENT ON TABLE public.employee_applications IS 'Stores submitted candidate application forms.';
COMMENT ON COLUMN public.employee_applications.id IS 'Unique application record UUID.';
COMMENT ON COLUMN public.employee_applications.application IS 'Complete application form data in JSONB format.';
COMMENT ON COLUMN public.employee_applications.submitted_at IS 'Timestamp when the application was submitted.';

-- 3. Enable Row Level Security (RLS) for privacy & security
ALTER TABLE public.employee_applications ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policy if present to avoid conflicts
DROP POLICY IF EXISTS "Allow public anonymous application submissions" ON public.employee_applications;

-- 5. Create narrow INSERT policy allowing anonymous submissions
CREATE POLICY "Allow public anonymous application submissions"
    ON public.employee_applications
    FOR INSERT
    WITH CHECK (true);

-- 6. Grant INSERT privileges to anon and authenticated roles
GRANT INSERT ON public.employee_applications TO anon, authenticated;
