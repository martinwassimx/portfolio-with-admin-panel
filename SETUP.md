# Complete Portfolio & Admin Panel Setup Guide

This guide walks you through setting up and deploying your portfolio with the administrative control panel.

---

## 1. Quick Start (Local Demo Mode)

The portfolio comes with an in-memory/local storage fallback engine pre-seeded with authentic portfolio content (projects, skills, education, experience, CV download). You can run and explore the application immediately without configuring Supabase first:

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open in your browser
# Public portfolio: http://localhost:3000
# Admin panel: http://localhost:3000/admin
```

To log into the Admin Console in local demo mode, simply visit `/admin/login` and click **"Enter Admin Console (Local Demo Mode)"** or enter any credentials.

---

## 2. Connecting Remote Supabase (PostgreSQL, Auth & Storage)

To make your data persistent across visitors and devices, connect your Supabase project:

### Step A: Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create a free project.
2. Note your **Project URL** and **API Keys** under `Project Settings > API`.

### Step B: Configure Environment Variables
Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your actual Supabase credentials in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step C: Execute SQL Migrations
In your Supabase project dashboard, navigate to the **SQL Editor**, create a new query, and paste the contents of:

1. `supabase/migrations/20261010000000_initial_schema.sql` (Creates all 16 tables, RLS policies, and triggers).
2. `supabase/migrations/20261010000001_storage_setup.sql` (Creates `portfolio-media` and `portfolio-documents` buckets with upload policies).

Click **RUN** to execute the scripts.

---

## 3. Creating Your First Administrator Account

1. Go to `Authentication > Users` in your Supabase Dashboard and click **"Add User"** (or register via Supabase Auth).
2. Because of the security trigger in `20261010000000_initial_schema.sql`, **the first user registered automatically receives the `admin` role** in the `profiles` table.
3. If you want to grant the admin role to an existing user manually, run this SQL query:
   ```sql
   UPDATE public.profiles
   SET role = 'admin'
   WHERE email = 'your-email@example.com';
   ```
4. Now visit `http://localhost:3000/admin/login` and sign in with your email and password.

---

## 4. Deploying to Vercel

1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. In the **Environment Variables** section, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (e.g. `https://your-domain.vercel.app`)
5. Click **Deploy**. Vercel will build and launch your production portfolio!

---

## 5. Security & Row Level Security (RLS)

- **Anonymous Public Visitors**: Can only read content explicitly marked `is_published = true` or `is_visible = true`. They can submit messages to `contact_messages` with validation, but cannot read any submissions or logs.
- **Admin Users**: Have complete CRUD permissions on all database tables and storage buckets after server-side session authentication.
- **Service Role Key**: Stored server-side only in `lib/supabase/admin.ts`. It is never bundled into client-side browser JavaScript.
