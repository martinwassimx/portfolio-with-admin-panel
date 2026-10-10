'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Check, Wrench, Eye, EyeOff } from 'lucide-react';
import {
  getSkillCategories,
  saveSkillCategories,
  getSkills,
  saveSkills,
} from '../../../lib/db/store';
import { SkillCategory, Skill } from '../../../lib/db/types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Dialog } from '../../../components/ui/Dialog';

export default function AdminSkillsPage() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // New Category Modal
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('Code');

  // New Skill Modal
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState('');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillColor, setNewSkillColor] = useState('cyan');

  useEffect(() => {
    async function load() {
      const [cats, sks] = await Promise.all([getSkillCategories(), getSkills()]);
      setCategories(cats);
      setSkills(sks);
      if (cats.length > 0) setSelectedCatId(cats[0].id);
    }
    load();
  }, []);

  const handleSaveAll = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await Promise.all([saveSkillCategories(categories), saveSkills(skills)]);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    const newCat: SkillCategory = {
      id: 'cat-' + Date.now(),
      name: newCatName.trim(),
      icon: newCatIcon,
      sort_order: categories.length + 1,
      is_visible: true,
    };
    setCategories([...categories, newCat]);
    setNewCatName('');
    setIsCategoryModalOpen(false);
  };

  const handleDeleteCategory = (catId: string) => {
    setCategories(categories.filter((c) => c.id !== catId));
    setSkills(skills.filter((s) => s.category_id !== catId));
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim() || !selectedCatId) return;
    const newSk: Skill = {
      id: 'sk-' + Date.now(),
      category_id: selectedCatId,
      name: newSkillName.trim(),
      badge_color: newSkillColor,
      sort_order: skills.filter((s) => s.category_id === selectedCatId).length + 1,
      is_featured: false,
      is_visible: true,
    };
    setSkills([...skills, newSk]);
    setNewSkillName('');
    setIsSkillModalOpen(false);
  };

  const handleDeleteSkill = (skillId: string) => {
    setSkills(skills.filter((s) => s.id !== skillId));
  };

  const handleToggleSkillVisibility = (skillId: string) => {
    setSkills(
      skills.map((s) => (s.id === skillId ? { ...s, is_visible: !s.is_visible } : s))
    );
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Skills & Tech Stack</h2>
          <p className="text-xs text-gray-400 mt-1">
            Organize skills by categories, customize badge styles, and control visibility.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCategoryModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Category
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveAll}
            isLoading={saving}
            leftIcon={saved ? <Check className="w-4 h-4 text-emerald-950" /> : <Save className="w-4 h-4" />}
          >
            {saved ? 'Saved' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Categories & Skills Matrix */}
      <div className="space-y-6">
        {categories.map((cat) => {
          const catSkills = skills.filter((s) => s.category_id === cat.id);

          return (
            <div
              key={cat.id}
              className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-4"
            >
              {/* Category Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={cat.name}
                      onChange={(e) =>
                        setCategories(
                          categories.map((c) =>
                            c.id === cat.id ? { ...c, name: e.target.value } : c
                          )
                        )
                      }
                      className="text-base font-bold text-white bg-transparent border-b border-transparent hover:border-white/20 focus:border-cyan-400 focus:outline-none px-1"
                    />
                    <span className="text-[11px] text-gray-500 block px-1">
                      {catSkills.length} skills listed
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCatId(cat.id);
                      setIsSkillModalOpen(true);
                    }}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Add Skill
                  </Button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Skills List */}
              <div className="flex flex-wrap gap-2.5 pt-2">
                {catSkills.map((sk) => (
                  <div
                    key={sk.id}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
                      sk.is_visible
                        ? 'bg-white/5 border-white/10 text-gray-200'
                        : 'bg-white/[0.02] border-white/5 text-gray-500 opacity-60'
                    }`}
                  >
                    <span className="text-xs font-semibold">{sk.name}</span>

                    {/* Color selector */}
                    <select
                      value={sk.badge_color || 'cyan'}
                      onChange={(e) =>
                        setSkills(
                          skills.map((s) =>
                            s.id === sk.id ? { ...s, badge_color: e.target.value } : s
                          )
                        )
                      }
                      className="text-[10px] bg-transparent text-gray-400 border-none focus:outline-none cursor-pointer"
                    >
                      <option value="cyan" className="bg-[#0f172a]">Cyan</option>
                      <option value="blue" className="bg-[#0f172a]">Blue</option>
                      <option value="purple" className="bg-[#0f172a]">Purple</option>
                      <option value="green" className="bg-[#0f172a]">Green</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleToggleSkillVisibility(sk.id)}
                      className="text-gray-400 hover:text-white"
                      title={sk.is_visible ? 'Hide Skill' : 'Show Skill'}
                    >
                      {sk.is_visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteSkill(sk.id)}
                      className="text-gray-500 hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {catSkills.length === 0 && (
                  <span className="text-xs text-gray-500 italic py-2">
                    No skills in this category. Click &quot;Add Skill&quot; to populate.
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Category Modal */}
      <Dialog
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Create Skill Category"
      >
        <div className="space-y-4">
          <Input
            label="Category Name"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="e.g. Cloud & DevOps"
          />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Icon
            </label>
            <select
              value={newCatIcon}
              onChange={(e) => setNewCatIcon(e.target.value)}
              className="w-full bg-[#0d1120] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200"
            >
              <option value="Code">Code</option>
              <option value="Globe">Globe</option>
              <option value="Cpu">Cpu</option>
              <option value="Database">Database</option>
              <option value="Wrench">Wrench</option>
              <option value="Shield">Shield</option>
            </select>
          </div>
          <div className="pt-2 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsCategoryModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddCategory}>
              Create Category
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Add Skill Modal */}
      <Dialog
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        title="Add New Skill"
      >
        <div className="space-y-4">
          <Input
            label="Skill Name"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            placeholder="e.g. TypeScript, PyTorch, Docker"
          />
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Category
            </label>
            <select
              value={selectedCatId}
              onChange={(e) => setSelectedCatId(e.target.value)}
              className="w-full bg-[#0d1120] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Accent Color
            </label>
            <select
              value={newSkillColor}
              onChange={(e) => setNewSkillColor(e.target.value)}
              className="w-full bg-[#0d1120] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200"
            >
              <option value="cyan">Cyan</option>
              <option value="blue">Blue</option>
              <option value="purple">Purple</option>
              <option value="green">Green</option>
            </select>
          </div>
          <div className="pt-2 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsSkillModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddSkill}>
              Add Skill
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
