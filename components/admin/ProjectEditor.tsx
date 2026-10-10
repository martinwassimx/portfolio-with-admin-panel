'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Save,
  Check,
  ArrowLeft,
  ExternalLink,
  Plus,
  Trash2,
  Code2,
  FileText,
  Layers,
  Image as ImageIcon,
  Link2,
  Sparkles,
} from 'lucide-react';
import { Project, ProjectContentBlock } from '../../lib/db/types';
import { saveProject } from '../../lib/db/store';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Switch } from '../ui/Switch';
import { ImageUploadField } from './ImageUploadField';

interface ProjectEditorProps {
  initialProject?: Project;
  isNew?: boolean;
}

export function ProjectEditor({ initialProject, isNew = false }: ProjectEditorProps) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<
    'general' | 'casestudy' | 'blocks' | 'technologies' | 'media' | 'links'
  >('general');

  const [project, setProject] = useState<Project>(() =>
    initialProject || {
      id: 'proj-' + Math.random().toString(36).slice(2, 9),
      slug: 'new-project',
      title: 'New Project Title',
      summary: 'High-level overview of the project objectives and architecture...',
      full_description: 'Detailed description of the application, architecture, stack choices, and outcomes...',
      project_type: 'Full-Stack Web App',
      status: 'Completed',
      start_date: '2024',
      completion_date: '2025',
      is_featured: false,
      is_published: true,
      sort_order: 1,
      thumbnail_url: '',
      cover_image_url: '',
      gallery_urls: [],
      technologies: ['Next.js', 'TypeScript', 'Tailwind CSS'],
      features: ['Real-time synchronization', 'Optimized database queries'],
      live_demo_url: '',
      repo_url: '',
      content_blocks: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  );

  const [techInput, setTechInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (publishedState?: boolean) => {
    setSaving(true);
    setSaved(false);

    try {
      const toSave = {
        ...project,
        is_published: publishedState !== undefined ? publishedState : project.is_published,
        updated_at: new Date().toISOString(),
      };
      await saveProject(toSave);
      setProject(toSave);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);

      if (isNew) {
        router.push(`/admin/projects/${toSave.id}/edit`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  // Add / Remove Tech
  const handleAddTech = () => {
    if (!techInput.trim()) return;
    setProject({
      ...project,
      technologies: [...(project.technologies || []), techInput.trim()],
    });
    setTechInput('');
  };

  const handleRemoveTech = (index: number) => {
    setProject({
      ...project,
      technologies: project.technologies?.filter((_, i) => i !== index),
    });
  };

  // Add / Remove Feature
  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    setProject({
      ...project,
      features: [...(project.features || []), featureInput.trim()],
    });
    setFeatureInput('');
  };

  const handleRemoveFeature = (index: number) => {
    setProject({
      ...project,
      features: project.features?.filter((_, i) => i !== index),
    });
  };

  // Add Content Block
  const handleAddBlock = (type: ProjectContentBlock['block_type']) => {
    const newBlock: ProjectContentBlock = {
      id: 'block-' + Date.now(),
      block_type: type,
      title: type === 'code_snippet' ? 'Typescript Implementation' : 'Section Heading',
      content:
        type === 'code_snippet'
          ? { language: 'typescript', code: '// Sample implementation\nexport async function handleRequest() {\n  return true;\n}' }
          : type === 'bullet_list'
          ? ['Key architectural benefit 1', 'Key architectural benefit 2']
          : type === 'metric'
          ? { metric: '99.9%', label: 'Uptime Reliability' }
          : 'Detailed paragraph explanation...',
      sort_order: (project.content_blocks?.length || 0) + 1,
    };

    setProject({
      ...project,
      content_blocks: [...(project.content_blocks || []), newBlock],
    });
  };

  const handleRemoveBlock = (blockId: string) => {
    setProject({
      ...project,
      content_blocks: project.content_blocks?.filter((b) => b.id !== blockId),
    });
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Top Header / Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {isNew ? 'Create New Project' : `Edit: ${project.title}`}
            </h2>
            <span className="text-xs font-mono text-cyan-400">/projects/{project.slug}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {!isNew && (
            <Link
              href={`/projects/${project.slug}`}
              target="_blank"
              className="btn-secondary py-2 px-3.5 text-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Preview Public Page</span>
            </Link>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleSave(false)}
            isLoading={saving}
          >
            Save as Draft
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => handleSave(true)}
            isLoading={saving}
            leftIcon={saved ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Save className="w-3.5 h-3.5" />}
          >
            {saved ? 'Published!' : 'Publish Project'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 border-b border-white/10 pb-2 overflow-x-auto">
        {[
          { id: 'general', label: 'General Info', icon: FileText },
          { id: 'casestudy', label: 'Case Study', icon: Layers },
          { id: 'blocks', label: 'Content Blocks', icon: Code2 },
          { id: 'technologies', label: 'Tech Stack', icon: Sparkles },
          { id: 'media', label: 'Media & Gallery', icon: ImageIcon },
          { id: 'links', label: 'Links & SEO', icon: Link2 },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(0,200,255,0.15)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: General Info */}
      {activeTab === 'general' && (
        <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Project Title"
              value={project.title}
              onChange={(e) => setProject({ ...project, title: e.target.value })}
              placeholder="e.g. Velora — High Performance Web Platform"
            />
            <Input
              label="Unique URL Slug"
              value={project.slug}
              onChange={(e) =>
                setProject({
                  ...project,
                  slug: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                })
              }
              placeholder="velora-platform"
              helperText="Determines the public URL: /projects/[slug]"
            />
          </div>

          <Textarea
            label="Short Summary"
            rows={3}
            value={project.summary}
            onChange={(e) => setProject({ ...project, summary: e.target.value })}
            placeholder="Brief summary of the engineering challenge and solution..."
          />

          <Textarea
            label="Full Detailed Description"
            rows={6}
            value={project.full_description || ''}
            onChange={(e) => setProject({ ...project, full_description: e.target.value })}
            placeholder="In-depth technical breakdown of system architecture and outcomes..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Input
              label="Project Type"
              value={project.project_type || ''}
              onChange={(e) => setProject({ ...project, project_type: e.target.value })}
              placeholder="e.g. Full-Stack Web App"
            />
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Status
              </label>
              <select
                value={project.status}
                onChange={(e) => setProject({ ...project, status: e.target.value as any })}
                className="w-full bg-[#0d1120] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200"
              >
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Concept">Concept</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
            <Input
              label="Timeline / Dates"
              value={project.start_date || ''}
              onChange={(e) => setProject({ ...project, start_date: e.target.value })}
              placeholder="e.g. 2026 - Present"
            />
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-wrap gap-6">
            <Switch
              checked={project.is_featured}
              onChange={(val) => setProject({ ...project, is_featured: val })}
              label="Featured Project"
              description="Promotes this project in the top featured section."
            />
            <Switch
              checked={project.is_published}
              onChange={(val) => setProject({ ...project, is_published: val })}
              label="Published"
              description="Unpublished drafts are hidden from public visitors."
            />
          </div>
        </div>
      )}

      {/* TAB 2: Case Study */}
      {activeTab === 'casestudy' && (
        <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Textarea
              label="Problem Statement"
              rows={4}
              value={project.problem_statement || ''}
              onChange={(e) => setProject({ ...project, problem_statement: e.target.value })}
              placeholder="Describe the core business problem or bottleneck..."
            />
            <Textarea
              label="Project Goals"
              rows={4}
              value={project.goals || ''}
              onChange={(e) => setProject({ ...project, goals: e.target.value })}
              placeholder="Define the technical objectives and benchmarks..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Textarea
              label="Key Challenges Encountered"
              rows={4}
              value={project.challenges || ''}
              onChange={(e) => setProject({ ...project, challenges: e.target.value })}
              placeholder="Scalability limits, legacy database bottlenecks, or edge cases..."
            />
            <Textarea
              label="Proposed Solution & Design"
              rows={4}
              value={project.solution || ''}
              onChange={(e) => setProject({ ...project, solution: e.target.value })}
              placeholder="Event-driven architecture, caching strategies, and modular UI..."
            />
          </div>

          {/* Key Features List */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Key Features & Deliverables
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                placeholder="e.g. End-to-end encryption pipeline..."
                className="flex-1 bg-[#0d1120] border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-200"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddFeature}>
                Add Feature
              </Button>
            </div>

            <div className="space-y-2">
              {project.features?.map((feat, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-gray-300"
                >
                  <span>{feat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(i)}
                    className="text-gray-500 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Textarea
            label="Architecture Overview & Stack Details"
            rows={4}
            value={project.architecture || ''}
            onChange={(e) => setProject({ ...project, architecture: e.target.value })}
            placeholder="Microservices, serverless functions, database schema details..."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Textarea
              label="Measurable Outcomes & Results"
              rows={4}
              value={project.outcomes || ''}
              onChange={(e) => setProject({ ...project, outcomes: e.target.value })}
              placeholder="e.g. 40% reduction in latency, 99.9% uptime..."
            />
            <Textarea
              label="Lessons Learned"
              rows={4}
              value={project.lessons_learned || ''}
              onChange={(e) => setProject({ ...project, lessons_learned: e.target.value })}
              placeholder="Key insights on distributed consensus, caching, or DX..."
            />
          </div>
        </div>
      )}

      {/* TAB 3: Modular Content Blocks */}
      {activeTab === 'blocks' && (
        <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400">
                Modular Content Blocks Builder
              </h3>
              <p className="text-xs text-gray-400">
                Add rich custom sections, headings, formatted paragraphs, syntax-highlighted code snippets, and metrics.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddBlock('heading')}
              >
                + Heading
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddBlock('paragraph')}
              >
                + Paragraph
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddBlock('code_snippet')}
              >
                + Code Block
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddBlock('metric')}
              >
                + Metric
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {project.content_blocks?.map((block, idx) => (
              <div
                key={block.id}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    Block #{idx + 1}: {block.block_type}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveBlock(block.id)}
                    className="text-gray-400 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {block.block_type === 'heading' && (
                  <Input
                    label="Heading Text"
                    value={block.title || (typeof block.content === 'string' ? block.content : '')}
                    onChange={(e) => {
                      const updated = [...(project.content_blocks || [])];
                      updated[idx] = { ...block, title: e.target.value, content: e.target.value };
                      setProject({ ...project, content_blocks: updated });
                    }}
                    placeholder="Section Heading"
                  />
                )}

                {block.block_type === 'paragraph' && (
                  <Textarea
                    label="Paragraph Content"
                    rows={4}
                    value={typeof block.content === 'string' ? block.content : ''}
                    onChange={(e) => {
                      const updated = [...(project.content_blocks || [])];
                      updated[idx] = { ...block, content: e.target.value };
                      setProject({ ...project, content_blocks: updated });
                    }}
                    placeholder="Detailed paragraph content..."
                  />
                )}

                {block.block_type === 'code_snippet' && (
                  <div className="space-y-3">
                    <Input
                      label="Snippet Title / Language"
                      value={block.title || ''}
                      onChange={(e) => {
                        const updated = [...(project.content_blocks || [])];
                        updated[idx] = { ...block, title: e.target.value };
                        setProject({ ...project, content_blocks: updated });
                      }}
                      placeholder="e.g. Architecture Handler"
                    />
                    <Textarea
                      label="Code"
                      rows={5}
                      value={
                        typeof block.content === 'object' && 'code' in block.content
                            ? (block.content as any).code
                          : String(block.content)
                      }
                      onChange={(e) => {
                        const updated = [...(project.content_blocks || [])];
                        updated[idx] = {
                          ...block,
                          content: { language: 'typescript', code: e.target.value },
                        };
                        setProject({ ...project, content_blocks: updated });
                      }}
                      placeholder="// Insert code snippet here..."
                    />
                  </div>
                )}

                {block.block_type === 'metric' && (
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Metric (e.g. 99.9% or 10x)"
                      value={
                        typeof block.content === 'object' && 'metric' in block.content
                          ? (block.content as any).metric
                          : ''
                      }
                      onChange={(e) => {
                        const updated = [...(project.content_blocks || [])];
                        const curr = (block.content as any) || {};
                        updated[idx] = {
                          ...block,
                          content: { ...curr, metric: e.target.value },
                        };
                        setProject({ ...project, content_blocks: updated });
                      }}
                      placeholder="99.9%"
                    />
                    <Input
                      label="Metric Label"
                      value={
                        typeof block.content === 'object' && 'label' in block.content
                          ? (block.content as any).label
                          : ''
                      }
                      onChange={(e) => {
                        const updated = [...(project.content_blocks || [])];
                        const curr = (block.content as any) || {};
                        updated[idx] = {
                          ...block,
                          content: { ...curr, label: e.target.value },
                        };
                        setProject({ ...project, content_blocks: updated });
                      }}
                      placeholder="Performance Increase"
                    />
                  </div>
                )}
              </div>
            ))}

            {(!project.content_blocks || project.content_blocks.length === 0) && (
              <p className="text-xs text-gray-500 italic text-center py-6">
                No custom blocks added yet. Click any button above to add rich blocks.
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Technologies */}
      {activeTab === 'technologies' && (
        <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
            Technologies & Libraries Used
          </label>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
              placeholder="e.g. Next.js, TypeScript, PostgreSQL..."
              className="flex-1 bg-[#0d1120] border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-200"
            />
            <Button type="button" variant="outline" size="sm" onClick={handleAddTech}>
              Add Technology
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.technologies?.map((tech, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-cyan-300"
              >
                <span>{tech}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTech(i)}
                  className="text-gray-500 hover:text-red-400"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Media */}
      {activeTab === 'media' && (
        <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-6">
          <ImageUploadField
            label="Project Thumbnail (Cards & Grid)"
            value={project.thumbnail_url || ''}
            onChange={(url) => setProject({ ...project, thumbnail_url: url })}
            helperText="Upload project thumbnail or screenshot. Displayed on public project cards."
          />

          <ImageUploadField
            label="Cover Showcase Image (Detail Page Header)"
            value={project.cover_image_url || ''}
            onChange={(url) => setProject({ ...project, cover_image_url: url })}
            helperText="High-resolution banner displayed at the top of the case study page."
          />

          <Input
            label="Video Demo URL (YouTube, Vimeo, or MP4)"
            value={project.video_url || ''}
            onChange={(e) => setProject({ ...project, video_url: e.target.value })}
            placeholder="https://youtube.com/..."
          />
        </div>
      )}

      {/* TAB 6: Links & SEO */}
      {activeTab === 'links' && (
        <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="Live Demo Link"
              value={project.live_demo_url || ''}
              onChange={(e) => setProject({ ...project, live_demo_url: e.target.value })}
              placeholder="https://example.com"
            />
            <Input
              label="Source Code (GitHub Repository)"
              value={project.repo_url || ''}
              onChange={(e) => setProject({ ...project, repo_url: e.target.value })}
              placeholder="https://github.com/..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input
              label="SEO Title Override"
              value={project.seo_title || ''}
              onChange={(e) => setProject({ ...project, seo_title: e.target.value })}
              placeholder="e.g. Velora | High-Performance Cloud Architecture"
            />
            <Input
              label="SEO Description"
              value={project.seo_description || ''}
              onChange={(e) => setProject({ ...project, seo_description: e.target.value })}
              placeholder="e.g. Case study detailing the architecture and performance benchmarks of Velora."
            />
          </div>
        </div>
      )}
    </div>
  );
}
