'use client';

import React from 'react';
import { GraduationCap, Calendar, Award, BookOpen } from 'lucide-react';
import { PageSectionConfig, EducationEntry } from '../../lib/db/types';

interface EducationSectionProps {
  section: PageSectionConfig;
  education: EducationEntry[];
}

export function EducationSection({ section, education }: EducationSectionProps) {
  const visibleEntries = education
    .filter((e) => e.is_visible)
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <section id="education" className="relative py-24 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="section-tag">
          {section.badge_text || 'Academic Background'}
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          {section.title || 'Academic'}{' '}
          <span className="gradient-text">{section.subtitle || 'Foundations'}</span>
        </h2>
        <p className="text-base text-gray-400 max-w-2xl mb-12">
          {section.config?.description || 'Higher education credentials, computer science degrees, and academic specializations.'}
        </p>

        {/* Timeline Layout */}
        <div
          className="relative pl-6 sm:pl-8 border-l space-y-12"
          style={{ borderColor: 'color-mix(in srgb, var(--accent) 25%, transparent)' }}
        >
          {visibleEntries.map((item) => (
            <div key={item.id} className="relative group">
              {/* Timeline dot */}
              <div
                className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 transition-colors"
                style={{
                  backgroundColor: 'var(--bg)',
                  borderColor: 'var(--accent)',
                  boxShadow: '0 0 12px color-mix(in srgb, var(--accent) 40%, transparent)',
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
                    style={{ color: 'var(--accent)' }}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>{item.institution}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {item.start_date} — {item.is_current ? 'Present' : item.end_date}
                    </span>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                  {item.degree}
                </h3>
                <p className="text-sm font-medium text-gray-300 mb-4">
                  {item.field_of_study}
                  {item.grade_gpa && (
                    <span className="ml-2 font-semibold" style={{ color: 'var(--accent)' }}>
                      • GPA/Grade: {item.grade_gpa}
                    </span>
                  )}
                </p>

                {item.description && (
                  <p className="text-sm text-gray-400 leading-relaxed mb-6">
                    {item.description}
                  </p>
                )}

                {/* Achievements */}
                {item.achievements && item.achievements.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-300 mb-2">
                      <Award className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                      <span>Key Highlights & Honors:</span>
                    </div>
                    <ul className="list-disc list-inside text-xs text-gray-400 space-y-1 pl-1">
                      {item.achievements.map((ach, i) => (
                        <li key={i}>{ach}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Relevant Coursework */}
                {item.coursework && item.coursework.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-300 mb-2">
                      <BookOpen className="w-3.5 h-3.5" style={{ color: 'var(--accent-2)' }} />
                      <span>Relevant Modules:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {item.coursework.map((course, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-white/5 border border-white/10 text-gray-300"
                        >
                          {course}
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
