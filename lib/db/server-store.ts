import 'server-only';
import path from 'path';
import fs from 'fs/promises';
import { createAdminClient } from '../supabase/admin';
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
} from './types';
import {
  DEFAULT_SITE_SETTINGS,
  DEFAULT_THEME_SETTINGS,
  DEFAULT_PAGE_SECTIONS,
  DEFAULT_NAVIGATION_ITEMS,
  DEFAULT_SKILL_CATEGORIES,
  DEFAULT_SKILLS,
  DEFAULT_PROJECTS,
  DEFAULT_EDUCATION,
  DEFAULT_EXPERIENCE,
  DEFAULT_CERTIFICATIONS,
  DEFAULT_SOCIAL_LINKS,
} from './defaults';

const DATA_FILE = path.join(process.cwd(), 'data', 'portfolio-store.json');

async function readStoreFile(): Promise<Record<string, any>> {
  try {
    const content = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return {};
  }
}

async function writeStoreFile(store: Record<string, any>): Promise<void> {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write portfolio-store.json:', err);
  }
}

export async function getServerItem<T>(key: string, defaultValue: T): Promise<T> {
  const store = await readStoreFile();
  if (store[key] !== undefined) {
    return store[key] as T;
  }
  return defaultValue;
}

export async function setServerItem<T>(key: string, value: T): Promise<void> {
  const store = await readStoreFile();
  store[key] = value;
  await writeStoreFile(store);
}

// ---------------- Site Settings ----------------
export async function getSiteSettings(): Promise<SiteSettings> {
  const adminSupabase = createAdminClient();
  if (adminSupabase) {
    try {
      const { data, error } = await adminSupabase
        .from('site_settings')
        .select('*')
        .eq('key', 'general')
        .maybeSingle();
      if (!error && data?.value) {
        return { ...DEFAULT_SITE_SETTINGS, ...data.value };
      }
    } catch (e) {
      console.warn('Supabase fetch failed on server:', e);
    }
  }
  return getServerItem<SiteSettings>('site_settings', DEFAULT_SITE_SETTINGS);
}

// ---------------- Theme Settings ----------------
export async function getThemeSettings(): Promise<ThemeSettings> {
  const adminSupabase = createAdminClient();
  if (adminSupabase) {
    try {
      const { data, error } = await adminSupabase
        .from('theme_settings')
        .select('*')
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!error && data?.config) {
        return { ...DEFAULT_THEME_SETTINGS, ...data.config };
      }
    } catch (e) {
      console.warn('Supabase fetch theme failed on server:', e);
    }
  }
  return getServerItem<ThemeSettings>('theme_settings', DEFAULT_THEME_SETTINGS);
}

// ---------------- Page Sections ----------------
export async function getPageSections(): Promise<PageSectionConfig[]> {
  const adminSupabase = createAdminClient();
  if (adminSupabase) {
    try {
      const { data, error } = await adminSupabase
        .from('page_sections')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) {
        const hasCert = data.some((s: any) => s.section_key === 'certifications');
        if (!hasCert) {
          const certSec = DEFAULT_PAGE_SECTIONS.find((s) => s.section_key === 'certifications');
          if (certSec) data.push(certSec as any);
        }
        return data as PageSectionConfig[];
      }
    } catch (e) {
      console.warn('Supabase sections fetch failed on server:', e);
    }
  }
  const local = await getServerItem<PageSectionConfig[]>('page_sections', DEFAULT_PAGE_SECTIONS);
  if (!local.some((s) => s.section_key === 'certifications')) {
    const certSec = DEFAULT_PAGE_SECTIONS.find((s) => s.section_key === 'certifications');
    if (certSec) local.push(certSec);
  }
  return local;
}

// ---------------- Navigation Items ----------------
export async function getNavigationItems(): Promise<NavigationItem[]> {
  const adminSupabase = createAdminClient();
  if (adminSupabase) {
    try {
      const { data, error } = await adminSupabase
        .from('navigation_items')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) {
        const hasCert = data.some((n: any) => n.href === '#certifications');
        if (!hasCert) {
          const certNav = DEFAULT_NAVIGATION_ITEMS.find((n) => n.href === '#certifications');
          if (certNav) data.push(certNav as any);
        }
        return data as NavigationItem[];
      }
    } catch (e) {
      console.warn(e);
    }
  }
  const localNav = await getServerItem<NavigationItem[]>('navigation_items', DEFAULT_NAVIGATION_ITEMS);
  if (!localNav.some((n) => n.href === '#certifications')) {
    const certNav = DEFAULT_NAVIGATION_ITEMS.find((n) => n.href === '#certifications');
    if (certNav) localNav.push(certNav);
  }
  return localNav;
}

// ---------------- Skill Categories ----------------
export async function getSkillCategories(): Promise<SkillCategory[]> {
  const adminSupabase = createAdminClient();
  if (adminSupabase) {
    try {
      const { data, error } = await adminSupabase
        .from('skill_categories')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) return data as SkillCategory[];
    } catch (e) {
      console.warn(e);
    }
  }
  return getServerItem<SkillCategory[]>('skill_categories', DEFAULT_SKILL_CATEGORIES);
}

// ---------------- Skills ----------------
export async function getSkills(): Promise<Skill[]> {
  const adminSupabase = createAdminClient();
  if (adminSupabase) {
    try {
      const { data, error } = await adminSupabase
        .from('skills')
        .select('*')
        .order('sort_order', { ascending: true });
      if (!error && Array.isArray(data)) return data as Skill[];
    } catch (e) {
      console.warn(e);
    }
  }
  return getServerItem<Skill[]>('skills', DEFAULT_SKILLS);
}

// ---------------- Projects ----------------
export async function getProjects(options: { publishedOnly?: boolean } = {}): Promise<Project[]> {
  const adminSupabase = createAdminClient();
  if (adminSupabase) {
    try {
      let query = adminSupabase.from('projects').select('*').order('sort_order', { ascending: true });
      if (options.publishedOnly) {
        query = query.eq('is_published', true);
      }
      const { data, error } = await query;
      if (!error && Array.isArray(data)) return data as Project[];
    } catch (e) {
      console.warn(e);
    }
  }
  const all = await getServerItem<Project[]>('projects', DEFAULT_PROJECTS);
  if (options.publishedOnly) {
    return all.filter((p) => p.is_published);
  }
  return all;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getProjects({ publishedOnly: false });
  return projects.find((p) => p.slug === slug) || null;
}

// ---------------- Education ----------------
export async function getEducation(): Promise<EducationEntry[]> {
  const adminSupabase = createAdminClient();
  if (adminSupabase) {
    try {
      const { data, error } = await adminSupabase.from('education').select('*').order('sort_order', { ascending: true });
      if (!error && Array.isArray(data)) return data as EducationEntry[];
    } catch (e) {
      console.warn(e);
    }
  }
  return getServerItem<EducationEntry[]>('education', DEFAULT_EDUCATION);
}

// ---------------- Experience ----------------
export async function getExperience(): Promise<ExperienceEntry[]> {
  const adminSupabase = createAdminClient();
  if (adminSupabase) {
    try {
      const { data, error } = await adminSupabase.from('experience').select('*').order('sort_order', { ascending: true });
      if (!error && Array.isArray(data)) return data as ExperienceEntry[];
    } catch (e) {
      console.warn(e);
    }
  }
  return getServerItem<ExperienceEntry[]>('experience', DEFAULT_EXPERIENCE);
}

// ---------------- Certifications ----------------
export async function getCertifications(): Promise<Certification[]> {
  const adminSupabase = createAdminClient();
  if (adminSupabase) {
    try {
      const { data, error } = await adminSupabase.from('certifications').select('*').order('sort_order', { ascending: true });
      if (!error && Array.isArray(data)) return data as Certification[];
    } catch (e) {
      console.warn(e);
    }
  }
  return getServerItem<Certification[]>('certifications', DEFAULT_CERTIFICATIONS);
}

// ---------------- Social Links ----------------
export async function getSocialLinks(): Promise<SocialLink[]> {
  const adminSupabase = createAdminClient();
  if (adminSupabase) {
    try {
      const { data, error } = await adminSupabase.from('social_links').select('*').order('sort_order', { ascending: true });
      if (!error && Array.isArray(data)) return data as SocialLink[];
    } catch (e) {
      console.warn(e);
    }
  }
  return getServerItem<SocialLink[]>('social_links', DEFAULT_SOCIAL_LINKS);
}
