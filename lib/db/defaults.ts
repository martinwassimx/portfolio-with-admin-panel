import {
  SiteSettings,
  ThemeSettings,
  PageSectionConfig,
  NavigationItem,
  SkillCategory,
  Skill,
  Project,
  EducationEntry,
  ExperienceEntry,
  Certification,
  SocialLink,
  ContactMessage,
  ActivityLog,
} from './types';

export const EMPTY_IMAGE_PLACEHOLDER = '/images/placeholder.svg';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  site_title: 'Portfolio',
  site_tagline: '',
  site_description: '',
  site_url: 'https://yoursite.com',
  logo_text: 'PF',
  logo_url: '',
  favicon_url: '/favicon.ico',
  og_image_url: '',
  cv_file_url: '',
  cv_download_label: 'Download CV',
  maintenance_mode: false,
  announcement_banner_enabled: false,
  announcement_banner_text: 'Available for Opportunities',
  contact_email: '',
  contact_phone: '',
  contact_location: '',
  contact_form_enabled: true,
  custom_css: '',
  enable_custom_cursor: true,
  enable_grid_background: true,
  enable_glow_orbs: true,
};

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  primary_color: '#00c8ff',
  secondary_color: '#3b82f6',
  accent_color: '#8b5cf6',
  accent_glow: 'rgba(0, 200, 255, 0.25)',
  gradient_start: '#00c8ff',
  gradient_middle: '#3b82f6',
  gradient_end: '#8b5cf6',
  bg_color: '#07090f',
  bg_secondary: '#0d1120',
  card_bg: '#111827',
  card_border: 'rgba(255, 255, 255, 0.08)',
  text_primary: '#f3f4f6',
  text_muted: '#9ca3af',
  text_dim: '#4b5563',
  font_display: 'var(--font-geist-sans), sans-serif',
  font_body: 'var(--font-geist-sans), sans-serif',
  border_radius: '16px',
  glow_intensity: 0.8,
  grid_opacity: 0.12,
  animation_intensity: 'normal',
};

export const DEFAULT_NAVIGATION_ITEMS: NavigationItem[] = [
  { id: 'nav-1', label: 'About', href: '#about', sort_order: 1, is_visible: true, is_external: false },
  { id: 'nav-2', label: 'Skills', href: '#skills', sort_order: 2, is_visible: true, is_external: false },
  { id: 'nav-3', label: 'Projects', href: '#projects', sort_order: 3, is_visible: true, is_external: false },
  { id: 'nav-4', label: 'Education', href: '#education', sort_order: 4, is_visible: true, is_external: false },
  { id: 'nav-5', label: 'Experience', href: '#experience', sort_order: 5, is_visible: true, is_external: false },
  { id: 'nav-cert', label: 'Certifications', href: '#certifications', sort_order: 6, is_visible: true, is_external: false },
  { id: 'nav-6', label: 'Contact', href: '#contact', sort_order: 7, is_visible: true, is_external: false },
];

export const DEFAULT_PAGE_SECTIONS: PageSectionConfig[] = [
  {
    id: 'sec-hero',
    section_key: 'hero',
    name: 'Hero',
    is_visible: true,
    sort_order: 1,
    title: '',
    subtitle: '',
    badge_text: 'Available for Opportunities',
    config: {
      first_name: '',
      highlighted_name: '',
      summary: '',
      cta_primary_label: 'Download CV',
      cta_primary_url: '',
      cta_secondary_label: 'Get in Touch',
      cta_secondary_url: '#contact',
      stats: [],
    },
  },
  {
    id: 'sec-about',
    section_key: 'about',
    name: 'About',
    is_visible: true,
    sort_order: 2,
    title: 'About',
    subtitle: 'Me',
    badge_text: 'About Me',
    config: {
      bio_paragraphs: [],
      tags: [],
      avatar_url: '',
      meta_info: [],
    },
  },
  {
    id: 'sec-skills',
    section_key: 'skills',
    name: 'Skills',
    is_visible: true,
    sort_order: 3,
    title: 'My',
    subtitle: 'Skills',
    badge_text: 'Technical Skills',
    config: {
      layout_style: 'cards',
      columns: 3,
      description: 'Upload your CV to auto-populate your skills.',
    },
  },
  {
    id: 'sec-projects',
    section_key: 'projects',
    name: 'Projects',
    is_visible: true,
    sort_order: 4,
    title: 'Featured',
    subtitle: 'Projects',
    badge_text: 'Work',
    config: {
      layout_style: 'grid',
      filter_enabled: true,
    },
  },
  {
    id: 'sec-education',
    section_key: 'education',
    name: 'Education',
    is_visible: true,
    sort_order: 5,
    title: 'Education &',
    subtitle: 'Certifications',
    badge_text: 'Academic Background',
    config: {
      layout_style: 'timeline',
      description: 'Your academic background will appear here after importing your CV.',
    },
  },
  {
    id: 'sec-experience',
    section_key: 'experience',
    name: 'Experience',
    is_visible: true,
    sort_order: 6,
    title: 'Career',
    subtitle: 'History',
    badge_text: 'Work Experience',
    config: {
      layout_style: 'timeline',
      description: 'Your work experience will appear here after importing your CV.',
    },
  },
  {
    id: 'sec-certifications',
    section_key: 'certifications',
    name: 'Certifications',
    is_visible: true,
    sort_order: 7,
    title: 'Licenses &',
    subtitle: 'Certifications',
    badge_text: 'Verified Credentials',
    config: {
      layout_style: 'grid',
      description: 'Your certifications will appear here after importing your CV.',
    },
  },
  {
    id: 'sec-contact',
    section_key: 'contact',
    name: 'Contact',
    is_visible: true,
    sort_order: 8,
    title: "Let's",
    subtitle: 'Connect',
    badge_text: 'Get In Touch',
    config: {
      card_title: 'Have a project in mind?',
      card_subtitle: 'Open to new opportunities. Feel free to reach out.',
      description: 'Reach out directly through the form below or via my direct communication channels.',
    },
  },
];

export const DEFAULT_SKILL_CATEGORIES: SkillCategory[] = [
  { id: '00000000-0000-0000-0000-000000000001', name: 'Programming Languages', icon: 'Code', sort_order: 1, is_visible: true },
  { id: '00000000-0000-0000-0000-000000000002', name: 'Frameworks & Libraries', icon: 'Globe', sort_order: 2, is_visible: true },
  { id: '00000000-0000-0000-0000-000000000003', name: 'AI & Machine Learning', icon: 'Cpu', sort_order: 3, is_visible: true },
  { id: '00000000-0000-0000-0000-000000000004', name: 'Databases & Tools', icon: 'Database', sort_order: 4, is_visible: true },
  { id: '00000000-0000-0000-0000-000000000005', name: 'Architecture & Design', icon: 'Wrench', sort_order: 5, is_visible: true },
];

export const DEFAULT_SKILLS: Skill[] = [];

export const DEFAULT_PROJECTS: Project[] = [];

export const DEFAULT_EDUCATION: EducationEntry[] = [];

export const DEFAULT_EXPERIENCE: ExperienceEntry[] = [];

export const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { id: 'soc-1', platform: 'GitHub', url: '', icon: 'Github', sort_order: 1, is_visible: true },
  { id: 'soc-2', platform: 'LinkedIn', url: '', icon: 'Linkedin', sort_order: 2, is_visible: true },
  { id: 'soc-3', platform: 'Email', url: '', icon: 'Mail', sort_order: 3, is_visible: true },
];

export const DEFAULT_CONTACT_MESSAGES: ContactMessage[] = [];

export const DEFAULT_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act-1',
    user_email: 'admin@portfolio.local',
    action: 'SYSTEM_INITIALIZED',
    entity_type: 'system',
    entity_id: 'init',
    details: { note: 'Portfolio initialized. Upload your CV to get started.' },
    created_at: new Date().toISOString(),
  },
];

export const DEFAULT_CERTIFICATIONS: Certification[] = [];
