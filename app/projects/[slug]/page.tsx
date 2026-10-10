import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink, ArrowLeft, Calendar, Tag, CheckCircle2, ArrowRight } from 'lucide-react';
import { GithubIcon } from '../../../components/ui/Icons';
import { getProjects, getProjectBySlug, getSiteSettings } from '../../../lib/db/server-store';

export const dynamic = 'force-dynamic';
import { ProjectContentBlockRenderer } from '../../../components/projects/ProjectContentBlockRenderer';
import { EmptyMediaPlaceholder } from '../../../components/ui/EmptyMediaPlaceholder';
import { Badge } from '../../../components/ui/Badge';
import { Navbar } from '../../../components/public/Navbar';
import { Footer } from '../../../components/public/Footer';
import { DEFAULT_NAVIGATION_ITEMS, DEFAULT_SOCIAL_LINKS } from '../../../lib/db/defaults';

export async function generateStaticParams() {
  const projects = await getProjects({ publishedOnly: true });
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: 'Project Not Found' };
  return {
    title: `${project.seo_title || project.title} | Portfolio`,
    description: project.seo_description || project.summary,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project || !project.is_published) {
    notFound();
  }

  const allProjects = await getProjects({ publishedOnly: true });
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

  const siteSettings = await getSiteSettings();

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col transition-colors duration-300">
      <Navbar navItems={DEFAULT_NAVIGATION_ITEMS} siteSettings={siteSettings} />

      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Back Link */}
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-cyan-400 mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Projects</span>
          </Link>

          {/* Project Header */}
          <div className="mb-10">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                {project.project_type || 'Software Application'}
              </span>
              <span className="text-gray-600">•</span>
              <Badge variant={project.status === 'Completed' ? 'green' : 'amber'}>
                {project.status}
              </Badge>
              {project.start_date && (
                <>
                  <span className="text-gray-600">•</span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {project.start_date} — {project.completion_date || 'Present'}
                  </span>
                </>
              )}
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-6">
              {project.title}
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-3xl mb-8">
              {project.summary}
            </p>

            {/* Action Links & Tech tags */}
            <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-white/10">
              <div className="flex flex-wrap gap-2">
                {project.technologies?.map((tech, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-cyan-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3">
                {project.live_demo_url && (
                  <a
                    href={project.live_demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary py-2 px-5 text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Live Demo</span>
                  </a>
                )}
                {project.repo_url && (
                  <a
                    href={project.repo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary py-2 px-5 text-sm"
                  >
                    <GithubIcon className="w-4 h-4" />
                    <span>Source Code</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Project Cover / Main Image */}
          <div className="mb-14 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            {project.cover_image_url || project.thumbnail_url ? (
              <img
                src={project.cover_image_url || project.thumbnail_url}
                alt={project.title}
                className="w-full aspect-video object-cover"
              />
            ) : (
              <EmptyMediaPlaceholder
                label="[ Project Showcase Media ]"
                sublabel={project.title}
                aspectRatio="video"
              />
            )}
          </div>

          {/* Case Study Detailed Content */}
          <div className="space-y-12">
            {/* Full description */}
            {project.full_description && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Overview</h2>
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed whitespace-pre-line">
                  {project.full_description}
                </p>
              </div>
            )}

            {/* Problem & Goal */}
            {(project.problem_statement || project.goals) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {project.problem_statement && (
                  <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-2">The Problem</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {project.problem_statement}
                    </p>
                  </div>
                )}
                {project.goals && (
                  <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-2">Project Goals</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {project.goals}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Challenges & Solution */}
            {(project.challenges || project.solution) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {project.challenges && (
                  <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-2">Challenges</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {project.challenges}
                    </p>
                  </div>
                )}
                {project.solution && (
                  <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-2">Proposed Solution</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {project.solution}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Key Features */}
            {project.features && project.features.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Key Features & Architecture</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.features.map((feat, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-200">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Architecture description */}
            {project.architecture && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Architecture & Implementation</h2>
                <p className="text-gray-300 text-base leading-relaxed">
                  {project.architecture}
                </p>
              </div>
            )}

            {/* Dynamic Content Blocks */}
            {project.content_blocks && project.content_blocks.length > 0 && (
              <div className="pt-4 border-t border-white/10">
                {project.content_blocks
                  .sort((a, b) => a.sort_order - b.sort_order)
                  .map((block) => (
                    <ProjectContentBlockRenderer key={block.id} block={block} />
                  ))}
              </div>
            )}

            {/* Outcomes & Lessons Learned */}
            {(project.outcomes || project.lessons_learned) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                {project.outcomes && (
                  <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-2">Measurable Outcomes</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {project.outcomes}
                    </p>
                  </div>
                )}
                {project.lessons_learned && (
                  <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10">
                    <h3 className="text-lg font-bold text-white mb-2">Lessons Learned</h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {project.lessons_learned}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Next & Previous Project Navigation */}
          <div className="mt-20 pt-10 border-t border-white/10 flex items-center justify-between">
            {prevProject ? (
              <Link
                href={`/projects/${prevProject.slug}`}
                className="flex items-center gap-3 text-gray-400 hover:text-cyan-400 transition-colors group text-left"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <div>
                  <span className="text-[11px] uppercase tracking-wider block text-gray-500">Previous Project</span>
                  <span className="text-sm font-semibold text-white group-hover:text-cyan-300">
                    {prevProject.title}
                  </span>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextProject ? (
              <Link
                href={`/projects/${nextProject.slug}`}
                className="flex items-center gap-3 text-gray-400 hover:text-cyan-400 transition-colors group text-right"
              >
                <div>
                  <span className="text-[11px] uppercase tracking-wider block text-gray-500">Next Project</span>
                  <span className="text-sm font-semibold text-white group-hover:text-cyan-300">
                    {nextProject.title}
                  </span>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </main>

      <Footer siteSettings={siteSettings} socialLinks={DEFAULT_SOCIAL_LINKS} />
    </div>
  );
}
