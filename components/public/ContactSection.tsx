'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { PageSectionConfig, SiteSettings, SocialLink } from '../../lib/db/types';
import { Button } from '../ui/Button';

interface ContactSectionProps {
  section: PageSectionConfig;
  siteSettings: SiteSettings;
  socialLinks: SocialLink[];
}

export function ContactSection({ section, siteSettings, socialLinks }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    _hp: '', // Honeypot field
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message.');
      }

      setSuccessMsg(data.message || 'Your message has been received!');
      setFormData({ name: '', email: '', subject: '', message: '', _hp: '' });
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="section-tag">
          {section.badge_text || 'Get In Touch'}
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          {section.title || 'Let\'s'}{' '}
          <span className="gradient-text">{section.subtitle || 'Connect'}</span>
        </h2>
        <p className="text-base text-gray-400 max-w-2xl mb-12">
          {section.config?.description || 'Interested in collaborating or have a question? Drop a message and let\'s talk.'}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 space-y-6">
            <div
              className="p-8 border border-white/10 backdrop-blur-md shadow-xl"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius)',
              }}
            >
              <h3 className="text-xl font-bold text-white mb-2">
                {section.config?.card_title || 'Let\'s build something great'}
              </h3>
              <p className="text-sm text-gray-400 mb-8">
                {section.config?.card_subtitle || 'I am open to full-time engineering roles, technical consulting, and innovative projects.'}
              </p>

              <div className="space-y-4">
                {siteSettings.contact_email && (
                  <a
                    href={`mailto:${siteSettings.contact_email}`}
                    className="flex items-center gap-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all text-gray-300 hover:text-white"
                  >
                    <div
                      className="p-2.5 rounded-lg"
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--accent) 15%, transparent)',
                        color: 'var(--accent)',
                      }}
                    >
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                        Email Address
                      </p>
                      <p className="text-sm font-medium text-gray-200 mt-0.5">
                        {siteSettings.contact_email}
                      </p>
                    </div>
                  </a>
                )}

                {siteSettings.contact_location && (
                  <div className="flex items-center gap-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-gray-300">
                    <div
                      className="p-2.5 rounded-lg"
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--accent-2) 15%, transparent)',
                        color: 'var(--accent-2)',
                      }}
                    >
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                        Location
                      </p>
                      <p className="text-sm font-medium text-gray-200 mt-0.5">
                        {siteSettings.contact_location}
                      </p>
                    </div>
                  </div>
                )}

                {siteSettings.contact_phone && (
                  <div className="flex items-center gap-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-gray-300">
                    <div
                      className="p-2.5 rounded-lg"
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--accent-3) 15%, transparent)',
                        color: 'var(--accent-3)',
                      }}
                    >
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                        Phone Number
                      </p>
                      <p className="text-sm font-medium text-gray-200 mt-0.5">
                        {siteSettings.contact_phone}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div
              className="p-8 border border-white/10 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius)',
              }}
            >
              {siteSettings.contact_form_enabled === false ? (
                <div className="p-8 text-center text-gray-400">
                  <p>The contact form is currently closed. Please reach out via email.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Honeypot field (hidden from view) */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="_hp"
                      value={formData._hp}
                      onChange={(e) => setFormData({ ...formData, _hp: e.target.value })}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {successMsg && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-300 text-sm">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <span>{successMsg}</span>
                    </div>
                  )}

                  {errorMsg && (
                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-300 text-sm">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Smith"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full border border-white/10 focus:border-white/30 rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none transition-all"
                        style={{ backgroundColor: 'var(--bg-2)' }}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full border border-white/10 focus:border-white/30 rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none transition-all"
                        style={{ backgroundColor: 'var(--bg-2)' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Project Inquiry / Job Opportunity"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none transition-all focus:border-white/30"
                      style={{ backgroundColor: 'var(--bg-2)' }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Hi Martin, I'd like to talk about..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 focus:outline-none transition-all resize-y focus:border-white/30"
                      style={{ backgroundColor: 'var(--bg-2)' }}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    className="w-full sm:w-auto"
                    leftIcon={<Send className="w-4 h-4" />}
                  >
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
