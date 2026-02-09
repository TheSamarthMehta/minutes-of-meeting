"use client";

import { useState } from 'react';
import { Calendar as CalendarIcon, List, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import Link from 'next/link';

export default function CalendarPage() {
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());

  const meetings = [
    { id: '1', title: 'Board Meeting Q1', date: '2026-01-28', time: '10:00 AM', type: 'Board', status: 'upcoming' },
    { id: '2', title: 'Department Review', date: '2026-01-30', time: '2:00 PM', type: 'Department', status: 'upcoming' },
    { id: '3', title: 'Committee Meeting', date: '2026-02-02', time: '11:00 AM', type: 'Committee', status: 'upcoming' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Meeting Calendar</h1>
            <p className="text-gray-400 mt-1">View and manage scheduled meetings</p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-[#1a1a1a] border border-gray-800 rounded-lg p-1">
          <button
            onClick={() => setView('calendar')}
            className={`px-4 py-2 rounded-md transition-all ${
              view === 'calendar'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-4 py-2 rounded-md transition-all ${
              view === 'list'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {view === 'list' ? (
        /* List View */
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{meeting.title}</h3>
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-full">
                      {meeting.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-2">
                      <CalendarIcon size={14} />
                      {new Date(meeting.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                    <span>{meeting.time}</span>
                  </div>
                </div>
                <Link
                  href={`/dashboard/meeting_management/details?id=${meeting.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600/10 text-purple-400 rounded-lg hover:bg-purple-600/20 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Eye size={16} />
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Calendar View */
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="p-2 bg-[#0f0f0f] border border-gray-800 rounded-lg hover:border-gray-700 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="p-2 bg-[#0f0f0f] border border-gray-800 rounded-lg hover:border-gray-700 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
                {day}
              </div>
            ))}
            {Array.from({ length: 35 }, (_, i) => (
              <div
                key={i}
                className="aspect-square bg-[#0f0f0f] border border-gray-800 rounded-lg p-2 hover:border-purple-500/30 transition-colors cursor-pointer"
              >
                <div className="text-sm text-gray-400">{(i % 28) + 1}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
