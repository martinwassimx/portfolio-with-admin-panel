'use client';

import React, { useState, useEffect } from 'react';
import {
  Award,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Calendar,
  MoveUp,
  MoveDown,
  Sparkles,
  Check,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  getCertifications,
  saveCertifications,
  saveCertification,
  deleteCertification,
} from '../../../lib/db/store';
import { Certification } from '../../../lib/db/types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Switch } from '../../../components/ui/Switch';
import { ConfirmDialog } from '../../../components/admin/ConfirmDialog';
import { ImageUploadField } from '../../../components/admin/ImageUploadField';
import { Badge } from '../../../components/ui/Badge';

export default function AdminCertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [certToDelete, setCertToDelete] = useState<Certification | null>(null);
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    const list = await getCertifications();
    setCertifications(list.sort((a, b) => a.sort_order - b.sort_order));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStartCreate = () => {
    setEditingCert({
      id: 'cert-' + Date.now(),
      title: '',
      issuer: '',
      issue_date: new Date().getFullYear().toString(),
      expiry_date: 'Does not expire',
      credential_id: '',
      credential_url: '',
      image_url: '',
      skills: [],
      is_featured: false,
      is_visible: true,
      sort_order: certifications.length + 1,
    });
    setIsCreating(true);
    setSkillInput('');
  };

  const handleStartEdit = (cert: Certification) => {
    setEditingCert({ ...cert, skills: cert.skills || [] });
    setIsCreating(false);
    setSkillInput('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert || !editingCert.title || !editingCert.issuer) {
      alert('Please fill in both Certificate Title and Issuing Organization.');
      return;
    }

    setSaving(true);
    try {
      await saveCertification(editingCert);
      setEditingCert(null);
      setIsCreating(false);
      await loadData();
    } catch (err) {
      console.error(err);
      alert('Failed to save certification.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!certToDelete) return;
    await deleteCertification(certToDelete.id);
    setCertToDelete(null);
    await loadData();
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= certifications.length) return;

    const items = [...certifications];
    const [moved] = items.splice(index, 1);
    items.splice(targetIndex, 0, moved);

    const reordered = items.map((item, idx) => ({ ...item, sort_order: idx + 1 }));
    setCertifications(reordered);
    await saveCertifications(reordered);
  };

  const handleToggleVisibility = async (cert: Certification) => {
    const updated = { ...cert, is_visible: !cert.is_visible };
    await saveCertification(updated);
    await loadData();
  };

  const handleAddSkill = () => {
    if (!skillInput.trim() || !editingCert) return;
    setEditingCert({
      ...editingCert,
      skills: [...(editingCert.skills || []), skillInput.trim()],
    });
    setSkillInput('');
  };

  const handleRemoveSkill = (skillIndex: number) => {
    if (!editingCert) return;
    setEditingCert({
      ...editingCert,
      skills: editingCert.skills?.filter((_, i) => i !== skillIndex),
    });
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Award className="w-5 h-5 text-cyan-400" />
            <span>Licenses & Certifications</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Manage industry accreditations, AI certificates, cloud badges, and upload certificate preview photos.
          </p>
        </div>

        <Button
          onClick={handleStartCreate}
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Certification
        </Button>
      </div>

      {/* Certifications List */}
      <div className="space-y-3">
        {certifications.map((cert, index) => (
          <div
            key={cert.id}
            className={`p-4 rounded-2xl bg-[#0f172a] border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              cert.is_visible ? 'border-white/10 hover:border-cyan-500/30' : 'border-white/5 opacity-60'
            }`}
          >
            <div className="flex items-center gap-4 min-w-0">
              {/* Order Controls */}
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleMove(index, 'up')}
                  disabled={index === 0}
                  className="p-1 text-gray-500 hover:text-white disabled:opacity-20"
                  title="Move Up"
                >
                  <MoveUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(index, 'down')}
                  disabled={index === certifications.length - 1}
                  className="p-1 text-gray-500 hover:text-white disabled:opacity-20"
                  title="Move Down"
                >
                  <MoveDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Photo / Badge Preview */}
              <div className="w-14 h-14 rounded-xl bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                {cert.image_url ? (
                  <img
                    src={cert.image_url}
                    alt={cert.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <ShieldCheck className="w-6 h-6 text-cyan-400" />
                )}
              </div>

              {/* Details */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    {cert.issuer}
                  </span>
                  {cert.is_featured && (
                    <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.2 rounded-full font-bold">
                      Featured
                    </span>
                  )}
                  {!cert.is_visible && (
                    <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.2 rounded-full">
                      Hidden
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-white truncate">{cert.title}</h4>

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-1">
                  {cert.issue_date && <span>Issued {cert.issue_date}</span>}
                  {cert.credential_id && (
                    <span className="font-mono text-[11px] text-gray-500">ID: {cert.credential_id}</span>
                  )}
                  {cert.credential_url && (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <span>Verify</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => handleToggleVisibility(cert)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                title={cert.is_visible ? 'Hide Certification' : 'Show Certification'}
              >
                {cert.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-gray-600" />}
              </button>

              <button
                type="button"
                onClick={() => handleStartEdit(cert)}
                className="p-2 rounded-lg text-gray-400 hover:text-cyan-300 hover:bg-white/5 transition-colors"
                title="Edit Certification"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setCertToDelete(cert)}
                className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Delete Certification"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {certifications.length === 0 && (
          <div className="py-16 text-center text-xs text-gray-500 border border-dashed border-white/10 rounded-2xl">
            No certifications added yet. Click &quot;Add Certification&quot; to showcase your verified credentials.
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {editingCert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" />
                {isCreating ? 'Add New Certification' : 'Edit Certification'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingCert(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-5 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Certification Title *"
                  required
                  placeholder="e.g. Deep Learning Specialization"
                  value={editingCert.title}
                  onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                />

                <Input
                  label="Issuing Organization *"
                  required
                  placeholder="e.g. DeepLearning.AI & Coursera"
                  value={editingCert.issuer}
                  onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                />
              </div>

              {/* Photo Upload with Instant Preview */}
              <ImageUploadField
                label="Certificate Photo / Badge Image"
                value={editingCert.image_url || ''}
                onChange={(url) => setEditingCert({ ...editingCert, image_url: url })}
                helperText="Upload a photo or certificate screenshot. Visitors can click to preview in high resolution."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Issue Date"
                  placeholder="e.g. 2024 or Nov 2024"
                  value={editingCert.issue_date}
                  onChange={(e) => setEditingCert({ ...editingCert, issue_date: e.target.value })}
                />

                <Input
                  label="Expiration Date"
                  placeholder="e.g. Does not expire or 2027"
                  value={editingCert.expiry_date || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, expiry_date: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Credential ID"
                  placeholder="e.g. DLAI-DL-948123"
                  value={editingCert.credential_id || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, credential_id: e.target.value })}
                />

                <Input
                  label="Verification Link (URL)"
                  placeholder="https://coursera.org/verify/..."
                  value={editingCert.credential_url || ''}
                  onChange={(e) => setEditingCert({ ...editingCert, credential_url: e.target.value })}
                />
              </div>

              {/* Skills Tags */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
                  Skills & Topics Covered
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="Type skill & press Enter (e.g. PyTorch)"
                    className="flex-1 bg-[#0d1120] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                  />
                  <Button type="button" variant="secondary" size="sm" onClick={handleAddSkill}>
                    Add
                  </Button>
                </div>

                {editingCert.skills && editingCert.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {editingCert.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(index)}
                          className="hover:text-red-400 ml-1 text-gray-500"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="pt-3 border-t border-white/5 space-y-4">
                <Switch
                  checked={Boolean(editingCert.is_featured)}
                  onChange={(val) => setEditingCert({ ...editingCert, is_featured: val })}
                  label="Featured Credential"
                  description="Prominently displays a glowing featured badge on the certificate card."
                />

                <Switch
                  checked={editingCert.is_visible !== false}
                  onChange={(val) => setEditingCert({ ...editingCert, is_visible: val })}
                  label="Visible on Portfolio"
                  description="When disabled, this certification is saved as a draft and hidden from visitors."
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditingCert(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={saving}
                  leftIcon={<Check className="w-4 h-4 text-slate-950" />}
                >
                  Save Certification
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(certToDelete)}
        onClose={() => setCertToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Certification"
        message={`Are you sure you want to remove "${certToDelete?.title}"? This cannot be undone.`}
      />
    </div>
  );
}
