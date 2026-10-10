'use client';

import React, { useState, useEffect } from 'react';
import { Save, Check, Plus, Trash2, User, Image as ImageIcon } from 'lucide-react';
import { getPageSections, updatePageSection } from '../../../lib/db/store';
import { PageSectionConfig } from '../../../lib/db/types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { ImageUploadField } from '../../../components/admin/ImageUploadField';

export default function AdminAboutPage() {
  const [section, setSection] = useState<PageSectionConfig | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const sections = await getPageSections();
      const target = sections.find((s) => s.section_key === 'about');
      if (target) setSection(target);
    }
    load();
  }, []);

  if (!section) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  const cfg = section.config || {};
  const paragraphs = (cfg.bio_paragraphs as string[]) || [
    'Software engineer and tech founder building scalable web systems and AI applications.',
  ];
  const tags = (cfg.tags as string[]) || ['#SoftwareEngineering', '#FullStack', '#AI'];
  const metaInfo = (cfg.meta_info as Array<{ icon: string; label: string; value: string }>) || [];

  const handleParagraphChange = (index: number, val: string) => {
    const next = [...paragraphs];
    next[index] = val;
    setSection({ ...section, config: { ...cfg, bio_paragraphs: next } });
  };

  const handleAddParagraph = () => {
    setSection({ ...section, config: { ...cfg, bio_paragraphs: [...paragraphs, 'New paragraph...'] } });
  };

  const handleRemoveParagraph = (index: number) => {
    setSection({ ...section, config: { ...cfg, bio_paragraphs: paragraphs.filter((_, i) => i !== index) } });
  };

  const handleTagChange = (index: number, val: string) => {
    const next = [...tags];
    next[index] = val;
    setSection({ ...section, config: { ...cfg, tags: next } });
  };

  const handleAddTag = () => {
    setSection({ ...section, config: { ...cfg, tags: [...tags, '#NewTag'] } });
  };

  const handleRemoveTag = (index: number) => {
    setSection({ ...section, config: { ...cfg, tags: tags.filter((_, i) => i !== index) } });
  };

  const handleMetaChange = (index: number, field: string, val: string) => {
    const next = [...metaInfo];
    next[index] = { ...next[index], [field]: val };
    setSection({ ...section, config: { ...cfg, meta_info: next } });
  };

  const handleAddMeta = () => {
    setSection({
      ...section,
      config: {
        ...cfg,
        meta_info: [...metaInfo, { icon: 'Code', label: 'Field Label', value: 'New Value' }],
      },
    });
  };

  const handleRemoveMeta = (index: number) => {
    setSection({ ...section, config: { ...cfg, meta_info: metaInfo.filter((_, i) => i !== index) } });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      await updatePageSection('about', section);
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
          <h2 className="text-xl font-bold text-white tracking-tight">About Section Management</h2>
          <p className="text-xs text-gray-400 mt-1">
            Manage your biography, tags, profile picture, and personal metadata card.
          </p>
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

      {/* Heading & Eyebrow */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400">
          Section Headings
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Section Eyebrow Badge"
            value={section.badge_text || ''}
            onChange={(e) => setSection({ ...section, badge_text: e.target.value })}
            placeholder="About Me"
          />
          <Input
            label="Main Heading"
            value={section.title || ''}
            onChange={(e) => setSection({ ...section, title: e.target.value })}
            placeholder="Engineering resilient, scalable digital systems."
          />
        </div>
        <Input
          label="Highlighted Subtitle (Gradient text)"
          value={section.subtitle || ''}
          onChange={(e) => setSection({ ...section, subtitle: e.target.value })}
          placeholder="delivers real value."
        />
      </div>

      {/* Profile Photo / Avatar */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400">
          Profile Photo / Avatar
        </h3>
        <ImageUploadField
          label="About Section Portrait"
          value={cfg.avatar_url || ''}
          onChange={(url) => setSection({ ...section, config: { ...cfg, avatar_url: url } })}
          helperText="Upload your portrait photograph or avatar displayed in the About Me section."
        />
      </div>

      {/* Biography Paragraphs */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400">
            Biography Paragraphs
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddParagraph}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Paragraph
          </Button>
        </div>

        {paragraphs.map((p, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="flex-1">
              <Textarea
                rows={3}
                value={p}
                onChange={(e) => handleParagraphChange(i, e.target.value)}
                placeholder="Write your biography paragraph..."
              />
            </div>
            {paragraphs.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveParagraph(i)}
                className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 mt-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Avatar & Photo */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          <span>Profile Photo & Avatar</span>
        </h3>
        <Input
          label="Avatar Image URL"
          value={cfg.avatar_url || ''}
          onChange={(e) =>
            setSection({
              ...section,
              config: { ...cfg, avatar_url: e.target.value },
            })
          }
          placeholder="https://.../photo.png or leave empty for Empty Image Placeholder"
          helperText="Leave empty to display the cyber empty avatar placeholder."
        />
      </div>

      {/* Personal Information Metadata Rows */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400 flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Personal Profile Metadata</span>
            </h3>
            <p className="text-xs text-gray-400">
              Each row displays with an icon on your public profile card.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddMeta}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Row
          </Button>
        </div>

        <div className="space-y-3">
          {metaInfo.map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-wrap sm:flex-nowrap gap-3 items-end">
              <div className="w-28 shrink-0">
                <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">
                  Icon
                </label>
                <select
                  value={item.icon}
                  onChange={(e) => handleMetaChange(i, 'icon', e.target.value)}
                  className="w-full bg-[#07090f] border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-200"
                >
                  <option value="MapPin">MapPin</option>
                  <option value="GraduationCap">GraduationCap</option>
                  <option value="Briefcase">Briefcase</option>
                  <option value="Code">Code</option>
                  <option value="Globe">Globe</option>
                </select>
              </div>

              <div className="w-44 shrink-0">
                <Input
                  label="Label"
                  value={item.label}
                  onChange={(e) => handleMetaChange(i, 'label', e.target.value)}
                  placeholder="e.g. Location"
                />
              </div>

              <div className="flex-1 min-w-[200px]">
                <Input
                  label="Value"
                  value={item.value}
                  onChange={(e) => handleMetaChange(i, 'value', e.target.value)}
                  placeholder="e.g. Cairo, Egypt or B.Sc. in Computer Science"
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemoveMeta(i)}
                className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 mb-0.5"
                title="Delete Row"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400">
            Professional Tags & Badges
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddTag}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Tag
          </Button>
        </div>

        <div className="flex flex-wrap gap-3">
          {tags.map((t, i) => (
            <div key={i} className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-xl">
              <input
                type="text"
                value={t}
                onChange={(e) => handleTagChange(i, e.target.value)}
                className="bg-transparent border-none px-2 py-1 text-xs text-cyan-300 focus:outline-none w-36"
                placeholder="#SoftwareEngineering"
              />
              <button
                type="button"
                onClick={() => handleRemoveTag(i)}
                className="p-1 text-gray-500 hover:text-red-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
