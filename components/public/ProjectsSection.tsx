'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
import { GithubIcon } from '../ui/Icons';
import { PageSectionConfig, Project } from '../../lib/db/types';
import { EmptyMediaPlaceholder } from '../ui/EmptyMediaPlaceholder';
import { Badge } from '../ui/Badge';

interface ProjectsSectionProps {
  section: PageSectionConfig;
  projects: Project[];
}

export function ProjectsSection({ section, projects }: ProjectsSectionProps) {
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const publishedProjects = projects
    .filter((p) => p.is_published)
    .sort((a, b) => a.sort_order - b.sort_order);

  // Extract unique tech tags
  const allTags = Array.from(
    new Set(publishedProjects.flatMap((p) => p.technologies || []))
  );

  const filteredProjects =
    selectedTag === 'All'
      ? publishedProjects
      : publishedProjects.filter((p) => p.technologies?.includes(selectedTag));

  return (
    <section id="projects" className="relative py-24 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="section-tag">
              {section.badge_text || 'Featured Work'}
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {section.title || 'Featured'}{' '}
              <span className="gradient-text">{section.subtitle || 'Projects'}</span>
            </h2>
          </div>

          {/* Filter pills if multiple technologies exist */}
          {allTags.length > 1 && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedTag('All')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedTag === 'All'
                    ? 'font-bold'
                    : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10'
                }`}
                style={
                  selectedTag === 'All'
                    ? {
                        backgroundColor: 'var(--accent)',
                        color: '#07090f',
                        boxShadow: '0 0 16px color-mix(in srgb, var(--accent) 35%, transparent)',
                      }
                    : {}
                }
              >
                All Projects
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedTag === tag
                      ? 'font-bold'
                      : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                  style={
                    selectedTag === tag
                      ? {
                          backgroundColor: 'var(--accent)',
                          color: '#07090f',
                          boxShadow: '0 0 16px color-mix(in srgb, var(--accent) 35%, transparent)',
                        }
                      : {}
                  }
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group flex flex-col border border-white/10 overflow-hidden backdrop-blur-md transition-all duration-300 hover:border-white/20"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
              }}
            >
              {/* Media Thumbnail */}
              <div className="relative overflow-hidden">
                {project.thumbnail_url ? (
                  <img
                    src={project.thumbnail_url}
                    alt={project.title}
                    className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <EmptyMediaPlaceholder
                    label="[ Project Media Placeholder ]"
                    sublabel={project.title}
                    aspectRatio="video"
                  />
                )}

                {/* Status Badge */}
                {project.status && (
                  <div className="absolute top-3 right-3">
                    <Badge variant={project.status === 'Completed' ? 'green' : 'amber'}>
                      {project.status}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--accent)' }}
                  >
                    {project.project_type || 'Full Stack / AI'}
                  </span>
                  {project.is_featured && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium" style={{ color: 'var(--accent)' }}>
                      <Sparkles className="w-3 h-3" /> Featured
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2 transition-colors">
                  {project.title}
                </h3>

                <p className="text-sm text-gray-400 line-clamp-3 mb-6 flex-1">
                  {project.summary}
                </p>

                {/* Tech badges */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.technologies?.slice(0, 4).map((tech, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-white/5 border border-white/10 text-gray-300"
                    >
                      {tech}
                    </span>
                  ))}
                  {(project.technologies?.length || 0) > 4 && (
                    <span className="text-[11px] text-gray-500 self-center">
                      +{project.technologies.length - 4} more
                    </span>
                  )}
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    {project.live_demo_url && (
                      <a
                        href={project.live_demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-white/5 text-gray-300 hover:text-white transition-colors"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--accent)';
                          e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--accent) 15%, transparent)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '';
                          e.currentTarget.style.backgroundColor = '';
                        }}
                        title="Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {project.repo_url && (
                      <a
                        href={project.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-white/5 text-gray-300 hover:text-white transition-colors"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--accent)';
                          e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--accent) 15%, transparent)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '';
                          e.currentTarget.style.backgroundColor = '';
                        }}
                        title="Source Code"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <Link
                    href={`/projects/${project.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors group-hover:translate-x-0.5"
                    style={{ color: 'var(--accent)' }}
                  >
                    <span>Read Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
