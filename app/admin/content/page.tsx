'use client';

import React, { useState, useEffect } from 'react';
import { Save, Check, FileText, Sparkles } from 'lucide-react';
import { getPageSections, updatePageSection, getSiteSettings, updateSiteSettings } from '../../../lib/db/store';
import { PageSectionConfig, SiteSettings } from '../../../lib/db/types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Switch } from '../../../components/ui/Switch';

export default function AdminContentPage() {
  const [heroSection, setHeroSection] = useState<PageSectionConfig | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const [sections, settings] = await Promise.all([getPageSections(), getSiteSettings()]);
      const hero = sections.find((s) => s.section_key === 'hero');
      if (hero) setHeroSection(hero);
      setSiteSettings(settings);
    }
    load();
  }, []);

  if (!heroSection || !siteSettings) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  const cfg = heroSection.config || {};
  const stats = (cfg.stats as Array<{ num: string; label: string }>) || [
    { num: '9+', label: 'Projects Built' },
    { num: '12+', label: 'Certifications' },
    { num: '2+', label: 'Tech Ventures' },
  ];

  const handleStatChange = (index: number, field: 'num' | 'label', value: string) => {
    const nextStats = [...stats];
    nextStats[index] = { ...nextStats[index], [field]: value };
    setHeroSection({
      ...heroSection,
      config: { ...cfg, stats: nextStats },
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      await Promise.all([
        updatePageSection('hero', heroSection),
        updateSiteSettings(siteSettings),
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
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Hero Section & Content</h2>
          <p className="text-xs text-gray-400 mt-1">Configure your main hero headline, role, bio, and call-to-actions.</p>
        </div>

        <Button
          type="submit"
          variant="primary"
          isLoading={saving}
          leftIcon={saved ? <Check className="w-4 h-4 text-emerald-950" /> : <Save className="w-4 h-4" />}
        >
          {saved ? 'Saved Changes' : 'Save Changes'}
        </Button>
      </div>

      {/* Hero Headings */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>Headline & Identity</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name / Primary Heading"
            value={cfg.first_name || ''}
            onChange={(e) =>
              setHeroSection({
                ...heroSection,
                config: { ...cfg, first_name: e.target.value },
              })
            }
            placeholder="Martin"
          />
          <Input
            label="Highlighted Word(s) (Gradient Effect)"
            value={cfg.highlighted_name || ''}
            onChange={(e) =>
              setHeroSection({
                ...heroSection,
                config: { ...cfg, highlighted_name: e.target.value },
              })
            }
            placeholder="Wassim"
          />
        </div>

        <Input
          label="Professional Role / Subtitle"
          value={heroSection.subtitle || ''}
          onChange={(e) => setHeroSection({ ...heroSection, subtitle: e.target.value })}
          placeholder="Software Engineer • AI / ML Engineer • Founder"
        />

        <Input
          label="Availability Status Badge (Eyebrow)"
          value={heroSection.badge_text || ''}
          onChange={(e) => setHeroSection({ ...heroSection, badge_text: e.target.value })}
          placeholder="Available for Opportunities"
        />

        <Textarea
          label="Hero Summary / Introduction"
          rows={4}
          value={cfg.summary || ''}
          onChange={(e) =>
            setHeroSection({
              ...heroSection,
              config: { ...cfg, summary: e.target.value },
            })
          }
          placeholder="Architecting high-performance web systems, AI applications, and robust digital solutions."
        />
      </div>

      {/* Call to Actions & CV */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span>Call to Action Buttons</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Primary CTA Label"
            value={cfg.cta_primary_label || ''}
            onChange={(e) =>
              setHeroSection({
                ...heroSection,
                config: { ...cfg, cta_primary_label: e.target.value },
              })
            }
            placeholder="Download CV"
          />
          <Input
            label="CV Download File URL (PDF or Doc)"
            value={siteSettings.cv_file_url || ''}
            onChange={(e) => setSiteSettings({ ...siteSettings, cv_file_url: e.target.value })}
            placeholder="https://.../cv.pdf or select from Media Library"
            helperText="Leave empty to use default contact destination."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Secondary CTA Label"
            value={cfg.cta_secondary_label || ''}
            onChange={(e) =>
              setHeroSection({
                ...heroSection,
                config: { ...cfg, cta_secondary_label: e.target.value },
              })
            }
            placeholder="Get in Touch"
          />
          <Input
            label="Secondary CTA Target Link"
            value={cfg.cta_secondary_url || ''}
            onChange={(e) =>
              setHeroSection({
                ...heroSection,
                config: { ...cfg, cta_secondary_url: e.target.value },
              })
            }
            placeholder="#contact"
          />
        </div>
      </div>

      {/* Hero Statistics Counters */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400">
          Statistics Counters (Leave 0 to hide automatically)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
              <Input
                label={`Stat #${i + 1} Number`}
                value={stat.num}
                onChange={(e) => handleStatChange(i, 'num', e.target.value)}
                placeholder="0"
              />
              <Input
                label={`Stat #${i + 1} Label`}
                value={stat.label}
                onChange={(e) => handleStatChange(i, 'label', e.target.value)}
                placeholder="e.g. Projects Built"
              />
            </div>
          ))}
        </div>

        <div className="pt-2">
          <Switch
            checked={cfg.show_scroll_indicator !== false}
            onChange={(val) =>
              setHeroSection({
                ...heroSection,
                config: { ...cfg, show_scroll_indicator: val },
              })
            }
            label="Show Scroll Indicator"
            description="Displays the animated scroll mouse indicator on large screens."
          />
        </div>
      </div>
    </form>
  );
}
