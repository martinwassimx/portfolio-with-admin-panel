import { ParsedCVData, ParsedProject } from './parser';

export type AITone = 'senior_engineer' | 'founder_visionary' | 'product_innovator' | 'concise';

export interface AIThemeRecommendation {
  themeId: string;
  name: string;
  reason: string;
  primaryColor: string;
  bgColor: string;
}

export interface AIEnhancementOptions {
  tone?: AITone;
  targetRole?: string;
  apiKey?: string;
  provider?: 'builtin' | 'gemini' | 'openai';
}

export interface AIEnhancedCVData extends ParsedCVData {
  aiThemeRecommendation: AIThemeRecommendation;
  aiHeadlineSuggestions: string[];
  aiKeyStrengths: string[];
  aiGeneratedBioStory: string[];
  enhancedProjects: Array<ParsedProject & {
    architectureOverview?: string;
    problemSolved?: string;
    keyMetrics?: string;
  }>;
  aiReadinessScore: number;
  aiEnhancementSummary: {
    bioImproved: boolean;
    bulletsRephrased: number;
    projectsExpanded: number;
    toneApplied: string;
    providerUsed: string;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Action Verbs & Metrics for Generative Bullet Synthesis
// ─────────────────────────────────────────────────────────────────────────────
const ACTION_VERBS = [
  'Architected',
  'Spearheaded',
  'Engineered',
  'Orchestrated',
  'Optimized',
  'Streamlined',
  'Deployed',
  'Pioneered',
  'Refactored',
  'Integrated',
];

// ─────────────────────────────────────────────────────────────────────────────
// Determine Theme Recommendation from Skill Landscape
// ─────────────────────────────────────────────────────────────────────────────
export function recommendThemeForCandidate(
  skills: Array<{ name: string; category?: string }>,
  projects: ParsedProject[] = [],
  headline: string = ''
): AIThemeRecommendation {
  const allNames = skills.map((s) => s.name.toLowerCase()).join(' ') + ' ' +
    projects.map((p) => (p.title + ' ' + p.technologies.join(' '))).join(' ').toLowerCase() + ' ' +
    headline.toLowerCase();

  // AI / ML / Computer Vision
  if (/python|machine learning|deep learning|computer vision|pytorch|tensorflow|opencv|ai|nlp|optimization/i.test(allNames)) {
    return {
      themeId: 'emerald-matrix',
      name: 'Emerald Matrix',
      reason: 'Tailored for Artificial Intelligence and Machine Learning engineering with deep matrix teal and neon emerald accents.',
      primaryColor: '#10b981',
      bgColor: '#05130d',
    };
  }

  // Mobile / Flutter / Cross-Platform
  if (/flutter|dart|mobile|swift|ios|kotlin|android|react native/i.test(allNames)) {
    return {
      themeId: 'cyber-cyan',
      name: 'Cyber Neon (Cyan & Sky)',
      reason: 'High-energy modern electric cyan crafted for cross-platform mobile and responsive frontend applications.',
      primaryColor: '#00c8ff',
      bgColor: '#07090f',
    };
  }

  // Cloud / DevOps / Backend / Enterprise
  if (/aws|docker|kubernetes|cloud|devops|backend|go|golang|java|spring|sql|postgresql/i.test(allNames)) {
    return {
      themeId: 'ocean-sapphire',
      name: 'Ocean Sapphire',
      reason: 'Royal oceanic blue and deep azure, delivering an authoritative, scalable cloud architecture atmosphere.',
      primaryColor: '#0099ff',
      bgColor: '#030c18',
    };
  }

  // Creative Full-Stack / Product / Design
  if (/react|next\.js|typescript|tailwind|ui|ux|full.?stack|frontend|node/i.test(allNames)) {
    return {
      themeId: 'cosmic-violet',
      name: 'Cosmic Violet & Fuchsia',
      reason: 'Modern product and full-stack creative energy featuring neon violet and synthwave fuchsia highlights.',
      primaryColor: '#a855f7',
      bgColor: '#0d0618',
    };
  }

  // Systems / Low-level / Security
  if (/c\+\+|rust|assembly|c#|embedded|security|linux|operating systems/i.test(allNames)) {
    return {
      themeId: 'titanium-stealth',
      name: 'Titanium Stealth',
      reason: 'Monochromatic slate and platinum minimalism reflecting low-level systems precision and high-performance computing.',
      primaryColor: '#f1f5f9',
      bgColor: '#0b0c10',
    };
  }

  // Default tech luxury
  return {
    themeId: 'cyber-cyan',
    name: 'Cyber Neon',
    reason: 'Dynamic cyber cyan palette that highlights modern engineering portfolios with pristine contrast.',
    primaryColor: '#00c8ff',
    bgColor: '#07090f',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Headline Generator
// ─────────────────────────────────────────────────────────────────────────────
export function generateHeadlines(
  name: string,
  headline: string,
  skills: Array<{ name: string; category?: string }>,
  tone: AITone = 'senior_engineer'
): string[] {
  const topSkills = skills.slice(0, 4).map((s) => s.name);
  const skillStr = topSkills.length > 0 ? topSkills.slice(0, 3).join(' • ') : 'Full-Stack Systems';

  switch (tone) {
    case 'founder_visionary':
      return [
        `Software Engineer & AI Builder | Architecting Next-Generation Digital Systems`,
        `Engineering High-Performance Web & AI Solutions | Founder & Builder`,
        `Pioneering Scalable Architectures across ${skillStr}`,
      ];
    case 'product_innovator':
      return [
        `Full-Stack Engineer & Product Builder | Specializing in ${skillStr}`,
        `Crafting Intuitive, High-Speed Applications & Modern AI Workflows`,
        `Software Developer • Bridging Scalable Architecture and Exceptional UX`,
      ];
    case 'concise':
      return [
        `Software Engineer • ${skillStr}`,
        `Full-Stack & AI Systems Developer`,
        `Software Engineering Specialist`,
      ];
    case 'senior_engineer':
    default:
      return [
        `Software Engineer & Systems Architect | ${skillStr}`,
        `Full-Stack Software Engineer specializing in Scalable Systems & AI`,
        `Engineering Resilient Web & Mobile Platforms with ${skillStr}`,
      ];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Generative Story Bio Synthesis
// ─────────────────────────────────────────────────────────────────────────────
export function synthesizeBioStory(
  name: string,
  currentHeadline: string,
  skills: Array<{ name: string; category?: string }>,
  projects: ParsedProject[],
  tone: AITone = 'senior_engineer'
): string[] {
  const skillNames = skills.slice(0, 6).map((s) => s.name);
  const topProjTitles = projects.slice(0, 2).map((p) => p.title);

  let p1 = '';
  let p2 = '';
  let p3 = '';

  if (tone === 'founder_visionary') {
    p1 = `I am a forward-thinking software engineer and technology builder passionate about conceptualizing, architecting, and deploying high-impact digital systems. Driven by engineering rigor and user-centric problem-solving, I transform complex technical problems into elegant, production-grade software solutions.`;
    p2 = `My technical foundation spans ${skillNames.join(', ')}. From designing robust algorithmic pipelines to engineering cross-platform client applications${
      topProjTitles.length > 0 ? ` like ${topProjTitles.join(' and ')}` : ''
    }, I specialize in building for fault tolerance, speed, and clean modularity.`;
    p3 = `I actively pursue challenging engineering problems at the intersection of web scalability and artificial intelligence, constantly striving to deliver solutions that push technical boundaries and generate measurable value.`;
  } else if (tone === 'product_innovator') {
    p1 = `I am a full-stack software engineer focused on building sleek, reliable digital products that people love to use. My passion lies in blending solid backend architecture with intuitive, responsive interfaces to create frictionless user journeys.`;
    p2 = `Leveraging modern toolchains including ${skillNames.join(', ')}, I have built products spanning ${
      topProjTitles.length > 0 ? topProjTitles.join(', ') : 'interactive applications and cloud integrations'
    }. I treat code quality, maintainability, and end-user delight as non-negotiable priorities in every sprint.`;
    p3 = `Always eager to learn and iterate, I thrive on shipping modern web and mobile applications that bridge technical complexity with remarkable user satisfaction.`;
  } else if (tone === 'concise') {
    p1 = `Software engineer with a focus on building scalable web platforms, robust application backends, and AI-driven workflows.`;
    p2 = `Core competencies include ${skillNames.join(', ')}${
      topProjTitles.length > 0 ? `, demonstrated across projects such as ${topProjTitles.join(' and ')}` : ''
    }. Experienced in API integration, clean architectural patterns, and performance tuning.`;
    p3 = `Dedicated to continuous improvement, pragmatic engineering, and delivering reliable software for modern teams.`;
  } else {
    // Senior Engineer (Default)
    p1 = `I am a software engineer committed to engineering scalable, maintainable, and high-performance digital systems. With deep interest in modern system design and algorithm optimization, I bring a disciplined, analytical approach to software development.`;
    p2 = `My core competencies center around ${skillNames.join(', ')}. Through hands-on development on projects such as ${
      topProjTitles.length > 0 ? topProjTitles.join(' and ') : 'distributed systems and client applications'
    }, I have honed expertise in clean architecture, API design, computational efficiency, and robust data management.`;
    p3 = `I am constantly expanding my technical repertoire into advanced paradigms like automated workflows and machine learning integration, always aiming to architect software that stands up to production demands.`;
  }

  return [p1, p2, p3];
}

// ─────────────────────────────────────────────────────────────────────────────
// Project Expansion & Architecture Synthesis
// ─────────────────────────────────────────────────────────────────────────────
export function expandProjectDetails(
  project: ParsedProject,
  tone: AITone = 'senior_engineer'
): ParsedProject & { architectureOverview: string; problemSolved: string; keyMetrics: string } {
  const techStr = project.technologies.join(', ') || 'Modern Full-Stack Stack';

  // Generate impact bullets if short or missing
  const enhancedBullets = [...project.bullets];
  if (enhancedBullets.length === 0) {
    enhancedBullets.push(
      `Architected end-to-end solution utilizing ${techStr} with emphasis on modular structure and responsive design.`,
      `Implemented core domain logic and data management layers ensuring predictable state and zero critical runtime regressions.`,
      `Integrated automated testing patterns and structured error handling for dependable user-facing operations.`
    );
  } else if (enhancedBullets.length < 3) {
    enhancedBullets.push(
      `Optimized data serialization and pipeline throughput, noticeably enhancing client responsiveness and latency.`
    );
  }

  // Polish each bullet with strong active verbs
  const polishedBullets = enhancedBullets.map((b) => {
    let clean = b.trim();
    if (!/^[A-Z]/.test(clean)) {
      clean = clean.charAt(0).toUpperCase() + clean.slice(1);
    }
    return clean;
  });

  const titleLower = project.title.toLowerCase();

  // Architecture overview synthesis
  let architecture = `Multi-layered client-service architecture integrating ${techStr} with clean state management, structured API endpoints, and modular data flow.`;
  let problem = `Solves manual operational overhead by automating data parsing, classification, and user interaction through a unified, high-performance interface.`;
  let metrics = `Achieved low response latency, seamless cross-platform reliability, and zero data loss across concurrent workloads.`;

  if (/classifier|classification|vision|waste|image|gesture/i.test(titleLower)) {
    architecture = `Computer vision inference pipeline powered by deep convolutional networks, preprocessed image transformations, and optimized local runtime workers.`;
    problem = `Eliminates manual visual categorization by automating real-time image recognition with high confidence and immediate visual feedback.`;
    metrics = `Delivers real-time frame inference (<45ms latency) with consistent classification accuracy across diverse lighting environments.`;
  } else if (/routing|vrp|optimization|algorithm/i.test(titleLower)) {
    architecture = `Combinatorial optimization engine implementing metaheuristic search routines, cost matrix evaluation, and localized heuristic graph pruning.`;
    problem = `Addresses complex resource and distance constraints to significantly reduce logistical delivery time, fuel consumption, and transport bottlenecks.`;
    metrics = `Reduces total travel trajectory by 28%+ across simulated high-density multi-stop distribution graphs.`;
  } else if (/event|app|mobile|flutter|chat|social/i.test(titleLower)) {
    architecture = `Reactive cross-platform client architecture adhering to clean BLoC/Provider state separation, RESTful data caching, and asynchronous network sync.`;
    problem = `Centralizes fragmented user schedules, registration flows, and notifications into an engaging, performant mobile experience.`;
    metrics = `Maintains smooth 60fps rendering, offline caching resilience, and zero unhandled exception drops.`;
  }

  return {
    ...project,
    bullets: polishedBullets,
    summary: project.summary || project.tagline || problem,
    architectureOverview: architecture,
    problemSolved: problem,
    keyMetrics: metrics,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Cloud LLM Provider Call (Google Gemini or OpenAI) with Resilient Fallback
// ─────────────────────────────────────────────────────────────────────────────
async function callCloudLLMEnhancer(
  rawText: string,
  baseData: ParsedCVData,
  apiKey: string,
  provider: 'gemini' | 'openai',
  tone: AITone
): Promise<Partial<AIEnhancedCVData> | null> {
  try {
    const prompt = `You are an elite developer career architect and executive portfolio editor.
Analyze the following developer resume and produce an enhanced, state-of-the-art developer portfolio profile in valid JSON format.

Desired Tone: ${tone} (e.g. Senior Software Engineer, Visionary Builder, High-Impact).

Developer Info:
Name: ${baseData.personal.fullName}
Skills: ${baseData.skills.map((s) => s.name).join(', ')}
Resume Snippet:
${rawText.slice(0, 3500)}

Return ONLY a raw valid JSON object (no markdown code blocks, no backticks, no comments) conforming to this schema:
{
  "headline": "A punchy, modern high-impact role headline",
  "bioParagraphs": [
    "First paragraph: Introduction and technical mission",
    "Second paragraph: Concrete engineering depth and projects",
    "Third paragraph: Forward-looking ambition and team value"
  ],
  "headlineSuggestions": ["Option 1", "Option 2", "Option 3"],
  "keyStrengths": ["Strength 1", "Strength 2", "Strength 3", "Strength 4"],
  "projects": [
    {
      "title": "Project Name",
      "tagline": "Catchy 1-line subtitle",
      "summary": "Impact summary",
      "technologies": ["Tech1", "Tech2"],
      "bullets": ["Impact bullet 1", "Impact bullet 2", "Impact bullet 3"],
      "architectureOverview": "Technical architecture description",
      "problemSolved": "Real-world problem solved",
      "keyMetrics": "Results and performance achievements"
    }
  ]
}`;

    if (provider === 'gemini') {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            responseMimeType: 'application/json',
          },
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const candidateText = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          const parsed = JSON.parse(candidateText.replace(/```json|```/g, '').trim());
          return parsed;
        }
      }
    } else if (provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are an expert developer portfolio architect. Output only valid JSON.' },
            { role: 'user', content: prompt },
          ],
          temperature: 0.4,
          response_format: { type: 'json_object' },
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const content = json.choices?.[0]?.message?.content;
        if (content) {
          return JSON.parse(content);
        }
      }
    }
  } catch (err) {
    console.warn('Cloud LLM enhancement call had an error, falling back to built-in generator:', err);
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Master Generative AI 2.0 Auto-Fill Orchestrator
// ─────────────────────────────────────────────────────────────────────────────
export async function runGenerativeAIAutoFill(
  baseData: ParsedCVData,
  rawText: string,
  options: AIEnhancementOptions = {}
): Promise<AIEnhancedCVData> {
  const tone = options.tone || 'senior_engineer';
  const apiKey = options.apiKey || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
  const provider = options.provider || (process.env.GEMINI_API_KEY ? 'gemini' : process.env.OPENAI_API_KEY ? 'openai' : 'builtin');

  let cloudEnhanced: any = null;
  let providerUsed = 'Built-in Generative AI 2.0 Engine';

  // 1. Try Cloud LLM if an API key is available
  if (apiKey && (provider === 'gemini' || provider === 'openai')) {
    cloudEnhanced = await callCloudLLMEnhancer(rawText, baseData, apiKey, provider, tone);
    if (cloudEnhanced) {
      providerUsed = provider === 'gemini' ? 'Google Gemini 1.5 Flash' : 'OpenAI GPT-4o-mini';
    }
  }

  // 2. Synthesize High-Impact Headlines
  const aiHeadlineSuggestions = cloudEnhanced?.headlineSuggestions ||
    generateHeadlines(baseData.personal.fullName, baseData.personal.headline, baseData.skills, tone);

  const selectedHeadline = cloudEnhanced?.headline ||
    (baseData.personal.headline && baseData.personal.headline.length > 20
      ? baseData.personal.headline
      : aiHeadlineSuggestions[0]);

  // 3. Synthesize Story Bio
  const aiGeneratedBioStory = cloudEnhanced?.bioParagraphs ||
    synthesizeBioStory(baseData.personal.fullName, selectedHeadline, baseData.skills, baseData.projects || [], tone);

  // 4. Synthesize Project Case Studies with Architecture Details
  const projectsToProcess = baseData.projects && baseData.projects.length > 0
    ? baseData.projects
    : [];

  const enhancedProjects = projectsToProcess.map((proj) => {
    // Check if cloud provided custom enrichment for this project
    const cloudMatch = cloudEnhanced?.projects?.find(
      (cp: any) => cp.title?.toLowerCase() === proj.title?.toLowerCase()
    );

    if (cloudMatch) {
      return {
        ...proj,
        tagline: cloudMatch.tagline || proj.tagline,
        summary: cloudMatch.summary || proj.summary,
        bullets: cloudMatch.bullets || proj.bullets,
        architectureOverview: cloudMatch.architectureOverview,
        problemSolved: cloudMatch.problemSolved,
        keyMetrics: cloudMatch.keyMetrics,
      };
    }

    return expandProjectDetails(proj, tone);
  });

  // 5. Enhance Experience Bullets
  const enhancedExperience = baseData.experience.map((exp) => {
    const polishedResp = exp.responsibilities.map((r, idx) => {
      let trimmed = r.trim();
      // Ensure begins with action verb if passive
      if (!/^[A-Z][a-z]+ed\b/.test(trimmed) && !/^(Developed|Built|Created|Engineered|Spearheaded|Managed|Designed)/i.test(trimmed)) {
        const verb = ACTION_VERBS[idx % ACTION_VERBS.length];
        trimmed = `${verb} ${trimmed.charAt(0).toLowerCase() + trimmed.slice(1)}`;
      }
      return trimmed;
    });

    return {
      ...exp,
      responsibilities: polishedResp,
    };
  });

  // 6. Formulate AI Key Strengths
  const aiKeyStrengths = cloudEnhanced?.keyStrengths || [
    'Modular System Architecture & Clean Design Patterns',
    'Algorithm Optimization & Computational Efficiency',
    'End-to-End Full-Lifecycle Product Development',
    'Continuous Integration, Testing & Agile Execution',
  ];

  // 7. Calculate AI Theme Recommendation
  const aiThemeRecommendation = recommendThemeForCandidate(
    baseData.skills,
    baseData.projects || [],
    selectedHeadline
  );

  // 8. Quality Scorecard 2.0 Calculation
  let readiness = 80;
  if (aiGeneratedBioStory.length >= 3) readiness += 5;
  if (enhancedProjects.length >= 2) readiness += 5;
  if (baseData.skills.length >= 8) readiness += 5;
  if (baseData.personal.email && baseData.personal.linkedinUrl) readiness += 5;
  const aiReadinessScore = Math.min(100, readiness);

  return {
    ...baseData,
    personal: {
      ...baseData.personal,
      headline: selectedHeadline,
    },
    summary: {
      bioParagraphs: aiGeneratedBioStory,
      tags: baseData.summary.tags,
    },
    experience: enhancedExperience,
    projects: enhancedProjects,
    enhancedProjects,
    aiThemeRecommendation,
    aiHeadlineSuggestions,
    aiKeyStrengths,
    aiGeneratedBioStory,
    aiReadinessScore,
    aiEnhancementSummary: {
      bioImproved: true,
      bulletsRephrased: enhancedExperience.reduce((sum, e) => sum + e.responsibilities.length, 0),
      projectsExpanded: enhancedProjects.length,
      toneApplied: tone,
      providerUsed,
    },
  };
}
