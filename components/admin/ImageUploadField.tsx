'use client';

import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Check, Loader2, FolderOpen } from 'lucide-react';
import { Button } from '../ui/Button';
import { getMediaAssets, saveMediaAsset } from '../../lib/db/store';
import { MediaAsset } from '../../lib/db/types';

interface ImageUploadFieldProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  helperText?: string;
  placeholder?: string;
}

export function ImageUploadField({
  label = 'Photo / Image',
  value = '',
  onChange,
  helperText = 'Upload a photo (PNG, JPG, WebP) or paste an image URL.',
  placeholder = 'https://... or /uploads/...',
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [libraryAssets, setLibraryAssets] = useState<MediaAsset[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'portfolio-media');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to upload image.');
      }

      const data = await res.json();
      if (data.asset?.public_url) {
        // Also save to client store so it appears in Media Library
        await saveMediaAsset(data.asset);
        onChange(data.asset.public_url);
      } else {
        throw new Error('Upload succeeded but no URL was returned.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Upload error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const openMediaPicker = async () => {
    setShowMediaPicker(true);
    setLoadingLibrary(true);
    try {
      const assets = await getMediaAssets();
      setLibraryAssets(assets.filter((a) => !a.mime_type?.includes('pdf') && !a.filename.endsWith('.pdf')));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLibrary(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300">
          {label}
        </label>
      )}

      {/* Image Preview & Action Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
        {/* Preview thumbnail */}
        <div className="w-24 h-24 rounded-lg bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center shrink-0 relative group">
          {value ? (
            <>
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-400 transition-opacity"
                title="Remove image"
              >
                <X className="w-5 h-5" />
              </button>
            </>
          ) : (
            <ImageIcon className="w-8 h-8 text-gray-600" />
          )}
        </div>

        {/* Buttons & Input */}
        <div className="flex-1 w-full space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="btn-primary py-2 px-3.5 text-xs font-semibold cursor-pointer"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  <span>Upload Photo</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={openMediaPicker}
              className="btn-secondary py-2 px-3 text-xs"
            >
              <FolderOpen className="w-3.5 h-3.5 mr-1.5" />
              <span>Choose from Library</span>
            </button>

            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="text-xs text-gray-400 hover:text-red-400 p-2 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* URL text field fallback */}
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-[#0d1120] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
      {helperText && !error && <p className="text-[11px] text-gray-400">{helperText}</p>}

      {/* Media Picker Modal */}
      {showMediaPicker && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-cyan-400" />
                Select Photo from Media Library
              </h3>
              <button
                type="button"
                onClick={() => setShowMediaPicker(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
              {loadingLibrary ? (
                <div className="py-12 flex justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                </div>
              ) : libraryAssets.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-500">
                  No images found in your library. Upload one directly!
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {libraryAssets.map((asset) => (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => {
                        onChange(asset.public_url);
                        setShowMediaPicker(false);
                      }}
                      className="group relative aspect-video rounded-xl overflow-hidden border border-white/10 hover:border-cyan-400 transition-all bg-black/40 text-left"
                    >
                      <img
                        src={asset.public_url}
                        alt={asset.filename}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-1.5">
                        <p className="text-[10px] text-white truncate font-medium">
                          {asset.filename}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-3 border-t border-white/10 flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowMediaPicker(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
