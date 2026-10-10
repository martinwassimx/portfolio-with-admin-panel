'use client';

import React, { useState } from 'react';
import { Copy, Check, Info, Code2 } from 'lucide-react';
import { ProjectContentBlock } from '../../lib/db/types';

export function ProjectContentBlockRenderer({ block }: { block: ProjectContentBlock }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  switch (block.block_type) {
    case 'heading':
      return (
        <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-8 mb-4">
          {block.title || (typeof block.content === 'string' ? block.content : '')}
        </h3>
      );

    case 'paragraph':
      return (
        <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
          {typeof block.content === 'string' ? block.content : ''}
        </p>
      );

    case 'bullet_list':
      const listItems = Array.isArray(block.content) ? block.content : [block.content];
      return (
        <div className="mb-6">
          {block.title && (
            <h4 className="text-lg font-semibold text-gray-200 mb-3">{block.title}</h4>
          )}
          <ul className="space-y-2.5">
            {listItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-gray-300 text-sm sm:text-base">
                <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ backgroundColor: 'var(--accent)' }} />
                <span>{typeof item === 'string' ? item : JSON.stringify(item)}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    case 'code_snippet':
      const snippet = typeof block.content === 'object' && 'code' in block.content
        ? block.content
        : { code: String(block.content), language: 'typescript' };
      return (
        <div
          className="my-6 rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >
          <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <span className="text-xs font-mono text-gray-300">
                {block.title || snippet.language}
              </span>
            </div>
            <button
              onClick={() => handleCopy(snippet.code)}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-4 sm:p-6 overflow-x-auto text-xs sm:text-sm font-mono text-gray-200 leading-relaxed">
            <code>{snippet.code}</code>
          </pre>
        </div>
      );

    case 'callout':
      return (
        <div
          className="my-6 p-5 sm:p-6 rounded-2xl border flex items-start gap-4 shadow-lg backdrop-blur-md"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--accent) 10%, transparent)',
            borderColor: 'color-mix(in srgb, var(--accent) 30%, transparent)',
          }}
        >
          <Info className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
          <div>
            {block.title && (
              <h4 className="text-base font-semibold mb-1" style={{ color: 'var(--accent)' }}>
                {block.title}
              </h4>
            )}
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
              {typeof block.content === 'string' ? block.content : JSON.stringify(block.content)}
            </p>
          </div>
        </div>
      );

    case 'metric':
      const metricData = typeof block.content === 'object' && 'metric' in block.content
        ? block.content
        : { metric: block.title || '0', label: String(block.content) };
      return (
        <div className="my-6 p-6 rounded-2xl bg-white/[0.03] border border-white/10 text-center max-w-sm">
          <p className="text-4xl sm:text-5xl font-black gradient-text mb-2">
            {metricData.metric}
          </p>
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-gray-400">
            {metricData.label}
          </p>
        </div>
      );

    default:
      return null;
  }
}
