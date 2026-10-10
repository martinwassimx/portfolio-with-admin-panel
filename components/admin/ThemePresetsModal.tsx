'use client';

import React from 'react';
import { Sparkles, Check } from 'lucide-react';
import { Dialog } from '../ui/Dialog';
import { ThemeSettings } from '../../lib/db/types';

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  theme: Partial<ThemeSettings>;
}

export const CURATED_THEME_PRESETS: ThemePreset[] = [
  {
    id: 'cyber-cyan',
    name: 'Cyber Neon (Cyan & Blue)',
    description: 'Electric tech aesthetic with neon cyan and electric blue glows.',
    theme: {
      primary_color: '#00c8ff',
      secondary_color: '#3b82f6',
      accent_color: '#8b5cf6',
      gradient_start: '#00c8ff',
      gradient_middle: '#38bdf8',
      gradient_end: '#818cf8',
      bg_color: '#07090f',
      bg_secondary: '#0d1120',
      card_bg: '#111827',
    },
  },
  {
    id: 'emerald-matrix',
    name: 'Emerald Matrix',
    description: 'Futuristic AI green and deep matrix teal palette.',
    theme: {
      primary_color: '#10b981',
      secondary_color: '#14b8a6',
      accent_color: '#84cc16',
      gradient_start: '#34d399',
      gradient_middle: '#10b981',
      gradient_end: '#14b8a6',
      bg_color: '#05130d',
      bg_secondary: '#071f16',
      card_bg: '#0c281e',
    },
  },
  {
    id: 'cosmic-violet',
    name: 'Cosmic Violet & Fuchsia',
    description: 'Vibrant neon purple with fuchsia and magenta highlights.',
    theme: {
      primary_color: '#a855f7',
      secondary_color: '#8b5cf6',
      accent_color: '#ec4899',
      gradient_start: '#c084fc',
      gradient_middle: '#a855f7',
      gradient_end: '#ec4899',
      bg_color: '#0d0618',
      bg_secondary: '#150a26',
      card_bg: '#1c0f33',
    },
  },
  {
    id: 'solar-flare',
    name: 'Solar Flare & Amber',
    description: 'Warm, high-energy cyber gold and sunset amber flames.',
    theme: {
      primary_color: '#f59e0b',
      secondary_color: '#f97316',
      accent_color: '#ef4444',
      gradient_start: '#fde047',
      gradient_middle: '#f59e0b',
      gradient_end: '#f43f5e',
      bg_color: '#130c03',
      bg_secondary: '#1f1305',
      card_bg: '#2b1907',
    },
  },
  {
    id: 'crimson-cyber',
    name: 'Crimson Cyber & Ruby',
    description: 'Bold red alert aesthetic with neon ruby and coral accents.',
    theme: {
      primary_color: '#ef4444',
      secondary_color: '#f43f5e',
      accent_color: '#fb7185',
      gradient_start: '#f87171',
      gradient_middle: '#ef4444',
      gradient_end: '#fb7185',
      bg_color: '#150507',
      bg_secondary: '#22080c',
      card_bg: '#2e0c12',
    },
  },
  {
    id: 'ocean-sapphire',
    name: 'Ocean Sapphire',
    description: 'Deep royal blue with oceanic cyan and azure brilliance.',
    theme: {
      primary_color: '#0099ff',
      secondary_color: '#0284c7',
      accent_color: '#06b6d4',
      gradient_start: '#38bdf8',
      gradient_middle: '#0099ff',
      gradient_end: '#3b82f6',
      bg_color: '#030c18',
      bg_secondary: '#06162a',
      card_bg: '#0a1d35',
    },
  },
  {
    id: 'aurora-borealis',
    name: 'Aurora Borealis',
    description: 'Magical northern lights blending teal, violet, and electric rose.',
    theme: {
      primary_color: '#2dd4bf',
      secondary_color: '#818cf8',
      accent_color: '#f43f5e',
      gradient_start: '#2dd4bf',
      gradient_middle: '#06b6d4',
      gradient_end: '#a855f7',
      bg_color: '#041014',
      bg_secondary: '#071e25',
      card_bg: '#0b2a33',
    },
  },
  {
    id: 'rose-quartz',
    name: 'Rose Quartz & Bubblegum',
    description: 'Neon magenta, pastel rose, and soft cyberpunk glow.',
    theme: {
      primary_color: '#f43f5e',
      secondary_color: '#ec4899',
      accent_color: '#fb7185',
      gradient_start: '#fda4af',
      gradient_middle: '#f43f5e',
      gradient_end: '#ec4899',
      bg_color: '#13050b',
      bg_secondary: '#1f0813',
      card_bg: '#2d0c1c',
    },
  },
  {
    id: 'cyber-gold',
    name: 'Imperial Gold & Onyx',
    description: 'High-contrast luxury cyber gold, metallic amber, and jet black.',
    theme: {
      primary_color: '#eab308',
      secondary_color: '#ca8a04',
      accent_color: '#f59e0b',
      gradient_start: '#fef08a',
      gradient_middle: '#eab308',
      gradient_end: '#d97706',
      bg_color: '#0d0b03',
      bg_secondary: '#171305',
      card_bg: '#241e08',
    },
  },
  {
    id: 'titanium-stealth',
    name: 'Titanium Stealth',
    description: 'Sophisticated monochromatic slate and platinum minimalism.',
    theme: {
      primary_color: '#f1f5f9',
      secondary_color: '#cbd5e1',
      accent_color: '#94a3b8',
      gradient_start: '#ffffff',
      gradient_middle: '#cbd5e1',
      gradient_end: '#94a3b8',
      bg_color: '#0b0c10',
      bg_secondary: '#13151f',
      card_bg: '#1a1d28',
    },
  },
];

interface ThemePresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: ThemePreset) => void;
  currentPrimaryColor: string;
}

export function ThemePresetsModal({
  isOpen,
  onClose,
  onSelectPreset,
  currentPrimaryColor,
}: ThemePresetsModalProps) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Choose Theme Color Preset"
      description="Pick any designer-crafted color theme. Applies instantly with no code needed!"
      maxWidth="2xl"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {CURATED_THEME_PRESETS.map((preset) => {
          const isActive =
            (currentPrimaryColor || '').toLowerCase() ===
            (preset.theme.primary_color || '').toLowerCase();

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                onSelectPreset(preset);
                onClose();
              }}
              className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all group ${
                isActive
                  ? 'bg-cyan-500/10 border-cyan-400 shadow-[0_0_20px_rgba(0,200,255,0.2)] ring-1 ring-cyan-400'
                  : 'bg-[#07090f]/90 border-white/10 hover:border-cyan-500/40 hover:bg-white/[0.04]'
              }`}
            >
              <div>
                {/* Visual Gradient Swatch Bar */}
                <div
                  className="h-9 w-full rounded-xl mb-3 shadow-inner flex items-center justify-between px-3 border border-white/15"
                  style={{
                    background: `linear-gradient(135deg, ${preset.theme.gradient_start}, ${preset.theme.gradient_middle}, ${preset.theme.gradient_end})`,
                  }}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full border border-black/30 shadow-sm"
                      style={{ backgroundColor: preset.theme.primary_color }}
                    />
                    <span
                      className="w-3 h-3 rounded-full border border-black/30 shadow-sm"
                      style={{ backgroundColor: preset.theme.secondary_color }}
                    />
                    <span
                      className="w-3 h-3 rounded-full border border-black/30 shadow-sm"
                      style={{ backgroundColor: preset.theme.accent_color }}
                    />
                  </div>

                  {isActive && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-black bg-white/90 px-2 py-0.5 rounded-full shadow">
                      <Check className="w-3 h-3" /> Active
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {preset.name}
                  </h4>
                </div>

                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  {preset.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] font-medium text-cyan-400 group-hover:underline">
                  Apply Theme →
                </span>
                <div
                  className="w-5 h-5 rounded-md border border-white/20"
                  style={{ backgroundColor: preset.theme.bg_color }}
                  title="Background Shade"
                />
              </div>
            </button>
          );
        })}
      </div>
    </Dialog>
  );
}
