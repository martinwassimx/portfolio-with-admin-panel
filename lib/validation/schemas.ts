import { z } from 'zod';

export const contactMessageSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(2, 'Subject must be at least 2 characters').max(150),
  message: z.string().min(5, 'Message must be at least 5 characters').max(5000),
  _hp: z.string().optional(), // Honeypot field
});

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  summary: z.string().min(1, 'Summary is required'),
  full_description: z.string().optional(),
  project_type: z.string().min(1, 'Project type is required'),
  status: z.enum(['Completed', 'In Progress', 'Concept', 'Archived']),
  start_date: z.string().optional(),
  completion_date: z.string().optional(),
  is_featured: z.boolean().default(false),
  is_published: z.boolean().default(true),
  sort_order: z.number().default(0),
  thumbnail_url: z.string().optional(),
  cover_image_url: z.string().optional(),
  live_demo_url: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  repo_url: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  technologies: z.array(z.string()).default([]),
});

export const siteSettingsSchema = z.object({
  site_title: z.string().min(1),
  site_tagline: z.string().optional(),
  site_description: z.string().optional(),
  site_url: z.string().url().or(z.literal('')).optional(),
  logo_text: z.string().min(1),
  contact_email: z.string().email(),
  contact_phone: z.string().optional(),
  contact_location: z.string().optional(),
  contact_form_enabled: z.boolean().default(true),
  maintenance_mode: z.boolean().default(false),
  announcement_banner_enabled: z.boolean().default(false),
  announcement_banner_text: z.string().optional(),
});
