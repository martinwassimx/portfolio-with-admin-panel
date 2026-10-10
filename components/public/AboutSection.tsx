'use client';

import React from 'react';
import { MapPin, GraduationCap, Briefcase, Code, Globe, User } from 'lucide-react';
import { PageSectionConfig } from '../../lib/db/types';
import { EmptyMediaPlaceholder } from '../ui/EmptyMediaPlaceholder';

interface AboutSectionProps {
  section: PageSectionConfig;
}

export function AboutSection({ section }: AboutSectionProps) {
  const cfg = section.config || {};
  const bioParagraphs = (cfg.bio_paragraphs as string[]) || [
    'Software engineer and founder passionate about building scalable web platforms, robust cloud backends, and AI-driven systems.',
    'Focused on clean architecture, intuitive interfaces, and end-to-end technical excellence.',
  ];
  const tags = (cfg.tags as string[]) || ['#SoftwareEngineering', '#FullStack', '#AI', '#NextJS'];
  const metaInfo = (cfg.meta_info as Array<{ icon: string; label: string; value: string }>) || [];

  const getMetaIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'mappin':
        return <MapPin className="w-4 h-4" style={{ color: 'var(--accent)' }} />;
      case 'graduationcap':
        return <GraduationCap className="w-4 h-4" style={{ color: 'var(--accent-2)' }} />;
      case 'briefcase':
        return <Briefcase className="w-4 h-4" style={{ color: 'var(--accent-3)' }} />;
      case 'code':
        return <Code className="w-4 h-4" style={{ color: 'var(--accent)' }} />;
      case 'globe':
        return <Globe className="w-4 h-4" style={{ color: 'var(--accent-2)' }} />;
      default:
        return <User className="w-4 h-4" style={{ color: 'var(--accent)' }} />;
    }
  };

  return (
    <section id="about" className="relative py-24 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Tag */}
        <div className="section-tag">
          {section.badge_text || 'About Me'}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mt-4">
          {/* Left Column: Heading, Bio, Tags */}
          <div className="lg:col-span-7">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-8">
              {section.title || 'Engineering resilient, scalable digital systems.'}
              {section.subtitle && (
                <>
                  <br />
                  <span className="gradient-text">{section.subtitle}</span>
                </>
              )}
            </h2>

            <div className="space-y-5 text-gray-300 text-base sm:text-lg leading-relaxed mb-8">
              {bioParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2.5 pt-4">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 transition-colors"
                  style={{ color: 'var(--accent)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Profile Card inspired by screenshot */}
          <div className="lg:col-span-5">
            <div
              className="relative border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all duration-300 group"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius)',
              }}
            >
              {/* Glowing decorative border aura */}
              <div
                className="absolute -inset-0.5 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500 -z-10"
                style={{
                  background: 'linear-gradient(135deg, var(--gradient-start), var(--gradient-end))',
                  borderRadius: 'calc(var(--radius) + 2px)',
                }}
              />

              {/* Avatar Section */}
              <div className="flex flex-col items-center mb-8">
                {cfg.avatar_url ? (
                  <div
                    className="relative w-36 h-36 rounded-full p-1"
                    style={{
                      background: 'linear-gradient(135deg, var(--accent), var(--accent-3))',
                      boxShadow: '0 0 30px color-mix(in srgb, var(--accent) 35%, transparent)',
                    }}
                  >
                    <img
                      src={cfg.avatar_url}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                      style={{ backgroundColor: 'var(--bg-card)' }}
                    />
                  </div>
                ) : (
                  <div className="w-full max-w-[280px]">
                    <EmptyMediaPlaceholder
                      label="[ Empty Avatar Placeholder ]"
                      sublabel="Add profile photo in Admin > About"
                      aspectRatio="square"
                    />
                  </div>
                )}
              </div>

              {/* Profile Meta Rows */}
              <div className="space-y-3.5 pt-2 border-t border-white/5">
                {metaInfo.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[var(--accent)]/30 transition-colors"
                  >
                    <div className="mt-0.5 p-1.5 rounded-lg bg-white/5 shrink-0">
                      {getMetaIcon(item.icon)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        {item.label}
                      </p>
                      <p className="text-sm font-medium text-gray-200 truncate mt-0.5">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
