"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
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
  X,
  ChevronRight,
  Building2,
  CalendarClock,
  UsersRound,
  MapPin,
  CalendarPlus,
  CalendarX,
  Info,
  UserPlus,
  ClipboardCheck,
  FileBarChart,
  FileSpreadsheet,
  Download,
} from "lucide-react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout, user } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      // Call logout API endpoint
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local state and redirect
      logout();
      router.push("/login");
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-gray-100 font-sans">
      {/* Sidebar */}
      <aside
        className={`border-r border-gray-800 bg-[#0a0a0a] flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-24"
        } hidden md:flex`}
      >
        <div
          className={`p-6 flex items-center gap-2 transition-all duration-300 ${
            isSidebarOpen ? "justify-start" : "justify-center"
          }`}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-white" />
          </div>
          {isSidebarOpen && (
            <span className="text-lg font-bold tracking-tight whitespace-nowrap">
              MinutesMaster
            </span>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          <NavItem
            href="/dashboard"
            icon={<LayoutDashboard size={20} />}
            label="Overview"
            pathname={pathname}
            isCollapsed={!isSidebarOpen}
          />

          <NavItemWithChildren
            icon={<Database size={20} />}
            label="Master Config"
            pathname={pathname}
            isCollapsed={!isSidebarOpen}
            basePath="/master_configuration"
            children={[
              {
                href: "/master_configuration/departments",
                label: "Departments",
                icon: <Building2 size={18} />,
              },
              {
                href: "/master_configuration/meeting-types",
                label: "Meeting Types",
                icon: <CalendarClock size={18} />,
              },
              {
                href: "/master_configuration/staff",
                label: "Staff",
                icon: <UsersRound size={18} />,
              },
              {
                href: "/master_configuration/venues",
                label: "Venues",
                icon: <MapPin size={18} />,
              },
            ]}
          />

          <NavItemWithChildren
            icon={<Calendar size={20} />}
            label="Meetings"
            pathname={pathname}
            isCollapsed={!isSidebarOpen}
            basePath="/meeting_management"
            children={[
              {
                href: "/meeting_management/calendar",
                label: "Calendar",
                icon: <Calendar size={18} />,
              },
              {
                href: "/meeting_management/create",
                label: "Create",
                icon: <CalendarPlus size={18} />,
              },
              {
                href: "/meeting_management/details",
                label: "Details",
                icon: <Info size={18} />,
              },
              {
                href: "/meeting_management/cancel",
                label: "Cancel",
                icon: <CalendarX size={18} />,
              },
            ]}
          />

          <NavItemWithChildren
            icon={<UserCheck size={20} />}
            label="Attendance"
            pathname={pathname}
            isCollapsed={!isSidebarOpen}
            basePath="/attendance_participants"
            children={[
              {
                href: "/attendance_participants/mark-attendance",
                label: "Mark Attendance",
                icon: <ClipboardCheck size={18} />,
              },
              {
                href: "/attendance_participants/add-members",
                label: "Add Members",
                icon: <UserPlus size={18} />,
              },
              {
                href: "/attendance_participants/summary",
                label: "Summary",
                icon: <FileBarChart size={18} />,
              },
            ]}
          />

          <NavItemWithChildren
            icon={<BarChart3 size={20} />}
            label="Reports"
            pathname={pathname}
            isCollapsed={!isSidebarOpen}
            basePath="/reports_analysis"
            children={[
              {
                href: "/reports_analysis/meeting-summary",
                label: "Meeting Summary",
                icon: <FileBarChart size={18} />,
              },
              {
                href: "/reports_analysis/meeting-wise",
                label: "Meeting Wise",
                icon: <FileSpreadsheet size={18} />,
              },
              {
                href: "/reports_analysis/export",
                label: "Export",
                icon: <Download size={18} />,
              },
            ]}
          />

          <NavItem
            href="/profile"
            icon={<User size={20} />}
            label="Profile"
            pathname={pathname}
            isCollapsed={!isSidebarOpen}
          />
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className={`flex ${
              !isSidebarOpen
                ? "flex-col items-center gap-1 px-2 py-3"
                : "flex-row items-center gap-3 px-4 py-3"
            } text-sm font-medium text-red-400 hover:bg-red-500/10 w-full rounded-lg transition-colors`}
          >
            <LogOut size={20} />
            <span
              className={`${!isSidebarOpen ? "text-[10px] text-center leading-tight" : ""}`}
            >
              Sign Out
            </span>
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
              <p className="text-sm font-medium text-gray-200">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-400">{user?.role || "STAFF"}</p>
            </div>
            <Link
              href="/profile"
              className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border border-gray-700 flex items-center justify-center text-white text-sm font-semibold hover:scale-105 transition-transform"
            >
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </Link>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

function NavItem({
  href,
  icon,
  label,
  pathname,
  isCollapsed,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  pathname: string;
  isCollapsed: boolean;
}) {
  const isActive =
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`flex ${
        isCollapsed
          ? "flex-col items-center gap-1 px-2 py-3"
          : "flex-row items-center gap-3 px-4 py-3"
      } text-sm font-medium rounded-lg transition-all ${
        isActive
          ? "bg-blue-600/10 text-blue-400 border border-blue-600/20"
          : "text-gray-400 hover:bg-[#1f1f1f] hover:text-gray-100"
      }`}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span
        className={`${isCollapsed ? "text-[10px] text-center leading-tight" : ""}`}
      >
        {label}
      </span>
    </Link>
  );
}

function NavItemWithChildren({
  icon,
  label,
  pathname,
  isCollapsed,
  basePath,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  pathname: string;
  isCollapsed: boolean;
  basePath: string;
  children: Array<{ href: string; label: string; icon: React.ReactNode }>;
}) {
  const [isExpanded, setIsExpanded] = useState(pathname.startsWith(basePath));
  const [submenuStyle, setSubmenuStyle] = useState<React.CSSProperties>({});
  const isActive = pathname.startsWith(basePath);

  // Keep expanded state in sync with pathname
  useEffect(() => {
    if (pathname.startsWith(basePath)) {
      setIsExpanded(true);
    }
  }, [pathname, basePath]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isCollapsed && e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      setSubmenuStyle({
        position: "fixed",
        top: `${rect.top}px`,
        left: `${rect.right + 8}px`,
      });
    }
  };

  // Render for both collapsed and expanded states with hover menu
  return (
    <div className="relative group/nav" onMouseEnter={handleMouseEnter}>
      {isCollapsed ? (
        <button
          className={`flex flex-col items-center gap-1 w-full px-2 py-3 text-sm font-medium rounded-lg transition-all ${
            isActive
              ? "bg-blue-600/10 text-blue-400 border border-blue-600/20"
              : "text-gray-400 hover:bg-[#1f1f1f] hover:text-gray-100"
          }`}
        >
          <span className="flex-shrink-0">{icon}</span>
          <span className="text-[10px] text-center leading-tight">{label}</span>
        </button>
      ) : (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all w-full ${
            isActive
              ? "bg-blue-600/10 text-blue-400 border border-blue-600/20"
              : "text-gray-400 hover:bg-[#1f1f1f] hover:text-gray-100"
          }`}
        >
          <span className="flex-shrink-0">{icon}</span>
          <span className="flex-1 text-left">{label}</span>
          <ChevronRight
            size={16}
            className={`transition-transform ${isExpanded ? "rotate-90" : ""}`}
          />
        </button>
      )}

      {/* Hover submenu - only shown when sidebar is collapsed */}
      {isCollapsed && (
        <div
          style={submenuStyle}
          className="bg-[#1a1a1a] border border-gray-700 rounded-lg py-2 min-w-[220px] opacity-0 invisible pointer-events-none group-hover/nav:opacity-100 group-hover/nav:visible group-hover/nav:pointer-events-auto transition-all duration-200 z-[9999] shadow-2xl"
        >
          <div className="px-4 py-2 text-sm font-semibold text-gray-100 border-b border-gray-700 flex items-center gap-2">
            {icon}
            <span>{label}</span>
          </div>
          <div className="py-1">
            {children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  pathname === child.href
                    ? "text-blue-400 bg-blue-600/10 font-medium"
                    : "text-gray-400 hover:text-gray-100 hover:bg-[#1f1f1f]"
                }`}
              >
                {child.icon}
                <span>{child.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Expanded accordion view - only shown when sidebar is expanded and button is clicked */}
      {!isCollapsed && isExpanded && (
        <div className="ml-8 relative mt-1">
          <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gray-700/60" />
          {children.map((child, index) => (
            <div key={child.href} className="relative">
              {/* Horizontal line connector */}
              <div className="absolute left-0 top-1/2 w-6 h-[2px] bg-gray-700/60 -translate-y-1/2" />
              <Link
                href={child.href}
                className={`flex items-center gap-3 pl-8 pr-4 py-2.5 text-sm rounded-lg transition-colors relative ${
                  pathname === child.href
                    ? "text-blue-400 bg-blue-600/5 font-medium"
                    : "text-gray-500 hover:text-gray-300 hover:bg-[#1a1a1a]"
                }`}
              >
                {child.icon}
                <span>{child.label}</span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
