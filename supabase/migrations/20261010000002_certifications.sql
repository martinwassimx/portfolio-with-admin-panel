-- Migration: Certifications Table
-- Stores professional accreditations, certifications, and badges

CREATE TABLE IF NOT EXISTS public.certifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issue_date TEXT NOT NULL,
  expiry_date TEXT,
  credential_id TEXT,
  credential_url TEXT,
  image_url TEXT,
  skills TEXT[] DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

-- Public can view visible certifications
CREATE POLICY "Public read certifications" ON public.certifications
  FOR SELECT USING (is_visible = true);

-- Admins have full access
CREATE POLICY "Admins manage certifications" ON public.certifications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
