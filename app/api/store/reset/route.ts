import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { setServerItem } from '../../../../lib/db/server-store';
import { createAdminClient } from '../../../../lib/supabase/admin';
import {
  DEFAULT_SITE_SETTINGS,
  DEFAULT_PAGE_SECTIONS,
  DEFAULT_SKILL_CATEGORIES,
  DEFAULT_SKILLS,
  DEFAULT_EDUCATION,
  DEFAULT_EXPERIENCE,
  DEFAULT_CERTIFICATIONS,
  DEFAULT_SOCIAL_LINKS,
  DEFAULT_PROJECTS,
  DEFAULT_ACTIVITY_LOGS,
  DEFAULT_CONTACT_MESSAGES,
} from '../../../../lib/db/defaults';

export async function POST(req: NextRequest) {
  try {
    // 1. Reset local JSON store on disk to empty defaults
    await setServerItem('site_settings', DEFAULT_SITE_SETTINGS);
    await setServerItem('page_sections', DEFAULT_PAGE_SECTIONS);
    await setServerItem('skill_categories', DEFAULT_SKILL_CATEGORIES);
    await setServerItem('skills', DEFAULT_SKILLS);
    await setServerItem('education', DEFAULT_EDUCATION);
    await setServerItem('experience', DEFAULT_EXPERIENCE);
    await setServerItem('certifications', DEFAULT_CERTIFICATIONS);
    await setServerItem('social_links', DEFAULT_SOCIAL_LINKS);
    await setServerItem('projects', DEFAULT_PROJECTS);
    await setServerItem('activity_logs', DEFAULT_ACTIVITY_LOGS);
    await setServerItem('contact_messages', DEFAULT_CONTACT_MESSAGES);

    // 2. Reset Supabase tables if configured
    const adminSupabase = createAdminClient();
    if (adminSupabase) {
      try {
        // Reset site_settings
        await adminSupabase
          .from('site_settings')
          .upsert(
            { key: 'general', value: DEFAULT_SITE_SETTINGS, updated_at: new Date().toISOString() },
            { onConflict: 'key' }
          );

        // Upsert default page sections with onConflict: 'section_key'
        for (const sec of DEFAULT_PAGE_SECTIONS) {
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

        // Upsert default skill categories
        for (const cat of DEFAULT_SKILL_CATEGORIES) {
          await adminSupabase.from('skill_categories').upsert(
            {
              id: cat.id,
              name: cat.name,
              icon: cat.icon,
              sort_order: cat.sort_order,
              is_visible: cat.is_visible,
            },
            { onConflict: 'id' }
          );
        }

        // Clear dynamic content tables safely using non-matching text filter
        await adminSupabase.from('skills').delete().neq('name', '___NEVER_MATCH___');
        await adminSupabase.from('education').delete().neq('institution', '___NEVER_MATCH___');
        await adminSupabase.from('experience').delete().neq('company', '___NEVER_MATCH___');
        await adminSupabase.from('certifications').delete().neq('title', '___NEVER_MATCH___');
        await adminSupabase.from('projects').delete().neq('title', '___NEVER_MATCH___');
        await adminSupabase.from('social_links').delete().neq('platform', '___NEVER_MATCH___');
        await adminSupabase.from('contact_messages').delete().neq('name', '___NEVER_MATCH___');
        await adminSupabase.from('activity_logs').delete().neq('action', '___NEVER_MATCH___');

        console.log('[Reset] Supabase tables cleared successfully.');
      } catch (dbErr) {
        console.warn('[Reset] Supabase reset warning:', dbErr);
      }
    }

    // 3. Revalidate public and admin pages
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
      revalidatePath('/admin/cv-import');
      revalidatePath('/admin/skills');
      revalidatePath('/admin/experience');
      revalidatePath('/admin/education');
      revalidatePath('/admin/certifications');
      revalidatePath('/admin/projects');
      revalidatePath('/admin/settings');
    } catch (e) {
      console.warn('[Reset] Revalidate warning:', e);
    }

    return NextResponse.json({ success: true, message: 'Portfolio data cleared successfully.' });
  } catch (err: any) {
    console.error('[Reset] Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
