"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  MoreVertical,
  Plus,
} from "lucide-react";

interface Stats {
  upcoming: number;
  completed: number;
  cancelled: number;
  pendingActions: number;
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  time?: string;
  status: string;
  meetingType?: {
    meetingTypeName: string;
  };
  venue?: {
    name: string;
  };
}

interface ActionItem {
  id: string;
  task: string;
  status: string;
  dueDate?: string;
  meeting: {
    title: string;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    pendingActions: 0,
  });
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch stats, meetings, and action items in parallel
      const [statsRes, meetingsRes, actionsRes] = await Promise.all([
        fetch("/api/dashboard/stats"),
        fetch("/api/meetings?limit=6"),
        fetch("/api/action-items?status=PENDING&limit=10"),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
      }

      if (meetingsRes.ok) {
        const meetingsData = await meetingsRes.json();
        setMeetings(meetingsData.meetings);
      }

      if (actionsRes.ok) {
        const actionsData = await actionsRes.json();
        setActionItems(actionsData.actionItems);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewMeeting = () => {
    router.push("/meeting_management/create");
  };

  const handleViewAllMeetings = () => {
    router.push("/meeting_management");
  };

  const handleMeetingClick = (meetingId: string) => {
    router.push(`/meeting_management/details?id=${meetingId}`);
  };

  const handleActionItemToggle = async (actionId: string) => {
    try {
      const response = await fetch("/api/action-items", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: actionId,
          status: "COMPLETED",
        }),
      });

      if (response.ok) {
        // Refresh dashboard data
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Error updating action item:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-white text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Overview</h1>
          <p className="text-gray-400 mt-1">
            Track your meetings and pending action items.
          </p>
        </div>
        <button
          onClick={handleNewMeeting}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={18} />
          New Meeting
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Upcoming"
          value={stats.upcoming.toString()}
          icon={<CalendarDays className="text-blue-400" />}
          bg="bg-blue-500/10"
          border="border-blue-500/20"
        />
        <StatCard
          label="Completed"
          value={stats.completed.toString()}
          icon={<CheckCircle2 className="text-emerald-400" />}
          bg="bg-emerald-500/10"
          border="border-emerald-500/20"
        />
        <StatCard
          label="Cancelled"
          value={stats.cancelled.toString()}
          icon={<XCircle className="text-red-400" />}
          bg="bg-red-500/10"
          border="border-red-500/20"
        />
        <StatCard
          label="Pending Actions"
          value={stats.pendingActions.toString()}
          icon={<Clock className="text-orange-400" />}
          bg="bg-orange-500/10"
          border="border-orange-500/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Meetings Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Recent Meetings
            </h3>
            <span
              onClick={handleViewAllMeetings}
              className="text-xs text-blue-400 cursor-pointer hover:underline"
            >
              View All
            </span>
          </div>

          <div className="space-y-3">
            {meetings.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No meetings found. Create your first meeting!
              </div>
            ) : (
              meetings.map((meeting) => (
                <MeetingItem
                  key={meeting.id}
                  id={meeting.id}
                  title={meeting.title}
                  date={new Date(meeting.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                  time={meeting.time || "No time set"}
                  status={meeting.status}
                  statusColor={getStatusColor(meeting.status)}
                  onClick={() => handleMeetingClick(meeting.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Pending Follow-ups Column (1/3 width) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Pending Follow-ups
            </h3>
          </div>

          <div className="bg-[#111] rounded-xl border border-gray-800 p-4 space-y-1">
            {actionItems.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No pending action items
              </div>
            ) : (
              actionItems.map((item) => (
                <ActionItem
                  key={item.id}
                  task={item.task}
                  due={formatDueDate(item.dueDate)}
                  onToggle={() => handleActionItemToggle(item.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper Functions ---

function getStatusColor(status: string): string {
  switch (status) {
    case "COMPLETED":
      return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    case "UPCOMING":
      return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    case "CANCELLED":
      return "text-red-400 bg-red-500/10 border-red-500/20";
    default:
      return "text-orange-400 bg-orange-500/10 border-orange-500/20";
  }
}

function formatDueDate(dueDate?: string): string {
  if (!dueDate) return "No due date";

  const due = new Date(dueDate);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Reset time parts for comparison
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  if (due.getTime() === today.getTime()) {
    return "Today";
  } else if (due.getTime() === tomorrow.getTime()) {
    return "Tomorrow";
  } else {
    return due.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
}

// --- Components ---

function StatCard({ label, value, icon, bg, border }: any) {
  return (
    <div
      className={`p-6 rounded-xl border ${border} ${bg} backdrop-blur-sm transition-all hover:scale-[1.02]`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-[#0a0a0a]/50 rounded-lg">{icon}</div>
      </div>
      <div>
        <h4 className="text-3xl font-bold text-white">{value}</h4>
        <p className="text-sm text-gray-400 font-medium mt-1">{label}</p>
      </div>
    </div>
  );
}

function MeetingItem({
  id,
  title,
  date,
  time,
  status,
  statusColor,
  onClick,
}: any) {
  return (
    <div
      onClick={onClick}
      className="group p-4 bg-[#111] hover:bg-[#161616] border border-gray-800 hover:border-gray-700 rounded-xl transition-all flex items-center justify-between cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center justify-center w-12 h-12 bg-[#1f1f1f] rounded-lg border border-gray-800">
          <span className="text-[10px] text-gray-500 font-bold uppercase">
            {date.split(" ")[0]}
          </span>
          <span className="text-lg font-bold text-white">
            {date.split(" ")[1]}
          </span>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">
            {title}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500">{time}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColor}`}
        >
          {status}
        </span>
        <button className="text-gray-500 hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  );
}

function ActionItem({ task, due, onToggle }: any) {
  return (
    <div className="flex items-start gap-3 p-3 hover:bg-[#1a1a1a] rounded-lg transition-colors cursor-pointer group">
      <div className="mt-1" onClick={onToggle}>
        <div className="w-4 h-4 rounded-full border-2 border-gray-600 group-hover:border-blue-500 transition-colors" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-300 group-hover:text-gray-100 decoration-gray-600">
          {task}
        </p>
        <p className="text-xs text-gray-500 mt-1">Due: {due}</p>
      </div>
    </div>
  );
}
