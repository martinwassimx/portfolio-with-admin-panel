# Contributing Guidelines

Thank you for your interest in contributing to the **Portfolio with Admin Panel** codebase! We welcome contributions, bug fixes, feature requests, and documentation improvements.

---

## 1. Development Workflow

### Prerequisites
- **Node.js**: Version 20.x or higher (Node 22 / 24 LTS recommended).
- **Package Manager**: `npm` (v10+).
- **Git**: Ensure your local git configuration is set up with your name and email.

### Setup Instructions
1. **Fork & Clone** the repository:
   ```bash
   git clone https://github.com/your-username/portfolio-with-admin-panel.git
   cd portfolio-with-admin-panel
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Environment Setup**:
   ```bash
   cp .env.example .env.local
   ```
   *(Optional: configure your Supabase test credentials or leave defaults to test with the built-in local store)*.
4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Access the app at `http://localhost:3000`.

---

## 2. Code Standards & Style Guide

- **TypeScript**: Strict type annotations are preferred. Avoid `any` types where an interface or union type can be expressed.
- **Styling**: Use utility classes with Tailwind CSS v4 or dynamic CSS variables defined in `lib/theme/ThemeProvider.tsx`. Do not write arbitrary inline styles when CSS custom variables exist.
- **Components**:
  - Keep client components (`'use client'`) focused on interactivity (state, event listeners, animations).
  - Use React Server Components for data fetching where feasible.
- **File Naming**:
  - React Components: PascalCase (e.g., `HeroSection.tsx`, `ProjectEditor.tsx`).
  - Utilities & Helpers: kebab-case (e.g., `server-store.ts`, `ai-enhancer.ts`).
  - Next.js Routes: lowercase kebab-case (e.g., `app/admin/cv-import/page.tsx`).

---

## 3. Pull Request Checklist

Before submitting a pull request, ensure:
- [ ] `npm run lint` passes without errors:
  ```bash
  npm run lint
  ```
- [ ] Production build succeeds without TypeScript compilation errors:
  ```bash
  npm run build
  ```
- [ ] No private environment variables or secrets (`.env`, service keys) are committed.
- [ ] New features or API changes are documented in `README.md` or `docs/`.
- [ ] Commit messages follow conventional commit style (e.g., `feat:`, `fix:`, `docs:`, `refactor:`).
