"use client";

import { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  List,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/app/components/ui/toast";

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string | null;
  status: string;
  agenda: string | null;
  description: string | null;
  meetingType: {
    id: string;
    name: string;
  } | null;
  venue: {
    id: string;
    name: string;
  } | null;
  department: {
    id: string;
    name: string;
  } | null;
}

export default function CalendarPage() {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/meetings");

      if (!response.ok) {
        throw new Error("Failed to fetch meetings");
      }

      const data = await response.json();
      setMeetings(data.meetings || []);
    } catch (error) {
      console.error("Error fetching meetings:", error);
      showToast("Failed to load meetings", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Get meetings for a specific date
  const getMeetingsForDate = (date: Date) => {
    return meetings.filter((meeting) => {
      const meetingDate = new Date(meeting.date);
      return (
        meetingDate.getDate() === date.getDate() &&
        meetingDate.getMonth() === date.getMonth() &&
        meetingDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);
    const startingDayOfWeek = firstDay.getDay();

    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();

    // Previous month's last days
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const days = [];

    // Add previous month's days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      });
    }

    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // Add next month's days to complete the grid
    const remainingDays = 42 - days.length; // 6 rows x 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "UPCOMING":
        return "bg-blue-500/10 text-blue-400";
      case "ONGOING":
        return "bg-green-500/10 text-green-400";
      case "COMPLETED":
        return "bg-gray-500/10 text-gray-400";
      case "CANCELLED":
        return "bg-red-500/10 text-red-400";
      default:
        return "bg-blue-500/10 text-blue-400";
    }
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Meeting Calendar</h1>
            <p className="text-gray-400 mt-1">
              View and manage scheduled meetings
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 bg-[#1a1a1a] border border-gray-800 rounded-lg p-1">
          <button
            onClick={() => setView("calendar")}
            className={`px-4 py-2 rounded-md transition-all ${
              view === "calendar"
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`px-4 py-2 rounded-md transition-all ${
              view === "list"
                ? "bg-purple-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {view === "list" ? (
        /* List View */
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
          ) : meetings.length === 0 ? (
            <div className="bg-linear-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-xl p-12 text-center">
              <CalendarIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No Meetings Scheduled
              </h3>
              <p className="text-gray-400 mb-6">
                Start by creating your first meeting
              </p>
              <Link
                href="/dashboard/meeting_management/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Create Meeting
              </Link>
            </div>
          ) : (
            meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="bg-linear-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {meeting.title}
                      </h3>
                      {meeting.meetingType && (
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-full">
                          {meeting.meetingType.name}
                        </span>
                      )}
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(meeting.status)}`}
                      >
                        {meeting.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-2">
                        <CalendarIcon size={14} />
                        {new Date(meeting.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      {meeting.time && <span>{meeting.time}</span>}
                      {meeting.venue && <span>📍 {meeting.venue.name}</span>}
                    </div>
                    {meeting.agenda && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-1">
                        {meeting.agenda}
                      </p>
                    )}
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
            ))
          )}
        </div>
      ) : (
        /* Calendar View */
        <div className="bg-linear-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {currentDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth() - 1,
                    ),
                  )
                }
                className="p-2 bg-[#0f0f0f] border border-gray-800 rounded-lg hover:border-gray-700 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 bg-[#0f0f0f] border border-gray-800 rounded-lg hover:border-gray-700 transition-colors text-sm text-gray-400"
              >
                Today
              </button>
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth() + 1,
                    ),
                  )
                }
                className="p-2 bg-[#0f0f0f] border border-gray-800 rounded-lg hover:border-gray-700 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
          ) : (
            <>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium text-gray-400 py-2"
                    >
                      {day}
                    </div>
                  ),
                )}
                {calendarDays.map((day, index) => {
                  const dayMeetings = getMeetingsForDate(day.date);
                  const today = isToday(day.date);

                  return (
                    <div
                      key={index}
                      className={`min-h-25 bg-[#0f0f0f] border rounded-lg p-2 transition-all ${
                        day.isCurrentMonth
                          ? "border-gray-800 hover:border-purple-500/30"
                          : "border-gray-900 opacity-50"
                      } ${today ? "ring-2 ring-purple-500" : ""}`}
                    >
                      <div
                        className={`text-sm mb-1 ${
                          day.isCurrentMonth ? "text-gray-300" : "text-gray-600"
                        } ${today ? "text-purple-400 font-bold" : ""}`}
                      >
                        {day.date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayMeetings.slice(0, 2).map((meeting) => (
                          <Link
                            key={meeting.id}
                            href={`/dashboard/meeting_management/details?id=${meeting.id}`}
                            className="block text-xs bg-purple-500/20 text-purple-300 rounded px-1 py-0.5 truncate hover:bg-purple-500/30 transition-colors"
                            title={meeting.title}
                          >
                            {meeting.time && `${meeting.time} `}
                            {meeting.title}
                          </Link>
                        ))}
                        {dayMeetings.length > 2 && (
                          <div className="text-xs text-gray-500 px-1">
                            +{dayMeetings.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-6 flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-400">Today</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500/20 rounded"></div>
                  <span className="text-gray-400">Has Meetings</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
