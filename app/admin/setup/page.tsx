'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Database, CheckCircle2, AlertCircle, Copy, Check, ArrowRight, Shield, Terminal } from 'lucide-react';
import { isSupabaseConfigured } from '../../../lib/supabase/client';
import { Button } from '../../../components/ui/Button';

export default function AdminSetupPage() {
  const [copied, setCopied] = useState(false);
  const isConnected = isSupabaseConfigured();

  const envSample = `NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000`;

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(envSample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#07090f] py-16 px-4 sm:px-8 max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-4 shadow-[0_0_25px_rgba(0,200,255,0.2)]">
          <Database className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
          Portfolio Setup & Supabase Diagnostics
        </h1>
        <p className="text-sm text-gray-400 max-w-xl mx-auto">
          Configure your Supabase PostgreSQL database, storage buckets, and administrator authentication.
        </p>
      </div>

      {/* Connection Status Banner */}
      <div
        className={`p-6 rounded-2xl border mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          isConnected
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
        }`}
      >
        <div className="flex items-center gap-3">
          {isConnected ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-6 h-6 text-amber-400 shrink-0" />
          )}
          <div>
            <h3 className="text-base font-bold text-white">
              {isConnected ? 'Supabase Database Connected' : 'Running in Local Offline Mode'}
            </h3>
            <p className="text-xs opacity-90 mt-0.5">
              {isConnected
                ? 'Your application is connected to your remote Supabase instance.'
                : 'All changes are currently stored in reactive local storage. Follow the steps below to connect live PostgreSQL.'}
            </p>
          </div>
        </div>

        <Link href="/admin">
          <Button variant="primary" size="sm">
            <span>Enter Admin Console</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

      {/* Step by step guide */}
      <div className="space-y-8">
        {/* Step 1: Env Variables */}
        <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h2 className="text-lg font-bold text-white">Configure Environment Variables</h2>
            </div>
            <button
              onClick={handleCopyEnv}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy .env.local Template'}</span>
            </button>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            Create or update <code className="text-cyan-300">.env.local</code> in your project root with your Supabase credentials:
          </p>
          <pre className="p-4 rounded-xl bg-[#07090f] border border-white/5 text-xs font-mono text-gray-300 overflow-x-auto">
            <code>{envSample}</code>
          </pre>
        </div>

        {/* Step 2: Database Migrations */}
        <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h2 className="text-lg font-bold text-white">Run SQL Migrations</h2>
          </div>
          <p className="text-xs text-gray-400 mb-4">
            Execute the prepared SQL migration files located in your repository in your Supabase SQL Editor:
          </p>
          <ul className="space-y-2 text-xs font-mono text-gray-300">
            <li className="p-3 rounded-xl bg-[#07090f] border border-white/5 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>supabase/migrations/20261010000000_initial_schema.sql</span>
            </li>
            <li className="p-3 rounded-xl bg-[#07090f] border border-white/5 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>supabase/migrations/20261010000001_storage_setup.sql</span>
            </li>
          </ul>
        </div>

        {/* Step 3: Admin User Creation */}
        <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h2 className="text-lg font-bold text-white">Initialize Admin User in Supabase</h2>
          </div>
          <p className="text-xs text-gray-400 mb-3 leading-relaxed">
            The SQL migration includes an automated security trigger: the first user created in Supabase Authentication is automatically granted the <code className="text-cyan-300">&apos;admin&apos;</code> role in the <code className="text-cyan-300">profiles</code> table.
          </p>
          <p className="text-xs text-gray-400 leading-relaxed">
            Alternatively, you can assign the admin role to any existing user by executing:
          </p>
          <pre className="p-3 mt-3 rounded-xl bg-[#07090f] border border-white/5 text-xs font-mono text-cyan-300">
            {`UPDATE public.profiles SET role = 'admin' WHERE email = 'your-email@example.com';`}
          </pre>
        </div>
      </div>
    </div>
  );
}
