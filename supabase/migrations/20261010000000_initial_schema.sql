-- Migration: Initial Schema & Row Level Security (RLS)
-- Portfolio with Admin Panel
-- Compatibility: Supabase / PostgreSQL 15+

-- 1. Helper function: Check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  email TEXT NOT NULL,
  display_name TEXT NOT NULL DEFAULT 'Administrator',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Site Settings (Key-Value)
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Theme Settings
CREATE TABLE IF NOT EXISTS public.theme_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Default Theme',
  is_active BOOLEAN NOT NULL DEFAULT true,
  config JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Page Sections
CREATE TABLE IF NOT EXISTS public.page_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  title TEXT NOT NULL DEFAULT '',
  subtitle TEXT NOT NULL DEFAULT '',
  badge_text TEXT NOT NULL DEFAULT '',
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Navigation Items
CREATE TABLE IF NOT EXISTS public.navigation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL DEFAULT 'Link',
  href TEXT NOT NULL DEFAULT '#',
  sort_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  is_external BOOLEAN NOT NULL DEFAULT false
);

-- 7. Skill Categories & Skills
CREATE TABLE IF NOT EXISTS public.skill_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Category',
  icon TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.skill_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Skill',
  icon TEXT,
  proficiency INT CHECK (proficiency >= 0 AND proficiency <= 100),
  years_of_experience TEXT,
  badge_color TEXT DEFAULT 'cyan',
  sort_order INT NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_visible BOOLEAN NOT NULL DEFAULT true
);

-- 8. Projects & Content Blocks
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL DEFAULT 'Project Title',
  summary TEXT DEFAULT '',
  full_description TEXT DEFAULT '',
  project_type TEXT DEFAULT 'Full-Stack',
  status TEXT DEFAULT 'Completed',
  start_date TEXT DEFAULT '',
  completion_date TEXT DEFAULT '',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  thumbnail_url TEXT DEFAULT '',
  cover_image_url TEXT DEFAULT '',
  gallery_urls JSONB DEFAULT '[]'::jsonb,
  video_url TEXT,
  logo_url TEXT,
  technologies JSONB DEFAULT '[]'::jsonb,
  problem_statement TEXT,
  goals TEXT,
  challenges TEXT,
  solution TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  architecture TEXT,
  outcomes TEXT,
  lessons_learned TEXT,
  role_description TEXT,
  live_demo_url TEXT,
  repo_url TEXT,
  docs_url TEXT,
  download_url TEXT,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.project_content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL,
  title TEXT,
  content JSONB NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

-- 9. Education
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL DEFAULT '',
  degree TEXT NOT NULL DEFAULT '',
  field_of_study TEXT NOT NULL DEFAULT '',
  start_date TEXT DEFAULT '',
  end_date TEXT DEFAULT '',
  is_current BOOLEAN NOT NULL DEFAULT false,
  description TEXT DEFAULT '',
  achievements JSONB DEFAULT '[]'::jsonb,
  coursework JSONB DEFAULT '[]'::jsonb,
  grade_gpa TEXT,
  logo_url TEXT,
  credential_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true
);

-- 10. Experience
CREATE TABLE IF NOT EXISTS public.experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL DEFAULT '',
  job_title TEXT NOT NULL DEFAULT '',
  employment_type TEXT DEFAULT 'Full-time',
  location TEXT DEFAULT '',
  start_date TEXT DEFAULT '',
  end_date TEXT DEFAULT '',
  is_current BOOLEAN NOT NULL DEFAULT false,
  description TEXT DEFAULT '',
  responsibilities JSONB DEFAULT '[]'::jsonb,
  achievements JSONB DEFAULT '[]'::jsonb,
  technologies JSONB DEFAULT '[]'::jsonb,
  logo_url TEXT,
  external_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true
);

-- 11. Social Links
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true
);

-- 12. Contact Messages
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
  is_archived BOOLEAN NOT NULL DEFAULT false,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Media Assets
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT,
  alt_text TEXT DEFAULT '',
  bucket TEXT DEFAULT 'portfolio-media',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Activity Logs
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theme_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Admins can view profiles" ON public.profiles
  FOR SELECT USING (public.is_admin() OR auth.uid() = id);

CREATE POLICY "Admins can update profiles" ON public.profiles
  FOR UPDATE USING (public.is_admin() OR auth.uid() = id);

-- 2. Public Read Policies for Portfolio Content
CREATE POLICY "Public read site_settings" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Public read active theme" ON public.theme_settings
  FOR SELECT USING (is_active = true OR public.is_admin());

CREATE POLICY "Public read visible page sections" ON public.page_sections
  FOR SELECT USING (is_visible = true OR public.is_admin());

CREATE POLICY "Public read visible nav items" ON public.navigation_items
  FOR SELECT USING (is_visible = true OR public.is_admin());

CREATE POLICY "Public read visible skill categories" ON public.skill_categories
  FOR SELECT USING (is_visible = true OR public.is_admin());

CREATE POLICY "Public read visible skills" ON public.skills
  FOR SELECT USING (is_visible = true OR public.is_admin());

CREATE POLICY "Public read published projects" ON public.projects
  FOR SELECT USING (is_published = true OR public.is_admin());

CREATE POLICY "Public read project content blocks" ON public.project_content_blocks
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND (p.is_published = true OR public.is_admin()))
  );

CREATE POLICY "Public read visible education" ON public.education
  FOR SELECT USING (is_visible = true OR public.is_admin());

CREATE POLICY "Public read visible experience" ON public.experience
  FOR SELECT USING (is_visible = true OR public.is_admin());

CREATE POLICY "Public read visible social links" ON public.social_links
  FOR SELECT USING (is_visible = true OR public.is_admin());

CREATE POLICY "Public read media assets" ON public.media_assets
  FOR SELECT USING (true);

-- 3. Contact Messages: Public INSERT only; Admin Full Access
CREATE POLICY "Public can submit contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (
    length(name) > 0 AND length(email) > 3 AND length(message) > 0
  );

CREATE POLICY "Admins full access to contact messages" ON public.contact_messages
  FOR ALL USING (public.is_admin());

-- 4. Activity Logs: Admin Read/Insert only
CREATE POLICY "Admins read activity logs" ON public.activity_logs
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins insert activity logs" ON public.activity_logs
  FOR INSERT WITH CHECK (public.is_admin());

-- 5. Admin Full Write/Manage Access on All Content Tables
CREATE POLICY "Admins manage site_settings" ON public.site_settings
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins manage theme_settings" ON public.theme_settings
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins manage page_sections" ON public.page_sections
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins manage navigation_items" ON public.navigation_items
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins manage skill_categories" ON public.skill_categories
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins manage skills" ON public.skills
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins manage projects" ON public.projects
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins manage project_content_blocks" ON public.project_content_blocks
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins manage education" ON public.education
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins manage experience" ON public.experience
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins manage social_links" ON public.social_links
  FOR ALL USING (public.is_admin());

CREATE POLICY "Admins manage media_assets" ON public.media_assets
  FOR ALL USING (public.is_admin());

-- Create Trigger to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    -- First registered user becomes admin, subsequent are standard users
    CASE WHEN (SELECT count(*) FROM public.profiles) = 0 THEN 'admin' ELSE 'user' END,
    coalesce(NEW.raw_user_meta_data->>'display_name', 'Administrator')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
