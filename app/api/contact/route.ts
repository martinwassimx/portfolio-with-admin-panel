import { NextRequest, NextResponse } from 'next/server';
import { contactMessageSchema } from '../../../lib/validation/schemas';
import { submitContactMessage } from '../../../lib/db/store';

// Simple in-memory rate limiting map for contact requests: max 5 requests per 10 minutes per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || 'unknown';

    // Rate Limiting Check
    const now = Date.now();
    const limitData = rateLimitMap.get(ip);
    if (limitData && limitData.resetAt > now) {
      if (limitData.count >= 5) {
        return NextResponse.json(
          { error: 'Too many messages sent. Please wait a few minutes before trying again.' },
          { status: 429 }
        );
      }
      limitData.count++;
    } else {
      rateLimitMap.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
    }

    const body = await req.json();

    // Anti-spam honeypot: if hidden field is filled, silently ignore
    if (body._hp && body._hp.trim() !== '') {
      return NextResponse.json({ success: true, message: 'Message sent.' });
    }

    // Validation
    const validation = contactMessageSchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || 'Invalid input data.';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, email, subject, message } = validation.data;

    // Persist to database
    await submitContactMessage({
      name,
      email,
      subject,
      message,
      ip_address: ip,
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for reaching out! Your message has been sent successfully.',
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
