"use client";

import Link from 'next/link';
import { Database, Users, Building2, MapPin, ListChecks } from 'lucide-react';

export default function MasterConfigurationPage() {
  const configModules = [
    {
      title: "Meeting Types",
      description: "Manage different types of meetings (Board, Committee, General, etc.)",
      icon: <ListChecks className="w-6 h-6" />,
      href: "/dashboard/master_configuration/meeting-types",
      color: "from-blue-500 to-cyan-500",
      stats: "12 types"
    },
    {
      title: "Staff Management",
      description: "Add, edit, and manage staff members and their details",
      icon: <Users className="w-6 h-6" />,
      href: "/dashboard/master_configuration/staff",
      color: "from-purple-500 to-pink-500",
      stats: "45 staff"
    },
    {
      title: "Departments",
      description: "Configure departments and organizational units",
      icon: <Building2 className="w-6 h-6" />,
      href: "/dashboard/master_configuration/departments",
      color: "from-emerald-500 to-teal-500",
      stats: "8 departments"
    },
    {
      title: "Venues",
      description: "Manage meeting venues and room configurations",
      icon: <MapPin className="w-6 h-6" />,
      href: "/dashboard/master_configuration/venues",
      color: "from-orange-500 to-red-500",
      stats: "15 venues"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <Database className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Master Configuration</h1>
          <p className="text-gray-400 mt-1">Configure and manage system master data</p>
        </div>
      </div>

      {/* Configuration Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {configModules.map((module, index) => (
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

      {/* Quick Stats */}
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Configuration Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatItem label="Total Entries" value="80" />
          <StatItem label="Active" value="76" />
          <StatItem label="Last Updated" value="Today" />
          <StatItem label="Modules" value="4" />
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}
