import React from 'react';
import Link from 'next/link';
import { createClient } from '@/app/lib/supabase';
import { redirect } from 'next/navigation';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  FileText, 
  Settings,
  LogOut
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
    <div className="flex h-screen bg-purple-50 ">
      {/* Sidebar */}
      <aside className="w-64 bg-white  border-r border-purple-100  flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-purple-700 ">Mascons</h2>
          <p className="text-xs text-purple-800/70 mt-1 uppercase tracking-wider font-semibold">Admin Portal</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <SidebarItem href="/admin" icon={<LayoutDashboard size={20} />} label="Overview" />
          <SidebarItem href="/admin/sessions" icon={<ClipboardList size={20} />} label="Test Sessions" />
          <SidebarItem href="/admin/participants" icon={<Users size={20} />} label="Participants" />
          <SidebarItem href="/admin/results" icon={<FileText size={20} />} label="Results" />
        </nav>
        
        <div className="p-4 border-t border-purple-100 ">
          <SidebarItem href="/settings" icon={<Settings size={20} />} label="Settings" />
          <button className="flex items-center w-full px-4 py-2 mt-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <LogOut size={20} className="mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 bg-white  border-b border-purple-100  flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold text-purple-950 ">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
              A
            </div>
          </div>
        </header>
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
      className="flex items-center px-4 py-3 text-sm font-medium text-purple-900  hover:text-purple-700 hover:bg-purple-50   rounded-xl transition-all duration-200 group"
    >
      <span className="mr-3 text-purple-400 group-hover:text-purple-600 transition-colors">
        {icon}
      </span>
      {label}
    </Link>
  );
}
