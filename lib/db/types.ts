export interface Profile {
  id: string;
  role: 'admin' | 'user';
  email: string;
  display_name: string;
  created_at?: string;
  updated_at?: string;
}

export interface SiteSettings {
  site_title: string;
  site_tagline: string;
  site_description: string;
  site_url: string;
  logo_text: string;
  logo_url?: string;
  favicon_url?: string;
  og_image_url?: string;
  cv_file_url?: string;
  cv_download_label: string;
  maintenance_mode: boolean;
  announcement_banner_enabled: boolean;
  announcement_banner_text: string;
  contact_email: string;
  contact_phone?: string;
  contact_location: string;
  contact_form_enabled: boolean;
  custom_css?: string;
  enable_custom_cursor: boolean;
  enable_grid_background: boolean;
  enable_glow_orbs: boolean;
}

export interface ThemeSettings {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  accent_glow: string;
  gradient_start: string;
  gradient_middle: string;
  gradient_end: string;
  bg_color: string;
  bg_secondary: string;
  card_bg: string;
  card_border: string;
  text_primary: string;
  text_muted: string;
  text_dim: string;
  font_display: string;
  font_body: string;
  border_radius: string;
  glow_intensity: number; // 0 to 1
  grid_opacity: number; // 0 to 1
  animation_intensity: 'none' | 'subtle' | 'normal' | 'vibrant';
}

export interface PageSectionConfig {
  id: string;
  section_key: 'hero' | 'about' | 'skills' | 'projects' | 'education' | 'experience' | 'certifications' | 'contact';
  name: string;
  is_visible: boolean;
  sort_order: number;
  title: string;
  subtitle: string;
  badge_text: string;
  config: Record<string, any>;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  sort_order: number;
  is_visible: boolean;
  is_external: boolean;
}

export interface SkillCategory {
  id: string;
  name: string;
  icon?: string;
  sort_order: number;
  is_visible: boolean;
}

export interface Skill {
  id: string;
  category_id: string;
  name: string;
  icon?: string;
  proficiency?: number;
  years_of_experience?: string;
  badge_color?: string;
  sort_order: number;
  is_featured: boolean;
  is_visible: boolean;
}

export interface ProjectContentBlock {
  id: string;
  project_id?: string;
  block_type: 'heading' | 'paragraph' | 'bullet_list' | 'code_snippet' | 'callout' | 'metric' | 'image';
  title?: string;
  content: string | string[] | { code: string; language: string } | { metric: string; label: string };
  sort_order: number;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  full_description: string;
  project_type: string;
  status: 'Completed' | 'In Progress' | 'Concept' | 'Archived';
  start_date: string;
  completion_date: string;
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
  thumbnail_url: string;
  cover_image_url: string;
  gallery_urls: string[];
  video_url?: string;
  logo_url?: string;
  technologies: string[];
  problem_statement?: string;
  goals?: string;
  challenges?: string;
  solution?: string;
  features?: string[];
  architecture?: string;
  outcomes?: string;
  lessons_learned?: string;
  role_description?: string;
  live_demo_url?: string;
  repo_url?: string;
  docs_url?: string;
  download_url?: string;
  seo_title?: string;
  seo_description?: string;
  content_blocks?: ProjectContentBlock[];
  created_at: string;
  updated_at: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  achievements: string[];
  coursework: string[];
  grade_gpa?: string;
  logo_url?: string;
  credential_url?: string;
  sort_order: number;
  is_visible: boolean;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  job_title: string;
  employment_type: string;
  location: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
  logo_url?: string;
  external_url?: string;
  sort_order: number;
  is_visible: boolean;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
  image_url?: string;
  skills?: string[];
  is_featured?: boolean;
  is_visible: boolean;
  sort_order: number;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  sort_order: number;
  is_visible: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  ip_address?: string;
  created_at: string;
}

export interface MediaAsset {
  id: string;
  filename: string;
  file_path: string;
  public_url: string;
  mime_type: string;
  size_bytes: number;
  alt_text: string;
  bucket: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_email: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details?: Record<string, any>;
  created_at: string;
}
