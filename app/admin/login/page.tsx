'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Key, Mail, ArrowRight, Database, AlertCircle } from 'lucide-react';
import { createClient, isSupabaseConfigured } from '../../../lib/supabase/client';
import { loginAdminLocally } from '../../../lib/security/auth';
import { Button } from '../../../components/ui/Button';

export default function AdminLoginPage() {
  const router = useRouter();
  const isSupabaseReady = isSupabaseConfigured();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSupabaseReady) {
        const supabase = createClient();
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) throw authError;

        // Verify administrator role in profiles table
        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .maybeSingle();

          if (profile?.role !== 'admin') {
            throw new Error('Access denied: You do not have administrator permissions.');
          }
        }
      } else {
        // Fallback for offline development mode
        await loginAdminLocally(email);
      }

      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

      {/* Radial ambient glow orbs */}
      <div className="glow-orb w-[450px] h-[450px] bg-cyan-500/10 -top-32 -left-32" />
      <div className="glow-orb w-[450px] h-[450px] bg-purple-600/10 -bottom-32 -right-32" />

      <div className="w-full max-w-md relative z-10">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#0f172a]/90 border border-white/10 backdrop-blur-2xl shadow-[0_4px_40px_rgba(0,0,0,0.8)]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-4 shadow-[0_0_20px_rgba(0,200,255,0.2)]">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Admin Console</h1>
            <p className="text-xs text-gray-400 mt-1">Authenticate to manage your portfolio</p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#07090f] border border-white/10 focus:border-cyan-400 rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
                  placeholder="admin@example.com"
                />
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#07090f] border border-white/10 focus:border-cyan-400 rounded-xl px-4 py-3 pl-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/50"
                />
                <Key className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="w-full mt-2"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Setup Link */}
          <div className="mt-6 text-center">
            <Link
              href="/admin/setup"
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Database Connection & Setup</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
