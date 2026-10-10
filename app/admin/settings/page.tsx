'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Save, Check, ShieldAlert, Code2, Sparkles, Trash2, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { getSiteSettings, updateSiteSettings } from '../../../lib/db/store';
import { SiteSettings } from '../../../lib/db/types';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Switch } from '../../../components/ui/Switch';
import { Dialog } from '../../../components/ui/Dialog';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getSiteSettings();
      setSettings(data);
    }
    load();
  }, []);

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await updateSiteSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleExecuteReset = async () => {
    setResetting(true);
    setResetError(null);
    setResetDone(false);

    try {
      const res = await fetch('/api/store/reset', { method: 'POST' });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Reset failed.');

      try {
        Object.keys(localStorage).forEach((k) => {
          if (k.startsWith('portfolio_db_')) localStorage.removeItem(k);
        });
        localStorage.setItem('portfolio_db___version', 'v3_clean');
      } catch (e) {
        console.warn(e);
      }

      window.dispatchEvent(new Event('portfolio_db_updated'));

      setIsResetModalOpen(false);
      setResetDone(true);
      const fresh = await getSiteSettings();
      setSettings(fresh);
      setTimeout(() => setResetDone(false), 8000);
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setResetError(err.message || 'Reset failed.');
    } finally {
      setResetting(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">General Website Settings</h2>
          <p className="text-xs text-gray-400 mt-1">
            Configure contact coordinates, maintenance mode, interactive toggles, and custom styling.
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="sm"
          isLoading={saving}
          leftIcon={saved ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Save className="w-3.5 h-3.5" />}
        >
          {saved ? 'Saved' : 'Save Changes'}
        </Button>
      </div>

      {/* Contact Details */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400">
          Contact Details & Inquiries
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Inquiry Email Address"
            value={settings.contact_email || ''}
            onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
            placeholder="test@example.com"
          />
          <Input
            label="Phone Number (Optional)"
            value={settings.contact_phone || ''}
            onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
            placeholder="+20 127 501 1232"
          />
          <Input
            label="Location"
            value={settings.contact_location || ''}
            onChange={(e) => setSettings({ ...settings, contact_location: e.target.value })}
            placeholder="Giza / Cairo, Egypt"
          />
        </div>

        <div className="pt-2">
          <Switch
            checked={settings.contact_form_enabled !== false}
            onChange={(val) => setSettings({ ...settings, contact_form_enabled: val })}
            label="Accept Contact Form Submissions"
            description="When disabled, visitors are directed to contact you by email."
          />
        </div>
      </div>

      {/* Maintenance & Announcement */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          <span>Operational Modes & Announcements</span>
        </h3>

        <div className="space-y-4">
          <Switch
            checked={settings.maintenance_mode}
            onChange={(val) => setSettings({ ...settings, maintenance_mode: val })}
            label="Maintenance Mode"
            description="When enabled, public visitors see an under-maintenance landing screen."
          />

          <div className="pt-3 border-t border-white/5 space-y-3">
            <Switch
              checked={settings.announcement_banner_enabled}
              onChange={(val) => setSettings({ ...settings, announcement_banner_enabled: val })}
              label="Top Announcement Banner"
              description="Displays a highlighted ribbon across the very top of your site."
            />

            {settings.announcement_banner_enabled && (
              <Input
                label="Announcement Banner Text"
                value={settings.announcement_banner_text || ''}
                onChange={(e) =>
                  setSettings({ ...settings, announcement_banner_text: e.target.value })
                }
                placeholder="🚀 Open for new contracts & collaborations"
              />
            )}
          </div>
        </div>
      </div>

      {/* Interactive FX Toggles */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>Interactive Visual FX</span>
        </h3>

        <div className="space-y-4">
          <Switch
            checked={settings.enable_custom_cursor !== false}
            onChange={(val) => setSettings({ ...settings, enable_custom_cursor: val })}
            label="Custom Cyber Cursor"
            description="Precision cursor dot with trailing follower ring (automatically disabled on mobile/touch screens)."
          />
        </div>
      </div>

      {/* Custom CSS */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <Code2 className="w-4 h-4" />
            <span>Advanced Custom CSS</span>
          </h3>
          <span className="text-[11px] text-gray-500">Injected safely into document head</span>
        </div>

        <Textarea
          rows={5}
          value={settings.custom_css || ''}
          onChange={(e) => setSettings({ ...settings, custom_css: e.target.value })}
          placeholder="/* Custom CSS overrides */&#10;.custom-class { ... }"
        />
      </div>

      {/* Danger Zone: Clear All Portfolio Data */}
      <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Danger Zone: Clear All Portfolio Data</h3>
              <p className="text-xs text-gray-400 mt-0.5 max-w-lg">
                Permanently wipes all skills, career experience, education, certifications, projects, bio, and contact info — resets the entire website to a clean blank slate.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setResetError(null);
              setIsResetModalOpen(true);
            }}
            disabled={resetting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/35 border border-red-500/50 hover:border-red-400 text-red-300 hover:text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-red-950/40 shrink-0"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
            <span>Clear All Portfolio Data</span>
          </button>
        </div>

        {resetDone && (
          <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>All portfolio data has been successfully cleared and reset to fresh defaults.</span>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <Dialog
        isOpen={isResetModalOpen}
        onClose={() => !resetting && setIsResetModalOpen(false)}
        title="Clear All Portfolio Data?"
        description="Permanently wipe all website content and start fresh from zero"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-xs">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <p className="font-bold text-white text-sm">Are you sure you want to proceed?</p>
              <p className="text-gray-300">This action will immediately delete:</p>
              <ul className="list-disc list-inside space-y-1 text-red-200/90 font-medium pl-1">
                <li>All technical skills & categories</li>
                <li>All career work experience history</li>
                <li>All academic degrees & education records</li>
                <li>All certifications & licenses</li>
                <li>All featured projects & case studies</li>
                <li>Personal hero info, bio paragraphs & contact coordinates</li>
              </ul>
            </div>
          </div>

          {resetError && (
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{resetError}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              disabled={resetting}
              onClick={() => setIsResetModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={resetting}
              onClick={handleExecuteReset}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors disabled:opacity-50 shadow-lg shadow-red-900/40"
            >
              {resetting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Clearing All Data...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Yes, Clear Everything</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Dialog>
    </form>
  );
}
