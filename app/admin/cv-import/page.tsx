'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Upload,
  Sparkles,
  Check,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Award,
  Wrench,
  User,
  ArrowRight,
  ExternalLink,
  RotateCcw,
  Eye,
  Loader2,
  Trash2,
  ShieldAlert,
  FolderGit2,
  Languages,
  Plus,
  X,
  Sliders,
  FileCheck2,
  Globe,
  Phone,
  Mail,
  MapPin,
  Wand2,
  Zap,
  Palette,
  Bot,
  Key,
  RefreshCw,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../../../components/ui/Icons';
import { Button } from '../../../components/ui/Button';
import { Switch } from '../../../components/ui/Switch';
import { Badge } from '../../../components/ui/Badge';
import { Dialog } from '../../../components/ui/Dialog';
import {
  getSiteSettings,
  updateSiteSettings,
  getPageSections,
  updatePageSection,
  getSkills,
  saveSkills,
  getExperience,
  saveExperience,
  getEducation,
  saveEducation,
  getCertifications,
  saveCertifications,
  getSkillCategories,
  getSocialLinks,
  saveSocialLinks,
  getProjects,
  saveProjects,
  updateThemeSettings,
} from '../../../lib/db/store';
import { ParsedCVData, ParsedProject } from '../../../lib/cv/parser';
import {
  AITone,
  AIThemeRecommendation,
  AIEnhancedCVData,
  recommendThemeForCandidate,
  generateHeadlines,
  synthesizeBioStory,
  expandProjectDetails,
} from '../../../lib/cv/ai-enhancer';
import { CURATED_THEME_PRESETS } from '../../../components/admin/ThemePresetsModal';
import {
  Skill,
  ExperienceEntry,
  EducationEntry,
  Certification,
  SocialLink,
  Project,
  PageSectionConfig,
} from '../../../lib/db/types';

const SAMPLE_CV_TEXT = `AHMED HOSSAM ELHOSSARY
Software Engineering | Mobile & AI Developer
01014060621 | ahmedelhossery22@gmail.com | Cairo, Egypt
linkedin.com/in/ahmed-elhossary | github.com/ahmedelhossary22

PROFESSIONAL SUMMARY
Software Engineering with practical experience in mobile application development using Flutter/Dart, AI and machine learning applications, and algorithm design. Certified Flutter developer with a portfolio of real-world projects spanning computer vision, AI-driven optimization, and cross-platform mobile apps. Seeking an internship or junior developer role to contribute to a high-performing engineering team.

EDUCATION
Bachelor of Science in Software Engineering (Expected Graduation: 2027)
Faculty of Computer and Information Sciences — Helwan National University

TECHNICAL SKILLS
Programming Languages: Python, Java, C++, C, Dart, SQL
Mobile Development: Flutter
Artificial Intelligence: Computer Vision, Gesture Recognition, Optimization Algorithms
Tools and Platforms: Git, GitHub
Core Concepts: Object-Oriented Programming, Data Structures, Algorithms, REST APIs

PROJECTS
Waste Classifier — AI Image Classification Application
– Developed a computer vision application to automatically classify waste types using deep learning models
– Categorized waste images into recyclable and non-recyclable groups to support smarter recycling decisions
Technologies: Python, Machine Learning, Computer Vision

Vehicle Routing Problem (VRP) — AI Optimization
– Implemented an AI-driven solution for the Vehicle Routing Problem using advanced optimization algorithms
– Applied operations research techniques to minimize delivery distances and reduce routing costs
Technologies: Python, Artificial Intelligence, Operations Research

Event App — Cross-Platform Mobile Application
– Built a full-featured Flutter mobile application for browsing, creating, and managing events
– Applied Flutter best practices including state management, clean architecture, and responsive UI design
Technologies: Flutter, Dart

Gesture Recognition — Real-Time Computer Vision System
– Built a real-time hand gesture recognition system enabling hands-free human-computer interaction
– Processed live video input to detect and classify hand gestures with high accuracy
Technologies: Python, Computer Vision, Machine Learning

CERTIFICATIONS AND TRAINING
Flutter Development Diploma June 2025 – November 2025
Route IT Training Center | Certified in cross-platform mobile development with Flutter and Dart

Automation Workflow with N8N Professional July 2026 – December 2026
Digital Egypt Pioneers Initiative (DEPI)

LANGUAGES
Arabic: Native
English: B2`;

export default function CVImportPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeInputTab, setActiveInputTab] = useState<'upload' | 'paste'>('upload');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedCVData | null>(null);
  const [cvFileUrl, setCvFileUrl] = useState<string | null>(null);

  // New skill input state
  const [newSkillInput, setNewSkillInput] = useState('');

  // Helper: RFC4122 v4 UUID generator for Supabase & local DB
  const generateUUID = (): string => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  // ── Unified Smart Generative AI States (Single Model) ──
  const [aiEnabled, setAiEnabled] = useState(true);
  const [aiThemeRecommendation, setAiThemeRecommendation] = useState<AIThemeRecommendation | null>(null);
  const [aiHeadlineSuggestions, setAiHeadlineSuggestions] = useState<string[]>([]);
  const [aiKeyStrengths, setAiKeyStrengths] = useState<string[]>([]);
  const [isEnhancingWithAI, setIsEnhancingWithAI] = useState(false);
  const [aiThemeApplied, setAiThemeApplied] = useState(false);
  const [aiReadinessScore, setAiReadinessScore] = useState<number>(95);
  const [aiEnhancementSummary, setAiEnhancementSummary] = useState<any>(null);

  // Import options / toggles
  const [importOptions, setImportOptions] = useState({
    updateHeroAndAbout: true,
    updateContact: true,
    updateSkills: true,
    updateProjects: true,
    updateExperience: true,
    updateEducation: true,
    updateCertifications: true,
    setDownloadableCv: true,
    applyAiTheme: true,
    mode: 'merge' as 'merge' | 'replace',
  });

  const [applying, setApplying] = useState(false);
  const [applyingStep, setApplyingStep] = useState<string>('');
  const [resetting, setResetting] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{
    skillsCount: number;
    projectsCount: number;
    experienceCount: number;
    educationCount: number;
    certCount: number;
  } | null>(null);

  const handleOpenResetModal = () => {
    setResetError(null);
    setIsResetModalOpen(true);
  };

  const handleExecuteReset = async () => {
    setResetting(true);
    setResetError(null);
    setResetDone(false);
    setSuccessResult(null);

    try {
      const res = await fetch('/api/store/reset', { method: 'POST' });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Reset failed.');

      // 1. Wipe client localStorage and preserve clean DB version
      try {
        Object.keys(localStorage).forEach((k) => {
          if (k.startsWith('portfolio_db_')) {
            localStorage.removeItem(k);
          }
        });
        localStorage.setItem('portfolio_db___version', 'v3_clean');
      } catch (e) {
        console.warn('LocalStorage clear warning:', e);
      }

      // 2. Dispatch custom event so any other open components update immediately
      window.dispatchEvent(new Event('portfolio_db_updated'));

      // 3. Clear ALL local state on this page (input, parsed results, file ref)
      setParsedData(null);
      setCvFile(null);
      setPastedText('');
      setCvFileUrl(null);
      setSuccessResult(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Close modal and show success notification
      setIsResetModalOpen(false);
      setResetDone(true);
      setTimeout(() => setResetDone(false), 8000);

      // Refresh server components
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setResetError(err.message || 'Reset failed.');
    } finally {
      setResetting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCvFile(file);
      setSuccessResult(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setCvFile(files[0]);
      setSuccessResult(null);
    }
  };

  const handleLoadSampleCV = () => {
    setPastedText(SAMPLE_CV_TEXT);
    setActiveInputTab('paste');
    setSuccessResult(null);
  };

  const handleParse = async () => {
    if (activeInputTab === 'upload' && !cvFile) {
      alert('Please select a CV document (PDF or Text) to parse.');
      return;
    }
    if (activeInputTab === 'paste' && pastedText.trim().length < 20) {
      alert('Please paste at least a paragraph of resume text.');
      return;
    }

    setParsing(true);
    setSuccessResult(null);

    try {
      let res: Response;
      const url = aiEnabled ? '/api/cv/parse?ai=true' : '/api/cv/parse';
      if (activeInputTab === 'upload' && cvFile) {
        const formData = new FormData();
        formData.append('file', cvFile);
        res = await fetch(url, {
          method: 'POST',
          body: formData,
        });
      } else {
        res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: pastedText }),
        });
      }

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Failed to parse CV.');
      }

      setParsedData(result.data);
      if (result.data.aiThemeRecommendation) setAiThemeRecommendation(result.data.aiThemeRecommendation);
      if (result.data.aiHeadlineSuggestions) setAiHeadlineSuggestions(result.data.aiHeadlineSuggestions);
      if (result.data.aiKeyStrengths) setAiKeyStrengths(result.data.aiKeyStrengths);
      if (result.data.aiReadinessScore) setAiReadinessScore(result.data.aiReadinessScore);
      if (result.data.aiEnhancementSummary) setAiEnhancementSummary(result.data.aiEnhancementSummary);
      if (result.cvFileUrl) {
        setCvFileUrl(result.cvFileUrl);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error parsing CV.');
    } finally {
      setParsing(false);
    }
  };

  const handleRunAIEnhancement = async () => {
    if (!parsedData) return;
    setIsEnhancingWithAI(true);
    try {
      const res = await fetch('/api/cv/ai-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          baseData: parsedData,
          rawText: pastedText || parsedData.rawTextPreview || '',
          options: {
            tone: 'senior_engineer',
            provider: 'builtin',
          },
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.error || 'AI Enhancement failed.');

      setParsedData(result.data);
      if (result.data.aiThemeRecommendation) setAiThemeRecommendation(result.data.aiThemeRecommendation);
      if (result.data.aiHeadlineSuggestions) setAiHeadlineSuggestions(result.data.aiHeadlineSuggestions);
      if (result.data.aiKeyStrengths) setAiKeyStrengths(result.data.aiKeyStrengths);
      if (result.data.aiReadinessScore) setAiReadinessScore(result.data.aiReadinessScore);
      if (result.data.aiEnhancementSummary) setAiEnhancementSummary(result.data.aiEnhancementSummary);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'AI Enhancement failed.');
    } finally {
      setIsEnhancingWithAI(false);
    }
  };

  const handleApplyRecommendedTheme = async () => {
    if (!aiThemeRecommendation) return;
    const preset = CURATED_THEME_PRESETS.find((p) => p.id === aiThemeRecommendation.themeId);
    if (preset) {
      await updateThemeSettings(preset.theme);
      window.dispatchEvent(new Event('portfolio_db_updated'));
      setAiThemeApplied(true);
      setTimeout(() => setAiThemeApplied(false), 4000);
    }
  };

  const handleSelectHeadline = (h: string) => {
    if (!parsedData) return;
    setParsedData({
      ...parsedData,
      personal: { ...parsedData.personal, headline: h },
    });
  };

  const handleRegenerateBio = () => {
    if (!parsedData) return;
    const newBio = synthesizeBioStory(
      parsedData.personal.fullName,
      parsedData.personal.headline,
      parsedData.skills,
      parsedData.projects || [],
      'senior_engineer'
    );
    setParsedData({
      ...parsedData,
      summary: { ...parsedData.summary, bioParagraphs: newBio },
    });
  };

  const handleExpandProjectArchitecture = (idx: number) => {
    if (!parsedData || !parsedData.projects) return;
    const target = parsedData.projects[idx];
    const expanded = expandProjectDetails(target, 'senior_engineer');
    const nextProjs = [...parsedData.projects];
    nextProjs[idx] = expanded;
    setParsedData({ ...parsedData, projects: nextProjs });
  };

  // Helper to remove a skill chip in preview
  const handleRemoveSkill = (index: number) => {
    if (!parsedData) return;
    const nextSkills = parsedData.skills.filter((_, i) => i !== index);
    setParsedData({ ...parsedData, skills: nextSkills });
  };

  // Helper to add a custom skill chip in preview
  const handleAddSkill = () => {
    if (!parsedData || !newSkillInput.trim()) return;
    const trimmed = newSkillInput.trim();
    if (parsedData.skills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setNewSkillInput('');
      return;
    }
    const nextSkills = [
      ...parsedData.skills,
      {
        name: trimmed,
        category: 'Technical Skills',
        proficiency: 85,
        badgeColor: 'cyan',
      },
    ];
    setParsedData({ ...parsedData, skills: nextSkills });
    setNewSkillInput('');
  };

  // Helper to remove a project in preview
  const handleRemoveProject = (index: number) => {
    if (!parsedData || !parsedData.projects) return;
    const next = parsedData.projects.filter((_, i) => i !== index);
    setParsedData({ ...parsedData, projects: next });
  };

  const handleApplyToPortfolio = async () => {
    if (!parsedData) return;
    setApplying(true);
    setApplyingStep('Preparing portfolio updates...');

    try {
      const { personal, summary, skills, experience, education, certifications, projects, languages } = parsedData;

      // Helper: extract initials from full name
      const getInitials = (name: string) =>
        name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

      // 1. Update Site Settings (Always persist candidate name and branding)
      setApplyingStep('Configuring candidate profile & site branding...');
      const currentSettings = await getSiteSettings();
      const settingsUpdates: any = { ...currentSettings };

      if (personal.fullName) {
        settingsUpdates.site_title = `${personal.fullName} | ${personal.headline || 'Portfolio'}`;
        settingsUpdates.site_tagline = personal.headline || 'Software Engineer';
        settingsUpdates.site_description = summary.bioParagraphs[0]?.slice(0, 160) || settingsUpdates.site_description;
        settingsUpdates.logo_text = getInitials(personal.fullName) || currentSettings.logo_text || 'Portfolio';
      }

      if (importOptions.updateContact) {
        if (personal.email) settingsUpdates.contact_email = personal.email;
        if (personal.phone) settingsUpdates.contact_phone = personal.phone;
        if (personal.location) settingsUpdates.contact_location = personal.location;
      }

      if (importOptions.setDownloadableCv && cvFileUrl) {
        settingsUpdates.cv_file_url = cvFileUrl;
        settingsUpdates.cv_download_label = 'Download CV';
      }

      await updateSiteSettings(settingsUpdates);

      // 1b. Social Links
      setApplyingStep('Linking social profiles...');
      let finalSocials: SocialLink[] = [];
      if (importOptions.updateContact) {
        const socialLinks = await getSocialLinks();
        const nextSocials: SocialLink[] = [...socialLinks];

        const upsertSocial = (platform: string, url: string, icon: string, order: number) => {
          if (!url) return;
          const existing = nextSocials.find((s) => s.platform.toLowerCase() === platform.toLowerCase());
          if (existing) {
            existing.url = url;
            existing.is_visible = true;
          } else {
            nextSocials.push({ id: generateUUID(), platform, url, icon, sort_order: order, is_visible: true });
          }
        };

        upsertSocial('GitHub', personal.githubUrl || '', 'Github', 1);
        upsertSocial('LinkedIn', personal.linkedinUrl || '', 'Linkedin', 2);
        if (personal.email) upsertSocial('Email', `mailto:${personal.email}`, 'Mail', 3);
        if (personal.portfolioUrl) upsertSocial('Portfolio', personal.portfolioUrl, 'Globe', 4);

        finalSocials = nextSocials.filter((s) => s.url);
        await saveSocialLinks(finalSocials);
      } else {
        finalSocials = await getSocialLinks();
      }

      // 2. Hero & About sections (Always update hero with candidate name!)
      setApplyingStep('Updating Hero & Biography sections...');
      let finalSections: PageSectionConfig[] = [];
      const sections = await getPageSections();
      finalSections = [...sections];

      if (importOptions.updateHeroAndAbout) {
        const heroIndex = finalSections.findIndex((s) => s.section_key === 'hero');
        const nameParts = personal.fullName.trim().split(/\s+/);
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ');

        if (heroIndex >= 0) {
          finalSections[heroIndex] = {
            ...finalSections[heroIndex],
            title: personal.fullName || firstName,
            subtitle: personal.headline || finalSections[heroIndex].subtitle,
            config: {
              ...(finalSections[heroIndex].config || {}),
              first_name: firstName,
              highlighted_name: lastName || '',
              summary: summary.bioParagraphs[0] || finalSections[heroIndex].config?.summary || '',
              cta_primary_url: cvFileUrl || finalSections[heroIndex].config?.cta_primary_url || '',
            },
          };
          await updatePageSection('hero', finalSections[heroIndex]);
        }

        const aboutIndex = finalSections.findIndex((s) => s.section_key === 'about');
        if (aboutIndex >= 0) {
          const metaInfo: any[] = [];
          if (personal.location) metaInfo.push({ icon: 'MapPin', label: 'Location', value: personal.location });
          if (personal.email) metaInfo.push({ icon: 'Mail', label: 'Email', value: personal.email });
          if (personal.phone) metaInfo.push({ icon: 'Phone', label: 'Phone', value: personal.phone });
          if (education[0]) {
            const degShort = education[0].degree?.replace(/Bachelor of (Science|Arts) in\s*/i, 'BSc. ').slice(0, 50);
            metaInfo.push({ icon: 'GraduationCap', label: 'Education', value: `${degShort} @ ${education[0].institution}` });
          }
          if (languages && languages.length > 0) {
            metaInfo.push({ icon: 'Globe', label: 'Languages', value: languages.map((l) => `${l.name} (${l.proficiency})`).join(', ') });
          }

          finalSections[aboutIndex] = {
            ...finalSections[aboutIndex],
            config: {
              ...(finalSections[aboutIndex].config || {}),
              bio_paragraphs: summary.bioParagraphs,
              tags: summary.tags,
              meta_info: metaInfo,
              avatar_url: finalSections[aboutIndex].config?.avatar_url || '',
            },
          };
          await updatePageSection('about', finalSections[aboutIndex]);
        }
      }

      // 3. Skills
      setApplyingStep(`Saving ${skills.length} technical skills...`);
      let appliedSkillsCount = 0;
      let finalSkills: Skill[] = [];
      if (importOptions.updateSkills && skills.length > 0) {
        const resolveCatId = (catName: string): string => {
          const lower = (catName || '').toLowerCase();
          if (/language|programming|python|dart|javascript|typescript|c\+\+|java|c#|golang|rust|kotlin|swift/i.test(lower)) {
            return '00000000-0000-0000-0000-000000000001';
          }
          if (/framework|library|react|flutter|next|node|vue|angular|django|express|fastapi|asp\.net|web|mobile|frontend|backend/i.test(lower)) {
            return '00000000-0000-0000-0000-000000000002';
          }
          if (/ai|machine|learning|intelligence|ml|cv|vision|deep|nlp|gesture|llm|rag|pytorch|tensorflow/i.test(lower)) {
            return '00000000-0000-0000-0000-000000000003';
          }
          if (/database|tool|sql|mongo|docker|git|aws|firebase|supabase|postgres|redis|linux|cloud|devops|azure/i.test(lower)) {
            return '00000000-0000-0000-0000-000000000004';
          }
          if (/architecture|design|pattern|system|api|fundamental|oop|microservice/i.test(lower)) {
            return '00000000-0000-0000-0000-000000000005';
          }
          return '00000000-0000-0000-0000-000000000001';
        };

        const newSkillObjects: Skill[] = skills.map((s, idx) => ({
          id: generateUUID(),
          category_id: resolveCatId(s.category),
          name: s.name,
          proficiency: s.proficiency || 85,
          badge_color: s.badgeColor || 'cyan',
          sort_order: idx + 1,
          is_featured: idx < 8,
          is_visible: true,
        }));

        if (importOptions.mode === 'replace') {
          finalSkills = newSkillObjects;
        } else {
          const existingSkills = await getSkills();
          finalSkills = [...existingSkills];
          newSkillObjects.forEach((ns) => {
            if (!finalSkills.some((e) => e.name.toLowerCase() === ns.name.toLowerCase())) finalSkills.push(ns);
          });
        }
        appliedSkillsCount = finalSkills.length;
        await saveSkills(finalSkills);
      } else {
        finalSkills = await getSkills();
      }

      // 4. Projects
      setApplyingStep('Saving featured portfolio projects...');
      let appliedProjectsCount = 0;
      let finalProjects: Project[] = [];
      if (importOptions.updateProjects && projects && projects.length > 0) {
        const newProjectObjects: Project[] = projects.map((p: any, idx) => {
          const cleanSlug = p.slug || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `proj-${idx + 1}`;
          const fullDesc = [
            p.architectureOverview ? `### Architecture Overview\n${p.architectureOverview}` : '',
            p.problemSolved ? `### Problem Solved\n${p.problemSolved}` : '',
            p.keyMetrics ? `### Performance & Metrics\n${p.keyMetrics}` : '',
            p.bullets && p.bullets.length > 0 ? `### Implementation Details\n${p.bullets.map((b: string) => `• ${b}`).join('\n')}` : '',
          ].filter(Boolean).join('\n\n') || p.summary;

          return {
            id: generateUUID(),
            slug: cleanSlug,
            title: p.title,
            summary: p.tagline || p.summary || p.title,
            full_description: fullDesc,
            project_type: p.projectType || 'Software Engineering',
            status: 'Completed',
            start_date: '2024',
            completion_date: '2025',
            is_featured: idx < 6,
            is_published: true,
            sort_order: idx + 1,
            thumbnail_url: '',
            cover_image_url: '',
            gallery_urls: [],
            technologies: p.technologies || [],
            features: p.bullets || [],
            repo_url: p.githubUrl || personal.githubUrl || '',
            live_demo_url: p.liveUrl || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
        });

        if (importOptions.mode === 'replace') {
          finalProjects = newProjectObjects;
        } else {
          const existingProjs = await getProjects({ publishedOnly: false });
          finalProjects = [...newProjectObjects];
          existingProjs.forEach((ep) => {
            if (!finalProjects.some((mp) => mp.slug === ep.slug || mp.title.toLowerCase() === ep.title.toLowerCase())) {
              finalProjects.push(ep);
            }
          });
        }
        appliedProjectsCount = finalProjects.length;
        await saveProjects(finalProjects);
      } else {
        finalProjects = await getProjects({ publishedOnly: false });
      }

      // 5. Experience
      setApplyingStep('Saving career experience...');
      let appliedExpCount = 0;
      let finalExp: ExperienceEntry[] = [];
      if (importOptions.updateExperience && experience.length > 0) {
        const existingExp = await getExperience();
        const newExpObjects: ExperienceEntry[] = experience.map((exp, idx) => ({
          id: generateUUID(),
          job_title: exp.role,
          company: exp.company,
          employment_type: /intern/i.test(exp.role) ? 'Internship' : 'Full-time',
          location: exp.location || personal.location || '',
          start_date: exp.startDate,
          end_date: exp.isCurrent ? 'Present' : (exp.endDate || 'Present'),
          is_current: exp.isCurrent,
          description: exp.description || exp.responsibilities[0] || '',
          responsibilities: exp.responsibilities.length > 0 ? exp.responsibilities : [],
          achievements: exp.achievements || [],
          technologies: exp.technologies || [],
          sort_order: idx + 1,
          is_visible: true,
        }));

        if (importOptions.mode === 'replace') {
          finalExp = newExpObjects;
        } else {
          finalExp = [...newExpObjects];
          existingExp.forEach((e) => {
            if (!finalExp.some((n) => n.company.toLowerCase() === e.company.toLowerCase() && n.job_title?.toLowerCase() === (e as any).job_title?.toLowerCase())) {
              finalExp.push(e);
            }
          });
        }
        appliedExpCount = finalExp.length;
        await saveExperience(finalExp);
      } else {
        finalExp = await getExperience();
      }

      // 6. Education
      setApplyingStep('Saving academic records...');
      let appliedEduCount = 0;
      let finalEdu: EducationEntry[] = [];
      if (importOptions.updateEducation && education.length > 0) {
        const existingEdu = await getEducation();
        const newEduObjects: EducationEntry[] = education.map((edu, idx) => ({
          id: generateUUID(),
          degree: edu.degree,
          field_of_study: edu.fieldOfStudy || '',
          institution: edu.institution || '',
          start_date: edu.startYear || '',
          end_date: edu.endYear || '',
          is_current: !edu.endYear || /present|current/i.test(edu.endYear),
          description: edu.description || '',
          achievements: [],
          coursework: [],
          grade_gpa: edu.grade || '',
          sort_order: idx + 1,
          is_visible: true,
        }));

        if (importOptions.mode === 'replace') {
          finalEdu = newEduObjects;
        } else {
          finalEdu = [...newEduObjects];
          existingEdu.forEach((e) => {
            if (!finalEdu.some((n) => n.institution.toLowerCase() === e.institution.toLowerCase())) finalEdu.push(e);
          });
        }
        appliedEduCount = finalEdu.length;
        await saveEducation(finalEdu);
      } else {
        finalEdu = await getEducation();
      }

      // 7. Certifications
      setApplyingStep('Saving verified certifications...');
      let appliedCertCount = 0;
      let finalCerts: Certification[] = [];
      if (importOptions.updateCertifications && certifications.length > 0) {
        const existingCerts = await getCertifications();
        const newCertObjects: Certification[] = certifications.map((c, idx) => ({
          id: generateUUID(),
          title: c.title,
          issuer: c.issuer,
          issue_date: c.issueDate,
          credential_id: c.credentialId || '',
          credential_url: c.credentialUrl || '',
          skills: c.skills || [],
          sort_order: idx + 1,
          is_featured: idx === 0,
          is_visible: true,
        }));

        if (importOptions.mode === 'replace') {
          finalCerts = newCertObjects;
        } else {
          finalCerts = [...newCertObjects];
          existingCerts.forEach((e) => {
            if (!finalCerts.some((n) => n.title.toLowerCase().slice(0, 30) === e.title.toLowerCase().slice(0, 30))) finalCerts.push(e);
          });
        }
        appliedCertCount = finalCerts.length;
        await saveCertifications(finalCerts);
      } else {
        finalCerts = await getCertifications();
      }

      // 8. AI Atmosphere Preset Application
      if (importOptions.applyAiTheme && aiThemeRecommendation) {
        setApplyingStep(`Applying AI-matched theme atmosphere: ${aiThemeRecommendation.name}...`);
        const preset = CURATED_THEME_PRESETS.find((p) => p.id === aiThemeRecommendation.themeId);
        if (preset) {
          await updateThemeSettings(preset.theme);
        }
      }

      // ── Sync batch to server store & Supabase ──
      setApplyingStep('Finalizing database synchronization & cache revalidation...');
      try {
        await fetch('/api/store', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode: importOptions.mode,
            batch: {
              site_settings: settingsUpdates,
              page_sections: finalSections,
              skills: finalSkills,
              education: finalEdu,
              experience: finalExp,
              certifications: finalCerts,
              social_links: finalSocials,
              projects: finalProjects,
            },
          }),
        });
      } catch (syncErr) {
        console.warn('[CV Import] Server sync warning:', syncErr);
      }

      // Dispatch event for other tabs/views
      window.dispatchEvent(new Event('portfolio_db_updated'));

      setSuccessResult({
        skillsCount: appliedSkillsCount,
        projectsCount: appliedProjectsCount,
        experienceCount: appliedExpCount,
        educationCount: appliedEduCount,
        certCount: appliedCertCount,
      });

      router.refresh();
    } catch (err: any) {
      console.error(err);
      alert('Error applying CV data: ' + (err.message || 'Unknown error'));
    } finally {
      setApplying(false);
      setApplyingStep('');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="pb-6 border-b border-white/10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Smart Portfolio Auto-Fill 2.0</span>
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">
          Upload CV & Auto-Fill Entire Portfolio
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-3xl">
          Upload your resume in PDF format or paste its text. Our structured parsing engine extracts
          your name, contact coordinates, biography, technical skills, career roles, projects, degrees, and certifications
          — then instantly auto-populates your entire website in one click.
        </p>
      </div>

      {/* ── RESET SECTION ── */}
      <div className="p-5 rounded-2xl bg-red-950/30 border border-red-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Clear All Portfolio Data</h3>
            <p className="text-xs text-gray-400 mt-0.5 max-w-md">
              Wipes all skills, experience, education, certifications, projects, bio, and contact info — resets everything to blank so you can start fresh from zero.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <button
            type="button"
            onClick={handleOpenResetModal}
            disabled={resetting}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/35 border border-red-500/50 hover:border-red-400 text-red-300 hover:text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-red-950/40"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
            <span>Clear All Portfolio Data</span>
          </button>
        </div>
      </div>

      {/* Reset Success Notification Banner */}
      {resetDone && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-300 shadow-lg">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>All portfolio data has been successfully cleared! The website is reset to a clean blank slate.</span>
          </div>
          <Link
            href="/"
            target="_blank"
            className="underline text-emerald-300 hover:text-white shrink-0 font-bold flex items-center gap-1"
          >
            <span>View Live Portfolio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Confirmation Modal */}
      <Dialog
        isOpen={isResetModalOpen}
        onClose={() => !resetting && setIsResetModalOpen(false)}
        title="Clear All Portfolio Data?"
        description="Permanently wipe all website content and start fresh from zero"
        maxWidth="md"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-300 text-xs">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <p className="font-bold text-white text-sm">Are you sure you want to proceed?</p>
              <p className="text-gray-300">This action will immediately delete:</p>
              <ul className="list-disc list-inside space-y-1 text-red-200/90 font-medium pl-1">
                <li>All technical skills & categories</li>
                <li>All featured projects & case studies</li>
                <li>All career work experience history</li>
                <li>All academic degrees & education records</li>
                <li>All certifications & licenses</li>
                <li>Personal hero info, bio paragraphs & contact coordinates</li>
                <li>Any uploaded CV documents & parsed session cache</li>
              </ul>
            </div>
          </div>

          {resetError && (
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{resetError}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              disabled={resetting}
              onClick={() => setIsResetModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={resetting}
              onClick={handleExecuteReset}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors disabled:opacity-50 shadow-lg shadow-red-900/40"
            >
              {resetting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Clearing All Data...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Yes, Clear Everything</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Dialog>

      {/* Success Notification Banner */}
      {successResult && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-[#0f172a] border border-emerald-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Portfolio Successfully Auto-Filled!</h3>
              <p className="text-xs text-gray-300 mt-1">
                Updated Profile & Hero info, {successResult.skillsCount} skills, {successResult.projectsCount} projects,{' '}
                {successResult.experienceCount} career roles, {successResult.educationCount} education records, and{' '}
                {successResult.certCount} certifications.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              target="_blank"
              className="btn-primary py-2 px-4 text-xs font-semibold flex items-center gap-1.5"
            >
              <span>View Live Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* ── UNIFIED SMART AI PORTFOLIO ENGINE (SINGLE MODEL) ── */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0c1a2d] via-[#101935] to-[#160c2b] border border-cyan-500/30 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-6 h-6 animate-pulse text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-black text-white">Smart AI Portfolio Auto-Fill</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-purple-400 text-slate-950 shadow-sm">
                  Active & Ready
                </span>
                <span className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">
                  Zero Config
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-1 max-w-2xl leading-relaxed">
                Automatically transforms raw resume text into first-person narrative storytelling, executive headlines,
                in-depth project architecture breakdowns, and optimal theme color matching.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {parsedData && (
              <button
                type="button"
                onClick={() => handleRunAIEnhancement()}
                disabled={isEnhancingWithAI}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                {isEnhancingWithAI ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Re-Synthesizing with AI...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Re-Synthesize with AI</span>
                  </>
                )}
              </button>
            )}

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-xs text-gray-300 font-semibold">Auto-Enhance:</span>
              <input
                type="checkbox"
                checked={aiEnabled}
                onChange={(e) => setAiEnabled(e.target.checked)}
                className="w-4 h-4 rounded accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── AI ATMOSPHERE & THEME RECOMMENDATION BANNER ── */}
      {aiThemeRecommendation && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0a1f18] via-[#091a26] to-[#120f26] border border-emerald-500/30 shadow-xl space-y-3 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/20 shadow-md"
                style={{ backgroundColor: `${aiThemeRecommendation.primaryColor}25`, color: aiThemeRecommendation.primaryColor }}
              >
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    AI Atmosphere Recommendation
                  </span>
                  <Badge variant="cyan" size="sm">
                    {aiThemeRecommendation.name}
                  </Badge>
                </div>
                <h4 className="text-base font-extrabold text-white mt-0.5">
                  Optimal Color Palette Matched to Candidate Domain
                </h4>
                <p className="text-xs text-gray-300 mt-1 max-w-2xl leading-relaxed">
                  {aiThemeRecommendation.reason}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-2 shrink-0">
              <button
                type="button"
                onClick={handleApplyRecommendedTheme}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg hover:brightness-110 active:scale-95"
                style={{
                  backgroundColor: aiThemeRecommendation.primaryColor,
                  color: '#030712',
                }}
              >
                {aiThemeApplied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Theme Applied!</span>
                  </>
                ) : (
                  <>
                    <Palette className="w-4 h-4" />
                    <span>Apply Theme Instantly</span>
                  </>
                )}
              </button>

              <label className="flex items-center gap-1.5 text-[11px] text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={importOptions.applyAiTheme}
                  onChange={(e) =>
                    setImportOptions({ ...importOptions, applyAiTheme: e.target.checked })
                  }
                  className="w-3.5 h-3.5 rounded accent-emerald-400 cursor-pointer"
                />
                <span>Auto-apply theme on Auto-Fill</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* STEP 1: Upload or Paste */}
      <div className="p-6 rounded-2xl bg-[#0f172a] border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>Step 1: Provide Your CV / Resume</span>
          </h3>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSampleCV}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Fill in a sample engineer CV to test the auto-fill immediately"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Sample Resume</span>
            </button>

            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setActiveInputTab('upload')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeInputTab === 'upload' ? 'bg-cyan-500 text-slate-950' : 'text-gray-400 hover:text-white'
                }`}
              >
                Upload PDF File
              </button>
              <button
                type="button"
                onClick={() => setActiveInputTab('paste')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeInputTab === 'paste' ? 'bg-cyan-500 text-slate-950' : 'text-gray-400 hover:text-white'
                }`}
              >
                Paste Text
              </button>
            </div>
          </div>
        </div>

        {activeInputTab === 'upload' ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
              isDragging
                ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
                : 'border-white/10 hover:border-cyan-400/50 bg-white/[0.01]'
            }`}
          >
            <input
              type="file"
              id="cv-upload-input"
              ref={fileInputRef}
              accept=".pdf,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="cv-upload-input" className="cursor-pointer block">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-4 transition-transform hover:scale-110">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-white mb-1">
                {cvFile ? cvFile.name : 'Choose your CV PDF or Drag & Drop here'}
              </p>
              <p className="text-xs text-gray-500">
                Supports Adobe PDF (.pdf) and plain text (.txt) up to 15MB
              </p>
              {cvFile && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium border border-emerald-500/30">
                  <Check className="w-3.5 h-3.5" />
                  <span>File Ready: {(cvFile.size / 1024).toFixed(1)} KB</span>
                </div>
              )}
            </label>
            {cvFile && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCvFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="mt-3 text-xs text-red-400 hover:text-red-300 underline font-medium cursor-pointer"
              >
                Remove selected file
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400 px-1">
              <span>Paste resume text below:</span>
              {pastedText.length > 0 && (
                <button
                  type="button"
                  onClick={() => setPastedText('')}
                  className="text-gray-400 hover:text-white underline cursor-pointer"
                >
                  Clear text ({pastedText.length} chars)
                </button>
              )}
            </div>
            <textarea
              rows={8}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste the full text of your CV, resume, or LinkedIn profile here..."
              className="w-full bg-[#0d1120] border border-white/10 rounded-xl p-4 text-xs text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 resize-y font-mono"
            />
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleParse}
            variant="primary"
            isLoading={parsing}
            leftIcon={<Sparkles className="w-4 h-4" />}
          >
            {parsing ? 'Scanning & Parsing Resume...' : 'Parse & Extract All Info'}
          </Button>
        </div>
      </div>

      {/* STEP 2: Review Extracted Entities & Live Customization */}
      {parsedData && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Extraction Quality & AI Readiness Scorecard */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-[#0f172a] border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center font-black text-lg shrink-0 shadow-lg shadow-cyan-950/50">
                {aiReadinessScore || parsedData.metrics?.completenessScore || 96}%
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2 flex-wrap">
                  <span>AI Readiness Score: {aiReadinessScore || parsedData.metrics?.completenessScore || 96}%</span>
                  <Badge variant="cyan" size="sm">
                    ✨ AI 2.0 Synthesis
                  </Badge>
                  {aiThemeRecommendation && (
                    <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Palette className="w-3 h-3 text-emerald-400" />
                      <span>{aiThemeRecommendation.name}</span>
                    </span>
                  )}
                </h4>
                <p className="text-xs text-gray-300 mt-1">
                  Extracted {parsedData.skills.length} skills, {parsedData.projects?.length || 0} projects, {parsedData.experience.length} career roles, and {parsedData.certifications.length} certifications. Engine:{' '}
                  <span className="text-cyan-300 font-semibold uppercase text-[11px] tracking-wide">
                    Smart AI Engine Active
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-300 font-semibold">Import Mode:</span>
              <select
                value={importOptions.mode}
                onChange={(e) =>
                  setImportOptions({ ...importOptions, mode: e.target.value as any })
                }
                className="bg-[#0d1120] border border-cyan-500/30 rounded-xl px-3 py-1.5 text-xs text-cyan-200 font-semibold focus:outline-none"
              >
                <option value="merge">Merge (Keep existing + append new)</option>
                <option value="replace">Clean Replace (100% overwrite)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Step 2: Review & Customize Extracted Information</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                You can review or fine-tune details below. Toggle each section you wish to apply to your portfolio.
              </p>
            </div>
          </div>

          {/* SECTION 1: Personal & Bio */}
          <div className="p-5 rounded-2xl bg-[#0f172a] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">Profile, Hero & Bio</h4>
              </div>
              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <span>Include in Auto-Fill</span>
                <input
                  type="checkbox"
                  checked={importOptions.updateHeroAndAbout}
                  onChange={(e) =>
                    setImportOptions({ ...importOptions, updateHeroAndAbout: e.target.checked })
                  }
                  className="w-4 h-4 rounded accent-cyan-400 cursor-pointer"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-white/[0.02] p-4 rounded-xl border border-white/5">
              <div>
                <span className="text-gray-500 uppercase font-semibold text-[10px]">Full Name:</span>
                <input
                  type="text"
                  value={parsedData.personal.fullName}
                  onChange={(e) =>
                    setParsedData({
                      ...parsedData,
                      personal: { ...parsedData.personal, fullName: e.target.value },
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-bold text-sm mt-1 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div className="sm:col-span-2">
                <span className="text-gray-500 uppercase font-semibold text-[10px]">Headline / Tagline:</span>
                <input
                  type="text"
                  value={parsedData.personal.headline}
                  onChange={(e) =>
                    setParsedData({
                      ...parsedData,
                      personal: { ...parsedData.personal, headline: e.target.value },
                    })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-gray-200 mt-1 focus:outline-none focus:border-cyan-400 text-xs"
                />
              </div>
            </div>

            {/* AI Executive Headline Variations */}
            {aiHeadlineSuggestions && aiHeadlineSuggestions.length > 0 && (
              <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/25 space-y-2">
                <span className="text-[11px] font-bold text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>AI Executive Headline Variations (Click to adopt):</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {aiHeadlineSuggestions.map((h, hi) => {
                    const isSelected = parsedData.personal.headline === h;
                    return (
                      <button
                        key={hi}
                        type="button"
                        onClick={() => handleSelectHeadline(h)}
                        className={`text-left px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-purple-500/25 border-purple-400 text-white font-semibold shadow-sm'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:border-purple-400/50 hover:text-white'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {h}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* AI Narrative Story Bio */}
            {parsedData.summary.bioParagraphs.length > 0 && (
              <div className="text-xs text-gray-300 bg-white/[0.02] p-4 rounded-xl border border-white/5 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-gray-400 uppercase font-semibold text-[10px] flex items-center gap-1.5">
                    <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>AI Narrative Story Biography:</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleRegenerateBio}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-[11px] font-semibold border border-cyan-500/30 flex items-center gap-1 transition-colors cursor-pointer"
                    title="Re-synthesize bio narrative with active tone"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Re-Polish Bio</span>
                  </button>
                </div>
                {parsedData.summary.bioParagraphs.map((p, i) => (
                  <p key={i} className="leading-relaxed text-gray-200">
                    {p}
                  </p>
                ))}
              </div>
            )}

            {/* Candidate Key Strengths */}
            {aiKeyStrengths && aiKeyStrengths.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <span className="text-[10px] uppercase font-bold text-gray-500">Core Strengths:</span>
                {aiKeyStrengths.map((str, si) => (
                  <Badge key={si} variant="cyan" size="sm">
                    {str}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 2: Contact Coordinates */}
          <div className="p-5 rounded-2xl bg-[#0f172a] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">Contact & Social Coordinates</h4>
              </div>
              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <span>Include in Auto-Fill</span>
                <input
                  type="checkbox"
                  checked={importOptions.updateContact}
                  onChange={(e) =>
                    setImportOptions({ ...importOptions, updateContact: e.target.checked })
                  }
                  className="w-4 h-4 rounded accent-cyan-400 cursor-pointer"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-gray-500 text-[10px] uppercase font-semibold flex items-center gap-1">
                  <Mail className="w-3 h-3 text-cyan-400" /> Email:
                </span>
                <input
                  type="text"
                  value={parsedData.personal.email || ''}
                  onChange={(e) =>
                    setParsedData({
                      ...parsedData,
                      personal: { ...parsedData.personal, email: e.target.value },
                    })
                  }
                  placeholder="Not found"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-gray-500 text-[10px] uppercase font-semibold flex items-center gap-1">
                  <Phone className="w-3 h-3 text-cyan-400" /> Phone:
                </span>
                <input
                  type="text"
                  value={parsedData.personal.phone || ''}
                  onChange={(e) =>
                    setParsedData({
                      ...parsedData,
                      personal: { ...parsedData.personal, phone: e.target.value },
                    })
                  }
                  placeholder="Not found"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-gray-500 text-[10px] uppercase font-semibold flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-cyan-400" /> Location:
                </span>
                <input
                  type="text"
                  value={parsedData.personal.location || ''}
                  onChange={(e) =>
                    setParsedData({
                      ...parsedData,
                      personal: { ...parsedData.personal, location: e.target.value },
                    })
                  }
                  placeholder="Not found"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-gray-500 text-[10px] uppercase font-semibold flex items-center gap-1">
                  <GithubIcon className="w-3 h-3 text-cyan-400" /> Social Links:
                </span>
                <p className="text-white text-xs font-medium truncate pt-1">
                  {parsedData.personal.linkedinUrl ? 'LinkedIn ✓' : ''}{' '}
                  {parsedData.personal.githubUrl ? 'GitHub ✓' : ''}
                  {!parsedData.personal.linkedinUrl && !parsedData.personal.githubUrl && 'None'}
                </p>
              </div>
            </div>

            {cvFileUrl && (
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-xs text-gray-300">
                  Set this uploaded CV as the portfolio&apos;s active downloadable CV file:
                </span>
                <input
                  type="checkbox"
                  checked={importOptions.setDownloadableCv}
                  onChange={(e) =>
                    setImportOptions({ ...importOptions, setDownloadableCv: e.target.checked })
                  }
                  className="w-4 h-4 rounded accent-cyan-400 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* SECTION 3: Technical Skills */}
          <div className="p-5 rounded-2xl bg-[#0f172a] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">
                  Technical Skills ({parsedData.skills.length} discovered)
                </h4>
              </div>
              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <span>Include in Auto-Fill</span>
                <input
                  type="checkbox"
                  checked={importOptions.updateSkills}
                  onChange={(e) =>
                    setImportOptions({ ...importOptions, updateSkills: e.target.checked })
                  }
                  className="w-4 h-4 rounded accent-cyan-400 cursor-pointer"
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-2">
              {parsedData.skills.map((skill, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold group hover:border-cyan-400 transition-colors"
                >
                  <span>{skill.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(i)}
                    className="text-gray-400 hover:text-red-400 p-0.5 rounded-full cursor-pointer"
                    title="Remove skill"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick add skill */}
            <div className="flex items-center gap-2 pt-2 border-t border-white/5">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Add custom skill (e.g. Next.js, Redis, Docker)..."
                className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-400 max-w-sm"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold border border-cyan-500/30 cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </div>
          </div>

          {/* SECTION 4: Featured Projects (NEW!) */}
          {parsedData.projects && parsedData.projects.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#0f172a] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-sm font-bold text-white">
                    Featured Projects ({parsedData.projects.length} extracted)
                  </h4>
                </div>
                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                  <span>Include in Auto-Fill</span>
                  <input
                    type="checkbox"
                    checked={importOptions.updateProjects}
                    onChange={(e) =>
                      setImportOptions({ ...importOptions, updateProjects: e.target.checked })
                    }
                    className="w-4 h-4 rounded accent-cyan-400 cursor-pointer"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {parsedData.projects.map((proj, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-colors space-y-3 relative group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5 className="font-bold text-white text-sm">{proj.title}</h5>
                        {proj.tagline && (
                          <p className="text-xs text-cyan-400 font-medium mt-0.5">{proj.tagline}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        <Badge variant="cyan" size="sm">
                          {proj.projectType || 'Project'}
                        </Badge>
                        <button
                          type="button"
                          onClick={() => handleExpandProjectArchitecture(i)}
                          className="px-2 py-1 rounded-lg bg-purple-500/15 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          title="Generate architecture breakdown and problem-solving case study"
                        >
                          <Wand2 className="w-3 h-3 text-purple-400" />
                          <span>AI Expand</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveProject(i)}
                          className="p-1 text-gray-500 hover:text-red-400 rounded-lg cursor-pointer"
                          title="Remove project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {proj.summary && proj.summary !== proj.tagline && (
                      <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                        {proj.summary}
                      </p>
                    )}

                    {/* AI Expanded Architecture & Case Study */}
                    {(proj.architectureOverview || proj.problemSolved || proj.keyMetrics) && (
                      <div className="p-3 rounded-xl bg-[#080d19] border border-cyan-500/20 text-xs space-y-2">
                        {proj.architectureOverview && (
                          <div>
                            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                              🏗️ Architecture Overview:
                            </span>
                            <p className="text-gray-300 text-[11px] leading-relaxed mt-0.5">
                              {proj.architectureOverview}
                            </p>
                          </div>
                        )}
                        {proj.problemSolved && (
                          <div>
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                              🎯 Problem Solved:
                            </span>
                            <p className="text-gray-300 text-[11px] leading-relaxed mt-0.5">
                              {proj.problemSolved}
                            </p>
                          </div>
                        )}
                        {proj.keyMetrics && (
                          <div>
                            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">
                              📊 Metrics & Performance:
                            </span>
                            <p className="text-gray-300 text-[11px] leading-relaxed mt-0.5">
                              {proj.keyMetrics}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.technologies.map((t, ti) => (
                          <span
                            key={ti}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/5 text-gray-300 border border-white/10"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5: Work Experience */}
          <div className="p-5 rounded-2xl bg-[#0f172a] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">
                  Work Experience ({parsedData.experience.length} roles)
                </h4>
              </div>
              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <span>Include in Auto-Fill</span>
                <input
                  type="checkbox"
                  checked={importOptions.updateExperience}
                  onChange={(e) =>
                    setImportOptions({ ...importOptions, updateExperience: e.target.checked })
                  }
                  className="w-4 h-4 rounded accent-cyan-400 cursor-pointer"
                />
              </label>
            </div>

            {parsedData.experience.length > 0 ? (
              <div className="space-y-3">
                {parsedData.experience.map((exp, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <span className="font-bold text-white text-sm">{exp.role}</span>
                      <span className="text-cyan-400 font-mono text-[11px]">
                        {exp.startDate} — {exp.endDate}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-2 font-medium">{exp.company}</p>
                    {exp.responsibilities.length > 0 && (
                      <ul className="list-disc list-inside space-y-1 text-gray-400">
                        {exp.responsibilities.slice(0, 3).map((r, ri) => (
                          <li key={ri} className="truncate">
                            {r}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">
                No formal corporate roles found (common for recent graduates & project-based portfolios).
              </p>
            )}
          </div>

          {/* SECTION 6: Education */}
          <div className="p-5 rounded-2xl bg-[#0f172a] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">
                  Education ({parsedData.education.length} degrees)
                </h4>
              </div>
              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <span>Include in Auto-Fill</span>
                <input
                  type="checkbox"
                  checked={importOptions.updateEducation}
                  onChange={(e) =>
                    setImportOptions({ ...importOptions, updateEducation: e.target.checked })
                  }
                  className="w-4 h-4 rounded accent-cyan-400 cursor-pointer"
                />
              </label>
            </div>

            <div className="space-y-2.5">
              {parsedData.education.map((edu, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{edu.degree}</span>
                    <span className="text-gray-400 font-mono text-[11px]">
                      {edu.startYear} — {edu.endYear}
                    </span>
                  </div>
                  <p className="text-cyan-400 mt-0.5">{edu.institution}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 7: Certifications */}
          {parsedData.certifications.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#0f172a] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-cyan-400" />
                  <h4 className="text-sm font-bold text-white">
                    Certifications ({parsedData.certifications.length} credentials)
                  </h4>
                </div>
                <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                  <span>Include in Auto-Fill</span>
                  <input
                    type="checkbox"
                    checked={importOptions.updateCertifications}
                    onChange={(e) =>
                      setImportOptions({ ...importOptions, updateCertifications: e.target.checked })
                    }
                    className="w-4 h-4 rounded accent-cyan-400 cursor-pointer"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {parsedData.certifications.map((c, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">{c.title}</span>
                      <span className="text-[10px] font-mono text-cyan-400">{c.issueDate}</span>
                    </div>
                    <p className="text-gray-400 text-xs">{c.issuer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 8: Languages (if found) */}
          {parsedData.languages && parsedData.languages.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#0f172a] border border-white/10 space-y-3">
              <div className="flex items-center gap-2">
                <Languages className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">
                  Spoken Languages ({parsedData.languages.length})
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {parsedData.languages.map((lang, li) => (
                  <span
                    key={li}
                    className="text-xs px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-gray-200 font-semibold"
                  >
                    {lang.name}: <span className="text-cyan-400 font-normal">{lang.proficiency}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: 1-Click Apply */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/60 via-purple-950/60 to-slate-900 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-white">Ready to Auto-Fill Entire Portfolio?</h4>
                <Badge variant="cyan" size="sm">AI 2.0 Ready</Badge>
              </div>
              <p className="text-xs text-gray-300 mt-1 max-w-xl">
                {applyingStep
                  ? applyingStep
                  : `Applies profile, career history, expanded case studies, and ${importOptions.applyAiTheme && aiThemeRecommendation ? `the AI "${aiThemeRecommendation.name}" theme atmosphere` : 'selected data'} to your live website in one click.`}
              </p>
            </div>

            <Button
              type="button"
              onClick={handleApplyToPortfolio}
              variant="primary"
              size="lg"
              isLoading={applying}
              leftIcon={<CheckCircle2 className="w-5 h-5 text-slate-950" />}
            >
              {applying ? (applyingStep || 'Applying CV to Portfolio...') : 'Apply & Auto-Fill Portfolio'}
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
