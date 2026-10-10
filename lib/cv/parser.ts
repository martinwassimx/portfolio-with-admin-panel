export interface ParsedProject {
  title: string;
  tagline?: string;
  summary: string;
  technologies: string[];
  bullets: string[];
  projectType?: string;
  slug?: string;
  githubUrl?: string;
  liveUrl?: string;
  architectureOverview?: string;
  problemSolved?: string;
  keyMetrics?: string;
}

export interface ParsedLanguage {
  name: string;
  proficiency: string;
}

export interface ParsedCVData {
  personal: {
    fullName: string;
    headline: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
  };
  summary: {
    bioParagraphs: string[];
    tags: string[];
  };
  skills: Array<{
    name: string;
    category: string;
    proficiency?: number;
    badgeColor?: string;
  }>;
  experience: Array<{
    role: string;
    company: string;
    location?: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    description: string;
    responsibilities: string[];
    achievements: string[];
    technologies: string[];
  }>;
  education: Array<{
    degree: string;
    fieldOfStudy: string;
    institution: string;
    location?: string;
    startYear: string;
    endYear: string;
    grade?: string;
    description?: string;
  }>;
  certifications: Array<{
    title: string;
    issuer: string;
    issueDate: string;
    credentialId?: string;
    credentialUrl?: string;
    skills: string[];
  }>;
  projects?: ParsedProject[];
  languages?: ParsedLanguage[];
  metrics?: {
    completenessScore: number;
    sectionsFound: string[];
    wordCount: number;
  };
  rawTextPreview: string;
}

// ─── Skill taxonomy ──────────────────────────────────────────────────────────
// Only exact skills (no partial-word matches)
const SKILL_TAXONOMY: Record<string, { category: string; badgeColor: string; display?: string }> = {
  // Languages
  python: { category: 'Programming Languages', badgeColor: 'blue', display: 'Python' },
  dart: { category: 'Programming Languages', badgeColor: 'cyan', display: 'Dart' },
  javascript: { category: 'Programming Languages', badgeColor: 'amber', display: 'JavaScript' },
  typescript: { category: 'Programming Languages', badgeColor: 'cyan', display: 'TypeScript' },
  'c#': { category: 'Programming Languages', badgeColor: 'purple', display: 'C#' },
  'c++': { category: 'Programming Languages', badgeColor: 'blue', display: 'C++' },
  java: { category: 'Programming Languages', badgeColor: 'amber', display: 'Java' },
  go: { category: 'Programming Languages', badgeColor: 'cyan', display: 'Go' },
  rust: { category: 'Programming Languages', badgeColor: 'amber', display: 'Rust' },
  kotlin: { category: 'Programming Languages', badgeColor: 'purple', display: 'Kotlin' },
  swift: { category: 'Programming Languages', badgeColor: 'amber', display: 'Swift' },
  sql: { category: 'Programming Languages', badgeColor: 'cyan', display: 'SQL' },
  'vb.net': { category: 'Programming Languages', badgeColor: 'blue', display: 'VB.NET' },
  html: { category: 'Programming Languages', badgeColor: 'amber', display: 'HTML5' },
  css: { category: 'Programming Languages', badgeColor: 'blue', display: 'CSS3' },
  php: { category: 'Programming Languages', badgeColor: 'purple', display: 'PHP' },
  ruby: { category: 'Programming Languages', badgeColor: 'red', display: 'Ruby' },
  scala: { category: 'Programming Languages', badgeColor: 'red', display: 'Scala' },

  // Mobile & Web
  flutter: { category: 'Mobile & Web Development', badgeColor: 'cyan', display: 'Flutter' },
  'react native': { category: 'Mobile & Web Development', badgeColor: 'cyan', display: 'React Native' },
  android: { category: 'Mobile & Web Development', badgeColor: 'green', display: 'Android' },
  ios: { category: 'Mobile & Web Development', badgeColor: 'purple', display: 'iOS' },
  ionic: { category: 'Mobile & Web Development', badgeColor: 'blue', display: 'Ionic' },
  xamarin: { category: 'Mobile & Web Development', badgeColor: 'blue', display: 'Xamarin' },

  // Backend & Web
  'next.js': { category: 'Backend & Web Development', badgeColor: 'cyan', display: 'Next.js' },
  nextjs: { category: 'Backend & Web Development', badgeColor: 'cyan', display: 'Next.js' },
  react: { category: 'Backend & Web Development', badgeColor: 'cyan', display: 'React' },
  'node.js': { category: 'Backend & Web Development', badgeColor: 'green', display: 'Node.js' },
  nodejs: { category: 'Backend & Web Development', badgeColor: 'green', display: 'Node.js' },
  express: { category: 'Backend & Web Development', badgeColor: 'green', display: 'Express.js' },
  'asp.net': { category: 'Backend & Web Development', badgeColor: 'purple', display: 'ASP.NET' },
  'asp.net core': { category: 'Backend & Web Development', badgeColor: 'purple', display: 'ASP.NET Core' },
  'asp.net web api': { category: 'Backend & Web Development', badgeColor: 'purple', display: 'ASP.NET Web API' },
  fastapi: { category: 'Backend & Web Development', badgeColor: 'green', display: 'FastAPI' },
  django: { category: 'Backend & Web Development', badgeColor: 'green', display: 'Django' },
  flask: { category: 'Backend & Web Development', badgeColor: 'cyan', display: 'Flask' },
  'tailwind css': { category: 'Backend & Web Development', badgeColor: 'cyan', display: 'Tailwind CSS' },
  tailwind: { category: 'Backend & Web Development', badgeColor: 'cyan', display: 'Tailwind CSS' },
  'rest api': { category: 'Backend & Web Development', badgeColor: 'blue', display: 'REST APIs' },
  'rest apis': { category: 'Backend & Web Development', badgeColor: 'blue', display: 'REST APIs' },
  graphql: { category: 'Backend & Web Development', badgeColor: 'purple', display: 'GraphQL' },
  vue: { category: 'Backend & Web Development', badgeColor: 'green', display: 'Vue.js' },
  angular: { category: 'Backend & Web Development', badgeColor: 'red', display: 'Angular' },
  svelte: { category: 'Backend & Web Development', badgeColor: 'amber', display: 'Svelte' },
  laravel: { category: 'Backend & Web Development', badgeColor: 'red', display: 'Laravel' },
  spring: { category: 'Backend & Web Development', badgeColor: 'green', display: 'Spring Boot' },

  // AI & ML
  'computer vision': { category: 'AI & Machine Learning', badgeColor: 'cyan', display: 'Computer Vision' },
  'gesture recognition': { category: 'AI & Machine Learning', badgeColor: 'purple', display: 'Gesture Recognition' },
  'machine learning': { category: 'AI & Machine Learning', badgeColor: 'purple', display: 'Machine Learning' },
  'deep learning': { category: 'AI & Machine Learning', badgeColor: 'purple', display: 'Deep Learning' },
  'image classification': { category: 'AI & Machine Learning', badgeColor: 'blue', display: 'Image Classification' },
  pytorch: { category: 'AI & Machine Learning', badgeColor: 'amber', display: 'PyTorch' },
  tensorflow: { category: 'AI & Machine Learning', badgeColor: 'amber', display: 'TensorFlow' },
  rag: { category: 'AI & Machine Learning', badgeColor: 'purple', display: 'RAG' },
  llm: { category: 'AI & Machine Learning', badgeColor: 'purple', display: 'LLMs' },
  transformers: { category: 'AI & Machine Learning', badgeColor: 'amber', display: 'Transformers' },
  langchain: { category: 'AI & Machine Learning', badgeColor: 'green', display: 'LangChain' },
  opencv: { category: 'AI & Machine Learning', badgeColor: 'green', display: 'OpenCV' },
  nlp: { category: 'AI & Machine Learning', badgeColor: 'blue', display: 'NLP' },
  'optimization algorithms': { category: 'AI & Machine Learning', badgeColor: 'amber', display: 'Optimization Algorithms' },
  'operations research': { category: 'AI & Machine Learning', badgeColor: 'purple', display: 'Operations Research' },
  'scikit-learn': { category: 'AI & Machine Learning', badgeColor: 'blue', display: 'Scikit-learn' },
  keras: { category: 'AI & Machine Learning', badgeColor: 'red', display: 'Keras' },
  huggingface: { category: 'AI & Machine Learning', badgeColor: 'amber', display: 'HuggingFace' },
  'hugging face': { category: 'AI & Machine Learning', badgeColor: 'amber', display: 'HuggingFace' },

  // Databases & Tools
  postgresql: { category: 'Databases & Tools', badgeColor: 'blue', display: 'PostgreSQL' },
  supabase: { category: 'Databases & Tools', badgeColor: 'green', display: 'Supabase' },
  'sql server': { category: 'Databases & Tools', badgeColor: 'red', display: 'SQL Server' },
  mongodb: { category: 'Databases & Tools', badgeColor: 'green', display: 'MongoDB' },
  redis: { category: 'Databases & Tools', badgeColor: 'red', display: 'Redis' },
  mysql: { category: 'Databases & Tools', badgeColor: 'blue', display: 'MySQL' },
  sqlite: { category: 'Databases & Tools', badgeColor: 'cyan', display: 'SQLite' },
  firebase: { category: 'Databases & Tools', badgeColor: 'amber', display: 'Firebase' },
  docker: { category: 'Databases & Tools', badgeColor: 'blue', display: 'Docker' },
  kubernetes: { category: 'Databases & Tools', badgeColor: 'blue', display: 'Kubernetes' },
  git: { category: 'Databases & Tools', badgeColor: 'amber', display: 'Git' },
  n8n: { category: 'Databases & Tools', badgeColor: 'red', display: 'n8n' },
  aws: { category: 'Databases & Tools', badgeColor: 'amber', display: 'AWS' },
  azure: { category: 'Databases & Tools', badgeColor: 'blue', display: 'Azure' },
  gcp: { category: 'Databases & Tools', badgeColor: 'blue', display: 'Google Cloud' },
  vercel: { category: 'Databases & Tools', badgeColor: 'cyan', display: 'Vercel' },
  linux: { category: 'Databases & Tools', badgeColor: 'amber', display: 'Linux' },
  nginx: { category: 'Databases & Tools', badgeColor: 'green', display: 'Nginx' },
  prisma: { category: 'Databases & Tools', badgeColor: 'cyan', display: 'Prisma' },

  // Architecture & CS
  'object-oriented programming': { category: 'Architecture & Fundamentals', badgeColor: 'blue', display: 'OOP' },
  oop: { category: 'Architecture & Fundamentals', badgeColor: 'blue', display: 'OOP' },
  'data structures': { category: 'Architecture & Fundamentals', badgeColor: 'amber', display: 'Data Structures' },
  algorithms: { category: 'Architecture & Fundamentals', badgeColor: 'purple', display: 'Algorithms' },
  'clean architecture': { category: 'Architecture & Fundamentals', badgeColor: 'purple', display: 'Clean Architecture' },
  'design patterns': { category: 'Architecture & Fundamentals', badgeColor: 'cyan', display: 'Design Patterns' },
  microservices: { category: 'Architecture & Fundamentals', badgeColor: 'green', display: 'Microservices' },
  agile: { category: 'Architecture & Fundamentals', badgeColor: 'cyan', display: 'Agile' },
  scrum: { category: 'Architecture & Fundamentals', badgeColor: 'cyan', display: 'Scrum' },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function isNoiseLine(line: string): boolean {
  // Filter out lines that are clearly not useful content
  const trimmed = line.trim();
  if (trimmed.length < 2) return true;
  if (/^\d{5,}$/.test(trimmed)) return true; // standalone long numbers
  if (/^[|•–—\-─═_=]+$/.test(trimmed)) return true; // dividers
  if (/^page\s+\d+(\s+of\s+\d+)?$/i.test(trimmed)) return true;
  return false;
}

function splitSections(lines: string[]): Record<string, string[]> {
  const sectionHeaders = [
    { key: 'summary',      pattern: /^(professional\s+)?summary$|^professional\s+summary$|^about\s*me$|^profile$|^objective$|^overview$/i },
    { key: 'experience',   pattern: /^(work\s+)?experience$|^employment\s+history$|^professional\s+experience$|^internship(s)?$|^career\s+history$|^work\s+history$/i },
    { key: 'education',    pattern: /^education$|^academic\s+(background|degrees?|qualifications?)$/i },
    { key: 'skills',       pattern: /^(technical\s+)?skills$|^technologies$|^core\s+competencies$|^tools(\s*(and\s*)?platforms?)?$|^competencies$|^tech\s+stack$/i },
    { key: 'certifications', pattern: /^certifications?$|^licenses?$|^courses?$|^credentials?$|^certifications?\s*(and\s+training)?$|^training$/i },
    { key: 'projects',     pattern: /^projects?$|^personal\s+projects?$|^key\s+projects?$|^portfolio$|^notable\s+projects?$/i },
    { key: 'languages',    pattern: /^(spoken\s+)?languages?$/i },
    { key: 'awards',       pattern: /^awards?$|^honors?$|^achievements?$/i },
  ];

  const sections: Record<string, string[]> = {
    preamble: [], summary: [], experience: [], education: [],
    skills: [], certifications: [], projects: [], languages: [], awards: [], other: [],
  };

  let current = 'preamble';

  for (const line of lines) {
    const matched = sectionHeaders.find((h) => h.pattern.test(line.trim()));
    if (matched) {
      current = matched.key;
    } else if (sections[current] !== undefined) {
      if (!isNoiseLine(line)) sections[current].push(line);
    } else {
      if (!isNoiseLine(line)) sections.other.push(line);
    }
  }

  return sections;
}

// ─── Main parser ─────────────────────────────────────────────────────────────
export function parseCVText(rawText: string): ParsedCVData {
  const cleanText = rawText.replace(/\r/g, '').replace(/\t/g, ' ');
  const lines = cleanText.split('\n').map((l) => l.trim()).filter((l) => l);

  // ── 1. Email ──────────────────────────────────────────────────────────────
  const emailMatch = cleanText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0].toLowerCase() : '';

  // ── 2. Phone ──────────────────────────────────────────────────────────────
  let phone = '';
  const egyptianPhone = cleanText.match(/\b01[0125]\d{8}\b/);
  if (egyptianPhone) {
    phone = egyptianPhone[0];
  } else {
    const generalPhone = cleanText.match(/(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,5}(?!\d)/);
    if (generalPhone) phone = generalPhone[0].trim();
  }

  // ── 3. Social links ───────────────────────────────────────────────────────
  const linkedinMatch = cleanText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([\w-]+)/i);
  const linkedinUrl = linkedinMatch ? `https://linkedin.com/in/${linkedinMatch[1]}` : '';

  const githubMatch = cleanText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([\w-]+)/i);
  const githubUrl = githubMatch ? `https://github.com/${githubMatch[1]}` : '';

  const portfolioMatch = cleanText.match(/(?:https?:\/\/)?([a-zA-Z0-9-]+\.(?:vercel\.app|github\.io|netlify\.app))(?:\/\S*)?/i);
  const portfolioUrl = portfolioMatch ? portfolioMatch[0] : '';

  // ── 4. Location ───────────────────────────────────────────────────────────
  let location = '';
  const locationPatterns = [
    /\b(Cairo|Alexandria|Giza|Mansoura|Aswan|Luxor|Port Said|Suez|Egypt)\b(?:[,\s]+([A-Za-z]+))?/i,
    /\b(Dubai|Abu Dhabi|Riyadh|Jeddah|Kuwait|Doha|UAE|Saudi Arabia|Qatar)\b/i,
    /\b(San Francisco|New York|London|Berlin|Paris|Toronto|Sydney|Remote)\b(?:[,\s]+([A-Za-z\s]+))?/i,
  ];
  for (const pat of locationPatterns) {
    const m = cleanText.match(pat);
    if (m) { location = m[0].trim(); break; }
  }

  // ── 5. Name & headline ────────────────────────────────────────────────────
  let fullName = '';
  let headline = '';

  const preambleLines = lines.slice(0, 10).filter(
    (l) => !l.includes('@') && !l.includes('http') && !l.includes('linkedin') &&
            !l.includes('github') && !/^\+?\d[\d\s\-().]{6,}$/.test(l)
  );

  // Name: first line that looks like a human name (2-4 words, mostly letters)
  for (const line of preambleLines) {
    const words = line.split(/\s+/);
    if (!fullName && words.length >= 2 && words.length <= 5 &&
        /^[A-Za-z\s'.'-]+$/.test(line) && line.length <= 50) {
      fullName = toTitleCase(line);
      continue;
    }
    // Headline: next line that has role keywords or separators
    if (fullName && !headline && line !== fullName &&
        (line.includes('|') || line.includes('•') || line.includes('&') ||
         /engineer|developer|designer|analyst|scientist|architect|manager|intern|founder/i.test(line))) {
      headline = line;
      break;
    }
  }

  if (!fullName && preambleLines.length > 0) {
    fullName = toTitleCase(preambleLines[0].replace(/[^a-zA-Z\s]/g, '').trim());
  }
  if (!headline) headline = 'Software Engineer';

  // ── 6. Split into sections ────────────────────────────────────────────────
  const sections = splitSections(lines);

  // ── 7. Summary / Bio ──────────────────────────────────────────────────────
  let bioParagraphs: string[] = [];

  const summaryRaw = sections.summary
    .filter((l) => {
      const ll = l.toLowerCase();
      return (
        !ll.includes('linkedin') && !ll.includes('github') &&
        !ll.includes('http') && !l.includes('@') &&
        !l.includes('|') && l !== fullName && l.length > 20
      );
    })
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (summaryRaw.length > 40) {
    // Split into ~2 paragraphs at natural sentence boundaries
    const sentences = summaryRaw.match(/[^.!?]+[.!?]+/g) || [summaryRaw];
    const half = Math.ceil(sentences.length / 2);
    const para1 = sentences.slice(0, half).join(' ').trim();
    const para2 = sentences.slice(half).join(' ').trim();
    bioParagraphs = [para1, para2].filter((p) => p.length > 10);
  }

  if (bioParagraphs.length === 0) {
    bioParagraphs = [
      `${fullName} is a ${headline}. Experienced in building high-performance applications, software architecture, and delivering end-to-end technical solutions.`,
    ];
  }

  // ── 8. Skills ─────────────────────────────────────────────────────────────
  const discoveredSkills: ParsedCVData['skills'] = [];
  const addedNames = new Set<string>();
  const textLower = cleanText.toLowerCase();

  // First pass: match against the taxonomy using whole-word regex
  for (const [key, meta] of Object.entries(SKILL_TAXONOMY)) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Match as whole word (not inside longer words)
    const regex = new RegExp(`(?<![a-zA-Z0-9+#])${escaped}(?![a-zA-Z0-9+#])`, 'i');
    if (regex.test(textLower)) {
      const displayName = meta.display || toTitleCase(key);
      const normalised = displayName.toLowerCase();
      if (!addedNames.has(normalised)) {
        addedNames.add(normalised);
        discoveredSkills.push({
          name: displayName,
          category: meta.category,
          proficiency: 85,
          badgeColor: meta.badgeColor,
        });
      }
    }
  }

  // Second pass: parse skills section lines for unlisted skills
  // Only accept tokens that look like real tech names (min 2 chars, short enough, no common verbs)
  const stopWords = new Set([
    'and', 'the', 'with', 'for', 'using', 'such', 'as', 'including', 'also',
    'creating', 'managing', 'building', 'designing', 'implementing', 'developing',
    'working', 'strong', 'experience', 'knowledge', 'understanding', 'ability',
    'proficient', 'familiar', 'skilled', 'events', 'projects', 'systems',
    'responsive', 'clean', 'ui', 'ux', 'design',
  ]);

  for (const skillLine of sections.skills) {
    // Remove label prefix like "Programming Languages:" or "Mobile Development:"
    const colonIdx = skillLine.indexOf(':');
    const cleaned = colonIdx > 0 && colonIdx < 35
      ? skillLine.slice(colonIdx + 1).trim()
      : skillLine;

    const tokens = cleaned
      .split(/[,|•;·]+/)
      .map((t) => t.trim())
      .filter((t) => {
        if (t.length < 2 || t.length > 35) return false;
        if (/^\d+$/.test(t)) return false;
        const tLow = t.toLowerCase();
        const words = tLow.split(/\s+/);
        // Reject if all words are stop words
        if (words.every((w) => stopWords.has(w))) return false;
        // Reject phrases longer than 4 words — too noisy
        if (words.length > 4) return false;
        // Reject if it looks like a section header
        if (/^(programming|mobile|artificial|tools|core|web|backend|frontend|cloud)$/i.test(t)) return false;
        return true;
      });

    for (const token of tokens) {
      const normalised = token.toLowerCase();
      if (!addedNames.has(normalised)) {
        addedNames.add(normalised);
        discoveredSkills.push({
          name: token,
          category: 'Technical Skills',
          proficiency: 80,
          badgeColor: 'cyan',
        });
      }
    }
  }

  // ── 9. Experience ─────────────────────────────────────────────────────────
  const parsedExperience: ParsedCVData['experience'] = [];
  const expLines = sections.experience;

  // Date range patterns
  const DATE_RANGE_RE = /((?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)[.,]?\s*)?\d{4}|Present|Current)\s*[-–—to]{1,4}\s*((?:(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)[.,]?\s*)?\d{4}|Present|Current)/i;

  type ExpEntry = ParsedCVData['experience'][0];
  let currentJob: ExpEntry | null = null;

  const flushJob = () => {
    if (currentJob && currentJob.role && currentJob.company) {
      parsedExperience.push(currentJob);
    }
    currentJob = null;
  };

  for (let i = 0; i < expLines.length; i++) {
    const line = expLines[i];
    const dateMatch = line.match(DATE_RANGE_RE);
    const isBullet = /^[•\-–—*▸►▪]\s+/.test(line);

    if (dateMatch) {
      flushJob();

      const rawStart = dateMatch[1];
      const rawEnd = dateMatch[2];
      const isCurrent = /present|current/i.test(rawEnd);

      // Try to find role/company from same line or adjacent lines
      let role = '';
      let company = '';
      const textBeforeDate = line.slice(0, line.indexOf(dateMatch[0])).replace(/[|•–—,]+/g, ' ').trim();
      const textAfterDate = line.slice(line.indexOf(dateMatch[0]) + dateMatch[0].length).replace(/[|•–—,]+/g, ' ').trim();

      const fullContext = [textBeforeDate, textAfterDate].join(' ').trim();

      // Split on " at ", " @ ", " — ", " - "
      const atSplit = fullContext.split(/\s+(?:at|@)\s+/i);
      const dashSplit = fullContext.split(/\s+[-–—]\s+/);

      if (atSplit.length >= 2) {
        role = atSplit[0].trim();
        company = atSplit.slice(1).join(' at ').trim();
      } else if (dashSplit.length >= 2) {
        role = dashSplit[0].trim();
        company = dashSplit[1].trim();
      } else if (fullContext.length > 2) {
        // Could be just company or just role — check adjacent lines
        company = fullContext;
      }

      // Look at surrounding lines for role/company if not found
      if (!role || role.length < 2) {
        // Check previous line
        for (let back = i - 1; back >= Math.max(0, i - 3); back--) {
          const prev = expLines[back];
          if (prev && !DATE_RANGE_RE.test(prev) && prev.length > 3 && prev.length < 80) {
            const prevAt = prev.split(/\s+(?:at|@)\s+/i);
            const prevDash = prev.split(/\s+[-–—]\s+/);
            if (prevAt.length >= 2) {
              role = prevAt[0].trim();
              company = company || prevAt.slice(1).join(' at ').trim();
            } else if (prevDash.length >= 2) {
              role = prevDash[0].trim();
              company = company || prevDash[1].trim();
            } else if (!company) {
              company = prev.trim();
            } else {
              role = prev.trim();
            }
            break;
          }
        }
      }

      // Check next line if still missing info
      if ((!role || !company) && i + 1 < expLines.length) {
        const next = expLines[i + 1];
        if (next && !DATE_RANGE_RE.test(next) && !/^[•\-–—*]/.test(next) && next.length < 80) {
          const nextAt = next.split(/\s+(?:at|@)\s+/i);
          if (nextAt.length >= 2) {
            if (!role) role = nextAt[0].trim();
            if (!company) company = nextAt.slice(1).join(' at ').trim();
          } else if (!company) {
            company = next.trim();
          }
        }
      }

      // Fallback defaults
      if (!role || role.length < 2) role = 'Software Engineer';
      if (!company || company.length < 2) company = 'Tech Organization';

      // Clean up stray punctuation
      role = role.replace(/^[^a-zA-Z]+/, '').replace(/[^a-zA-Z0-9\s.,&/-]+$/g, '').trim();
      company = company.replace(/^[^a-zA-Z]+/, '').replace(/[^a-zA-Z0-9\s.,&/-]+$/g, '').trim();

      currentJob = {
        role: role || 'Software Engineer',
        company: company || 'Tech Organization',
        location: location || '',
        startDate: rawStart,
        endDate: rawEnd,
        isCurrent,
        description: '',
        responsibilities: [],
        achievements: [],
        technologies: [],
      };
    } else if (currentJob) {
      if (isBullet) {
        const bulletText = line.replace(/^[•\-–—*▸►▪]\s*/, '').trim();
        if (bulletText.length > 10) {
          // Heuristic: achievements often start with a metric
          if (/^\d|increased|decreased|reduced|improved|grew|led|built|delivered|achieved|launched/i.test(bulletText)) {
            currentJob.achievements.push(bulletText);
          } else {
            currentJob.responsibilities.push(bulletText);
          }
        }
      } else if (!currentJob.description && line.length > 20 && !DATE_RANGE_RE.test(line)) {
        currentJob.description = line;
      }
    }
  }
  flushJob();

  // ── 10. Education ─────────────────────────────────────────────────────────
  const parsedEducation: ParsedCVData['education'] = [];
  const eduLines = sections.education;

  const DEGREE_RE = /\b(bachelor|b\.sc|b\.s\.|b\.e\.|master|m\.sc|m\.s\.|ph\.d|doctorate|diploma|associate|high school|secondary|software engineering|computer science|information technology|engineering)\b/i;
  const UNI_RE = /\b(university|college|faculty|institute|school|academy|polytechnic)\b/i;
  const YEAR_RE = /\b((?:19|20)\d{2})\b/g;

  type EduEntry = ParsedCVData['education'][0];
  let currentEdu: EduEntry | null = null;

  const flushEdu = () => {
    if (currentEdu && (currentEdu.institution || currentEdu.degree)) {
      parsedEducation.push(currentEdu);
    }
    currentEdu = null;
  };

  for (let i = 0; i < eduLines.length; i++) {
    const line = eduLines[i];
    const yearMatches = [...line.matchAll(YEAR_RE)].map((m) => m[1]);
    const hasDegree = DEGREE_RE.test(line);
    const hasUni = UNI_RE.test(line);

    if (hasDegree || hasUni) {
      if (currentEdu && (hasDegree || hasUni)) {
        // If we're encountering another degree/uni entry, flush the current one first
        if (hasDegree && currentEdu.degree) {
          flushEdu();
        }
      }

      if (hasDegree && (!currentEdu || !currentEdu.degree)) {
        if (!currentEdu) {
          currentEdu = {
            degree: '',
            fieldOfStudy: '',
            institution: '',
            startYear: '',
            endYear: '',
            description: '',
          };
        }
        // Extract degree text (remove year and graduation note)
        currentEdu.degree = line
          .replace(/\s*\(Expected\s+Graduation:?\s*\d{0,4}\)/gi, '')
          .replace(/\b(19|20)\d{2}\b/g, '')
          .replace(/\s{2,}/g, ' ')
          .trim();

        // Try to detect graduation year specifically from "Expected Graduation: 2027"
        const gradExactMatch = line.match(/(?:expected(?:\s+graduation)?|graduation)[:\s,]*(?:in\s*)?(\b20\d{2}\b)/i);
        const anyYearMatch = line.match(/\b(20\d{2})\b/);
        const rangeYearMatch = line.match(/(\b20\d{2}\b)\s*[-–—]\s*(\b20\d{2}\b|present)/i);
        if (rangeYearMatch) {
          currentEdu.startYear = rangeYearMatch[1];
          currentEdu.endYear = /present/i.test(rangeYearMatch[2]) ? '' : rangeYearMatch[2];
        } else if (gradExactMatch) {
          currentEdu.endYear = gradExactMatch[1];
          // don't set startYear — leave empty, will be inferred from next lines
        } else if (anyYearMatch) {
          currentEdu.endYear = anyYearMatch[1];
        }

        // Infer field of study
        if (/software\s+engineering/i.test(line)) currentEdu.fieldOfStudy = 'Software Engineering';
        else if (/computer\s+science/i.test(line)) currentEdu.fieldOfStudy = 'Computer Science';
        else if (/information\s+technology/i.test(line)) currentEdu.fieldOfStudy = 'Information Technology';
        else if (/artificial\s+intelligence/i.test(line)) currentEdu.fieldOfStudy = 'Artificial Intelligence';
        else currentEdu.fieldOfStudy = '';
      }

      if (hasUni) {
        if (!currentEdu) {
          currentEdu = { degree: '', fieldOfStudy: '', institution: line, startYear: '', endYear: '', description: '' };
        } else {
          currentEdu.institution = line;
        }
      }

      // Handle year ranges on this line
      if (yearMatches.length >= 2) {
        if (!currentEdu) currentEdu = { degree: '', fieldOfStudy: '', institution: '', startYear: '', endYear: '', description: '' };
        currentEdu.startYear = yearMatches[0];
        currentEdu.endYear = yearMatches[1];
      } else if (yearMatches.length === 1 && currentEdu) {
        if (!currentEdu.endYear) currentEdu.endYear = yearMatches[0];
        else if (!currentEdu.startYear) currentEdu.startYear = yearMatches[0];
      }
    } else if (currentEdu) {
      // Year range on a standalone line
      if (yearMatches.length >= 2) {
        currentEdu.startYear = yearMatches[0];
        currentEdu.endYear = yearMatches[1];
      } else if (yearMatches.length === 1) {
        if (!currentEdu.endYear) currentEdu.endYear = yearMatches[0];
      }

      // Grade / GPA info
      const gradeMatch = line.match(/(?:gpa|grade|cgpa)[:\s]*([0-9.]+(?:\/[0-9.]+)?)/i);
      if (gradeMatch) currentEdu.grade = gradeMatch[1];

      // Extra description
      if (!currentEdu.description && line.length > 20 && !UNI_RE.test(line)) {
        currentEdu.description = line;
      }
    }
  }

  // Post-process: fill in missing startYear estimates
  for (const edu of parsedEducation) {
    if (edu.endYear && !edu.startYear) {
      const endNum = parseInt(edu.endYear, 10);
      // Bachelor's ≈ 4 years, Master's ≈ 2 years
      const duration = /master|m\.sc|ph\.d/i.test(edu.degree) ? 2 : 4;
      edu.startYear = String(endNum - duration);
    }
  }
  flushEdu();

  // ── 11. Certifications ────────────────────────────────────────────────────
  const parsedCerts: ParsedCVData['certifications'] = [];
  const certLines = sections.certifications;

  // Known issuers — match against line content
  const ISSUER_MAP: Array<[RegExp, string]> = [
    [/route\s*it|route academy/i, 'Route IT Training Center'],
    [/depi|digital\s+egypt\s+pioneers/i, 'Digital Egypt Pioneers Initiative (DEPI)'],
    [/coursera/i, 'Coursera'],
    [/udemy/i, 'Udemy'],
    [/google/i, 'Google'],
    [/microsoft/i, 'Microsoft'],
    [/amazon|aws/i, 'Amazon Web Services (AWS)'],
    [/meta/i, 'Meta'],
    [/deeplearning\.ai/i, 'DeepLearning.AI'],
    [/huawei|hcia/i, 'Huawei'],
    [/cisco/i, 'Cisco'],
    [/iti\b|information\s+technology\s+institute/i, 'ITI'],
    [/oracle/i, 'Oracle'],
    [/pytorch|tensorflow/i, 'DeepLearning.AI'],
    [/linkedin\s+learning/i, 'LinkedIn Learning'],
  ];

  const getIssuer = (text: string): string => {
    for (const [re, name] of ISSUER_MAP) {
      if (re.test(text)) return name;
    }
    return '';
  };

  const certAddedTitles = new Set<string>();

  for (let i = 0; i < certLines.length; i++) {
    const line = certLines[i];

    // Skip if it's clearly a divider or too short
    if (line.length < 6 || /^[-–—|•]+$/.test(line)) continue;

    // Skip if it's a pure year/date line
    if (/^\d{4}$/.test(line.trim())) continue;

    // Skip lines that START with a known issuer name — these are detail/sub-lines, not new cert titles
    // e.g. "Route IT Training Center | Certified in cross-platform..."
    const lineStartsWithIssuer = ISSUER_MAP.some(([re]) => {
      // Test if the issuer pattern matches at the start of the line
      const startRe = new RegExp('^' + re.source, 'i');
      return startRe.test(line);
    });
    if (lineStartsWithIssuer) continue;

    // Also skip if the line looks like a description/continuation (starts with lowercase or common verbs)
    if (/^[a-z]/.test(line) && line.length > 20) continue;

    // Extract year
    const yearMatch = line.match(/\b(20\d{2})\b/);
    const year = yearMatch ? yearMatch[1] : (certLines.slice(i + 1, i + 3).find((l) => /\b20\d{2}\b/.test(l))?.match(/\b(20\d{2})\b/)?.[1] || '2024');

    // Get issuer from this line or next line
    let issuer = getIssuer(line);
    if (!issuer && i + 1 < certLines.length) issuer = getIssuer(certLines[i + 1]);
    if (!issuer) issuer = 'Accredited Training Institute';

    // Build a clean title — remove year, month names, issuer names embedded after a dash/pipe
    const title = line
      .replace(/\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\b/gi, '')
      .replace(/\b(20\d{2})\b/g, '')
      // Strip issuer names that appear after dash/pipe in the title
      .replace(/\s*[|–—]\s*(Route IT|Route Academy|DEPI|Digital Egypt|Coursera|Udemy|Google|Microsoft|Amazon|AWS|Meta|DeepLearning|Huawei|Cisco|ITI|Oracle|LinkedIn Learning)[^|]*/gi, '')
      .replace(/[-–—|,]+$/, '')
      .replace(/^\s*[-–—|,]\s*/, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

    // Reject title if it IS the issuer name or very short
    if (!title || title.length < 8) continue;

    // De-duplicate (skip near-duplicates)
    const normalTitle = title.toLowerCase().replace(/\s+/g, ' ').slice(0, 45);
    if ([...certAddedTitles].some((a) => a.startsWith(normalTitle.slice(0, 30)) || normalTitle.startsWith(a.slice(0, 30)))) continue;
    certAddedTitles.add(normalTitle);

    // Extract skills from title
    const certSkills: string[] = [];
    if (/flutter/i.test(title + line)) certSkills.push('Flutter', 'Dart');
    if (/n8n/i.test(title + line)) certSkills.push('n8n', 'Automation');
    if (/react/i.test(title + line)) certSkills.push('React');
    if (/python/i.test(title + line)) certSkills.push('Python');
    if (/machine\s+learning/i.test(title + line)) certSkills.push('Machine Learning');
    if (/deep\s+learning/i.test(title + line)) certSkills.push('Deep Learning');

    // Credential URL (look within a few lines)
    let credentialUrl = '';
    for (let j = i; j < Math.min(i + 3, certLines.length); j++) {
      const urlMatch = certLines[j].match(/https?:\/\/[^\s]+/);
      if (urlMatch) { credentialUrl = urlMatch[0]; break; }
    }

    parsedCerts.push({
      title,
      issuer,
      issueDate: year,
      credentialUrl,
      skills: certSkills,
    });
  }

  // ── 12. Projects ──────────────────────────────────────────────────────────
  const parsedProjects: NonNullable<ParsedCVData['projects']> = [];
  let currentProj: ParsedProject | null = null;

  const inferProjectType = (text: string, tech: string[]): string => {
    const combined = (text + ' ' + tech.join(' ')).toLowerCase();
    if (/flutter|dart|mobile|android|ios|react\s*native/i.test(combined)) return 'Mobile Application';
    if (/vision|gesture|ai\b|ml\b|machine\s+learning|deep\s+learning|optimization|neural|classification/i.test(combined)) return 'AI & Machine Learning';
    if (/web|next\.?js|react|full-?stack|frontend|backend|django|fastapi|laravel/i.test(combined)) return 'Full-Stack Web';
    if (/automation|n8n|workflow|bot/i.test(combined)) return 'Automation & Workflow';
    return 'Software Engineering';
  };

  const flushProject = () => {
    if (currentProj && currentProj.title) {
      if (!currentProj.summary) {
        currentProj.summary = currentProj.tagline || currentProj.bullets[0] || 'Software engineering project.';
      }
      currentProj.projectType = inferProjectType(currentProj.title + ' ' + (currentProj.tagline || ''), currentProj.technologies);
      currentProj.slug = currentProj.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 40) || `project-${parsedProjects.length + 1}`;
      parsedProjects.push(currentProj);
      currentProj = null;
    }
  };

  const ACTION_VERBS_RE = /^(built|developed|designed|implemented|engineered|architected|created|enforced|integrated|optimized|streamlined|spearheaded|deployed|maintained|automated|configured|collaborated|conducted|managed|led|tested|resolved|refactored|leveraged|utilized|improved|reduced|increased|facilitated|authored|established|trained|fine-tuned|supervised|evaluated)\b/i;
  const CONTINUATION_START_RE = /^[a-z]|^([Aa]nd|[Oo]r|[Ww]ith|[Ff]or|[Tt]o|[Ii]n|[Bb]y|[Vv]ia|[Ff]rom|[Aa]s|[Aa]t|[Ii]nto|[Ii]ncluding|such as|so that)\b/;
  const TECH_PREFIX_RE = /^(technologies|tech\s+stack|tech|stack|tools|built\s+with|built\s+using|environment)[:\s]/i;
  const KNOWN_TECH_LIST = [
    'react', 'react 19', 'react 18', 'next.js', 'next.js 15', 'next.js 16', 'nextjs', 'vue', 'angular',
    'typescript', 'javascript', 'tailwind', 'tailwind css', 'css', 'html', 'sass', 'bootstrap',
    'node', 'node.js', 'nodejs', 'express', 'nestjs', 'python', 'fastapi', 'flask', 'django',
    'flutter', 'dart', 'supabase', 'firebase', 'postgres', 'postgresql', 'mysql', 'mongodb', 'redis',
    'prisma', 'drizzle', 'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'vercel', 'git', 'github',
    'graphql', 'rest', 'restful', 'pytorch', 'tensorflow', 'opencv', 'pandas', 'numpy', 'n8n'
  ];

  const isKnownTechToken = (t: string): boolean => {
    const clean = t.toLowerCase().trim();
    if (!clean) return false;
    return KNOWN_TECH_LIST.some((k) => clean === k || clean.startsWith(k + ' ') || clean.includes(k));
  };

  let prevLineWasTech = false;

  for (let i = 0; i < sections.projects.length; i++) {
    const line = sections.projects[i].trim();
    if (!line) continue;

    const isBullet = /^[•\-–—*▸►▪]\s+/.test(line);

    // 1. Check for links
    const linkMatch = line.match(/https?:\/\/[^\s]+/);
    if (linkMatch && currentProj) {
      if (/github\.com/i.test(linkMatch[0])) currentProj.githubUrl = linkMatch[0];
      else currentProj.liveUrl = linkMatch[0];
      continue;
    }

    // 2. Check if this line is a technology stack list
    const hasTechPrefix = TECH_PREFIX_RE.test(line);
    const hasBulletSeparatedTech = (line.includes('•') || line.includes('|') || line.includes(' · ') || line.split(',').length >= 3) &&
      line.split(/[•|·,]/).filter((token) => isKnownTechToken(token)).length >= 2;

    if (hasTechPrefix || hasBulletSeparatedTech || (prevLineWasTech && isKnownTechToken(line) && line.length < 35)) {
      if (currentProj) {
        const rawTechs = hasTechPrefix ? line.replace(TECH_PREFIX_RE, '') : line;
        const extracted = rawTechs
          .split(/(?:\s*[•|·;]\s*|,\s*(?![^()]*\)))/)
          .map((t) => t.trim().replace(/^[\-–—]\s*/, ''))
          .filter((t) => t.length > 1 && !/^[•\-–—*]$/.test(t));

        extracted.forEach((t) => {
          if (!currentProj!.technologies.some((exist) => exist.toLowerCase() === t.toLowerCase())) {
            currentProj!.technologies.push(t);
          }
        });
      }
      prevLineWasTech = true;
      continue;
    }

    // 3. Check if line is a Project Title
    const isSeparatedTitle = /\s+[—–|]\s+|\s+-\s+|:\s+/.test(line) && !isBullet && !ACTION_VERBS_RE.test(line) && !CONTINUATION_START_RE.test(line);
    const isShortTitle = !currentProj || (!isBullet &&
      !ACTION_VERBS_RE.test(line) &&
      !CONTINUATION_START_RE.test(line) &&
      !DATE_RANGE_RE.test(line) &&
      !/[,;]$/.test(line) &&
      !/\b\w{3,}\.\s*$/.test(line) &&
      line.length >= 3 && line.length <= 50 &&
      line.split(/\s+/).length <= 6 &&
      /^[A-Z0-9]/.test(line) &&
      !/\b(the|is|are|was|were|that|which|into|through|with|from)\b/i.test(line)
    );

    const isProjectTitle = (isSeparatedTitle || isShortTitle) &&
      !isBullet &&
      !ACTION_VERBS_RE.test(line) &&
      !CONTINUATION_START_RE.test(line) &&
      !DATE_RANGE_RE.test(line);

    if (isProjectTitle) {
      flushProject();

      const dashParts = line.split(/\s+[—–|]\s+|\s+-\s+|:\s+/);
      const projTitle = dashParts[0].trim();
      const projTagline = dashParts.length > 1 ? dashParts.slice(1).join(' — ').trim() : '';

      currentProj = {
        title: projTitle,
        tagline: projTagline,
        summary: projTagline || '',
        technologies: [],
        bullets: [],
      };
      prevLineWasTech = false;
      continue;
    }

    // 4. If currentProj exists, handle as Bullet, Continuation, or Summary
    if (currentProj) {
      if (isBullet || ACTION_VERBS_RE.test(line)) {
        const bulletText = line.replace(/^[•\-–—*▸►▪]\s*/, '').trim();
        if (bulletText) {
          currentProj.bullets.push(bulletText);
          if (!currentProj.summary || currentProj.summary === currentProj.tagline) {
            currentProj.summary = bulletText;
          }
        }
        prevLineWasTech = false;
      } else if (CONTINUATION_START_RE.test(line) || /[,;]$/.test(line) || (currentProj.bullets.length > 0 && line.length < 120)) {
        // Wrapped continuation line from previous bullet or summary
        if (currentProj.bullets.length > 0) {
          const lastIdx = currentProj.bullets.length - 1;
          currentProj.bullets[lastIdx] = currentProj.bullets[lastIdx] + ' ' + line;
          if (lastIdx === 0 && currentProj.summary.startsWith(currentProj.bullets[0].slice(0, 30))) {
            currentProj.summary = currentProj.bullets[0];
          }
        } else if (currentProj.summary) {
          currentProj.summary = currentProj.summary + ' ' + line;
        } else {
          currentProj.bullets.push(line);
          currentProj.summary = line;
        }
        prevLineWasTech = false;
      } else if (!currentProj.summary && line.length > 15) {
        currentProj.summary = line;
        prevLineWasTech = false;
      }
    }
  }
  flushProject();

  // ── 13. Languages ─────────────────────────────────────────────────────────
  const parsedLanguages: ParsedLanguage[] = [];
  for (const line of sections.languages) {
    const colonMatch = line.match(/^([A-Za-z\s]+)[:\-–]\s*([A-Za-z0-9\s()]+)$/);
    if (colonMatch) {
      parsedLanguages.push({ name: colonMatch[1].trim(), proficiency: colonMatch[2].trim() });
    } else if (line.length < 30 && /^[A-Za-z\s()]+$/.test(line)) {
      parsedLanguages.push({ name: line.trim(), proficiency: 'Fluent' });
    }
  }

  // ── 14. Tags ──────────────────────────────────────────────────────────────
  const tags: string[] = [];
  if (discoveredSkills.some((s) => s.name === 'Flutter')) tags.push('#FlutterDev');
  if (discoveredSkills.some((s) => s.name === 'Python')) tags.push('#PythonDev');
  if (discoveredSkills.some((s) => s.category?.includes('AI'))) tags.push('#AIMLEngineer');
  if (discoveredSkills.some((s) => s.name.includes('React') || s.name.includes('Next.js'))) tags.push('#WebDeveloper');
  if (parsedExperience.length > 0 || parsedProjects.length > 0) tags.push('#SoftwareEngineer');
  tags.push('#OpenToWork');

  // ── 15. Completeness Metrics ──────────────────────────────────────────────
  let score = 0;
  const sectionsFound: string[] = [];
  if (fullName) { score += 15; sectionsFound.push('Profile & Headline'); }
  if (headline) { score += 10; }
  if (email || phone || location) { score += 15; sectionsFound.push('Contact Information'); }
  if (linkedinUrl || githubUrl) { score += 10; sectionsFound.push('Social Links'); }
  if (bioParagraphs.length > 0) { score += 15; sectionsFound.push('Biography & Summary'); }
  if (discoveredSkills.length > 0) { score += 15; sectionsFound.push(`Technical Skills (${discoveredSkills.length})`); }
  if (parsedProjects.length > 0) { score += 10; sectionsFound.push(`Projects (${parsedProjects.length})`); }
  if (parsedEducation.length > 0) { score += 5; sectionsFound.push(`Education (${parsedEducation.length})`); }
  if (parsedCerts.length > 0) { score += 5; sectionsFound.push(`Certifications (${parsedCerts.length})`); }
  const completenessScore = Math.min(100, Math.round(score));
  const wordCount = cleanText.split(/\s+/).filter(Boolean).length;

  return {
    personal: { fullName, headline, email, phone, location, linkedinUrl, githubUrl, portfolioUrl },
    summary: { bioParagraphs, tags },
    skills: discoveredSkills,
    experience: parsedExperience,
    education: parsedEducation,
    certifications: parsedCerts,
    projects: parsedProjects,
    languages: parsedLanguages,
    metrics: {
      completenessScore,
      sectionsFound,
      wordCount,
    },
    rawTextPreview: cleanText.slice(0, 2000),
  };
}
