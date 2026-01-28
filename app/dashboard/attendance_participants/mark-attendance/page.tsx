"use client";

import { useState } from 'react';
import { ArrowLeft, CheckSquare, Search, Check, X } from 'lucide-react';
import Link from 'next/link';

export default function MarkAttendancePage() {
  const [selectedMeeting, setSelectedMeeting] = useState('');
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | null>>({});

  const meetings = [
    { id: '1', title: 'Board Meeting Q1', date: '2026-01-28', status: 'ongoing' },
    { id: '2', title: 'Department Review', date: '2026-01-25', status: 'completed' },
  ];

  const participants = [
    { id: '1', name: 'John Doe', role: 'Board Member', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', role: 'Secretary', email: 'jane@example.com' },
    { id: '3', name: 'Bob Johnson', role: 'Member', email: 'bob@example.com' },
    { id: '4', name: 'Alice Williams', role: 'Member', email: 'alice@example.com' },
  ];

  const markAttendance = (participantId: string, status: 'present' | 'absent') => {
    setAttendance(prev => ({ ...prev, [participantId]: status }));
  };

  const handleSubmit = () => {
    console.log('Attendance:', attendance);
    alert('Attendance marked successfully!');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/attendance_participants"
          className="w-10 h-10 bg-[#1a1a1a] border border-gray-800 rounded-lg flex items-center justify-center hover:bg-[#252525] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Mark Attendance</h1>
          <p className="text-gray-400 mt-1">Record participant attendance for meetings</p>
        </div>
      </div>

      {/* Meeting Selection */}
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Select Meeting</h2>
        <select
          value={selectedMeeting}
          onChange={(e) => setSelectedMeeting(e.target.value)}
          className="w-full bg-[#0f0f0f] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
        >
          <option value="">Choose a meeting...</option>
          {meetings.map(meeting => (
            <option key={meeting.id} value={meeting.id}>
              {meeting.title} - {new Date(meeting.date).toLocaleDateString()} ({meeting.status})
            </option>
          ))}
        </select>
      </div>

      {selectedMeeting && (
        <>
          {/* Attendance List */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Participants</h2>
              <div className="text-sm text-gray-400">
                {Object.values(attendance).filter(v => v === 'present').length} / {participants.length} Present
              </div>
            </div>

            <div className="space-y-3">
              {participants.map(participant => {
                const status = attendance[participant.id];
                return (
                  <div
                    key={participant.id}
                    className="p-4 bg-[#0f0f0f] border border-gray-800 rounded-lg hover:border-gray-700 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                          status === 'present' ? 'bg-gradient-to-br from-emerald-500 to-teal-500' :
                          status === 'absent' ? 'bg-gradient-to-br from-red-500 to-orange-500' :
                          'bg-gradient-to-br from-gray-500 to-gray-600'
                        }`}>
                          {participant.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{participant.name}</p>
                          <p className="text-sm text-gray-400">{participant.role}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => markAttendance(participant.id, 'present')}
                          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                            status === 'present'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-emerald-600/10 text-emerald-400 hover:bg-emerald-600/20'
                          }`}
                        >
                          <Check size={16} />
                          Present
                        </button>
                        <button
                          onClick={() => markAttendance(participant.id, 'absent')}
                          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                            status === 'absent'
                              ? 'bg-red-600 text-white'
                              : 'bg-red-600/10 text-red-400 hover:bg-red-600/20'
                          }`}
                        >
                          <X size={16} />
                          Absent
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Link
              href="/dashboard/attendance_participants"
              className="px-6 py-3 bg-[#1a1a1a] border border-gray-800 text-white rounded-lg hover:bg-[#252525] transition-colors"
            >
              Cancel
            </Link>
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg transition-all shadow-lg font-medium"
            >
              Save Attendance
            </button>
          </div>
        </>
      )}
    </div>
  );
}
