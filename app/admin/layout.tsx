'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { getCurrentAdmin, AdminUser } from '../../lib/security/auth';
import { getContactMessages } from '../../lib/db/store';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const isPublicAdminRoute = pathname === '/admin/login' || pathname === '/admin/setup';

  useEffect(() => {
    async function checkAuth() {
      const admin = await getCurrentAdmin();
      setUser(admin);

      if (!admin && !isPublicAdminRoute) {
        router.push('/admin/login');
      } else {
        const msgs = await getContactMessages();
        const unread = msgs.filter((m) => m.status === 'unread').length;
        setUnreadCount(unread);
      }
      setLoading(false);
    }

    checkAuth();

    const handleAuthChange = () => {
      checkAuth();
    };
    window.addEventListener('portfolio_auth_changed', handleAuthChange);
    return () => window.removeEventListener('portfolio_auth_changed', handleAuthChange);
  }, [pathname, isPublicAdminRoute, router]);

  if (isPublicAdminRoute) {
    return <div className="min-h-screen bg-[#07090f] text-gray-100">{children}</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090f] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  const sectionName = pathname.split('/')[2] || 'Overview';
  const displayTitle = sectionName.charAt(0).toUpperCase() + sectionName.slice(1);

  return (
    <div className="min-h-screen bg-[#07090f] text-gray-100 flex">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        unreadCount={unreadCount}
      />

      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <AdminHeader
          onOpenSidebar={() => setSidebarOpen(true)}
          title={displayTitle}
          user={user}
        />
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#07090f] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
        </div>
      }
    >
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </Suspense>
  );
}
