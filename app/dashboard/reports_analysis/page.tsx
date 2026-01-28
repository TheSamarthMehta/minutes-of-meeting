"use client";

import Link from 'next/link';
import { FileText, BarChart3, Download, TrendingUp } from 'lucide-react';

export default function ReportsAnalysisPage() {
  const modules = [
    {
      title: "Meeting Summary Report",
      description: "View comprehensive summary of all meetings",
      icon: <FileText className="w-6 h-6" />,
      href: "/dashboard/reports_analysis/meeting-summary",
      color: "from-blue-500 to-cyan-500",
      stats: "All meetings"
    },
    {
      title: "Meeting Wise Report",
      description: "Detailed reports for individual meetings",
      icon: <BarChart3 className="w-6 h-6" />,
      href: "/dashboard/reports_analysis/meeting-wise",
      color: "from-purple-500 to-pink-500",
      stats: "Detailed view"
    },
    {
      title: "Export Reports",
      description: "Export meeting data to Excel or PDF formats",
      icon: <Download className="w-6 h-6" />,
      href: "/dashboard/reports_analysis/export",
      color: "from-emerald-500 to-teal-500",
      stats: "Excel / PDF"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-gray-400 mt-1">Generate and export meeting reports</p>
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <QuickStat label="Reports Generated" value="156" color="blue" />
        <QuickStat label="Avg. Meeting Duration" value="2.5 hrs" color="purple" />
        <QuickStat label="Total Participants" value="245" color="emerald" />
        <QuickStat label="Completion Rate" value="94%" color="orange" />
      </div>

      {/* Recent Exports */}
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Exports</h2>
        <div className="space-y-3">
          <ExportItem
            title="Board Meeting Q1 2026 - Full Report"
            date="Jan 26, 2026"
            format="PDF"
          />
          <ExportItem
            title="Monthly Attendance Report"
            date="Jan 25, 2026"
            format="Excel"
          />
          <ExportItem
            title="Department Reviews - December"
            date="Jan 20, 2026"
            format="PDF"
          />
        </div>
      </div>
    </div>
  );
}

function QuickStat({ label, value, color }: { label: string; value: string; color: string }) {
  const colors = {
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    emerald: 'from-emerald-500 to-teal-500',
    orange: 'from-orange-500 to-red-500'
  };

  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-xl p-6">
      <p className="text-gray-400 text-sm mb-2">{label}</p>
      <p className={`text-3xl font-bold bg-gradient-to-r ${colors[color as keyof typeof colors]} bg-clip-text text-transparent`}>
        {value}
      </p>
    </div>
  );
}

function ExportItem({ title, date, format }: { title: string; date: string; format: string }) {
  return (
    <div className="flex items-center justify-between p-4 bg-[#0f0f0f] rounded-lg hover:bg-[#1a1a1a] transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
          <Download className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-white font-medium">{title}</p>
          <p className="text-sm text-gray-400">{date}</p>
        </div>
      </div>
      <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium">
        {format}
      </span>
    </div>
  );
}
