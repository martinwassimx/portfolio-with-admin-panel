-- Migration: Storage Buckets & Policies
-- Portfolio Media and Documents

-- 1. Create Storage Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  (
    'portfolio-media', 
    'portfolio-media', 
    true, 
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif']
  ),
  (
    'portfolio-documents', 
    'portfolio-documents', 
    true, 
    20971520, -- 20MB
    ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  )
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Storage Policies
-- Public Read Access for portfolio-media
CREATE POLICY "Public media access" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-media');

-- Public Read Access for portfolio-documents
CREATE POLICY "Public document access" ON storage.objects
  FOR SELECT USING (bucket_id = 'portfolio-documents');

-- Admin Upload/Update/Delete Access for all buckets
CREATE POLICY "Admin upload media" ON storage.objects
  FOR INSERT WITH CHECK (
    (bucket_id IN ('portfolio-media', 'portfolio-documents'))
    AND (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  );

CREATE POLICY "Admin update media" ON storage.objects
  FOR UPDATE USING (
    (bucket_id IN ('portfolio-media', 'portfolio-documents'))
    AND (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  );

CREATE POLICY "Admin delete media" ON storage.objects
  FOR DELETE USING (
    (bucket_id IN ('portfolio-media', 'portfolio-documents'))
    AND (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
  );
