"use client";

import { useState } from 'react';
import { ArrowLeft, BarChart3, Search, Eye } from 'lucide-react';
import Link from 'next/link';

export default function MeetingWisePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const meetings = [
    {
      id: '1',
      title: 'Board Meeting Q1 2026',
      date: '2026-01-28',
      type: 'Board',
      organizer: 'John Doe',
      participants: 15,
      attendance: 12,
      duration: '2h 30m',
      decisions: 8,
      actionItems: 12
    },
    {
      id: '2',
      title: 'Department Review',
      date: '2026-01-25',
      type: 'Department',
      organizer: 'Jane Smith',
      participants: 20,
      attendance: 18,
      duration: '1h 45m',
      decisions: 5,
      actionItems: 8
    },
    {
      id: '3',
      title: 'Committee Meeting',
      date: '2026-01-22',
      type: 'Committee',
      organizer: 'Bob Johnson',
      participants: 10,
      attendance: 8,
      duration: '1h 30m',
      decisions: 3,
      actionItems: 5
    },
  ];

  const filteredMeetings = meetings.filter(meeting =>
    meeting.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div>
          <h1 className="text-3xl font-bold text-white">Meeting Wise Report</h1>
          <p className="text-gray-400 mt-1">Detailed analysis for individual meetings</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search meetings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
        />
      </div>

      {/* Meeting Cards */}
      <div className="space-y-4">
        {filteredMeetings.map((meeting) => (
          <div
            key={meeting.id}
            className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">{meeting.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{new Date(meeting.date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>Organized by {meeting.organizer}</span>
                </div>
              </div>
              <Link
                href={`/dashboard/meeting_management/details?id=${meeting.id}`}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600/10 text-purple-400 rounded-lg hover:bg-purple-600/20 transition-colors"
              >
                <Eye size={16} />
                View Full Details
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <MetricItem label="Type" value={meeting.type} />
              <MetricItem 
                label="Attendance" 
                value={`${meeting.attendance}/${meeting.participants}`} 
              />
              <MetricItem label="Duration" value={meeting.duration} />
              <MetricItem label="Decisions" value={meeting.decisions.toString()} />
              <MetricItem label="Action Items" value={meeting.actionItems.toString()} />
              <MetricItem 
                label="Rate" 
                value={`${Math.round(meeting.attendance/meeting.participants*100)}%`} 
              />
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-400">Completion Progress</span>
                <span className="text-white font-medium">
                  {Math.round(meeting.attendance/meeting.participants*100)}%
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ width: `${Math.round(meeting.attendance/meeting.participants*100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#0f0f0f] rounded-lg p-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-white font-semibold">{value}</p>
    </div>
  );
}
