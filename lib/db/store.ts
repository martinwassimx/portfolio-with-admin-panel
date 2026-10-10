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
  MediaAsset,
  ActivityLog,
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
  DEFAULT_CONTACT_MESSAGES,
  DEFAULT_ACTIVITY_LOGS,
} from './defaults';
import { isSupabaseConfigured, createClient } from '../supabase/client';

const STORAGE_KEY_PREFIX = 'portfolio_db_';
const DB_VERSION = 'v4_production';

function getLocalItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const versionKey = STORAGE_KEY_PREFIX + '__version';
    const currentVersion = localStorage.getItem(versionKey);
    if (currentVersion !== DB_VERSION) {
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith(STORAGE_KEY_PREFIX)) {
          localStorage.removeItem(k);
        }
      });
      localStorage.setItem(versionKey, DB_VERSION);
      return defaultValue;
    }

    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to read ${key} from localStorage`, e);
    return defaultValue;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
    window.dispatchEvent(new Event('portfolio_db_updated'));

    // Automatically sync to server store & Supabase
    fetch('/api/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    }).catch(() => {});
  } catch (e) {
    console.error(`Failed to write ${key} to localStorage`, e);
  }
}

// ---------------- Site Settings ----------------
export async function getSiteSettings(): Promise<SiteSettings> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'general')
        .maybeSingle();
      if (!error && data?.value) {
        return { ...DEFAULT_SITE_SETTINGS, ...data.value };
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local store', e);
    }
  }
  return getLocalItem('site_settings', DEFAULT_SITE_SETTINGS);
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getSiteSettings();
  const updated = { ...current, ...settings };

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase
        .from('site_settings')
        .upsert({ key: 'general', value: updated, updated_at: new Date().toISOString() });
    } catch (e) {
      console.warn('Supabase update failed', e);
    }
  }

  setLocalItem('site_settings', updated);
  await logActivity('UPDATE_SITE_SETTINGS', 'site_settings', 'general', settings);
  return updated;
}

// ---------------- Theme Settings ----------------
export async function getThemeSettings(): Promise<ThemeSettings> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('theme_settings')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();
      if (!error && data?.config) {
        return { ...DEFAULT_THEME_SETTINGS, ...data.config };
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local store', e);
    }
  }
  return getLocalItem('theme_settings', DEFAULT_THEME_SETTINGS);
}

export async function updateThemeSettings(theme: Partial<ThemeSettings>): Promise<ThemeSettings> {
  const current = await getThemeSettings();
  const updated = { ...current, ...theme };

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data: existing } = await supabase
        .from('theme_settings')
        .select('id')
        .eq('is_active', true)
        .limit(1)
        .maybeSingle();

      if (existing?.id) {
        await supabase
          .from('theme_settings')
          .update({ config: updated, updated_at: new Date().toISOString() })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('theme_settings')
          .insert({ name: 'Active Theme', is_active: true, config: updated, updated_at: new Date().toISOString() });
      }
    } catch (e) {
      console.warn('Supabase theme update warning', e);
    }
  }

  setLocalItem('theme_settings', updated);
  await logActivity('UPDATE_THEME', 'theme_settings', 'active', theme);
  return updated;
}

// ---------------- Page Sections ----------------
export async function getPageSections(): Promise<PageSectionConfig[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
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
      console.warn('Supabase sections fetch failed', e);
    }
  }
  const local = getLocalItem('page_sections', DEFAULT_PAGE_SECTIONS);
  if (!local.some((s: any) => s.section_key === 'certifications')) {
    const certSec = DEFAULT_PAGE_SECTIONS.find((s) => s.section_key === 'certifications');
    if (certSec) {
      local.push(certSec);
      setLocalItem('page_sections', local);
    }
  }
  return local;
}

export async function updatePageSection(sectionKey: string, updates: Partial<PageSectionConfig>): Promise<PageSectionConfig[]> {
  const sections = await getPageSections();
  const updated = sections.map((sec) => (sec.section_key === sectionKey ? { ...sec, ...updates } : sec));

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const target = updated.find((s) => s.section_key === sectionKey);
      if (target) {
        await supabase.from('page_sections').upsert(
          {
            section_key: target.section_key,
            name: target.name,
            is_visible: target.is_visible,
            sort_order: target.sort_order,
            title: target.title,
            subtitle: target.subtitle,
            badge_text: target.badge_text,
            config: target.config,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'section_key' }
        );
      }
    } catch (e) {
      console.warn('Supabase section update failed', e);
    }
  }

  setLocalItem('page_sections', updated);
  try {
    await fetch('/api/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'page_sections', value: updated }),
    });
  } catch (err) {
    // Non-blocking sync attempt
  }
  await logActivity('UPDATE_SECTION', 'page_sections', sectionKey, updates);
  return updated;
}

export async function reorderPageSections(orderedKeys: string[]): Promise<PageSectionConfig[]> {
  const sections = await getPageSections();
  const reordered = sections.map((sec) => {
    const newIdx = orderedKeys.indexOf(sec.section_key);
    return { ...sec, sort_order: newIdx >= 0 ? newIdx + 1 : sec.sort_order };
  }).sort((a, b) => a.sort_order - b.sort_order);

  setLocalItem('page_sections', reordered);
  return reordered;
}

// ---------------- Navigation Items ----------------
export async function getNavigationItems(): Promise<NavigationItem[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
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
  const localNav = getLocalItem('navigation_items', DEFAULT_NAVIGATION_ITEMS);
  if (!localNav.some((n: any) => n.href === '#certifications')) {
    const certNav = DEFAULT_NAVIGATION_ITEMS.find((n) => n.href === '#certifications');
    if (certNav) {
      localNav.push(certNav);
      setLocalItem('navigation_items', localNav);
    }
  }
  return localNav;
}

export async function saveNavigationItems(items: NavigationItem[]): Promise<NavigationItem[]> {
  setLocalItem('navigation_items', items);
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      for (const item of items) {
        await supabase.from('navigation_items').upsert(item);
      }
    } catch (e) {
      console.warn(e);
    }
  }
  await logActivity('UPDATE_NAV', 'navigation_items', 'all', { count: items.length });
  return items;
}

// ---------------- Skills & Categories ----------------
export async function getSkillCategories(): Promise<SkillCategory[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('skill_categories').select('*').order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) return data as SkillCategory[];
    } catch (e) {
      console.warn(e);
    }
  }
  return getLocalItem('skill_categories', DEFAULT_SKILL_CATEGORIES);
}

export async function saveSkillCategories(categories: SkillCategory[]): Promise<SkillCategory[]> {
  setLocalItem('skill_categories', categories);
  return categories;
}

export async function getSkills(): Promise<Skill[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('skills').select('*').order('sort_order', { ascending: true });
      if (!error && Array.isArray(data)) return data as Skill[];
    } catch (e) {
      console.warn(e);
    }
  }
  return getLocalItem('skills', DEFAULT_SKILLS);
}

export async function saveSkills(skills: Skill[]): Promise<Skill[]> {
  setLocalItem('skills', skills);
  await logActivity('UPDATE_SKILLS', 'skills', 'all', { count: skills.length });
  return skills;
}

// ---------------- Projects ----------------
export async function getProjects(options: { publishedOnly?: boolean } = {}): Promise<Project[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      let query = supabase.from('projects').select('*, content_blocks:project_content_blocks(*)').order('sort_order', { ascending: true });
      if (options.publishedOnly) {
        query = query.eq('is_published', true);
      }
      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        return data as Project[];
      }
    } catch (e) {
      console.warn(e);
    }
  }

  const projects = getLocalItem('projects', DEFAULT_PROJECTS);
  if (options.publishedOnly) {
    return projects.filter((p) => p.is_published);
  }
  return projects;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const all = await getProjects({ publishedOnly: false });
  return all.find((p) => p.slug === slug) || null;
}

export async function getProjectById(id: string): Promise<Project | null> {
  const all = await getProjects({ publishedOnly: false });
  return all.find((p) => p.id === id) || null;
}

export async function saveProject(project: Project): Promise<Project> {
  const all = await getProjects({ publishedOnly: false });
  const index = all.findIndex((p) => p.id === project.id);
  let updatedList: Project[];

  const updatedProject = {
    ...project,
    updated_at: new Date().toISOString(),
  };

  if (index >= 0) {
    updatedList = [...all];
    updatedList[index] = updatedProject;
  } else {
    updatedList = [...all, updatedProject];
  }

  setLocalItem('projects', updatedList);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase.from('projects').upsert(updatedProject);
    } catch (e) {
      console.warn('Supabase save project failed', e);
    }
  }

  await logActivity('SAVE_PROJECT', 'projects', project.id, { title: project.title, slug: project.slug });
  return updatedProject;
}

export async function saveProjects(projects: Project[]): Promise<Project[]> {
  setLocalItem('projects', projects);
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      for (const p of projects) {
        await supabase.from('projects').upsert(p);
      }
    } catch (e) {
      console.warn('Supabase saveProjects failed', e);
    }
  }
  await logActivity('UPDATE_PROJECTS', 'projects', 'all', { count: projects.length });
  return projects;
}

export async function deleteProject(id: string): Promise<boolean> {
  const all = await getProjects({ publishedOnly: false });
  const filtered = all.filter((p) => p.id !== id);
  setLocalItem('projects', filtered);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase.from('projects').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete project failed', e);
    }
  }

  await logActivity('DELETE_PROJECT', 'projects', id, {});
  return true;
}

// ---------------- Education & Experience ----------------
export async function getEducation(): Promise<EducationEntry[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('education').select('*').order('sort_order', { ascending: true });
      if (!error && Array.isArray(data)) return data as EducationEntry[];
    } catch (e) {
      console.warn(e);
    }
  }
  return getLocalItem('education', DEFAULT_EDUCATION);
}

export async function saveEducation(education: EducationEntry[]): Promise<EducationEntry[]> {
  setLocalItem('education', education);
  await logActivity('UPDATE_EDUCATION', 'education', 'all', { count: education.length });
  return education;
}

export async function getExperience(): Promise<ExperienceEntry[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('experience').select('*').order('sort_order', { ascending: true });
      if (!error && Array.isArray(data)) return data as ExperienceEntry[];
    } catch (e) {
      console.warn(e);
    }
  }
  return getLocalItem('experience', DEFAULT_EXPERIENCE);
}

export async function saveExperience(experience: ExperienceEntry[]): Promise<ExperienceEntry[]> {
  setLocalItem('experience', experience);
  await logActivity('UPDATE_EXPERIENCE', 'experience', 'all', { count: experience.length });
  return experience;
}

// ---------------- Certifications ----------------
export async function getCertifications(): Promise<Certification[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('certifications').select('*').order('sort_order', { ascending: true });
      if (!error && Array.isArray(data)) return data as Certification[];
    } catch (e) {
      console.warn(e);
    }
  }
  return getLocalItem('certifications', DEFAULT_CERTIFICATIONS);
}

export async function saveCertifications(certifications: Certification[]): Promise<Certification[]> {
  setLocalItem('certifications', certifications);
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase.from('certifications').upsert(certifications);
    } catch (e) {
      console.warn(e);
    }
  }
  await logActivity('UPDATE_CERTIFICATIONS', 'certifications', 'all', { count: certifications.length });
  return certifications;
}

export async function saveCertification(certification: Certification): Promise<Certification> {
  const current = await getCertifications();
  const index = current.findIndex((c) => c.id === certification.id);
  let updated: Certification[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = certification;
  } else {
    updated = [...current, certification];
  }
  await saveCertifications(updated);
  return certification;
}

export async function deleteCertification(id: string): Promise<void> {
  const current = await getCertifications();
  const updated = current.filter((c) => c.id !== id);
  await saveCertifications(updated);
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase.from('certifications').delete().eq('id', id);
    } catch (e) {
      console.warn(e);
    }
  }
}

// ---------------- Social Links ----------------
export async function getSocialLinks(): Promise<SocialLink[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('social_links').select('*').order('sort_order', { ascending: true });
      if (!error && data && data.length > 0) return data as SocialLink[];
    } catch (e) {
      console.warn(e);
    }
  }
  return getLocalItem('social_links', DEFAULT_SOCIAL_LINKS);
}

export async function saveSocialLinks(links: SocialLink[]): Promise<SocialLink[]> {
  setLocalItem('social_links', links);
  await logActivity('UPDATE_SOCIAL_LINKS', 'social_links', 'all', { count: links.length });
  return links;
}

// ---------------- Contact Messages ----------------
export async function getContactMessages(): Promise<ContactMessage[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as ContactMessage[];
    } catch (e) {
      console.warn(e);
    }
  }
  return getLocalItem('contact_messages', DEFAULT_CONTACT_MESSAGES);
}

export async function submitContactMessage(msg: Omit<ContactMessage, 'id' | 'status' | 'created_at'>): Promise<ContactMessage> {
  const newMsg: ContactMessage = {
    ...msg,
    id: 'msg-' + Date.now(),
    status: 'unread',
    created_at: new Date().toISOString(),
  };

  const current = await getContactMessages();
  setLocalItem('contact_messages', [newMsg, ...current]);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase.from('contact_messages').insert({
        name: msg.name,
        email: msg.email,
        subject: msg.subject,
        message: msg.message,
      });
    } catch (e) {
      console.warn('Supabase insert message failed', e);
    }
  }

  return newMsg;
}

export async function updateContactMessageStatus(id: string, status: ContactMessage['status']): Promise<void> {
  const messages = await getContactMessages();
  const updated = messages.map((m) => (m.id === id ? { ...m, status } : m));
  setLocalItem('contact_messages', updated);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase.from('contact_messages').update({ status }).eq('id', id);
    } catch (e) {
      console.warn(e);
    }
  }
}

export async function deleteContactMessage(id: string): Promise<void> {
  const messages = await getContactMessages();
  const filtered = messages.filter((m) => m.id !== id);
  setLocalItem('contact_messages', filtered);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase.from('contact_messages').delete().eq('id', id);
    } catch (e) {
      console.warn(e);
    }
  }
}

// ---------------- Media Assets ----------------
export async function getMediaAssets(): Promise<MediaAsset[]> {
  const local = getLocalItem<MediaAsset[]>('media_assets', []);
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('media_assets').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        const map = new Map<string, MediaAsset>();
        data.forEach((d: any) => map.set(d.id, d as MediaAsset));
        local.forEach((l) => {
          if (!map.has(l.id)) map.set(l.id, l);
        });
        return Array.from(map.values()).sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
    } catch (e) {
      console.warn(e);
    }
  }
  return local;
}

export async function saveMediaAsset(asset: MediaAsset): Promise<MediaAsset> {
  const assets = await getMediaAssets();
  const updated = [asset, ...assets.filter((a) => a.id !== asset.id)];
  setLocalItem('media_assets', updated);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase.from('media_assets').upsert(asset);
    } catch (e) {
      console.warn(e);
    }
  }

  await logActivity('UPLOAD_MEDIA', 'media_assets', asset.id, { filename: asset.filename });
  return asset;
}

export async function deleteMediaAsset(id: string): Promise<void> {
  const assets = await getMediaAssets();
  setLocalItem('media_assets', assets.filter((a) => a.id !== id));

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase.from('media_assets').delete().eq('id', id);
    } catch (e) {
      console.warn(e);
    }
  }
}

// ---------------- Activity Logs ----------------
export async function getActivityLogs(): Promise<ActivityLog[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(50);
      if (!error && data && data.length > 0) return data as ActivityLog[];
    } catch (e) {
      console.warn(e);
    }
  }
  return getLocalItem('activity_logs', DEFAULT_ACTIVITY_LOGS);
}

export async function logActivity(action: string, entity_type: string, entity_id: string, details?: Record<string, any>): Promise<void> {
  const log: ActivityLog = {
    id: 'log-' + Date.now(),
    user_email: 'admin@portfolio.local',
    action,
    entity_type,
    entity_id,
    details,
    created_at: new Date().toISOString(),
  };

  const current = getLocalItem('activity_logs', DEFAULT_ACTIVITY_LOGS);
  setLocalItem('activity_logs', [log, ...current.slice(0, 99)]);

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase.from('activity_logs').insert({
        user_email: log.user_email,
        action,
        entity_type,
        entity_id,
        details,
      });
    } catch (e) {
      // Ignore background log error
    }
  }
}
