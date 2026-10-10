'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Check, GraduationCap, Eye, EyeOff } from 'lucide-react';
import { getEducation, saveEducation } from '../../../lib/db/store';
import { EducationEntry } from '../../../lib/db/types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Switch } from '../../../components/ui/Switch';
import { ConfirmDialog } from '../../../components/admin/ConfirmDialog';

export default function AdminEducationPage() {
  const [educationList, setEducationList] = useState<EducationEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<EducationEntry | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getEducation();
      setEducationList(data);
    }
    load();
  }, []);

  const handleSaveAll = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await saveEducation(educationList);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleAddEntry = () => {
    const newEntry: EducationEntry = {
      id: 'edu-' + Date.now(),
      institution: 'University / Institute Name',
      degree: 'Degree Title (e.g. B.Sc. Computer Science)',
      field_of_study: 'Field of Study (e.g. Software Engineering)',
      start_date: '2022',
      end_date: '2026',
      is_current: false,
      description: 'Program highlights, honors, or key projects...',
      achievements: [],
      coursework: [],
      grade_gpa: '',
      sort_order: educationList.length + 1,
      is_visible: true,
    };
    setEducationList([...educationList, newEntry]);
  };

  const handleUpdate = (id: string, updates: Partial<EducationEntry>) => {
    setEducationList(
      educationList.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const confirmDelete = () => {
    if (!entryToDelete) return;
    setEducationList(educationList.filter((e) => e.id !== entryToDelete.id));
    setEntryToDelete(null);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Academic Education</h2>
          <p className="text-xs text-gray-400 mt-1">
            Manage your degrees, universities, coursework, achievements, and dates.
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
            Add Education
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
        {educationList.map((item, index) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold text-white">Entry #{index + 1}</span>
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
                label="Degree / Qualification"
                value={item.degree}
                onChange={(e) => handleUpdate(item.id, { degree: e.target.value })}
                placeholder="e.g. B.Sc. in Computer Science"
              />
              <Input
                label="Institution / University"
                value={item.institution}
                onChange={(e) => handleUpdate(item.id, { institution: e.target.value })}
                placeholder="e.g. Helwan National University"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Field of Study"
                value={item.field_of_study}
                onChange={(e) => handleUpdate(item.id, { field_of_study: e.target.value })}
                placeholder="e.g. Robotics & Software Engineering"
              />
              <Input
                label="Start Date"
                value={item.start_date}
                onChange={(e) => handleUpdate(item.id, { start_date: e.target.value })}
                placeholder="e.g. 2022"
              />
              <Input
                label="End Date"
                value={item.end_date}
                onChange={(e) => handleUpdate(item.id, { end_date: e.target.value })}
                placeholder="e.g. 2026"
                disabled={item.is_current}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <Input
                label="GPA / Grade (Optional)"
                value={item.grade_gpa || ''}
                onChange={(e) => handleUpdate(item.id, { grade_gpa: e.target.value })}
                placeholder="e.g. 3.8 / 4.0 or Excellent"
              />
              <div className="pt-5">
                <Switch
                  checked={item.is_current}
                  onChange={(val) => handleUpdate(item.id, { is_current: val })}
                  label="Currently Studying Here"
                />
              </div>
            </div>

            <Textarea
              label="Description"
              rows={3}
              value={item.description}
              onChange={(e) => handleUpdate(item.id, { description: e.target.value })}
              placeholder="Program curriculum, graduation project, and academic focus..."
            />
          </div>
        ))}

        {educationList.length === 0 && (
          <div className="p-12 text-center text-gray-500 text-xs">
            No education entries yet. Click &quot;Add Education&quot; to create one.
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={Boolean(entryToDelete)}
        onClose={() => setEntryToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Education Entry"
        message={`Delete ${entryToDelete?.degree} at ${entryToDelete?.institution}?`}
      />
    </div>
  );
}
