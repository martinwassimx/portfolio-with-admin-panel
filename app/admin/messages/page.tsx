'use client';

import React, { useState, useEffect } from 'react';
import {
  Mail,
  Search,
  Trash2,
  Archive,
  CheckCircle,
  Eye,
  Reply,
  Clock,
  User,
} from 'lucide-react';
import {
  getContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
} from '../../../lib/db/store';
import { ContactMessage } from '../../../lib/db/types';
import { Dialog } from '../../../components/ui/Dialog';
import { ConfirmDialog } from '../../../components/admin/ConfirmDialog';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'archived'>('all');
  const [activeMessage, setActiveMessage] = useState<ContactMessage | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null);

  const loadMessages = async () => {
    const data = await getContactMessages();
    setMessages(data);
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleStatusChange = async (id: string, status: ContactMessage['status']) => {
    await updateContactMessageStatus(id, status);
    loadMessages();
    if (activeMessage?.id === id) {
      setActiveMessage({ ...activeMessage, status });
    }
  };

  const confirmDelete = async () => {
    if (!messageToDelete) return;
    await deleteContactMessage(messageToDelete.id);
    setMessageToDelete(null);
    if (activeMessage?.id === messageToDelete.id) {
      setActiveMessage(null);
    }
    loadMessages();
  };

  const filtered = messages.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'unread'
        ? m.status === 'unread'
        : filter === 'read'
        ? m.status === 'read'
        : m.status === 'archived';

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Contact Messages Inbox</h2>
          <p className="text-xs text-gray-400 mt-1">
            Review and manage inquiries received from your public portfolio contact form.
          </p>
        </div>

        <span className="text-xs text-gray-400">
          Total messages: <strong className="text-white">{messages.length}</strong>
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search inquiries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0d1120] border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400"
          />
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {(['all', 'unread', 'read', 'archived'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                filter === tab
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(0,200,255,0.3)]'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {filtered.map((msg) => (
          <div
            key={msg.id}
            className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:border-cyan-500/40 ${
              msg.status === 'unread'
                ? 'bg-cyan-500/[0.04] border-cyan-500/30'
                : 'bg-[#0f172a] border-white/10'
            }`}
            onClick={() => {
              setActiveMessage(msg);
              if (msg.status === 'unread') handleStatusChange(msg.id, 'read');
            }}
          >
            <div className="flex items-start gap-4 min-w-0 flex-1">
              <div
                className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                  msg.status === 'unread'
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'bg-white/5 text-gray-500'
                }`}
              >
                <Mail className="w-4 h-4" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-white">{msg.name}</span>
                  <span className="text-xs text-gray-400">({msg.email})</span>
                  {msg.status === 'unread' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500 text-slate-950">
                      NEW
                    </span>
                  )}
                </div>
                <p className="text-xs font-medium text-gray-300 truncate mb-1">{msg.subject}</p>
                <p className="text-xs text-gray-500 line-clamp-1">{msg.message}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
              <span className="text-[11px] text-gray-500">
                {new Date(msg.created_at).toLocaleDateString()}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMessageToDelete(msg);
                }}
                className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10"
                title="Delete message"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-16 rounded-2xl bg-[#0f172a] border border-white/10 text-center text-gray-500 text-xs">
            No inquiries match your current filter.
          </div>
        )}
      </div>

      {/* Message View Modal */}
      {activeMessage && (
        <Dialog
          isOpen={Boolean(activeMessage)}
          onClose={() => setActiveMessage(null)}
          title={activeMessage.subject}
          maxWidth="lg"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{activeMessage.name}</h4>
                  <a
                    href={`mailto:${activeMessage.email}`}
                    className="text-xs text-cyan-400 hover:underline"
                  >
                    {activeMessage.email}
                  </a>
                </div>
              </div>

              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {new Date(activeMessage.created_at).toLocaleString()}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#07090f] border border-white/5 text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
              {activeMessage.message}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange(activeMessage.id, 'unread')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-300"
                >
                  Mark Unread
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(activeMessage.id, 'archived')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-300 flex items-center gap-1"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>Archive</span>
                </button>
              </div>

              <a
                href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(activeMessage.subject)}`}
                className="btn-primary py-2 px-4 text-xs inline-flex items-center gap-1.5"
              >
                <Reply className="w-3.5 h-3.5" />
                <span>Reply by Email</span>
              </a>
            </div>
          </div>
        </Dialog>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(messageToDelete)}
        onClose={() => setMessageToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Message"
        message={`Permanently delete message from ${messageToDelete?.name}?`}
      />
    </div>
  );
}
