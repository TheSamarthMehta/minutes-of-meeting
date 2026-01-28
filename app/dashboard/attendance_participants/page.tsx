"use client";

import Link from 'next/link';
import { Users, UserPlus, CheckSquare, BarChart3 } from 'lucide-react';

export default function AttendanceParticipantsPage() {
  const modules = [
    {
      title: "Add Meeting Members",
      description: "Add and manage participants for upcoming meetings",
      icon: <UserPlus className="w-6 h-6" />,
      href: "/dashboard/attendance_participants/add-members",
      color: "from-blue-500 to-cyan-500",
      stats: "Quick add"
    },
    {
      title: "Mark Attendance",
      description: "Record attendance for ongoing or completed meetings",
      icon: <CheckSquare className="w-6 h-6" />,
      href: "/dashboard/attendance_participants/mark-attendance",
      color: "from-emerald-500 to-teal-500",
      stats: "Real-time"
    },
    {
      title: "Attendance Summary",
      description: "View attendance reports and participant statistics",
      icon: <BarChart3 className="w-6 h-6" />,
      href: "/dashboard/attendance_participants/summary",
      color: "from-purple-500 to-pink-500",
      stats: "Analytics"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Attendance & Participants</h1>
          <p className="text-gray-400 mt-1">Manage meeting participants and track attendance</p>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <Link
            key={index}
            href={module.href}
            className="group relative overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:scale-[1.02]"
          >
            <div className={`w-14 h-14 bg-gradient-to-br ${module.color} rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 mb-4`}>
              {module.icon}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
              {module.title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              {module.description}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-300 font-medium">{module.stats}</span>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-all duration-300 pointer-events-none"></div>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Participants" value="156" change="+12 this month" />
        <StatCard title="Average Attendance" value="87%" change="+5% from last month" />
        <StatCard title="Meetings This Month" value="24" change="8 completed" />
      </div>
    </div>
  );
}

function StatCard({ title, value, change }: { title: string; value: string; change: string }) {
  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-xl p-6">
      <h3 className="text-sm text-gray-400 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-emerald-400">{change}</p>
    </div>
  );
}
