'use client';

import React from 'react';
import Link from 'next/link';
import { Download, Send, ArrowDown } from 'lucide-react';
import { PageSectionConfig, SiteSettings } from '../../lib/db/types';

interface HeroSectionProps {
  section: PageSectionConfig;
  siteSettings: SiteSettings;
}

export function HeroSection({ section, siteSettings }: HeroSectionProps) {
  const cfg = section.config || {};
  const stats = (cfg.stats as Array<{ num: string; label: string }>) || [];

  return (
    <section id="hero" className="relative min-h-[92vh] flex flex-col justify-center pt-36 sm:pt-40 pb-16 overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

      {/* Glowing Ambient Radial Orbs */}
      <div
        className="glow-orb w-[500px] h-[500px] -top-40 -left-20"
        style={{
          backgroundColor: 'var(--accent)',
          opacity: 'calc(var(--glow-opacity) * 0.18)',
        }}
      />
      <div
        className="glow-orb w-[600px] h-[600px] top-1/3 -right-40"
        style={{
          backgroundColor: 'var(--accent-3)',
          opacity: 'calc(var(--glow-opacity) * 0.16)',
        }}
      />
      <div
        className="glow-orb w-[400px] h-[400px] bottom-0 left-1/3"
        style={{
          backgroundColor: 'var(--accent-2)',
          opacity: 'calc(var(--glow-opacity) * 0.14)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Availability Eyebrow */}
        <div
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-8 backdrop-blur-md border transition-colors"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--accent) 12%, transparent)',
            borderColor: 'color-mix(in srgb, var(--accent) 30%, transparent)',
            color: 'var(--accent)',
          }}
        >
          <span className="status-dot" />
          <span className="text-xs sm:text-sm font-medium">
            {section.badge_text || 'Available for Opportunities'}
          </span>
        </div>

        {/* Oversized Name Display Heading */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.05] mb-6">
          {cfg.first_name || (section.title ? section.title.split(' ')[0] : 'Your')}
          {cfg.highlighted_name ? (
            <>
              <br />
              <span className="gradient-text">{cfg.highlighted_name}</span>
            </>
          ) : section.title && section.title.split(' ').length > 1 ? (
            <>
              <br />
              <span className="gradient-text">{section.title.split(' ').slice(1).join(' ')}</span>
            </>
          ) : !cfg.first_name && !section.title ? (
            <>
              <br />
              <span className="gradient-text">Name</span>
            </>
          ) : null}
        </h1>

        {/* Professional Role or Subtitle */}
        <p className="text-lg sm:text-2xl font-medium text-gray-300 mb-6 flex flex-wrap items-center gap-2.5">
          {section.subtitle || (cfg.first_name ? 'Software Engineer' : 'Software Engineer • Portfolio')}
        </p>

        {/* Short Biography / Summary */}
        <p className="text-base sm:text-lg text-gray-400 max-w-3xl leading-relaxed mb-10">
          {cfg.summary || (cfg.first_name ? 'Architecting high-performance web systems and digital solutions.' : 'Upload your CV in the admin panel to auto-fill your personal introduction, skills, and projects.')}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-4 mb-16">
          {siteSettings.cv_file_url ? (
            <a
              href={siteSettings.cv_file_url}
              download
              className="btn-primary"
            >
              <Download className="w-4 h-4" />
              <span>{siteSettings.cv_download_label || 'Download CV'}</span>
            </a>
          ) : (
            <Link href="#contact" className="btn-primary">
              <Download className="w-4 h-4" />
              <span>{cfg.cta_primary_label || 'Download CV'}</span>
            </Link>
          )}

          <Link href="#contact" className="btn-secondary">
            <Send className="w-4 h-4" />
            <span>{cfg.cta_secondary_label || 'Get in Touch'}</span>
          </Link>
        </div>

        {/* Statistics Bar (Automatically renders stats, skips empty ones) */}
        {stats.length > 0 && stats.some((s) => s.num && s.num !== '0' && s.label) && (
          <div className="inline-flex flex-wrap items-center gap-8 py-5 px-8 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
            {stats.map((stat, idx) => (
              <React.Fragment key={idx}>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {stat.num}
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
                {idx < stats.length - 1 && (
                  <div className="hidden sm:block w-px h-8 bg-white/10" />
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      {cfg.show_scroll_indicator !== false && (
        <div className="hidden lg:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-gray-500">
          <span className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">Scroll</span>
          <div className="w-5 h-8 rounded-full border border-gray-600/60 flex items-start justify-center p-1">
            <div
              className="w-1.5 h-2 rounded-full animate-bounce mt-1"
              style={{ backgroundColor: 'var(--accent)' }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
