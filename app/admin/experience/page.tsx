'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Check, Briefcase, Eye, EyeOff } from 'lucide-react';
import { getExperience, saveExperience } from '../../../lib/db/store';
import { ExperienceEntry } from '../../../lib/db/types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Switch } from '../../../components/ui/Switch';
import { ConfirmDialog } from '../../../components/admin/ConfirmDialog';

export default function AdminExperiencePage() {
  const [experienceList, setExperienceList] = useState<ExperienceEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<ExperienceEntry | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getExperience();
      setExperienceList(data);
    }
    load();
  }, []);

  const handleSaveAll = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await saveExperience(experienceList);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleAddEntry = () => {
    const newEntry: ExperienceEntry = {
      id: 'exp-' + Date.now(),
      company: 'Company / Organization',
      job_title: 'Job Title / Role',
      employment_type: 'Full-time',
      location: 'City, Country / Remote',
      start_date: '2024',
      end_date: 'Present',
      is_current: true,
      description: 'Key responsibilities, team impact, and technical accomplishments...',
      responsibilities: [],
      achievements: [],
      technologies: [],
      sort_order: experienceList.length + 1,
      is_visible: true,
    };
    setExperienceList([...experienceList, newEntry]);
  };

  const handleUpdate = (id: string, updates: Partial<ExperienceEntry>) => {
    setExperienceList(
      experienceList.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const confirmDelete = () => {
    if (!entryToDelete) return;
    setExperienceList(experienceList.filter((e) => e.id !== entryToDelete.id));
    setEntryToDelete(null);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Work & Career Experience</h2>
          <p className="text-xs text-gray-400 mt-1">
            Manage your past roles, companies, responsibilities, deliverables, and tech stack.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddEntry}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Experience
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSaveAll}
            isLoading={saving}
            leftIcon={saved ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Save className="w-3.5 h-3.5" />}
          >
            {saved ? 'Saved' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {experienceList.map((item, index) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-white">Experience #{index + 1}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdate(item.id, { is_visible: !item.is_visible })}
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5"
                  title={item.is_visible ? 'Hide Entry' : 'Show Entry'}
                >
                  {item.is_visible ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setEntryToDelete(item)}
                  className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                  title="Delete Entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Job Title"
                value={item.job_title}
                onChange={(e) => handleUpdate(item.id, { job_title: e.target.value })}
                placeholder="e.g. Software Engineer / Founder"
              />
              <Input
                label="Company / Organization"
                value={item.company}
                onChange={(e) => handleUpdate(item.id, { company: e.target.value })}
                placeholder="e.g. Systemize EG"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Employment Type"
                value={item.employment_type || ''}
                onChange={(e) => handleUpdate(item.id, { employment_type: e.target.value })}
                placeholder="e.g. Full-time, Internship"
              />
              <Input
                label="Location"
                value={item.location || ''}
                onChange={(e) => handleUpdate(item.id, { location: e.target.value })}
                placeholder="e.g. Cairo, Egypt or Remote"
              />
              <div className="pt-5">
                <Switch
                  checked={item.is_current}
                  onChange={(val) => handleUpdate(item.id, { is_current: val })}
                  label="Currently Working Here"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                value={item.start_date}
                onChange={(e) => handleUpdate(item.id, { start_date: e.target.value })}
                placeholder="e.g. Jan 2024"
              />
              <Input
                label="End Date"
                value={item.end_date}
                onChange={(e) => handleUpdate(item.id, { end_date: e.target.value })}
                placeholder="e.g. Present"
                disabled={item.is_current}
              />
            </div>

            <Textarea
              label="Role Overview / Summary"
              rows={3}
              value={item.description}
              onChange={(e) => handleUpdate(item.id, { description: e.target.value })}
              placeholder="Key responsibilities, engineering deliverables, and technical achievements..."
            />
          </div>
        ))}

        {experienceList.length === 0 && (
          <div className="p-12 text-center text-gray-500 text-xs">
            No experience entries yet. Click &quot;Add Experience&quot; to create one.
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={Boolean(entryToDelete)}
        onClose={() => setEntryToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Experience Entry"
        message={`Delete ${entryToDelete?.job_title} at ${entryToDelete?.company}?`}
      />
    </div>
  );
}
