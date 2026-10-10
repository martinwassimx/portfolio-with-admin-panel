import { createClient, isSupabaseConfigured } from '../supabase/client';

const ADMIN_STORAGE_KEY = 'portfolio_admin_auth';

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
  displayName: string;
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  // 1. In production with Supabase configured, strictly verify authenticated session and admin profile role
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profile?.role === 'admin') {
          return {
            id: session.user.id,
            email: session.user.email || '',
            role: 'admin',
            displayName: profile.display_name || 'Administrator',
          };
        }
      }
    } catch (e) {
      console.warn('Supabase auth check failed', e);
    }
    // Do not fall back to local unverified storage if Supabase is active
    return null;
  }

  // 2. Fallback only for offline local development without Supabase credentials
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error(e);
    }
  }

  return null;
}

export async function loginAdminLocally(email: string): Promise<AdminUser> {
  const user: AdminUser = {
    id: 'local-admin-1',
    email,
    role: 'admin',
    displayName: 'Administrator',
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(user));
    window.dispatchEvent(new Event('portfolio_auth_changed'));
  }

  return user;
}

export async function logoutAdmin(): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (e) {
      console.warn(e);
    }
  }

  if (typeof window !== 'undefined') {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    window.dispatchEvent(new Event('portfolio_auth_changed'));
  }
}
