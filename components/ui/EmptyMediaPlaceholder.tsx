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
      className={`relative w-full ${aspectClass} rounded-xl border border-dashed border-cyan-500/30 bg-gradient-to-br from-[#0d1120] to-[#111827] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden transition-all duration-300 hover:border-cyan-400/50 group ${
        onClick ? 'cursor-pointer hover:bg-[#161f32]' : ''
      } ${className}`}
    >
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all duration-300">
        <ImageIcon className="w-6 h-6" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-300 group-hover:text-cyan-300 transition-colors">
        {label}
      </p>
      {sublabel && (
        <p className="text-[11px] text-gray-500 mt-1 max-w-[200px]">
          {sublabel}
        </p>
      )}
    </div>
  );
}
