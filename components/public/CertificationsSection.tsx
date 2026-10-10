'use client';

import React, { useState } from 'react';
import { Award, ExternalLink, Calendar, CheckCircle2, ShieldCheck, X, Eye, Sparkles } from 'lucide-react';
import { PageSectionConfig, Certification } from '../../lib/db/types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface CertificationsSectionProps {
  section: PageSectionConfig;
  certifications: Certification[];
}

export function CertificationsSection({ section, certifications }: CertificationsSectionProps) {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  const visibleCerts = [...certifications]
    .filter((c) => c.is_visible !== false)
    .sort((a, b) => a.sort_order - b.sort_order);

  if (visibleCerts.length === 0) return null;

  const cfg = section.config || {};

  return (
    <section id="certifications" className="py-24 relative overflow-hidden">
      {/* Background radial glow */}
      <div
        className="glow-orb w-[500px] h-[500px] top-1/2 -left-48"
        style={{
          backgroundColor: 'var(--accent-2)',
          opacity: 'calc(var(--glow-opacity) * 0.1)',
        }}
      />
      <div
        className="glow-orb w-[450px] h-[450px] bottom-10 -right-48"
        style={{
          backgroundColor: 'var(--accent)',
          opacity: 'calc(var(--glow-opacity) * 0.12)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="section-tag">
            <Award className="w-3.5 h-3.5" />
            <span>{section.badge_text || 'Verified Credentials'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mt-2 mb-4">
            {section.title || 'Licenses &'}{' '}
            <span className="gradient-text">{section.subtitle || 'Certifications'}</span>
          </h2>

          <p className="text-base text-gray-400">
            {cfg.description ||
              'Accredited industry certifications, machine learning specializations, and cloud architecture credentials.'}
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleCerts.map((cert) => {
            return (
              <div
                key={cert.id}
                className="group relative rounded-2xl backdrop-blur-xl border border-white/10 p-6 flex flex-col justify-between hover:border-white/20 transition-all duration-300 card-glow"
                style={{ backgroundColor: 'var(--bg-card)' }}
              >
                {cert.is_featured && (
                  <div className="absolute top-4 right-4">
                    <span
                      className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--accent) 15%, transparent)',
                        color: 'var(--accent)',
                        borderColor: 'color-mix(in srgb, var(--accent) 30%, transparent)',
                        borderWidth: 1,
                      }}
                    >
                      <Sparkles className="w-3 h-3" />
                      Featured
                    </span>
                  </div>
                )}

                <div>
                  {/* Photo / Badge banner if present */}
                  {cert.image_url ? (
                    <div
                      className="relative aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/5 mb-5 cursor-pointer group/img"
                      onClick={() => setSelectedCert(cert)}
                    >
                      <img
                        src={cert.image_url}
                        alt={cert.title}
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 text-xs font-semibold text-white backdrop-blur-sm border border-white/20">
                          <Eye className="w-3.5 h-3.5" />
                          View Certificate
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl mb-5 flex items-center justify-center bg-white/5 border border-white/10 text-white">
                      <ShieldCheck
                        className="w-6 h-6"
                        style={{ color: 'var(--accent)' }}
                      />
                    </div>
                  )}

                  {/* Issuer & Title */}
                  <div className="mb-3">
                    <p
                      className="text-xs font-semibold tracking-wider uppercase mb-1"
                      style={{ color: 'var(--accent)' }}
                    >
                      {cert.issuer}
                    </p>
                    <h3 className="text-lg font-bold text-white tracking-tight leading-snug group-hover:text-white transition-colors">
                      {cert.title}
                    </h3>
                  </div>

                  {/* Credential ID and Dates */}
                  <div className="space-y-1.5 text-xs text-gray-400 mb-4">
                    {cert.issue_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" style={{ color: 'var(--accent-2)' }} />
                        <span>Issued {cert.issue_date}</span>
                        {cert.expiry_date && (
                          <span className="text-gray-500">• Expires {cert.expiry_date}</span>
                        )}
                      </div>
                    )}

                    {cert.credential_id && (
                      <div className="flex items-center gap-2 font-mono text-[11px] text-gray-400">
                        <span className="text-gray-500">ID:</span>
                        <span className="text-gray-300 bg-white/5 px-2 py-0.5 rounded border border-white/5">
                          {cert.credential_id}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Skills badges */}
                  {cert.skills && cert.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {cert.skills.map((skill, i) => (
                        <Badge key={i} variant="cyan" size="sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                  {cert.credential_url ? (
                    <a
                      href={cert.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold hover:underline transition-colors"
                      style={{ color: 'var(--accent)' }}
                    >
                      <span>Verify Credential</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-gray-300 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                      Verified
                    </span>
                  )}

                  {cert.image_url && (
                    <button
                      type="button"
                      onClick={() => setSelectedCert(cert)}
                      className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox / Certificate Image Modal */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="relative max-w-4xl w-full border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            style={{ backgroundColor: 'var(--bg-card)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/30">
              <div>
                <h4 className="text-sm font-bold text-white">{selectedCert.title}</h4>
                <p className="text-xs text-gray-400">{selectedCert.issuer}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Image display */}
            <div className="p-4 bg-black/60 flex items-center justify-center max-h-[70vh] overflow-auto">
              <img
                src={selectedCert.image_url}
                alt={selectedCert.title}
                className="max-h-[65vh] w-auto max-w-full object-contain rounded-lg shadow-lg"
              />
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10 bg-black/30 flex items-center justify-between">
              <div className="text-xs text-gray-400 font-mono">
                {selectedCert.credential_id && `Credential ID: ${selectedCert.credential_id}`}
              </div>
              <div className="flex items-center gap-3">
                {selectedCert.credential_url && (
                  <a
                    href={selectedCert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary py-1.5 px-4 text-xs font-semibold"
                  >
                    <span>Verify at Issuer</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </a>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedCert(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
