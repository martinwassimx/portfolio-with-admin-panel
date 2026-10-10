import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import { getServerItem, setServerItem } from '../../../lib/db/server-store';
import { createAdminClient } from '../../../lib/supabase/admin';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function ensureUUID(id: any): string {
  if (typeof id === 'string' && UUID_REGEX.test(id)) return id;
  return crypto.randomUUID();
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');
    if (!key) {
      return NextResponse.json({ error: 'Missing key parameter' }, { status: 400 });
    }
    const data = await getServerItem(key, null);
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const adminSupabase = createAdminClient();
    const isReplace = body.mode === 'replace' || body.replace === true;

    // Support single { key, value } or multiple { batch: { key1: val1, key2: val2 } }
    const itemsToUpdate: Record<string, any> = {};

    if (body.batch && typeof body.batch === 'object') {
      Object.assign(itemsToUpdate, body.batch);
    } else if (body.key) {
      itemsToUpdate[body.key] = body.value;
    }

    for (const [key, value] of Object.entries(itemsToUpdate)) {
      // 1. Save to local JSON store on disk
      await setServerItem(key, value);

      // 2. If Supabase admin client is configured, sync to Supabase table
      if (adminSupabase) {
        try {
          if (key === 'site_settings') {
            await adminSupabase
              .from('site_settings')
              .upsert(
                { key: 'general', value, updated_at: new Date().toISOString() },
                { onConflict: 'key' }
              );
          } else if (key === 'theme_settings') {
            const { data: existingTheme } = await adminSupabase
              .from('theme_settings')
              .select('id')
              .eq('is_active', true)
              .limit(1)
              .maybeSingle();

            if (existingTheme?.id) {
              await adminSupabase
                .from('theme_settings')
                .update({ config: value, updated_at: new Date().toISOString() })
                .eq('id', existingTheme.id);
            } else {
              await adminSupabase
                .from('theme_settings')
                .insert({
                  name: 'Active Theme',
                  is_active: true,
                  config: value,
                  updated_at: new Date().toISOString(),
                });
            }
          } else if (key === 'page_sections' && Array.isArray(value)) {
            for (const sec of value) {
              await adminSupabase.from('page_sections').upsert(
                {
                  section_key: sec.section_key,
                  name: sec.name,
                  is_visible: sec.is_visible,
                  sort_order: sec.sort_order,
                  title: sec.title,
                  subtitle: sec.subtitle,
                  badge_text: sec.badge_text,
                  config: sec.config,
                  updated_at: new Date().toISOString(),
                },
                { onConflict: 'section_key' }
              );
            }
          } else if (key === 'skills' && Array.isArray(value)) {
            if (isReplace) {
              await adminSupabase.from('skills').delete().neq('name', '___NEVER_MATCH___');
            }
            for (const item of value) {
              const skillId = ensureUUID(item.id);
              let catId = typeof item.category_id === 'string' && UUID_REGEX.test(item.category_id)
                ? item.category_id
                : null;
              if (!catId) {
                catId = '00000000-0000-0000-0000-000000000001';
              }
              await adminSupabase.from('skills').upsert({
                id: skillId,
                category_id: catId,
                name: item.name,
                proficiency: typeof item.proficiency === 'number' ? item.proficiency : 85,
                badge_color: item.badge_color || 'cyan',
                sort_order: item.sort_order ?? 0,
                is_featured: !!item.is_featured,
                is_visible: item.is_visible !== false,
              });
            }
          } else if (key === 'experience' && Array.isArray(value)) {
            if (isReplace) {
              await adminSupabase.from('experience').delete().neq('company', '___NEVER_MATCH___');
            }
            for (const item of value) {
              const expId = ensureUUID(item.id);
              await adminSupabase.from('experience').upsert({
                id: expId,
                job_title: item.job_title || item.role || '',
                company: item.company || '',
                employment_type: item.employment_type || 'Full-time',
                location: item.location || '',
                start_date: item.start_date || '',
                end_date: item.end_date || 'Present',
                is_current: !!item.is_current,
                description: item.description || '',
                responsibilities: Array.isArray(item.responsibilities) ? item.responsibilities : [],
                achievements: Array.isArray(item.achievements) ? item.achievements : [],
                technologies: Array.isArray(item.technologies) ? item.technologies : [],
                sort_order: item.sort_order ?? 0,
                is_visible: item.is_visible !== false,
              });
            }
          } else if (key === 'education' && Array.isArray(value)) {
            if (isReplace) {
              await adminSupabase.from('education').delete().neq('institution', '___NEVER_MATCH___');
            }
            for (const item of value) {
              const eduId = ensureUUID(item.id);
              await adminSupabase.from('education').upsert({
                id: eduId,
                institution: item.institution || '',
                degree: item.degree || '',
                field_of_study: item.field_of_study || '',
                start_date: item.start_date || '',
                end_date: item.end_date || '',
                is_current: !!item.is_current,
                description: item.description || '',
                achievements: Array.isArray(item.achievements) ? item.achievements : [],
                coursework: Array.isArray(item.coursework) ? item.coursework : [],
                grade_gpa: item.grade_gpa || '',
                sort_order: item.sort_order ?? 0,
                is_visible: item.is_visible !== false,
              });
            }
          } else if (key === 'certifications' && Array.isArray(value)) {
            if (isReplace) {
              await adminSupabase.from('certifications').delete().neq('title', '___NEVER_MATCH___');
            }
            for (const item of value) {
              await adminSupabase.from('certifications').upsert(item);
            }
          } else if (key === 'social_links' && Array.isArray(value)) {
            if (isReplace) {
              await adminSupabase.from('social_links').delete().neq('platform', '___NEVER_MATCH___');
            }
            for (const item of value) {
              const socId = ensureUUID(item.id);
              await adminSupabase.from('social_links').upsert({
                id: socId,
                platform: item.platform,
                url: item.url,
                icon: item.icon || 'Globe',
                sort_order: item.sort_order ?? 0,
                is_visible: item.is_visible !== false,
              });
            }
          } else if (key === 'projects' && Array.isArray(value)) {
            if (isReplace) {
              await adminSupabase.from('projects').delete().neq('title', '___NEVER_MATCH___');
            }
            for (const item of value) {
              const projId = ensureUUID(item.id);
              const cleanSlug = item.slug || item.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `proj-${Date.now()}`;
              await adminSupabase.from('projects').upsert(
                {
                  id: projId,
                  slug: cleanSlug,
                  title: item.title,
                  summary: item.summary || '',
                  full_description: item.full_description || '',
                  project_type: item.project_type || 'Software Engineering',
                  status: item.status || 'Completed',
                  start_date: item.start_date || '2024',
                  completion_date: item.completion_date || '2025',
                  is_featured: !!item.is_featured,
                  is_published: item.is_published !== false,
                  sort_order: item.sort_order ?? 0,
                  thumbnail_url: item.thumbnail_url || '',
                  cover_image_url: item.cover_image_url || '',
                  gallery_urls: Array.isArray(item.gallery_urls) ? item.gallery_urls : [],
                  technologies: Array.isArray(item.technologies) ? item.technologies : [],
                  features: Array.isArray(item.features) ? item.features : [],
                  repo_url: item.repo_url || '',
                  live_demo_url: item.live_demo_url || '',
                  updated_at: new Date().toISOString(),
                },
                { onConflict: 'slug' }
              );
            }
          }
        } catch (dbErr) {
          console.warn(`Supabase sync warning for ${key}:`, dbErr);
        }
      }
    }

    // Immediately purge and revalidate public Next.js page cache
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
    } catch (e) {
      console.warn('Revalidate warning:', e);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Store API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
