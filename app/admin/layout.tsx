import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/app/lib/supabase';
import { redirect } from 'next/navigation';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  FileText, 
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { db } from '@/app/lib/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Verify Admin Role in Database
  const dbUser = await db.select().from(users).where(eq(users.id, user.id)).limit(1);
  
  if (!dbUser || dbUser.length === 0 || dbUser[0].role !== 'admin') {
    // If not an admin, redirect them out
    redirect('/login?error=unauthorized');
  }

  return (
    <div className="flex h-screen" style={{ background: '#f0f4ff' }}>
      {/* Sidebar */}
      <aside
        className="w-72 flex flex-col relative overflow-hidden flex-shrink-0"
        style={{
          background: '#ffffff',
          borderRight: '1px solid rgba(29, 78, 216, 0.08)',
          boxShadow: '4px 0 25px rgba(29, 78, 216, 0.03)',
        }}
      >
        {/* Decorative gradient orb */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-10%',
            right: '-20%',
            width: '280px',
            height: '280px',
            background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: '5%',
            left: '-15%',
            width: '240px',
            height: '240px',
            background: 'radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%)',
          }}
        />

        {/* Logo */}
        <div className="relative z-10 px-6 pt-7 pb-6">
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0"
              style={{ boxShadow: '0 4px 14px rgba(29,78,216,0.15)', border: '1px solid rgba(29,78,216,0.1)' }}
            >
              <Image
                src="/logo.jpeg"
                alt="Logo Mascons"
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <h2
                className="text-lg font-extrabold tracking-tight"
                style={{ color: '#0a1628' }}
              >
                Mascons
              </h2>
              <p
                className="text-[10px] uppercase tracking-[0.2em] font-bold"
                style={{ color: '#2563eb' }}
              >
                Admin Portal
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-5 mb-2" style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(29,78,216,0.12), transparent)' }} />

        {/* Navigation */}
        <nav className="relative z-10 flex-1 px-4 space-y-1 py-2">
          <p className="px-3 mb-3 text-[10px] uppercase tracking-[0.18em] font-bold" style={{ color: '#94a3b8' }}>
            Menu Utama
          </p>
          <SidebarItem href="/admin" icon={<LayoutDashboard size={19} />} label="Overview" />
          <SidebarItem href="/admin/sessions" icon={<ClipboardList size={19} />} label="Sesi Tes" />
          <SidebarItem href="/admin/participants" icon={<Users size={19} />} label="Partisipan" />
          <SidebarItem href="/admin/results" icon={<FileText size={19} />} label="Hasil Tes" />
        </nav>

        {/* Bottom section */}
        <div className="relative z-10 px-4 pb-6">
          <div className="mb-3" style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(29,78,216,0.1), transparent)' }} />
          <form action="/api/auth/logout" method="POST" className="w-full">
            <button
              type="submit"
              className="w-full flex items-center justify-center px-4 py-3 text-sm font-bold text-red-600 bg-red-50/80 hover:bg-red-600 hover:text-white border border-red-200/80 hover:border-red-600 rounded-xl transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-red-500/20 group cursor-pointer"
            >
              <LogOut size={18} className="mr-2 text-red-500 group-hover:text-white transition-colors duration-200" />
              Keluar Akun
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Header Bar */}
        <header
          className="h-[72px] flex items-center justify-between px-8 sticky top-0 z-40"
          style={{
            background: 'rgba(240,244,255,0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(29,78,216,0.08)',
            boxShadow: '0 1px 20px rgba(29,78,216,0.04)',
          }}
        >
          <div className="flex items-center gap-4">
            <h1
              className="text-xl font-bold tracking-tight"
              style={{ color: '#0a1628' }}
            >
              Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* User avatar */}
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                style={{
                  background: 'linear-gradient(135deg, #1d4ed8, #0ea5e9)',
                  color: '#fff',
                  boxShadow: '0 4px 12px rgba(29,78,216,0.3)',
                }}
              >
                {user.email ? user.email.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-semibold" style={{ color: '#0a1628' }}>Admin</p>
                <p className="text-[11px]" style={{ color: '#94a3b8' }}>{user.email?.split('@')[0]}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link 
      href={href}
      className="admin-sidebar-item flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group"
      style={{ color: '#475569' }}
    >
      <span className="mr-3 transition-all duration-200 group-hover:scale-110" style={{ color: '#64748b' }}>
        {icon}
      </span>
      <span className="flex-1 font-semibold">{label}</span>
      <ChevronRight
        size={14}
        className="opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0"
        style={{ color: '#2563eb' }}
      />
    </Link>
  );
}
