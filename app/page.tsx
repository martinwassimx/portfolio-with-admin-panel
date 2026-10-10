import React from 'react';
import type { Metadata } from 'next';
import {
  getSiteSettings,
  getPageSections,
  getNavigationItems,
  getSkillCategories,
  getSkills,
  getProjects,
  getEducation,
  getExperience,
  getCertifications,
  getSocialLinks,
} from '../lib/db/server-store';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  return {
    title: siteSettings.site_title || 'Portfolio',
    description: siteSettings.site_description || 'Software Engineer Portfolio',
  };
}
import { Navbar } from '../components/public/Navbar';
import { Footer } from '../components/public/Footer';
import { HeroSection } from '../components/public/HeroSection';
import { AboutSection } from '../components/public/AboutSection';
import { SkillsSection } from '../components/public/SkillsSection';
import { ProjectsSection } from '../components/public/ProjectsSection';
import { EducationSection } from '../components/public/EducationSection';
import { ExperienceSection } from '../components/public/ExperienceSection';
import { CertificationsSection } from '../components/public/CertificationsSection';
import { ContactSection } from '../components/public/ContactSection';
import { CustomCursor } from '../components/public/CustomCursor';
import { BackToTop } from '../components/public/BackToTop';

export default async function HomePage() {
  const [
    siteSettings,
    sections,
    navItems,
    skillCategories,
    skills,
    projects,
    education,
    experience,
    certifications,
    socialLinks,
  ] = await Promise.all([
    getSiteSettings(),
    getPageSections(),
    getNavigationItems(),
    getSkillCategories(),
    getSkills(),
    getProjects({ publishedOnly: true }),
    getEducation(),
    getExperience(),
    getCertifications(),
    getSocialLinks(),
  ]);

  // Maintenance mode screen
  if (siteSettings.maintenance_mode) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6">
          <span className="text-2xl font-black">⚙️</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Under Scheduled Maintenance</h1>
        <p className="text-gray-400 max-w-md mb-6">
          We are currently making updates to the portfolio. Please check back shortly.
        </p>
        <a
          href="/admin"
          className="text-xs text-cyan-400 border border-cyan-500/30 px-3 py-1.5 rounded-lg hover:bg-cyan-500/10 transition-colors"
        >
          Administrator Login
        </a>
      </div>
    );
  }

  // Map sections by key for dynamic ordering & visibility
  const sortedSections = [...sections]
    .filter((s) => s.is_visible)
    .sort((a, b) => a.sort_order - b.sort_order);

  const heroSection = sections.find((s) => s.section_key === 'hero');

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col relative selection:bg-white/20 selection:text-white transition-colors duration-300">
      {/* Optional Custom Cursor */}
      <CustomCursor enabled={siteSettings.enable_custom_cursor !== false} />

      {/* Announcement Banner */}
      {siteSettings.announcement_banner_enabled && (
        <div
          className="border-b py-2.5 px-4 text-center text-xs font-semibold backdrop-blur-md"
          style={{
            background: 'linear-gradient(90deg, color-mix(in srgb, var(--accent) 20%, transparent), color-mix(in srgb, var(--accent-2) 20%, transparent))',
            borderColor: 'color-mix(in srgb, var(--accent) 30%, transparent)',
            color: 'var(--text)',
          }}
        >
          {siteSettings.announcement_banner_text || '🚀 Open for new software engineering and AI collaborations'}
        </div>
      )}

      {/* Sticky Navigation Bar */}
      <Navbar navItems={navItems} siteSettings={siteSettings} />

      <main className="flex-1">
        {/* Render sections based on their database sort_order */}
        {sortedSections.map((sec) => {
          switch (sec.section_key) {
            case 'hero':
              return (
                <HeroSection key={sec.id} section={sec} siteSettings={siteSettings} />
              );
            case 'about':
              return <AboutSection key={sec.id} section={sec} />;
            case 'skills':
              return (
                <SkillsSection
                  key={sec.id}
                  section={sec}
                  categories={skillCategories}
                  skills={skills}
                />
              );
            case 'projects':
              return (
                <ProjectsSection
                  key={sec.id}
                  section={sec}
                  projects={projects}
                />
              );
            case 'education':
              return (
                <EducationSection
                  key={sec.id}
                  section={sec}
                  education={education}
                />
              );
            case 'experience':
              return (
                <ExperienceSection
                  key={sec.id}
                  section={sec}
                  experience={experience}
                />
              );
            case 'certifications':
              return (
                <CertificationsSection
                  key={sec.id}
                  section={sec}
                  certifications={certifications}
                />
              );
            case 'contact':
              return (
                <ContactSection
                  key={sec.id}
                  section={sec}
                  siteSettings={siteSettings}
                  socialLinks={socialLinks}
                />
              );
            default:
              return null;
          }
        })}
      </main>

      {/* Footer */}
      <Footer siteSettings={siteSettings} socialLinks={socialLinks} />

      {/* Floating Back to Top Button */}
      <BackToTop />
    </div>
  );
}
