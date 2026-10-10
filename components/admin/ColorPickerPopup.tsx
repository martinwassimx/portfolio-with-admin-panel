'use client';

import React, { useState } from 'react';
import { Palette, Check, Sparkles, Pipette } from 'lucide-react';
import { Dialog } from '../ui/Dialog';

// Curated high-aesthetic color palettes categorized for ease of use
export const COLOR_SWATCHES = [
  {
    category: 'Vibrant & Cyber Accents',
    colors: [
      { name: 'Electric Cyan', hex: '#00c8ff' },
      { name: 'Sky Blue', hex: '#38bdf8' },
      { name: 'Neon Azure', hex: '#0099ff' },
      { name: 'Royal Blue', hex: '#3b82f6' },
      { name: 'Deep Indigo', hex: '#6366f1' },
      { name: 'Cosmic Violet', hex: '#8b5cf6' },
      { name: 'Purple Neon', hex: '#a855f7' },
      { name: 'Fuchsia Glow', hex: '#d946ef' },
      { name: 'Neon Pink', hex: '#ec4899' },
      { name: 'Ruby Crimson', hex: '#ef4444' },
      { name: 'Coral Flame', hex: '#f43f5e' },
      { name: 'Sunset Orange', hex: '#f97316' },
      { name: 'Warm Amber', hex: '#f59e0b' },
      { name: 'Cyber Gold', hex: '#eab308' },
      { name: 'Acid Lime', hex: '#84cc16' },
      { name: 'Matrix Emerald', hex: '#10b981' },
      { name: 'Bright Mint', hex: '#14b8a6' },
      { name: 'Aurora Teal', hex: '#06b6d4' },
    ],
  },
  {
    category: 'Dark Backgrounds & Surfaces',
    colors: [
      { name: 'Obsidian Void', hex: '#07090f' },
      { name: 'Pure Deep Void', hex: '#030508' },
      { name: 'Midnight Navy', hex: '#0a0e17' },
      { name: 'Cyber Slate', hex: '#0d1120' },
      { name: 'Space Surface', hex: '#0f172a' },
      { name: 'Dark Indigo Base', hex: '#0c0a1a' },
      { name: 'Dark Emerald Base', hex: '#04120a' },
      { name: 'Dark Crimson Base', hex: '#140507' },
      { name: 'Charcoal Card', hex: '#111827' },
      { name: 'Slate Surface', hex: '#1e293b' },
      { name: 'Deep Zinc Card', hex: '#18181b' },
      { name: 'Onyx Black', hex: '#000000' },
    ],
  },
  {
    category: 'Text & Neutral Tones',
    colors: [
      { name: 'Pure White', hex: '#ffffff' },
      { name: 'Crisp Off-White', hex: '#f8fafc' },
      { name: 'Silver Mist', hex: '#f3f4f6' },
      { name: 'Cool Gray', hex: '#e2e8f0' },
      { name: 'Muted Slate', hex: '#94a3b8' },
      { name: 'Dim Gray', hex: '#64748b' },
      { name: 'Dark Metal', hex: '#475569' },
      { name: 'Subtle Charcoal', hex: '#334155' },
    ],
  },
];

interface ColorPickerPopupProps {
  label: string;
  value: string;
  onChange: (hex: string) => void;
  description?: string;
  quickSwatches?: { name: string; hex: string }[];
}

export function ColorPickerPopup({
  label,
  value,
  onChange,
  description,
  quickSwatches,
}: ColorPickerPopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Find human-readable swatch name if known
  const currentSwatch = COLOR_SWATCHES.flatMap((c) => c.colors).find(
    (c) => c.hex.toLowerCase() === (value || '').toLowerCase()
  );

  return (
    <>
      {/* Visual Trigger Card - No code required */}
      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 hover:bg-white/[0.05] transition-all group flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-bold text-white tracking-wide">
              {label}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-400 group-hover:text-cyan-300 group-hover:border-cyan-500/30 transition-colors">
              {value}
            </span>
          </div>
          {description && (
            <span className="text-[11px] text-gray-400 block mb-3 line-clamp-1">
              {description}
            </span>
          )}
        </div>

        {/* Clickable color preview swatch button that opens popup */}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/80 border border-white/10 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all w-full text-left mt-2 shadow-inner"
          title="Click to choose color from palette popup"
        >
          {/* Color Dot with glow */}
          <div
            className="w-9 h-9 rounded-xl shrink-0 border border-white/30 shadow-md transition-transform group-hover:scale-105"
            style={{
              backgroundColor: value,
              boxShadow: `0 0 16px ${value}45`,
            }}
          />
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold text-white truncate block">
              {currentSwatch ? currentSwatch.name : 'Custom Color'}
            </span>
            <span className="text-[11px] text-cyan-400 font-medium flex items-center gap-1">
              <span>Palette Popup</span>
              <span className="text-[9px]">↗</span>
            </span>
          </div>

          <div className="p-1.5 rounded-lg bg-white/5 text-gray-400 group-hover:text-cyan-300 group-hover:bg-cyan-500/10 transition-colors shrink-0">
            <Palette className="w-4 h-4" />
          </div>
        </button>

        {/* Optional 1-click Quick Swatches Strip */}
        {quickSwatches && quickSwatches.length > 0 && (
          <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-white/5 overflow-x-auto pb-0.5">
            <span className="text-[10px] uppercase font-bold text-gray-500 shrink-0 mr-1">Fast:</span>
            {quickSwatches.map((qs, qIdx) => {
              const isSelected = (value || '').toLowerCase() === qs.hex.toLowerCase();
              return (
                <button
                  key={qIdx}
                  type="button"
                  onClick={() => onChange(qs.hex)}
                  title={qs.name}
                  className={`w-5 h-5 rounded-md border shrink-0 transition-transform hover:scale-125 ${
                    isSelected
                      ? 'border-cyan-400 ring-2 ring-cyan-400/50 scale-110'
                      : 'border-white/20 hover:border-white/60'
                  }`}
                  style={{ backgroundColor: qs.hex }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* The Color Pop (Popup Modal) */}
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`Choose Color: ${label}`}
        description="Select a color from the visual palette or use the interactive color spectrum."
        maxWidth="lg"
      >
        <div className="space-y-6">
          {/* Active Color Preview & Visual Spectrum Launcher */}
          <div className="p-4 rounded-2xl bg-[#07090f] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div
                className="w-14 h-14 rounded-2xl border-2 border-white/30 shrink-0 shadow-lg relative overflow-hidden"
                style={{
                  backgroundColor: value,
                  boxShadow: `0 0 25px ${value}60`,
                }}
              >
                <input
                  type="color"
                  value={value.startsWith('#') && value.length === 7 ? value : '#00c8ff'}
                  onChange={(e) => onChange(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  title="Click to pick color"
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400 font-medium">Selected Color</p>
                <p className="text-sm font-bold text-white">
                  {currentSwatch ? currentSwatch.name : 'Custom Selection'}
                </p>
                {/* Direct Editable Hex Input */}
                <div className="flex items-center gap-1.5 pt-0.5">
                  <span className="text-xs text-gray-400 font-mono">HEX:</span>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => {
                      const val = e.target.value;
                      onChange(val);
                    }}
                    placeholder="#00c8ff"
                    className="w-28 px-2 py-0.5 rounded-md bg-white/10 border border-white/20 font-mono text-xs text-white uppercase focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Interactive Visual Spectrum Tool - Direct click */}
            <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 text-cyan-200 text-xs font-semibold hover:bg-cyan-500/30 cursor-pointer transition-all shadow-[0_0_15px_rgba(0,200,255,0.15)]">
              <Pipette className="w-4 h-4 text-cyan-300" />
              <span>Color Wheel Spectrum</span>
              <input
                type="color"
                value={value.startsWith('#') && value.length === 7 ? value : '#00c8ff'}
                onChange={(e) => onChange(e.target.value)}
                className="sr-only"
              />
            </label>
          </div>

          {/* Categorized Palette Grid */}
          <div className="space-y-5">
            {COLOR_SWATCHES.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                    {group.category}
                  </h4>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                  {group.colors.map((swatch, idx) => {
                    const isSelected =
                      (value || '').toLowerCase() === swatch.hex.toLowerCase();

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onChange(swatch.hex)}
                        className={`group relative p-2.5 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_15px_rgba(0,200,255,0.3)] ring-1 ring-cyan-400'
                            : 'bg-[#07090f]/80 border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
                        }`}
                      >
                        {/* Swatch circle */}
                        <div
                          className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm"
                          style={{
                            backgroundColor: swatch.hex,
                            boxShadow: isSelected
                              ? `0 0 14px ${swatch.hex}`
                              : 'none',
                          }}
                        >
                          {isSelected && (
                            <Check
                              className={`w-4 h-4 ${
                                swatch.hex === '#ffffff' ||
                                swatch.hex === '#f8fafc' ||
                                swatch.hex === '#f3f4f6'
                                  ? 'text-black'
                                  : 'text-white'
                              }`}
                            />
                          )}
                        </div>

                        {/* Name */}
                        <span className="text-[11px] font-medium text-gray-200 text-center leading-tight truncate w-full">
                          {swatch.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Dialog Action Buttons */}
          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(0,200,255,0.4)]"
            >
              Done / Apply Color
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
}
