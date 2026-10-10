'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FolderKanban,
  Wrench,
  GraduationCap,
  Briefcase,
  Mail,
  Palette,
  ArrowRight,
  Plus,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';
import {
  getProjects,
  getSkills,
  getEducation,
  getExperience,
  getContactMessages,
  getActivityLogs,
  updateContactMessageStatus,
} from '../../lib/db/store';
import { Project, Skill, EducationEntry, ExperienceEntry, ContactMessage, ActivityLog } from '../../lib/db/types';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    publishedProjects: 0,
    draftProjects: 0,
    skillsCount: 0,
    educationCount: 0,
    experienceCount: 0,
    unreadMessages: 0,
  });

  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [allProjects, skills, edu, exp, msgs, logs] = await Promise.all([
        getProjects({ publishedOnly: false }),
        getSkills(),
        getEducation(),
        getExperience(),
        getContactMessages(),
        getActivityLogs(),
      ]);

      const published = allProjects.filter((p) => p.is_published).length;
      const draft = allProjects.length - published;
      const unread = msgs.filter((m) => m.status === 'unread').length;

      setStats({
        publishedProjects: published,
        draftProjects: draft,
        skillsCount: skills.length,
        educationCount: edu.length,
        experienceCount: exp.length,
        unreadMessages: unread,
      });

      setRecentMessages(msgs.slice(0, 5));
      setActivityLogs(logs.slice(0, 6));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkRead = async (id: string) => {
    await updateContactMessageStatus(id, 'read');
    loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Published Projects',
      value: stats.publishedProjects,
      sub: `${stats.draftProjects} draft`,
      icon: FolderKanban,
      href: '/admin/projects',
      color: 'text-cyan-400',
      border: 'border-cyan-500/20',
      bg: 'bg-cyan-500/10',
    },
    {
      title: 'Skills Configured',
      value: stats.skillsCount,
      sub: 'Across categories',
      icon: Wrench,
      href: '/admin/skills',
      color: 'text-blue-400',
      border: 'border-blue-500/20',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Experience Entries',
      value: stats.experienceCount,
      sub: 'Timeline records',
      icon: Briefcase,
      href: '/admin/experience',
      color: 'text-purple-400',
      border: 'border-purple-500/20',
      bg: 'bg-purple-500/10',
    },
    {
      title: 'Education Entries',
      value: stats.educationCount,
      sub: 'Academic records',
      icon: GraduationCap,
      href: '/admin/education',
      color: 'text-emerald-400',
      border: 'border-emerald-500/20',
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Unread Messages',
      value: stats.unreadMessages,
      sub: 'From contact form',
      icon: Mail,
      href: '/admin/messages',
      color: stats.unreadMessages > 0 ? 'text-amber-400' : 'text-gray-400',
      border: stats.unreadMessages > 0 ? 'border-amber-500/30' : 'border-white/10',
      bg: stats.unreadMessages > 0 ? 'bg-amber-500/10' : 'bg-white/5',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#0d1627] via-[#0f172a] to-[#171329] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Admin Control Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome to your Portfolio Dashboard
          </h2>
          <p className="text-sm text-gray-400 mt-1 max-w-xl">
            Manage your projects, customize styling and themes, configure content, and review incoming contact messages.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <Link
            href="/admin/cv-import"
            className="btn-primary py-2.5 px-4 text-xs font-semibold"
          >
            <Sparkles className="w-4 h-4" />
            <span>CV Auto-Fill Wizard</span>
          </Link>
          <Link
            href="/admin/projects/new"
            className="btn-secondary py-2.5 px-4 text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </Link>
          <Link
            href="/admin/theme"
            className="btn-secondary py-2.5 px-4 text-xs"
          >
            <Palette className="w-4 h-4" />
            <span>Theme Studio</span>
          </Link>
        </div>
      </div>

      {/* Database Derived Real Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link
              key={idx}
              href={card.href}
              className={`p-5 rounded-2xl bg-[#0f172a]/70 border ${card.border} backdrop-blur-md hover:scale-[1.02] transition-all group`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-gray-400 group-hover:text-white transition-colors">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl ${card.bg} ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-white tracking-tight">
                {card.value}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">{card.sub}</p>
            </Link>
          );
        })}
      </div>

      {/* Split Section: Inbound Contact Messages & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Messages (Left 7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0f172a] border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Recent Inquiries</h3>
            </div>
            <Link
              href="/admin/messages"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentMessages.length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-xs">
              No inquiries received yet. Submissions from the contact form will appear here.
            </div>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-xl border transition-all ${
                    msg.status === 'unread'
                      ? 'bg-cyan-500/[0.04] border-cyan-500/30'
                      : 'bg-white/[0.02] border-white/5'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <span className="text-sm font-semibold text-white">{msg.name}</span>
                      <span className="text-xs text-gray-400 ml-2">({msg.email})</span>
                    </div>
                    {msg.status === 'unread' && (
                      <button
                        onClick={() => handleMarkRead(msg.id)}
                        className="text-[11px] font-semibold text-cyan-400 hover:underline shrink-0"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                  <p className="text-xs font-medium text-gray-300 mb-1">{msg.subject}</p>
                  <p className="text-xs text-gray-400 line-clamp-2">{msg.message}</p>
                  <p className="text-[10px] text-gray-600 mt-2">
                    {new Date(msg.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Feed (Right 5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0f172a] border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-400" />
              <h3 className="text-base font-bold text-white">System Activity</h3>
            </div>
            <Link
              href="/admin/activity"
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <span>Audit Log</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {activityLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-200 truncate">
                    {log.action.replace(/_/g, ' ')}
                  </p>
                  <p className="text-gray-500 text-[11px]">
                    {log.entity_type} {log.entity_id && `(${log.entity_id})`}
                  </p>
                </div>
                <span className="text-[10px] text-gray-500 shrink-0">
                  {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
