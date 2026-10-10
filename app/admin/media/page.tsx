'use client';

import React, { useState, useEffect } from 'react';
import {
  Upload,
  Copy,
  Check,
  Trash2,
  Image as ImageIcon,
  FileText,
  Search,
  ExternalLink,
} from 'lucide-react';
import { getMediaAssets, deleteMediaAsset, saveMediaAsset } from '../../../lib/db/store';
import { MediaAsset } from '../../../lib/db/types';
import { Button } from '../../../components/ui/Button';
import { ConfirmDialog } from '../../../components/admin/ConfirmDialog';

export default function AdminMediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [assetToDelete, setAssetToDelete] = useState<MediaAsset | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadAssets = async () => {
    const list = await getMediaAssets();
    setAssets(list);
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newAssets: MediaAsset[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', file.type.includes('pdf') ? 'portfolio-documents' : 'portfolio-media');

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Upload failed');
        }

        const data = await res.json();
        if (data.asset) {
          await saveMediaAsset(data.asset);
          newAssets.push(data.asset);
        }
      }
      if (newAssets.length > 0) {
        setAssets((prev) => [...newAssets, ...prev.filter((a) => !newAssets.some((n) => n.id === a.id))]);
      }
      await loadAssets();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Upload failed. Please verify file size or network connection.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const confirmDelete = async () => {
    if (!assetToDelete) return;
    await deleteMediaAsset(assetToDelete.id);
    setAssetToDelete(null);
    loadAssets();
  };

  const filtered = assets.filter((a) =>
    a.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Media & Asset Library</h2>
          <p className="text-xs text-gray-400 mt-1">
            Upload images, CV documents, and screenshots stored in Supabase Storage.
          </p>
        </div>

        <label className="cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*,application/pdf"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
          <div className="btn-primary py-2.5 px-5 text-xs font-semibold cursor-pointer select-none">
            <Upload className="w-4 h-4 mr-1.5" />
            <span>{uploading ? 'Uploading...' : 'Upload New Media'}</span>
          </div>
        </label>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="Filter files by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#0d1120] border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400"
        />
        <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
      </div>

      {/* Grid of Media Assets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((asset) => {
          const isPdf = asset.mime_type?.includes('pdf') || asset.filename.endsWith('.pdf');
          const isImage = !isPdf;

          return (
            <div
              key={asset.id}
              className="p-3 rounded-2xl bg-[#0f172a] border border-white/10 flex flex-col justify-between hover:border-cyan-500/30 transition-all group"
            >
              <div className="aspect-video rounded-xl overflow-hidden bg-[#07090f] border border-white/5 flex items-center justify-center relative mb-3">
                {isImage && asset.public_url ? (
                  <img
                    src={asset.public_url}
                    alt={asset.alt_text || asset.filename}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-gray-500">
                    <FileText className="w-8 h-8 text-cyan-400" />
                    <span className="text-[10px] uppercase font-mono font-bold">PDF Document</span>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-bold text-white truncate mb-1" title={asset.filename}>
                  {asset.filename}
                </p>
                <div className="flex items-center justify-between text-[10px] text-gray-500 mb-3">
                  <span>{(asset.size_bytes / 1024).toFixed(1)} KB</span>
                  <span>{new Date(asset.created_at).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(asset.id, asset.public_url)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    {copiedId === asset.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setAssetToDelete(asset)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10"
                    title="Delete File"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full py-16 text-center text-gray-500 text-xs">
            No media files uploaded yet. Click &quot;Upload New Media&quot; to upload project screenshots, profile pictures, or CVs.
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={Boolean(assetToDelete)}
        onClose={() => setAssetToDelete(null)}
        onConfirm={confirmDelete}
        title="Delete Media Asset"
        message={`Delete "${assetToDelete?.filename}"? Any project or section referencing this URL will need to be updated.`}
      />
    </div>
  );
}
