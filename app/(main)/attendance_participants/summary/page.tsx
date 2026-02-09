"use client";

import { useState } from 'react';
import { ArrowLeft, BarChart3, TrendingUp, Users, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function AttendanceSummaryPage() {
  const [timeRange, setTimeRange] = useState('month');

  const summaryData = {
    totalMeetings: 24,
    totalParticipants: 156,
    averageAttendance: 87,
    trend: '+5%'
  };

  const topAttendees = [
    { name: 'John Doe', attendance: '95%', meetings: 23 },
    { name: 'Jane Smith', attendance: '92%', meetings: 22 },
    { name: 'Bob Johnson', attendance: '88%', meetings: 21 },
    { name: 'Alice Williams', attendance: '85%', meetings: 20 },
  ];

  const recentMeetings = [
    { title: 'Board Meeting Q1', date: '2026-01-28', attendance: '12/15', rate: 80 },
    { title: 'Department Review', date: '2026-01-25', attendance: '18/20', rate: 90 },
    { title: 'Committee Meeting', date: '2026-01-22', attendance: '8/10', rate: 80 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/attendance_participants"
            className="w-10 h-10 bg-[#1a1a1a] border border-gray-800 rounded-lg flex items-center justify-center hover:bg-[#252525] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Attendance Summary</h1>
            <p className="text-gray-400 mt-1">View attendance reports and statistics</p>
          </div>
        </div>

        {/* Time Range Filter */}
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <SummaryCard
          icon={<Calendar className="w-6 h-6 text-blue-400" />}
          label="Total Meetings"
          value={summaryData.totalMeetings.toString()}
          color="blue"
        />
        <SummaryCard
          icon={<Users className="w-6 h-6 text-purple-400" />}
          label="Total Participants"
          value={summaryData.totalParticipants.toString()}
          color="purple"
        />
        <SummaryCard
          icon={<BarChart3 className="w-6 h-6 text-emerald-400" />}
          label="Avg. Attendance"
          value={`${summaryData.averageAttendance}%`}
          color="emerald"
        />
        <SummaryCard
          icon={<TrendingUp className="w-6 h-6 text-orange-400" />}
          label="Trend"
          value={summaryData.trend}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Attendees */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Top Attendees</h2>
          <div className="space-y-4">
            {topAttendees.map((attendee, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-[#0f0f0f] rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {attendee.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium">{attendee.name}</p>
                    <p className="text-sm text-gray-400">{attendee.meetings} meetings</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-400">{attendee.attendance}</p>
                  <p className="text-xs text-gray-500">attendance</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Meetings */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Recent Meetings</h2>
          <div className="space-y-4">
            {recentMeetings.map((meeting, index) => (
              <div key={index} className="p-4 bg-[#0f0f0f] rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white font-medium mb-1">{meeting.title}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(meeting.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-white">
                    {meeting.attendance}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      meeting.rate >= 90 ? 'bg-emerald-500' :
                      meeting.rate >= 70 ? 'bg-blue-500' :
                      'bg-orange-500'
                    }`}
                    style={{ width: `${meeting.rate}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">{meeting.rate}% attendance rate</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance Chart Placeholder */}
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Attendance Trend</h2>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <p>Chart visualization would be displayed here</p>
            <p className="text-sm mt-2">Use a library like Chart.js or Recharts</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value, color }: { 
  icon: React.ReactNode; 
  label: string; 
  value: string; 
  color: string;
}) {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    emerald: 'from-emerald-500 to-teal-500',
    orange: 'from-orange-500 to-red-500'
  };

  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-xl p-6">
      <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}
