"use client";

import { ArrowLeft, Calendar, Clock, MapPin, Users, FileText, Download, Edit } from 'lucide-react';
import Link from 'next/link';

export default function MeetingDetailsPage() {
  // This would normally come from API/database
  const meeting = {
    id: '1',
    title: 'Board Meeting Q1 2026',
    type: 'Board Meeting',
    date: '2026-01-28',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    venue: 'Conference Room A',
    status: 'upcoming',
    description: 'Quarterly board meeting to discuss financial performance and strategic initiatives.',
    agenda: '1. Review Q4 2025 Results\n2. Discuss Q1 2026 Budget\n3. Strategic Planning\n4. Any Other Business',
    organizer: 'John Doe',
    participants: [
      { id: '1', name: 'Jane Smith', role: 'Board Member', status: 'accepted' },
      { id: '2', name: 'Bob Johnson', role: 'Board Member', status: 'pending' },
      { id: '3', name: 'Alice Williams', role: 'Secretary', status: 'accepted' },
    ],
    minutes: 'Meeting minutes will be available after the meeting.'
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/meeting_management/calendar"
            className="w-10 h-10 bg-[#1a1a1a] border border-gray-800 rounded-lg flex items-center justify-center hover:bg-[#252525] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">{meeting.title}</h1>
            <p className="text-gray-400 mt-1">Meeting Details & Information</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-gray-800 text-white rounded-lg hover:bg-[#252525] transition-colors">
            <Download size={18} />
            Export
          </button>
          <Link
            href={`/dashboard/meeting_management/create?edit=${meeting.id}`}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-500 hover:to-indigo-500 transition-all"
          >
            <Edit size={18} />
            Edit
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Meeting Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <InfoItem icon={<Calendar />} label="Date" value={new Date(meeting.date).toLocaleDateString()} />
              <InfoItem icon={<Clock />} label="Time" value={`${meeting.startTime} - ${meeting.endTime}`} />
              <InfoItem icon={<MapPin />} label="Venue" value={meeting.venue} />
              <InfoItem icon={<FileText />} label="Type" value={meeting.type} />
            </div>
          </div>

          {/* Description & Agenda */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Description</h2>
            <p className="text-gray-400 leading-relaxed mb-6">{meeting.description}</p>
            
            <h2 className="text-lg font-semibold text-white mb-4">Agenda</h2>
            <pre className="text-gray-400 leading-relaxed whitespace-pre-wrap font-sans">
              {meeting.agenda}
            </pre>
          </div>

          {/* Minutes */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Meeting Minutes</h2>
            <p className="text-gray-400 leading-relaxed">{meeting.minutes}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-2">Status</h3>
            <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
              meeting.status === 'upcoming' ? 'bg-blue-500/10 text-blue-400' :
              meeting.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
              'bg-red-500/10 text-red-400'
            }`}>
              {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
            </span>
          </div>

          {/* Organizer */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Organized By</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                {meeting.organizer.charAt(0)}
              </div>
              <div>
                <p className="text-white font-medium">{meeting.organizer}</p>
                <p className="text-xs text-gray-500">Meeting Organizer</p>
              </div>
            </div>
          </div>

          {/* Participants */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-400">Participants</h3>
              <span className="text-sm text-gray-500">{meeting.participants.length} people</span>
            </div>
            <div className="space-y-3">
              {meeting.participants.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {participant.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm text-white font-medium">{participant.name}</p>
                      <p className="text-xs text-gray-500">{participant.role}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    participant.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400' :
                    'bg-yellow-500/10 text-yellow-400'
                  }`}>
                    {participant.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-gray-400 mb-2">
        <div className="w-5 h-5">{icon}</div>
        <span className="text-sm">{label}</span>
      </div>
      <p className="text-white font-medium">{value}</p>
    </div>
  );
}
