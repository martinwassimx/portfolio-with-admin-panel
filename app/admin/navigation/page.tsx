'use client';

import React, { useState, useEffect } from 'react';
import {
  Compass,
  Plus,
  Trash2,
  Save,
  Check,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Globe,
} from 'lucide-react';
import {
  getNavigationItems,
  saveNavigationItems,
  getSocialLinks,
  saveSocialLinks,
  getSiteSettings,
  updateSiteSettings,
} from '../../../lib/db/store';
import { NavigationItem, SocialLink, SiteSettings } from '../../../lib/db/types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

export default function AdminNavigationPage() {
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const [nav, soc, setts] = await Promise.all([
        getNavigationItems(),
        getSocialLinks(),
        getSiteSettings(),
      ]);
      setNavItems([...nav].sort((a, b) => a.sort_order - b.sort_order));
      setSocialLinks(soc);
      setSiteSettings(setts);
    }
    load();
  }, []);

  const moveNavItem = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === navItems.length - 1)
    )
      return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...navItems];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);
    setNavItems(reordered.map((item, i) => ({ ...item, sort_order: i + 1 })));
  };

  const toggleNavVisibility = (id: string) => {
    setNavItems(
      navItems.map((n) => (n.id === id ? { ...n, is_visible: !n.is_visible } : n))
    );
  };

  const updateNavItem = (id: string, field: keyof NavigationItem, val: any) => {
    setNavItems(
      navItems.map((n) => (n.id === id ? { ...n, [field]: val } : n))
    );
  };

  const handleAddSocial = () => {
    const newSoc: SocialLink = {
      id: 'soc-' + Date.now(),
      platform: 'New Platform',
      url: 'https://',
      icon: 'Globe',
      sort_order: socialLinks.length + 1,
      is_visible: true,
    };
    setSocialLinks([...socialLinks, newSoc]);
  };

  const updateSocialLink = (id: string, field: keyof SocialLink, val: any) => {
    setSocialLinks(
      socialLinks.map((s) => (s.id === id ? { ...s, [field]: val } : s))
    );
  };

  const handleRemoveSocial = (id: string) => {
    setSocialLinks(socialLinks.filter((s) => s.id !== id));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await Promise.all([
        saveNavigationItems(navItems),
        saveSocialLinks(socialLinks),
        siteSettings ? updateSiteSettings(siteSettings) : Promise.resolve(),
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Navigation & Footer</h2>
          <p className="text-xs text-gray-400 mt-1">
            Customize header navbar links, logo brand text, footer credits, and social accounts.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={handleSaveAll}
          isLoading={saving}
          leftIcon={saved ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Save className="w-3.5 h-3.5" />}
        >
          {saved ? 'Saved' : 'Save Changes'}
        </Button>
      </div>

      {/* Brand & Logo Text */}
      {siteSettings && (
        <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400">
            Navbar Branding
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Logo Text / Initials"
              value={siteSettings.logo_text || ''}
              onChange={(e) => setSiteSettings({ ...siteSettings, logo_text: e.target.value })}
              placeholder="MW"
            />
            <Input
              label="Site Tagline"
              value={siteSettings.site_tagline || ''}
              onChange={(e) => setSiteSettings({ ...siteSettings, site_tagline: e.target.value })}
              placeholder="Founder of Systemize EG • Software Engineer"
            />
          </div>
        </div>
      )}

      {/* Header Navigation Items */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <Compass className="w-4 h-4" />
          <span>Header Navigation Links (Specified Order)</span>
        </h3>

        <div className="space-y-3">
          {navItems.map((item, idx) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-wrap sm:flex-nowrap items-center gap-3"
            >
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveNavItem(idx, 'up')}
                  className="p-1 text-gray-500 hover:text-white disabled:opacity-30"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={idx === navItems.length - 1}
                  onClick={() => moveNavItem(idx, 'down')}
                  className="p-1 text-gray-500 hover:text-white disabled:opacity-30"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="w-44">
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updateNavItem(item.id, 'label', e.target.value)}
                  className="w-full bg-[#07090f] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                  placeholder="Label"
                />
              </div>

              <div className="flex-1 min-w-[160px]">
                <input
                  type="text"
                  value={item.href}
                  onChange={(e) => updateNavItem(item.id, 'href', e.target.value)}
                  className="w-full bg-[#07090f] border border-white/10 rounded-lg px-3 py-1.5 text-xs font-mono text-cyan-400"
                  placeholder="#section"
                />
              </div>

              <button
                type="button"
                onClick={() => toggleNavVisibility(item.id)}
                className={`p-2 rounded-lg ${
                  item.is_visible ? 'text-emerald-400' : 'text-gray-500'
                }`}
                title={item.is_visible ? 'Visible' : 'Hidden'}
              >
                {item.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>Social Media Accounts</span>
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddSocial}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Social Link
          </Button>
        </div>

        <div className="space-y-3">
          {socialLinks.map((soc) => (
            <div
              key={soc.id}
              className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-wrap sm:flex-nowrap items-center gap-3"
            >
              <div className="w-36">
                <select
                  value={soc.icon}
                  onChange={(e) => updateSocialLink(soc.id, 'icon', e.target.value)}
                  className="w-full bg-[#07090f] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white"
                >
                  <option value="Github">GitHub</option>
                  <option value="Linkedin">LinkedIn</option>
                  <option value="Twitter">Twitter / X</option>
                  <option value="Mail">Email</option>
                  <option value="Globe">Website</option>
                </select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <input
                  type="text"
                  value={soc.url}
                  onChange={(e) => updateSocialLink(soc.id, 'url', e.target.value)}
                  className="w-full bg-[#07090f] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-200"
                  placeholder="https://..."
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemoveSocial(soc.id)}
                className="p-2 rounded-lg text-gray-500 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
