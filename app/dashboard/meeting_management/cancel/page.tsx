"use client";

import { useState } from 'react';
import { ArrowLeft, XCircle, AlertCircle, Search } from 'lucide-react';
import Link from 'next/link';

export default function CancelMeetingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMeeting, setSelectedMeeting] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  const upcomingMeetings = [
    { id: '1', title: 'Board Meeting Q1', date: '2026-01-28', time: '10:00 AM' },
    { id: '2', title: 'Department Review', date: '2026-01-30', time: '2:00 PM' },
    { id: '3', title: 'Committee Meeting', date: '2026-02-02', time: '11:00 AM' },
  ];

  const filteredMeetings = upcomingMeetings.filter(meeting =>
    meeting.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCancel = () => {
    if (selectedMeeting && reason) {
      alert(`Meeting ${selectedMeeting} cancelled. Participants will be notified.`);
      setSelectedMeeting(null);
      setReason('');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/meeting_management"
          className="w-10 h-10 bg-[#1a1a1a] border border-gray-800 rounded-lg flex items-center justify-center hover:bg-[#252525] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Cancel Meeting</h1>
          <p className="text-gray-400 mt-1">Cancel scheduled meetings and notify participants</p>
        </div>
      </div>

      {/* Warning Message */}
      <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-orange-400 font-semibold mb-1">Important Notice</h3>
            <p className="text-orange-300/80 text-sm">
              Cancelling a meeting will notify all participants via email. This action cannot be undone.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meeting Selection */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Select Meeting to Cancel</h2>
            
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search meetings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0f0f0f] border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
              />
            </div>

            {/* Meeting List */}
            <div className="space-y-2">
              {filteredMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  onClick={() => setSelectedMeeting(meeting.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedMeeting === meeting.id
                      ? 'bg-red-500/10 border-red-500/30'
                      : 'bg-[#0f0f0f] border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <h3 className="text-white font-medium mb-1">{meeting.title}</h3>
                  <p className="text-sm text-gray-400">
                    {new Date(meeting.date).toLocaleDateString()} at {meeting.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cancellation Form */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Cancellation Details</h2>
          
          {selectedMeeting ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Reason for Cancellation *
                </label>
                <textarea
                  rows={6}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-[#0f0f0f] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                  placeholder="Please provide a reason for cancelling this meeting..."
                />
              </div>

              <div className="pt-4">
                <p className="text-sm text-gray-400 mb-4">
                  All participants will receive an email notification about the cancellation.
                </p>
                <button
                  onClick={handleCancel}
                  disabled={!reason}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-all shadow-lg font-medium"
                >
                  <XCircle className="w-5 h-5" />
                  Cancel Meeting & Notify Participants
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <XCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">Select a meeting from the list to cancel</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
