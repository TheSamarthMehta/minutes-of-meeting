import { 
  CalendarDays, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MoreVertical,
  Plus 
} from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Overview</h1>
          <p className="text-gray-400 mt-1">Track your meetings and pending action items.</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-500/20">
          <Plus size={18} />
          New Meeting
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Upcoming" 
          value="3" 
          icon={<CalendarDays className="text-blue-400" />} 
          bg="bg-blue-500/10"
          border="border-blue-500/20"
        />
        <StatCard 
          label="Completed" 
          value="12" 
          icon={<CheckCircle2 className="text-emerald-400" />} 
          bg="bg-emerald-500/10"
          border="border-emerald-500/20"
        />
        <StatCard 
          label="Cancelled" 
          value="1" 
          icon={<XCircle className="text-red-400" />} 
          bg="bg-red-500/10"
          border="border-red-500/20"
        />
        <StatCard 
          label="Pending Actions" 
          value="8" 
          icon={<Clock className="text-orange-400" />} 
          bg="bg-orange-500/10"
          border="border-orange-500/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Meetings Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Recent Meetings</h3>
            <span className="text-xs text-blue-400 cursor-pointer hover:underline">View All</span>
          </div>
          
          <div className="space-y-3">
            <MeetingItem 
              title="Q3 Product Roadmap Review" 
              date="Oct 24" 
              time="2:00 PM"
              status="Completed"
              statusColor="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
            />
            <MeetingItem 
              title="Weekly Engineering Sync" 
              date="Oct 25" 
              time="10:00 AM"
              status="Upcoming"
              statusColor="text-blue-400 bg-blue-500/10 border-blue-500/20"
            />
            <MeetingItem 
              title="Client Discovery Call - Acme Corp" 
              date="Oct 22" 
              time="11:30 AM"
              status="Cancelled"
              statusColor="text-red-400 bg-red-500/10 border-red-500/20"
            />
             <MeetingItem 
              title="Design System Handoff" 
              date="Oct 21" 
              time="4:00 PM"
              status="Pending MOM"
              statusColor="text-orange-400 bg-orange-500/10 border-orange-500/20"
            />
          </div>
        </div>

        {/* Pending Follow-ups Column (1/3 width) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Pending Follow-ups</h3>
          </div>

          <div className="bg-[#111] rounded-xl border border-gray-800 p-4 space-y-1">
             <ActionItem task="Update Figma prototypes" due="Today" />
             <ActionItem task="Email stakeholder summary" due="Tomorrow" />
             <ActionItem task="Review PR #402" due="Oct 28" />
             <ActionItem task="Schedule follow-up w/ HR" due="Oct 30" />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Components ---

function StatCard({ label, value, icon, bg, border }: any) {
  return (
    <div className={`p-6 rounded-xl border ${border} ${bg} backdrop-blur-sm transition-all hover:scale-[1.02]`}>
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

function MeetingItem({ title, date, time, status, statusColor }: any) {
  return (
    <div className="group p-4 bg-[#111] hover:bg-[#161616] border border-gray-800 hover:border-gray-700 rounded-xl transition-all flex items-center justify-between cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center justify-center w-12 h-12 bg-[#1f1f1f] rounded-lg border border-gray-800">
          <span className="text-[10px] text-gray-500 font-bold uppercase">{date.split(' ')[0]}</span>
          <span className="text-lg font-bold text-white">{date.split(' ')[1]}</span>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">{title}</h4>
          <div className="flex items-center gap-2 mt-1">
             <span className="text-xs text-gray-500">{time}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColor}`}>
          {status}
        </span>
        <button className="text-gray-500 hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreVertical size={16} />
        </button>
      </div>
    </div>
  );
}

function ActionItem({ task, due }: any) {
  return (
    <div className="flex items-start gap-3 p-3 hover:bg-[#1a1a1a] rounded-lg transition-colors cursor-pointer group">
      <div className="mt-1">
        <div className="w-4 h-4 rounded-full border-2 border-gray-600 group-hover:border-blue-500 transition-colors" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-300 group-hover:text-gray-100 decoration-gray-600">{task}</p>
        <p className="text-xs text-gray-500 mt-1">Due: {due}</p>
      </div>
    </div>
  );
}