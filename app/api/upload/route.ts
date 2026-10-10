import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import crypto from 'crypto';
import { createAdminClient } from '../../../lib/supabase/admin';
import { createClient, isSupabaseConfigured } from '../../../lib/supabase/client';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const bucket = (formData.get('bucket') as string) || 'portfolio-media';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const filename = file.name;
    const mimeType = file.type || 'application/octet-stream';
    const sizeBytes = file.size;

    // Check size limit: 15MB
    if (sizeBytes > 15 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 15MB limit.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const safePath = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // 1. Always save locally to public/uploads/ as an immediate reliable backup
    let publicUrl = '';
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, safePath), buffer);
      publicUrl = `/uploads/${safePath}`;
    } catch (fsErr) {
      console.warn('Failed writing local file:', fsErr);
    }

    // 2. Attempt Supabase upload if configured
    const adminSupabase = createAdminClient();
    const supabase = adminSupabase || (isSupabaseConfigured() ? createClient() : null);

    if (supabase) {
      try {
        // If admin client, ensure bucket exists
        if (adminSupabase) {
          try {
            const { data: buckets } = await adminSupabase.storage.listBuckets();
            if (!buckets?.some((b) => b.name === bucket)) {
              await adminSupabase.storage.createBucket(bucket, { public: true });
            }
          } catch (bErr) {
            console.warn('Bucket ensure error:', bErr);
          }
        }

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(safePath, buffer, {
            contentType: mimeType,
            upsert: true,
          });

        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(uploadData.path);
          if (urlData?.publicUrl) {
            publicUrl = urlData.publicUrl;
          }
        } else if (uploadError) {
          console.warn('Supabase storage upload error:', uploadError.message);
        }
      } catch (e: any) {
        console.warn('Supabase storage upload failed, keeping local URL:', e);
      }
    }

    // Fallback if neither local nor supabase worked: base64 data url
    if (!publicUrl) {
      const base64 = buffer.toString('base64');
      publicUrl = `data:${mimeType};base64,${base64}`;
    }

    const assetId = crypto.randomUUID();
    const asset = {
      id: assetId,
      filename,
      file_path: safePath,
      public_url: publicUrl,
      mime_type: mimeType,
      size_bytes: sizeBytes,
      alt_text: filename,
      bucket,
      created_at: new Date().toISOString(),
    };

    // If Supabase is available, persist directly to media_assets table
    if (supabase) {
      try {
        await supabase.from('media_assets').upsert({
          id: assetId,
          filename,
          file_path: safePath,
          public_url: publicUrl,
          mime_type: mimeType,
          size_bytes: sizeBytes,
          alt_text: filename,
          bucket,
        });
      } catch (dbErr) {
        console.warn('Supabase media_assets table upsert failed:', dbErr);
      }
    }

    return NextResponse.json({ success: true, asset });
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
