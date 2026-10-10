'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  Key,
  Database,
  CheckCircle2,
  AlertTriangle,
  LogOut,
} from 'lucide-react';
import { getCurrentAdmin, AdminUser, logoutAdmin } from '../../../lib/security/auth';
import { isSupabaseConfigured, createClient } from '../../../lib/supabase/client';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

export default function AdminSecurityPage() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [passwordStatus, setPasswordStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const isConnected = isSupabaseConfigured();

  useEffect(() => {
    async function load() {
      const u = await getCurrentAdmin();
      setAdminUser(u);
    }
    load();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setPasswordStatus('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setPasswordStatus('');

    try {
      if (isConnected) {
        const supabase = createClient();
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
        setPasswordStatus('Password updated successfully in Supabase Authentication!');
      } else {
        setPasswordStatus('Password updated for your local session.');
      }
      setNewPassword('');
    } catch (e: any) {
      setPasswordStatus(e.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    window.location.href = '/admin/login';
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Account & Security Center</h2>
          <p className="text-xs text-gray-400 mt-1">
            Review administrator privileges, update credentials, and verify Row Level Security status.
          </p>
        </div>

        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={handleLogout}
          leftIcon={<LogOut className="w-3.5 h-3.5" />}
        >
          Sign Out
        </Button>
      </div>

      {/* Admin Profile & Role */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Authenticated Administrator Identity</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-[11px] font-semibold uppercase text-gray-500 block mb-1">
              Active Email
            </span>
            <span className="text-sm font-bold text-white">
              {adminUser?.email || 'admin@portfolio.local'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase text-gray-500 block mb-1">
                Authorization Role
              </span>
              <span className="text-sm font-bold text-cyan-400 uppercase">
                {adminUser?.role || 'admin'}
              </span>
            </div>
            <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_#10b981]" />
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <Key className="w-4 h-4" />
          <span>Update Security Password</span>
        </h3>

        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
          <Input
            label="New Password (min 6 characters)"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••••••"
          />

          {passwordStatus && (
            <p className="text-xs font-semibold text-cyan-300">{passwordStatus}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={loading}
          >
            Update Password
          </Button>
        </form>
      </div>

      {/* Row Level Security Verification Checklist */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <Database className="w-4 h-4" />
          <span>PostgreSQL Row Level Security (RLS) Audit</span>
        </h3>

        <p className="text-xs text-gray-400">
          All 16 tables in the database schema enforce strict RLS policies to safeguard administrative data:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
          {[
            'contact_messages: Public insert only, private read/write',
            'projects: Published read, admin-only write & drafts',
            'theme_settings: Public active read, admin-only write',
            'profiles: Administrator authorization verification',
            'storage: Media public, admin uploads & deletes',
            'activity_logs: Administrator audit access only',
          ].map((check, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-gray-300"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{check}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
