"use client";

import Link from 'next/link';
import { Calendar, Plus, CalendarDays, Eye, XCircle } from 'lucide-react';

export default function MeetingManagementPage() {
  const managementModules = [
    {
      title: "Create/Edit Meetings",
      description: "Schedule new meetings or modify existing ones",
      icon: <Plus className="w-6 h-6" />,
      href: "/dashboard/meeting_management/create",
      color: "from-blue-500 to-cyan-500",
      stats: "Quick action"
    },
    {
      title: "Meeting Calendar",
      description: "View all meetings in calendar and list format",
      icon: <CalendarDays className="w-6 h-6" />,
      href: "/dashboard/meeting_management/calendar",
      color: "from-purple-500 to-pink-500",
      stats: "12 this month"
    },
    {
      title: "Meeting Details",
      description: "View comprehensive details of meetings and minutes",
      icon: <Eye className="w-6 h-6" />,
      href: "/dashboard/meeting_management/details",
      color: "from-emerald-500 to-teal-500",
      stats: "Full view"
    },
    {
      title: "Cancel Meetings",
      description: "Cancel scheduled meetings and notify participants",
      icon: <XCircle className="w-6 h-6" />,
      href: "/dashboard/meeting_management/cancel",
      color: "from-orange-500 to-red-500",
      stats: "Quick cancel"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Meeting Management</h1>
          <p className="text-gray-400 mt-1">Create, schedule, and manage all meetings</p>
        </div>
      </div>

      {/* Quick Action */}
      <Link
        href="/dashboard/meeting_management/create"
        className="block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-2xl p-8 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Schedule New Meeting</h2>
            <p className="text-blue-100">Click here to create and schedule a new meeting</p>
          </div>
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
            <Plus className="w-8 h-8 text-white" />
          </div>
        </div>
      </Link>

      {/* Management Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {managementModules.map((module, index) => (
          <Link
            key={index}
            href={module.href}
            className="group relative overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:scale-[1.02]"
          >
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 bg-gradient-to-br ${module.color} rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                {module.icon}
              </div>
              <div className="flex-1">
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
              </div>
            </div>
            
            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-all duration-300 pointer-events-none"></div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <ActivityItem 
            action="Meeting created"
            title="Board Meeting Q1 2026"
            time="2 hours ago"
          />
          <ActivityItem 
            action="Meeting updated"
            title="Department Review"
            time="5 hours ago"
          />
          <ActivityItem 
            action="Meeting cancelled"
            title="Weekly Standup"
            time="Yesterday"
          />
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ action, title, time }: { action: string; title: string; time: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
      <div>
        <p className="text-sm text-gray-300">
          <span className="text-blue-400 font-medium">{action}</span> - {title}
        </p>
      </div>
      <span className="text-xs text-gray-500">{time}</span>
    </div>
  );
}
