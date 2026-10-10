'use client';

import React from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { PageSectionConfig, ExperienceEntry } from '../../lib/db/types';

interface ExperienceSectionProps {
  section: PageSectionConfig;
  experience: ExperienceEntry[];
}

export function ExperienceSection({ section, experience }: ExperienceSectionProps) {
  const visibleEntries = experience
    .filter((e) => e.is_visible)
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <section id="experience" className="relative py-24 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="section-tag">
          {section.badge_text || 'Career History'}
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          {section.title || 'Work'}{' '}
          <span className="gradient-text">{section.subtitle || 'Experience'}</span>
        </h2>
        <p className="text-base text-gray-400 max-w-2xl mb-12">
          {section.config?.description || 'Professional trajectory, technical leadership, and engineering achievements across industry roles.'}
        </p>

        {/* Timeline Layout */}
        <div
          className="relative pl-6 sm:pl-8 border-l space-y-12"
          style={{ borderColor: 'color-mix(in srgb, var(--accent-2) 25%, transparent)' }}
        >
          {visibleEntries.map((item) => (
            <div key={item.id} className="relative group">
              {/* Timeline marker */}
              <div
                className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 transition-colors"
                style={{
                  backgroundColor: 'var(--bg)',
                  borderColor: 'var(--accent-2)',
                  boxShadow: '0 0 12px color-mix(in srgb, var(--accent-2) 40%, transparent)',
                }}
              />

              <div
                className="p-6 sm:p-8 border border-white/10 backdrop-blur-md transition-all hover:border-white/20"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div
                    className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--accent-2)' }}
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>{item.company}</span>
                    {item.employment_type && (
                      <span className="text-gray-500">• {item.employment_type}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {item.location && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                        {item.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-gray-300 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                      <Calendar className="w-3.5 h-3.5" style={{ color: 'var(--accent-2)' }} />
                      {item.start_date} — {item.is_current ? 'Present' : item.end_date}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  {item.job_title}
                </h3>

                {item.description && (
                  <p className="text-sm text-gray-300 leading-relaxed mb-6">
                    {item.description}
                  </p>
                )}

                {/* Responsibilities / Key Deliverables */}
                {item.responsibilities && item.responsibilities.length > 0 && (
                  <div className="mb-6 space-y-2">
                    {item.responsibilities.map((resp, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-400">
                        <CheckCircle2
                          className="w-4 h-4 shrink-0 mt-0.5"
                          style={{ color: 'var(--accent)' }}
                        />
                        <span>{resp}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tech Stack used */}
                {item.technologies && item.technologies.length > 0 && (
                  <div className="pt-4 border-t border-white/5">
                    <div className="flex flex-wrap gap-1.5">
                      {item.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-md text-[11px] font-medium border"
                          style={{
                            backgroundColor: 'color-mix(in srgb, var(--accent-2) 12%, transparent)',
                            borderColor: 'color-mix(in srgb, var(--accent-2) 28%, transparent)',
                            color: 'var(--accent-2)',
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
