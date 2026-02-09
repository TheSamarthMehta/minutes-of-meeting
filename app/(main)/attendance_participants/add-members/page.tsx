"use client";

import { useState } from 'react';
import { ArrowLeft, UserPlus, Search, X } from 'lucide-react';
import Link from 'next/link';

export default function AddMembersPage() {
  const [selectedMeeting, setSelectedMeeting] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const meetings = [
    { id: '1', title: 'Board Meeting Q1', date: '2026-01-28' },
    { id: '2', title: 'Department Review', date: '2026-01-30' },
  ];

  const availableStaff = [
    { id: '1', name: 'John Doe', department: 'Administration', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', department: 'Finance', email: 'jane@example.com' },
    { id: '3', name: 'Bob Johnson', department: 'IT', email: 'bob@example.com' },
    { id: '4', name: 'Alice Williams', department: 'HR', email: 'alice@example.com' },
  ];

  const filteredStaff = availableStaff.filter(staff =>
    staff.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedMembers.includes(staff.id)
  );

  const toggleMember = (id: string) => {
    setSelectedMembers(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
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
          <h1 className="text-3xl font-bold text-white">Add Meeting Members</h1>
          <p className="text-gray-400 mt-1">Select participants for the meeting</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Meeting Selection & Staff List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Select Meeting */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Select Meeting</h2>
            <select
              value={selectedMeeting}
              onChange={(e) => setSelectedMeeting(e.target.value)}
              className="w-full bg-[#0f0f0f] border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">Choose a meeting...</option>
              {meetings.map(meeting => (
                <option key={meeting.id} value={meeting.id}>
                  {meeting.title} - {new Date(meeting.date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          {/* Available Staff */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Available Staff</h2>
            
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search staff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0f0f0f] border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Staff List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredStaff.map(staff => (
                <div
                  key={staff.id}
                  onClick={() => toggleMember(staff.id)}
                  className="p-4 bg-[#0f0f0f] border border-gray-800 rounded-lg hover:border-blue-500/30 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {staff.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium">{staff.name}</p>
                        <p className="text-sm text-gray-400">{staff.department}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMember(staff.id);
                      }}
                      className="px-4 py-2 bg-blue-600/10 text-blue-400 rounded-lg hover:bg-blue-600/20 transition-colors text-sm"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Members */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Selected Members ({selectedMembers.length})
          </h2>
          
          {selectedMembers.length === 0 ? (
            <div className="text-center py-12">
              <UserPlus className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No members selected yet</p>
            </div>
          ) : (
            <div className="space-y-3 mb-6">
              {selectedMembers.map(memberId => {
                const member = availableStaff.find(s => s.id === memberId);
                if (!member) return null;
                return (
                  <div
                    key={memberId}
                    className="flex items-center justify-between p-3 bg-[#0f0f0f] rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.department}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleMember(memberId)}
                      className="p-1 text-red-400 hover:bg-red-500/10 rounded transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <button
            disabled={!selectedMeeting || selectedMembers.length === 0}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-all shadow-lg font-medium"
          >
            Add {selectedMembers.length} Member{selectedMembers.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
}
