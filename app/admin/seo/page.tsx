'use client';

import React, { useState, useEffect } from 'react';
import { Search, Save, Check, Globe } from 'lucide-react';
import { getSiteSettings, updateSiteSettings } from '../../../lib/db/store';
import { SiteSettings } from '../../../lib/db/types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';

export default function AdminSeoPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getSiteSettings();
      setSettings(data);
    }
    load();
  }, []);

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await updateSiteSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">SEO & Social Metadata</h2>
          <p className="text-xs text-gray-400 mt-1">
            Configure site title, meta description, Open Graph share card, and search engine settings.
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="sm"
          isLoading={saving}
          leftIcon={saved ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Save className="w-3.5 h-3.5" />}
        >
          {saved ? 'Saved' : 'Save Changes'}
        </Button>
      </div>

      <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <Search className="w-4 h-4" />
          <span>Meta Tags & Search Engine Visibility</span>
        </h3>

        <Input
          label="Site Title (Appears in browser tab & Google)"
          value={settings.site_title || ''}
          onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
          placeholder="Martin Wassim | Portfolio"
        />

        <Textarea
          label="Meta Description (Summary for search engines)"
          rows={3}
          value={settings.site_description || ''}
          onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
          placeholder="Personal engineering portfolio of Martin Wassim, Founder & Software Engineer."
        />

        <Input
          label="Canonical Production Site URL"
          value={settings.site_url || ''}
          onChange={(e) => setSettings({ ...settings, site_url: e.target.value })}
          placeholder="https://example.com"
          helperText="Used to generate canonical links, sitemaps, and absolute OpenGraph cards."
        />
      </div>

      <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          <span>Social Graph & Favicon</span>
        </h3>

        <Input
          label="Open Graph Image URL (og:image for Twitter/LinkedIn previews)"
          value={settings.og_image_url || ''}
          onChange={(e) => setSettings({ ...settings, og_image_url: e.target.value })}
          placeholder="https://.../og-preview.png or select from Media Library"
        />

        <Input
          label="Favicon URL"
          value={settings.favicon_url || ''}
          onChange={(e) => setSettings({ ...settings, favicon_url: e.target.value })}
          placeholder="/favicon.ico or custom icon URL"
        />
      </div>
    </form>
  );
}
