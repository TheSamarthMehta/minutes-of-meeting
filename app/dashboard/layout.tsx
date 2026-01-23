"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  FileText 
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { logout, user } = useAuthStore();

  const handleLogout = async () => {
    try {
      // Call logout API endpoint
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state and redirect
      logout();
      router.push('/login');
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-800 bg-[#0a0a0a] hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded flex items-center justify-center">
             <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">MinutesMaster</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem href="/dashboard" icon={<LayoutDashboard size={20} />} label="Overview" active />
          <NavItem href="/dashboard/meetings" icon={<Calendar size={20} />} label="Meetings" />
          <NavItem href="/dashboard/team" icon={<Users size={20} />} label="Team" />
          <NavItem href="/dashboard/settings" icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 w-full rounded-lg transition-colors"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-8 bg-[#0a0a0a]/50 backdrop-blur-md sticky top-0 z-10">
          <h2 className="font-semibold text-lg text-gray-200">Dashboard</h2>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-200">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-400">{user?.role || 'STAFF'}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border border-gray-700 flex items-center justify-center text-white text-sm font-semibold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </header>
        
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon, label, active = false }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
        active 
          ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
          : 'text-gray-400 hover:bg-[#1f1f1f] hover:text-gray-100'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}