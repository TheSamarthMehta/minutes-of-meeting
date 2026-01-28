"use client";

import { useState } from 'react';
import { ArrowLeft, FileText, Calendar, Filter } from 'lucide-react';
import Link from 'next/link';

export default function MeetingSummaryPage() {
  const [dateRange, setDateRange] = useState('month');
  const [meetingType, setMeetingType] = useState('all');

  const summaryData = [
    {
      id: '1',
      title: 'Board Meeting Q1 2026',
      date: '2026-01-28',
      type: 'Board',
      status: 'completed',
      participants: 15,
      attendance: 12,
      duration: '2h 30m'
    },
    {
      id: '2',
      title: 'Department Review',
      date: '2026-01-25',
      type: 'Department',
      status: 'completed',
      participants: 20,
      attendance: 18,
      duration: '1h 45m'
    },
    {
      id: '3',
      title: 'Committee Meeting',
      date: '2026-01-22',
      type: 'Committee',
      status: 'completed',
      participants: 10,
      attendance: 8,
      duration: '1h 30m'
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/reports_analysis"
          className="w-10 h-10 bg-[#1a1a1a] border border-gray-800 rounded-lg flex items-center justify-center hover:bg-[#252525] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white">Meeting Summary Report</h1>
          <p className="text-gray-400 mt-1">Comprehensive overview of all meetings</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Date Range</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-[#0f0f0f] border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Meeting Type</label>
            <select
              value={meetingType}
              onChange={(e) => setMeetingType(e.target.value)}
              className="w-full bg-[#0f0f0f] border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="all">All Types</option>
              <option value="board">Board Meetings</option>
              <option value="committee">Committee Meetings</option>
              <option value="department">Department Meetings</option>
              <option value="general">General Meetings</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg transition-all font-medium">
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Total Meetings" value="24" />
        <StatCard label="Avg. Attendance" value="87%" />
        <StatCard label="Total Hours" value="48.5" />
        <StatCard label="Participants" value="156" />
      </div>

      {/* Meeting List */}
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Meeting Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Meeting</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Type</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Attendance</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Duration</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {summaryData.map((meeting) => (
                <tr key={meeting.id} className="border-b border-gray-800 hover:bg-[#0f0f0f] transition-colors">
                  <td className="py-4 px-4">
                    <Link href={`/dashboard/meeting_management/details?id=${meeting.id}`} className="text-white font-medium hover:text-blue-400">
                      {meeting.title}
                    </Link>
                  </td>
                  <td className="py-4 px-4 text-gray-400">
                    {new Date(meeting.date).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium">
                      {meeting.type}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-400">
                    {meeting.attendance}/{meeting.participants} ({Math.round(meeting.attendance/meeting.participants*100)}%)
                  </td>
                  <td className="py-4 px-4 text-gray-400">{meeting.duration}</td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-medium">
                      {meeting.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-xl p-6">
      <p className="text-gray-400 text-sm mb-2">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}
