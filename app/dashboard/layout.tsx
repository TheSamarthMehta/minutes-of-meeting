"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings, 
  LogOut, 
  FileText,
  Database,
  UserCheck,
  BarChart3,
  User,
  Menu,
  X
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, user } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
      <aside className={`border-r border-gray-800 bg-[#0a0a0a] flex-col transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'w-64' : 'w-20'
      } hidden md:flex`}>
        <div className={`p-6 flex items-center gap-2 transition-all duration-300 ${
          isSidebarOpen ? 'justify-start' : 'justify-center'
        }`}>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded flex items-center justify-center flex-shrink-0">
             <FileText className="w-5 h-5 text-white" />
          </div>
          {isSidebarOpen && (
            <span className="text-lg font-bold tracking-tight whitespace-nowrap">MinutesMaster</span>
          )}
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
          <NavItem href="/dashboard" icon={<LayoutDashboard size={20} />} label="Overview" pathname={pathname} isCollapsed={!isSidebarOpen} />
          <NavItem href="/dashboard/master_configuration" icon={<Database size={20} />} label="Master Config" pathname={pathname} isCollapsed={!isSidebarOpen} />
          <NavItem href="/dashboard/meeting_management" icon={<Calendar size={20} />} label="Meetings" pathname={pathname} isCollapsed={!isSidebarOpen} />
          <NavItem href="/dashboard/attendance_participants" icon={<UserCheck size={20} />} label="Attendance" pathname={pathname} isCollapsed={!isSidebarOpen} />
          <NavItem href="/dashboard/reports_analysis" icon={<BarChart3 size={20} />} label="Reports" pathname={pathname} isCollapsed={!isSidebarOpen} />
          <NavItem href="/dashboard/profile" icon={<User size={20} />} label="Profile" pathname={pathname} isCollapsed={!isSidebarOpen} />
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 w-full rounded-lg transition-colors ${
              !isSidebarOpen ? 'justify-center' : ''
            }`}
            title={!isSidebarOpen ? 'Sign Out' : ''}
          >
            <LogOut size={20} />
            {isSidebarOpen && 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-8 bg-[#0a0a0a]/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[#1a1a1a] transition-colors text-gray-400 hover:text-white"
              aria-label="Toggle Sidebar"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h2 className="font-semibold text-lg text-gray-200">Dashboard</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-200">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-400">{user?.role || 'STAFF'}</p>
            </div>
            <Link href="/dashboard/profile" className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border border-gray-700 flex items-center justify-center text-white text-sm font-semibold hover:scale-105 transition-transform">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Link>
          </div>
        </header>
        
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon, label, pathname, isCollapsed }: { 
  href: string; 
  icon: React.ReactNode; 
  label: string; 
  pathname: string;
  isCollapsed: boolean;
}) {
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
  
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all relative group ${
        isActive 
          ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' 
          : 'text-gray-400 hover:bg-[#1f1f1f] hover:text-gray-100'
      } ${isCollapsed ? 'justify-center' : ''}`}
      title={isCollapsed ? label : ''}
    >
      <span className="flex-shrink-0">{icon}</span>
      {!isCollapsed && <span>{label}</span>}
      
      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-3 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-sm whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">
          {label}
        </div>
      )}
    </Link>
  );
}