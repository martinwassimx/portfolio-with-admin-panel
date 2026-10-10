'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  Copy,
  Sparkles,
  Eye,
  EyeOff,
  FolderKanban,
} from 'lucide-react';
import { getProjects, saveProject, deleteProject } from '../../../lib/db/store';
import { Project } from '../../../lib/db/types';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { ConfirmDialog } from '../../../components/admin/ConfirmDialog';

export default function AdminProjectsListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Delete modal state
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const loadProjects = async () => {
    try {
      const data = await getProjects({ publishedOnly: false });
      setProjects(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleTogglePublish = async (project: Project) => {
    const updated = { ...project, is_published: !project.is_published };
    await saveProject(updated);
    loadProjects();
  };

  const handleDuplicate = async (project: Project) => {
    const duplicated: Project = {
      ...project,
      id: 'proj-' + Date.now(),
      slug: `${project.slug}-copy-${Date.now().toString().slice(-4)}`,
      title: `${project.title} (Copy)`,
      is_published: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    await saveProject(duplicated);
    loadProjects();
  };

  const confirmDelete = async () => {
    if (!projectToDelete) return;
    await deleteProject(projectToDelete.id);
    setProjectToDelete(null);
    loadProjects();
  };

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Published'
        ? p.is_published
        : statusFilter === 'Draft'
        ? !p.is_published
        : p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Project Portfolio Catalog</h2>
          <p className="text-xs text-gray-400 mt-1">
            Create, edit, duplicate, and publish case-studies and public project detail pages.
          </p>
        </div>

        <Link href="/admin/projects/new">
          <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
            Create New Project
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0d1120] border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400"
          />
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
          {['All', 'Published', 'Draft', 'Completed', 'In Progress'].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === f
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(0,200,255,0.3)]'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Table */}
      <div className="rounded-2xl bg-[#0f172a] border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0a0f1d] border-b border-white/10 text-gray-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-6">Project Title & Slug</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Publishing</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {filtered.map((proj) => (
                <tr key={proj.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                        <FolderKanban className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{proj.title}</span>
                          {proj.is_featured && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-300">
                              <Sparkles className="w-2.5 h-2.5" /> Featured
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-cyan-400/80">
                          /projects/{proj.slug}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-medium text-gray-400">
                    {proj.project_type || 'Software'}
                  </td>

                  <td className="py-4 px-4">
                    <Badge variant={proj.status === 'Completed' ? 'green' : 'amber'}>
                      {proj.status}
                    </Badge>
                  </td>

                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleTogglePublish(proj)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                        proj.is_published
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                          : 'bg-gray-500/10 border-gray-500/30 text-gray-400 hover:bg-gray-500/20'
                      }`}
                    >
                      {proj.is_published ? (
                        <>
                          <Eye className="w-3 h-3 text-emerald-400" /> Published
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3 text-gray-400" /> Draft
                        </>
                      )}
                    </button>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex items-center gap-1">
                      {proj.is_published && (
                        <Link
                          href={`/projects/${proj.slug}`}
                          target="_blank"
                          className="p-2 rounded-lg text-gray-400 hover:text-cyan-400 hover:bg-white/5 transition-colors"
                          title="View Live Public Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      )}

                      <Link
                        href={`/admin/projects/${proj.id}/edit`}
                        className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        title="Edit Project"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleDuplicate(proj)}
                        className="p-2 rounded-lg text-gray-400 hover:text-purple-400 hover:bg-white/5 transition-colors"
                        title="Duplicate Project"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setProjectToDelete(proj)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    No projects found. Click &quot;Create New Project&quot; to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(projectToDelete)}
        onClose={() => setProjectToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Project"
        message={`Are you sure you want to permanently delete "${projectToDelete?.title}"? This will remove its public page and content.`}
        confirmLabel="Delete Project"
      />
    </div>
  );
}
