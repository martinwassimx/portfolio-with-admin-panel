'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Save,
  Check,
  RotateCcw,
} from 'lucide-react';
import { getPageSections, updatePageSection, reorderPageSections } from '../../../lib/db/store';
import { PageSectionConfig } from '../../../lib/db/types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<PageSectionConfig[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getPageSections();
      setSections([...data].sort((a, b) => a.sort_order - b.sort_order));
    }
    load();
  }, []);

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === sections.length - 1)
    )
      return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...sections];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);

    // Update sort_order
    const updated = reordered.map((sec, i) => ({ ...sec, sort_order: i + 1 }));
    setSections(updated);
  };

  const toggleVisibility = (id: string) => {
    setSections(
      sections.map((s) => (s.id === id ? { ...s, is_visible: !s.is_visible } : s))
    );
  };

  const updateSectionField = (id: string, field: keyof PageSectionConfig, value: any) => {
    setSections(
      sections.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const keysInOrder = sections.map((s) => s.section_key);
      await reorderPageSections(keysInOrder);
      for (const s of sections) {
        await updatePageSection(s.section_key, s);
      }
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
          <h2 className="text-xl font-bold text-white tracking-tight">Layout & Sections Manager</h2>
          <p className="text-xs text-gray-400 mt-1">
            Toggle visibility, adjust display order, and configure individual section headings.
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
          {saved ? 'Saved Layout' : 'Save Section Order'}
        </Button>
      </div>

      <div className="space-y-4">
        {sections.map((sec, idx) => (
          <div
            key={sec.id}
            className={`p-5 rounded-2xl border transition-all ${
              sec.is_visible
                ? 'bg-[#0f172a] border-white/10'
                : 'bg-white/[0.02] border-white/5 opacity-60'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-bold flex items-center justify-center">
                  #{idx + 1}
                </span>
                <div>
                  <h3 className="text-base font-bold text-white">{sec.name} Section</h3>
                  <span className="text-[11px] font-mono text-cyan-400">/#{sec.section_key}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveSection(idx, 'up')}
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none"
                  title="Move Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={idx === sections.length - 1}
                  onClick={() => moveSection(idx, 'down')}
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => toggleVisibility(sec.id)}
                  className={`p-2 rounded-xl transition-colors ${
                    sec.is_visible
                      ? 'text-emerald-400 hover:bg-emerald-500/10'
                      : 'text-gray-500 hover:bg-white/10'
                  }`}
                  title={sec.is_visible ? 'Hide section from public site' : 'Show section'}
                >
                  {sec.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <Input
                label="Eyebrow Badge"
                value={sec.badge_text || ''}
                onChange={(e) => updateSectionField(sec.id, 'badge_text', e.target.value)}
                placeholder="Badge text"
              />
              <Input
                label="Section Title"
                value={sec.title || ''}
                onChange={(e) => updateSectionField(sec.id, 'title', e.target.value)}
                placeholder="Title"
              />
              <Input
                label="Section Subtitle"
                value={sec.subtitle || ''}
                onChange={(e) => updateSectionField(sec.id, 'subtitle', e.target.value)}
                placeholder="Subtitle"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
