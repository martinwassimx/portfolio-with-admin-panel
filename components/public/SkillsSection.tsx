'use client';

import React from 'react';
import { Code, Globe, Cpu, Wrench, Layers, Database, Shield } from 'lucide-react';
import { PageSectionConfig, SkillCategory, Skill } from '../../lib/db/types';
import { Badge } from '../ui/Badge';

interface SkillsSectionProps {
  section: PageSectionConfig;
  categories: SkillCategory[];
  skills: Skill[];
}

export function SkillsSection({ section, categories, skills }: SkillsSectionProps) {
  const visibleCategories = categories
    .filter((c) => c.is_visible)
    .sort((a, b) => a.sort_order - b.sort_order);

  // Dynamic theme-adaptive styling for category icons and accent aura
  const getCategoryThemePalette = (index: number) => {
    const palettes = [
      {
        accent: 'var(--accent)',
        iconBg: 'color-mix(in srgb, var(--accent) 15%, transparent)',
        iconBorder: 'color-mix(in srgb, var(--accent) 35%, transparent)',
        iconGlow: '0 0 16px color-mix(in srgb, var(--accent) 22%, transparent)',
        badgeVariant: 'cyan' as const,
        hoverBorder: 'color-mix(in srgb, var(--accent) 45%, transparent)',
      },
      {
        accent: 'var(--accent-2)',
        iconBg: 'color-mix(in srgb, var(--accent-2) 15%, transparent)',
        iconBorder: 'color-mix(in srgb, var(--accent-2) 35%, transparent)',
        iconGlow: '0 0 16px color-mix(in srgb, var(--accent-2) 22%, transparent)',
        badgeVariant: 'blue' as const,
        hoverBorder: 'color-mix(in srgb, var(--accent-2) 45%, transparent)',
      },
      {
        accent: 'var(--accent-3)',
        iconBg: 'color-mix(in srgb, var(--accent-3) 15%, transparent)',
        iconBorder: 'color-mix(in srgb, var(--accent-3) 35%, transparent)',
        iconGlow: '0 0 16px color-mix(in srgb, var(--accent-3) 22%, transparent)',
        badgeVariant: 'purple' as const,
        hoverBorder: 'color-mix(in srgb, var(--accent-3) 45%, transparent)',
      },
    ];
    return palettes[index % palettes.length];
  };

  const getCategoryIcon = (iconName: string | undefined, categoryName: string, iconColor: string) => {
    const style = { color: iconColor };
    const query = `${iconName || ''} ${categoryName || ''}`.toLowerCase();

    if (/globe|web|internet|network/i.test(query)) {
      return <Globe className="w-5 h-5 transition-colors duration-300" style={style} />;
    }
    if (/cpu|ai|machine|learning|intelligence|vision|gesture|deep/i.test(query)) {
      return <Cpu className="w-5 h-5 transition-colors duration-300" style={style} />;
    }
    if (/wrench|tool|devops|build|architecture|design/i.test(query)) {
      return <Wrench className="w-5 h-5 transition-colors duration-300" style={style} />;
    }
    if (/database|sql|data|storage|backend/i.test(query)) {
      return <Database className="w-5 h-5 transition-colors duration-300" style={style} />;
    }
    if (/shield|security|auth/i.test(query)) {
      return <Shield className="w-5 h-5 transition-colors duration-300" style={style} />;
    }
    if (/framework|library|layers/i.test(query)) {
      return <Layers className="w-5 h-5 transition-colors duration-300" style={style} />;
    }
    return <Code className="w-5 h-5 transition-colors duration-300" style={style} />;
  };

  return (
    <section id="skills" className="relative py-24 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="section-tag">
          {section.badge_text || 'Technical Skills'}
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          {section.title || 'Technical'}{' '}
          <span className="gradient-text">{section.subtitle || 'Competencies'}</span>
        </h2>
        <p className="text-base text-gray-400 max-w-2xl mb-12">
          {section.config?.description || 'A comprehensive overview of my technical stack, engineering practices, and core specialties.'}
        </p>

        {/* Skills Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleCategories.map((category, catIdx) => {
            const catSkills = skills
              .filter((s) => {
                if (s.is_visible === false) return false;
                if (s.category_id === category.id) return true;
                if (s.category_id === `cat-${catIdx + 1}` || s.category_id === `cat-${catIdx}`) return true;
                if (s.category_id && category.id && s.category_id.endsWith(category.id.slice(-4))) return true;
                if (!s.category_id && catIdx === 0) return true;
                return false;
              })
              .sort((a, b) => a.sort_order - b.sort_order);

            const palette = getCategoryThemePalette(catIdx);

            return (
              <div
                key={category.id}
                className="group border border-white/10 p-6 backdrop-blur-md transition-all duration-300 hover:border-white/20"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: 'var(--radius)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = palette.hoverBorder;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                }}
              >
                {/* Header with Theme-Adaptive Icon */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                  <div
                    className="p-2.5 rounded-xl border transition-all duration-300 group-hover:scale-105"
                    style={{
                      backgroundColor: palette.iconBg,
                      borderColor: palette.iconBorder,
                      boxShadow: palette.iconGlow,
                    }}
                  >
                    {getCategoryIcon(category.icon, category.name, palette.accent)}
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {category.name}
                  </h3>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  {catSkills.length > 0 ? (
                    catSkills.map((sk) => (
                      <Badge
                        key={sk.id}
                        variant={(sk.badge_color as any) || palette.badgeVariant}
                        className="py-1 px-3 text-xs"
                      >
                        {sk.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500 italic">No skills listed</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
