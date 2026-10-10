'use client';

import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface EmptyMediaPlaceholderProps {
  label?: string;
  sublabel?: string;
  className?: string;
  aspectRatio?: 'video' | 'square' | 'portrait' | 'auto';
  onClick?: () => void;
}

export function EmptyMediaPlaceholder({
  label = '[ Empty Image Placeholder ]',
  sublabel = 'Configurable from Admin Panel',
  className = '',
  aspectRatio = 'video',
  onClick,
}: EmptyMediaPlaceholderProps) {
  const aspectClass = {
    video: 'aspect-video',
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    auto: 'h-48',
  }[aspectRatio];

  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'color-mix(in srgb, var(--accent) 30%, transparent)',
      }}
      className={`relative w-full ${aspectClass} rounded-xl border border-dashed flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden transition-all duration-300 group ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
      <div
        style={{
          backgroundColor: 'color-mix(in srgb, var(--accent) 12%, transparent)',
          borderColor: 'color-mix(in srgb, var(--accent) 28%, transparent)',
          color: 'var(--accent)',
        }}
        className="w-12 h-12 rounded-xl border flex items-center justify-center mb-3 group-hover:scale-110 transition-all duration-300 shadow-lg"
      >
        <ImageIcon className="w-6 h-6" />
      </div>
      <p
        style={{ color: 'var(--text)' }}
        className="text-xs font-semibold uppercase tracking-wider transition-colors"
      >
        {label}
      </p>
      {sublabel && (
        <p className="text-[11px] text-gray-400 mt-1 max-w-[200px]">
          {sublabel}
        </p>
      )}
    </div>
  );
}
