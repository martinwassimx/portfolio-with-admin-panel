import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { setServerItem } from '../../../../lib/db/server-store';
import { createAdminClient } from '../../../../lib/supabase/admin';
import {
  DEFAULT_SITE_SETTINGS,
  DEFAULT_PAGE_SECTIONS,
  DEFAULT_SKILL_CATEGORIES,
  DEFAULT_SOCIAL_LINKS,
} from '../../../../lib/db/defaults';

const NULL_UUID = '00000000-0000-0000-0000-000000000000';

export async function POST(req: NextRequest) {
  try {
    // 1. Reset local JSON store on disk (wrapped for read-only serverless environments like Vercel)
    try {
      await setServerItem('site_settings', DEFAULT_SITE_SETTINGS);
      await setServerItem('page_sections', DEFAULT_PAGE_SECTIONS);
      await setServerItem('skill_categories', DEFAULT_SKILL_CATEGORIES);
      await setServerItem('skills', []);
      await setServerItem('education', []);
      await setServerItem('experience', []);
      await setServerItem('certifications', []);
      await setServerItem('social_links', DEFAULT_SOCIAL_LINKS);
      await setServerItem('projects', []);
      await setServerItem('activity_logs', []);
      await setServerItem('contact_messages', []);
    } catch (fsErr) {
      console.warn('[Reset] Local filesystem write warning (expected on read-only serverless):', fsErr);
    }

    // 2. Resolve Supabase client: Service Role Key first, then user Bearer token fallback
    let client = createAdminClient();
    if (!client) {
      const authHeader = req.headers.get('authorization');
      const token = authHeader?.replace(/^Bearer\s+/i, '');
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
      if (url && anonKey && token) {
        client = createSupabaseClient(url, anonKey, {
          global: { headers: { Authorization: `Bearer ${token}` } },
        });
      }
    }

    if (client) {
      try {
        // Reset site_settings
        await client
          .from('site_settings')
          .upsert(
            { key: 'general', value: DEFAULT_SITE_SETTINGS, updated_at: new Date().toISOString() },
            { onConflict: 'key' }
          );

        // Upsert default page sections
        for (const sec of DEFAULT_PAGE_SECTIONS) {
          await client.from('page_sections').upsert(
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
          await client.from('skill_categories').upsert(
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

        // Clear dynamic content tables cleanly by primary key
        await client.from('skills').delete().neq('id', NULL_UUID);
        await client.from('education').delete().neq('id', NULL_UUID);
        await client.from('experience').delete().neq('id', NULL_UUID);
        await client.from('certifications').delete().neq('id', NULL_UUID);
        await client.from('project_content_blocks').delete().neq('id', NULL_UUID);
        await client.from('projects').delete().neq('id', NULL_UUID);
        await client.from('social_links').delete().neq('id', NULL_UUID);
        await client.from('contact_messages').delete().neq('id', NULL_UUID);
        await client.from('activity_logs').delete().neq('id', NULL_UUID);

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
