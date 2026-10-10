'use client';

import React, { useState } from 'react';
import {
  Palette,
  RotateCcw,
  Check,
  Save,
  Sparkles,
  Sliders,
  Layers,
  Copy,
  ExternalLink,
  Laptop,
  CheckCircle2,
  Brush,
} from 'lucide-react';
import { useTheme } from '../../../lib/theme/ThemeProvider';
import { DEFAULT_THEME_SETTINGS } from '../../../lib/db/defaults';
import { updateThemeSettings } from '../../../lib/db/store';
import { Button } from '../../../components/ui/Button';
import { ColorPickerPopup } from '../../../components/admin/ColorPickerPopup';
import {
  ThemePresetsModal,
  ThemePreset,
  CURATED_THEME_PRESETS,
} from '../../../components/admin/ThemePresetsModal';

const QUICK_BACKGROUND_SWATCHES = [
  { name: 'Obsidian Void', hex: '#07090f' },
  { name: 'Pure Deep Void', hex: '#030508' },
  { name: 'Matrix Abyss', hex: '#05130d' },
  { name: 'Cosmic Violet', hex: '#0c0717' },
  { name: 'Ocean Navy', hex: '#040d1a' },
  { name: 'Cyber Slate', hex: '#0d1120' },
  { name: 'Space Black', hex: '#000000' },
  { name: 'Studio Dark', hex: '#121212' },
];

const QUICK_CARD_SWATCHES = [
  { name: 'Charcoal Dark', hex: '#111827' },
  { name: 'Midnight Slate', hex: '#0f172a' },
  { name: 'Deep Emerald', hex: '#0c281e' },
  { name: 'Cosmic Plum', hex: '#1b1233' },
  { name: 'Ocean Sapphire', hex: '#0c213d' },
  { name: 'Deep Zinc', hex: '#18181b' },
  { name: 'Night Glass', hex: '#0d1424' },
];

const QUICK_ACCENT_SWATCHES = [
  { name: 'Electric Cyan', hex: '#00c8ff' },
  { name: 'Sky Blue', hex: '#38bdf8' },
  { name: 'Royal Blue', hex: '#3b82f6' },
  { name: 'Matrix Emerald', hex: '#10b981' },
  { name: 'Cosmic Violet', hex: '#8b5cf6' },
  { name: 'Purple Neon', hex: '#a855f7' },
  { name: 'Sunset Amber', hex: '#f59e0b' },
  { name: 'Ruby Crimson', hex: '#ef4444' },
];

export default function AdminThemePage() {
  const { theme, previewTheme, resetPreview, refreshTheme, isLivePreview } = useTheme();

  const [formTheme, setFormTheme] = useState({ ...theme });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [copiedCss, setCopiedCss] = useState(false);

  // Keep formTheme synchronized whenever the persisted theme is loaded
  React.useEffect(() => {
    if (!isLivePreview) {
      setFormTheme(theme);
    }
  }, [theme, isLivePreview]);

  const handleColorChange = (key: string, val: any) => {
    const next = { ...formTheme, [key]: val };
    setFormTheme(next);
    previewTheme(next);
  };

  const handleApplyPreset = async (preset: ThemePreset) => {
    const computedGlow =
      preset.theme.accent_glow ||
      `color-mix(in srgb, ${preset.theme.primary_color || formTheme.primary_color} 38%, transparent)`;
    const next = { ...formTheme, ...preset.theme, accent_glow: computedGlow };
    setFormTheme(next);
    previewTheme(next);
    try {
      await updateThemeSettings(next);
      await refreshTheme();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error('Failed to auto-save preset', e);
    }
  };

  const handleResetDefaults = () => {
    setFormTheme(DEFAULT_THEME_SETTINGS);
    previewTheme(DEFAULT_THEME_SETTINGS);
  };

  const handleRevertUnsaved = () => {
    resetPreview();
    setFormTheme({ ...theme });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await updateThemeSettings(formTheme);
      await refreshTheme();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const copyCssTokens = () => {
    const cssText = `:root {
  --bg: ${formTheme.bg_color};
  --bg-card: ${formTheme.card_bg};
  --accent: ${formTheme.primary_color};
  --accent-2: ${formTheme.secondary_color};
  --accent-3: ${formTheme.accent_color};
  --gradient-start: ${formTheme.gradient_start};
  --gradient-middle: ${formTheme.gradient_middle};
  --gradient-end: ${formTheme.gradient_end};
  --radius: ${formTheme.border_radius};
}`;
    navigator.clipboard.writeText(cssText);
    setCopiedCss(true);
    setTimeout(() => setCopiedCss(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl pb-16">
      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/90 via-[#0d1322] to-slate-950 border border-white/10 p-6 sm:p-8 shadow-2xl">
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: formTheme.primary_color }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-xs font-semibold text-cyan-300">
              <Brush className="w-3.5 h-3.5 text-cyan-400" />
              <span>Theme Studio & Design System</span>
              {isLivePreview && (
                <span className="flex items-center gap-1 text-[10px] bg-cyan-400 text-slate-950 font-bold px-1.5 py-0.2 rounded-full">
                  LIVE
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Visual Atmosphere & Color Engine
            </h1>
            <p className="text-sm text-gray-400 max-w-2xl leading-relaxed">
              Dynamically calibrate your site-wide page background, card surfaces, brand accents, and typography. Every adjustment updates the live canvas in real-time.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/15 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              <span>View Live Site</span>
            </a>

            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsPresetsOpen(true)}
              leftIcon={<Sparkles className="w-4 h-4 text-cyan-400" />}
              className="border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/15 shadow-[0_0_20px_rgba(0,200,255,0.15)] bg-cyan-950/20"
            >
              Preset Gallery (10)
            </Button>

            {isLivePreview && (
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={handleRevertUnsaved}
                leftIcon={<RotateCcw className="w-4 h-4" />}
                className="border-white/15 text-gray-300 hover:bg-white/10"
              >
                Revert
              </Button>
            )}

            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={handleResetDefaults}
              className="text-gray-400 hover:text-white"
            >
              Reset Defaults
            </Button>

            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleSave}
              isLoading={saving}
              leftIcon={saved ? <CheckCircle2 className="w-4 h-4 text-slate-950" /> : <Save className="w-4 h-4" />}
              className="shadow-[0_0_25px_rgba(0,200,255,0.35)] px-6"
            >
              {saved ? 'Saved Successfully!' : 'Save Theme'}
            </Button>
          </div>
        </div>

        {/* 1-Click Fast Presets Strip */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>One-Click Full Theme Styles (10 Curated Palettes)</span>
            </span>
            <span className="text-[11px] text-gray-400">Click any preset to transform the atmosphere</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
            {CURATED_THEME_PRESETS.map((p) => {
              const isSelected =
                (formTheme.primary_color || '').toLowerCase() === (p.theme.primary_color || '').toLowerCase() &&
                (formTheme.bg_color || '').toLowerCase() === (p.theme.bg_color || '').toLowerCase();

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between group ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-500/15 ring-2 ring-cyan-400/40 shadow-[0_0_20px_rgba(0,200,255,0.25)]'
                      : 'border-white/10 bg-slate-900/60 hover:border-white/30 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    {/* Background Swatch Dot */}
                    <div
                      className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: p.theme.bg_color }}
                      title={`Background: ${p.theme.bg_color}`}
                    />
                    {/* Primary Accent Swatch Dot */}
                    <div
                      className="w-4 h-4 rounded-full border border-white/30 shadow-sm -ml-2"
                      style={{ backgroundColor: p.theme.primary_color }}
                      title={`Accent: ${p.theme.primary_color}`}
                    />
                    {/* Gradient Start Swatch Dot */}
                    <div
                      className="w-3 h-3 rounded-full border border-white/20 shadow-sm -ml-1.5 opacity-80"
                      style={{ backgroundColor: p.theme.gradient_end }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-white truncate block group-hover:text-cyan-300 transition-colors">
                    {p.name.split(' (')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Left Customizer Controls, Right Realistic Mini-Portfolio Window */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column (7 Columns) */}
        <div className="lg:col-span-7 space-y-7">
          {/* SECTION 1: Canvas & Surfaces (Backgrounds) */}
          <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Canvas & Surfaces (Backgrounds)
                  </h2>
                  <p className="text-xs text-gray-400">
                    Controls the global backdrop tone and card elevation surfaces.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ColorPickerPopup
                label="Page Background"
                description="Entire website backdrop canvas tone"
                value={formTheme.bg_color}
                onChange={(hex) => handleColorChange('bg_color', hex)}
                quickSwatches={QUICK_BACKGROUND_SWATCHES}
              />

              <ColorPickerPopup
                label="Card & Container Surface"
                description="Elevated project cards, modals & panels"
                value={formTheme.card_bg}
                onChange={(hex) => handleColorChange('card_bg', hex)}
                quickSwatches={QUICK_CARD_SWATCHES}
              />
            </div>

            {/* Corner Radius Controls */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <label className="block text-xs font-bold text-white">
                    Component Corner Radius
                  </label>
                  <span className="text-[11px] text-gray-400">
                    Determines card, button, and image softness
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20">
                  {formTheme.border_radius}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                {[
                  { label: 'Crisp', value: '8px' },
                  { label: 'Modern', value: '12px' },
                  { label: 'Cyber', value: '16px' },
                  { label: 'Soft', value: '24px' },
                ].map((r) => {
                  const isSelected = formTheme.border_radius === r.value;
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => handleColorChange('border_radius', r.value)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                        isSelected
                          ? 'border-cyan-400 bg-cyan-500/20 text-white font-bold ring-1 ring-cyan-400'
                          : 'border-white/10 bg-slate-950/60 text-gray-400 hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <div
                        className="w-5 h-5 border-2 border-current opacity-70"
                        style={{ borderRadius: r.value }}
                      />
                      <span className="text-xs">{r.label}</span>
                      <span className="text-[10px] font-mono text-gray-500">{r.value}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SECTION 2: Brand & Accents */}
          <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Brand Accents & Highlights
                  </h2>
                  <p className="text-xs text-gray-400">
                    Action buttons, glow halos, badges, and focus rings.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ColorPickerPopup
                label="Primary Accent"
                description="CTA buttons, main glowing halos"
                value={formTheme.primary_color}
                onChange={(hex) => handleColorChange('primary_color', hex)}
                quickSwatches={QUICK_ACCENT_SWATCHES}
              />

              <ColorPickerPopup
                label="Secondary Accent"
                description="Status badges, secondary button hover"
                value={formTheme.secondary_color}
                onChange={(hex) => handleColorChange('secondary_color', hex)}
              />

              <ColorPickerPopup
                label="Tertiary Accent"
                description="Violet halos & secondary gradients"
                value={formTheme.accent_color}
                onChange={(hex) => handleColorChange('accent_color', hex)}
              />
            </div>
          </div>

          {/* SECTION 3: Headline Gradient Stops */}
          <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Headline Gradient Flow
                  </h2>
                  <p className="text-xs text-gray-400">
                    Powers the high-impact title typography on your landing page.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ColorPickerPopup
                label="Gradient Start"
                description="Left origin stop"
                value={formTheme.gradient_start}
                onChange={(hex) => handleColorChange('gradient_start', hex)}
              />

              <ColorPickerPopup
                label="Gradient Middle"
                description="Center transition"
                value={formTheme.gradient_middle}
                onChange={(hex) => handleColorChange('gradient_middle', hex)}
              />

              <ColorPickerPopup
                label="Gradient End"
                description="Right termination"
                value={formTheme.gradient_end}
                onChange={(hex) => handleColorChange('gradient_end', hex)}
              />
            </div>

            {/* Live Interactive Gradient Ribbon */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-400">
                <span>Active 3-Stop Gradient Ribbon</span>
                <span className="font-mono text-[11px] text-cyan-400">135deg Angle</span>
              </div>
              <div
                className="h-4 rounded-full shadow-lg border border-white/20 transition-all duration-300"
                style={{
                  background: `linear-gradient(90deg, ${formTheme.gradient_start} 0%, ${formTheme.gradient_middle} 50%, ${formTheme.gradient_end} 100%)`,
                }}
              />
              <div className="pt-2 text-center">
                <span
                  className="text-2xl sm:text-3xl font-black tracking-tight transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${formTheme.gradient_start} 0%, ${formTheme.gradient_middle} 50%, ${formTheme.gradient_end} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Software Engineer & AI Builder
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 4: Grid & Atmospheric Lighting */}
          <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/80 border border-white/10 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                    Atmospheric Grid & Glow Lighting
                  </h2>
                  <p className="text-xs text-gray-400">
                    Adjust background cyber grid density and glowing orb illumination.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Cyber Grid Opacity</span>
                  <span className="font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                    {Math.round(formTheme.grid_opacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.4"
                  step="0.02"
                  value={formTheme.grid_opacity}
                  onChange={(e) => handleColorChange('grid_opacity', parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <span className="text-[11px] text-gray-500 block">
                  Controls the background blueprint matrix lines
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-white">
                  <span>Glow Halos Intensity</span>
                  <span className="font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                    {Math.round(formTheme.glow_intensity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={formTheme.glow_intensity}
                  onChange={(e) => handleColorChange('glow_intensity', parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <span className="text-[11px] text-gray-500 block">
                  Controls luminous radial light behind titles and cards
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Device Showcase Column (5 Columns) */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          <div className="p-5 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Live Mini-Portfolio Mockup
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Responsive Sync</span>
              </span>
            </div>

            {/* Realistic macOS Browser Window Mockup */}
            <div className="rounded-2xl border border-white/15 overflow-hidden shadow-2xl">
              {/* Window Bar */}
              <div className="bg-slate-950/95 px-3 py-2.5 border-b border-white/10 flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex-1 mx-2">
                  <div className="bg-white/5 border border-white/10 rounded-md px-2.5 py-1 text-[10px] text-gray-400 font-mono text-center truncate">
                    martinsportfolio.dev
                  </div>
                </div>
              </div>

              {/* Window Content: Styled dynamically with the chosen background! */}
              <div
                className="p-5 transition-colors duration-300 relative overflow-hidden min-h-[380px] flex flex-col justify-between"
                style={{
                  backgroundColor: formTheme.bg_color,
                }}
              >
                {/* Background Cyber Grid */}
                <div
                  className="absolute inset-0 pointer-events-none cyber-grid"
                  style={{
                    opacity: formTheme.grid_opacity,
                  }}
                />

                {/* Glowing Orb */}
                <div
                  className="glow-orb w-60 h-60 -top-20 -right-20"
                  style={{
                    backgroundColor: formTheme.primary_color,
                    opacity: formTheme.glow_intensity * 0.4,
                  }}
                />

                {/* Mini Navbar */}
                <div className="relative z-10 flex items-center justify-between pb-4 border-b border-white/10">
                  <span className="text-xs font-black text-white tracking-wider flex items-center">
                    MW<span style={{ color: formTheme.primary_color }}>.</span>
                  </span>
                  <div className="flex items-center gap-3 text-[10px] text-gray-400 font-medium">
                    <span className="text-white">About</span>
                    <span>Projects</span>
                    <span>Skills</span>
                    <span
                      className="px-2 py-0.5 rounded-full border text-[9px] font-bold"
                      style={{
                        borderColor: `${formTheme.primary_color}60`,
                        color: formTheme.primary_color,
                        backgroundColor: `${formTheme.primary_color}15`,
                      }}
                    >
                      Contact
                    </span>
                  </div>
                </div>

                {/* Mini Hero Area */}
                <div className="relative z-10 my-4 space-y-3">
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border"
                    style={{
                      borderColor: `${formTheme.primary_color}40`,
                      backgroundColor: `${formTheme.primary_color}15`,
                      color: formTheme.primary_color,
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Available for Projects</span>
                  </div>

                  <h4
                    className="text-lg font-black tracking-tight leading-tight transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${formTheme.gradient_start} 0%, ${formTheme.gradient_middle} 50%, ${formTheme.gradient_end} 100%)`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Engineering High-Performance Web & AI Platforms
                  </h4>

                  <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">
                    Founder of Systemize EG and full-stack software engineer crafting bespoke modern digital experiences.
                  </p>

                  {/* Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-full text-[11px] font-bold shadow-md transition-all flex items-center gap-1"
                      style={{
                        background: `linear-gradient(135deg, ${formTheme.primary_color} 0%, ${formTheme.secondary_color} 100%)`,
                        color: '#07090f',
                        boxShadow: `0 0 15px ${formTheme.primary_color}60`,
                      }}
                    >
                      <span>Explore Work</span>
                      <span>→</span>
                    </button>

                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-full text-[11px] font-medium border border-white/15 bg-white/5 text-gray-200"
                    >
                      Resume
                    </button>
                  </div>
                </div>

                {/* Mini Project Card */}
                <div
                  className="relative z-10 p-3.5 border transition-all shadow-lg"
                  style={{
                    backgroundColor: formTheme.card_bg,
                    borderRadius: formTheme.border_radius,
                    borderColor: `${formTheme.primary_color}30`,
                  }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-white flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: formTheme.primary_color }}
                      />
                      Enterprise AI Platform
                    </span>
                    <span
                      className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: `${formTheme.primary_color}20`,
                        color: formTheme.primary_color,
                      }}
                    >
                      Featured
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 line-clamp-1 mb-2">
                    Scalable microservices architecture with real-time vector embeddings.
                  </p>
                  <div className="flex items-center justify-between text-[9px] text-gray-400 pt-1 border-t border-white/5">
                    <span>Next.js • PyTorch • Postgres</span>
                    <span
                      className="font-semibold flex items-center gap-0.5"
                      style={{ color: formTheme.primary_color }}
                    >
                      <span>Case Study</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* CSS Tokens Inspector */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Exported CSS Variables
                </span>
                <button
                  type="button"
                  onClick={copyCssTokens}
                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  {copiedCss ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy CSS</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-gray-500 block text-[9px]">--bg</span>
                  <span className="text-white font-semibold">{formTheme.bg_color}</span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-gray-500 block text-[9px]">--bg-card</span>
                  <span className="text-white font-semibold">{formTheme.card_bg}</span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-gray-500 block text-[9px]">--accent</span>
                  <span className="text-cyan-400 font-semibold">{formTheme.primary_color}</span>
                </div>
                <div className="p-2 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-gray-500 block text-[9px]">--radius</span>
                  <span className="text-purple-400 font-semibold">{formTheme.border_radius}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Presets Popup Modal */}
      <ThemePresetsModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={handleApplyPreset}
        currentPrimaryColor={formTheme.primary_color}
      />
    </div>
  );
}
