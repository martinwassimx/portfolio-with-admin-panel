'use client';

import React, { useState, useEffect } from 'react';
import { History, Search, Clock, UserCheck, Shield } from 'lucide-react';
import { getActivityLogs } from '../../../lib/db/store';
import { ActivityLog } from '../../../lib/db/types';

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function load() {
      const data = await getActivityLogs();
      setLogs(data);
    }
    load();
  }, []);

  const filtered = logs.filter((l) =>
    l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.entity_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.entity_id && l.entity_id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">System Activity & Audit Log</h2>
          <p className="text-xs text-gray-400 mt-1">
            Chronological audit trail of all content updates, publishes, uploads, and theme changes.
          </p>
        </div>

        <span className="text-xs text-gray-400">
          Showing <strong className="text-white">{filtered.length}</strong> events
        </span>
      </div>

      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Filter activities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#0d1120] border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400"
        />
        <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
      </div>

      <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-4">
        <div className="space-y-3">
          {filtered.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0 mt-0.5">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white font-mono uppercase">
                      {log.action.replace(/_/g, ' ')}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-gray-400">
                      {log.entity_type}
                    </span>
                  </div>
                  <p className="text-gray-400 text-[11px]">
                    User: {log.user_email} {log.entity_id && `• ID: ${log.entity_id}`}
                  </p>
                </div>
              </div>

              <div className="text-right sm:text-right shrink-0">
                <span className="text-gray-500 text-[11px] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(log.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="py-12 text-center text-gray-500 text-xs">
              No activity records match your filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
