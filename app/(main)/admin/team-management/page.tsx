"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import {
  Users,
  Shield,
  UserCog,
  User,
  Trash2,
  Mail,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "STAFF" | "MANAGER" | "ADMIN";
  createdAt: string;
}

const ROLE_META: Record<
  TeamMember["role"],
  { label: string; colour: string; icon: React.ReactNode }
> = {
  ADMIN: {
    label: "Admin",
    colour: "text-red-400 bg-red-500/10 border-red-500/20",
    icon: <Shield size={14} />,
  },
  MANAGER: {
    label: "Manager",
    colour: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    icon: <UserCog size={14} />,
  },
  STAFF: {
    label: "Staff",
    colour: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    icon: <User size={14} />,
  },
};

export default function TeamManagementPage() {
  const { token, user } = useAuthStore();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/delete-user", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch team");
      setMembers(data.users ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleDelete = async (userId: string) => {
    setDeletingId(userId);
    try {
      const res = await fetch("/api/admin/delete-user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setMembers((prev) => prev.filter((m) => m.id !== userId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const byRole = (role: TeamMember["role"]) =>
    members.filter((m) => m.role === role);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Team Management</h1>
          <p className="text-gray-400 text-sm mt-1">
            View and manage all platform users
          </p>
        </div>
        <button
          onClick={fetchMembers}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-gray-700 text-gray-300 rounded-lg hover:bg-[#222] transition-colors text-sm"
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          <AlertTriangle size={18} />
          {error}
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {(["ADMIN", "MANAGER", "STAFF"] as TeamMember["role"][]).map((role) => {
          const meta = ROLE_META[role];
          const count = byRole(role).length;
          return (
            <div
              key={role}
              className="bg-[#111] border border-gray-800 rounded-xl p-5 flex items-center gap-4"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center border ${meta.colour}`}
              >
                {meta.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{count}</p>
                <p className="text-xs text-gray-400">{meta.label}s</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Member list */}
      {isLoading ? (
        <div className="text-center text-gray-500 py-16">Loading team…</div>
      ) : (
        <div className="bg-[#111] border border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-gray-400 font-medium px-6 py-4">
                    Name
                  </th>
                  <th className="text-left text-gray-400 font-medium px-6 py-4">
                    Email
                  </th>
                  <th className="text-left text-gray-400 font-medium px-6 py-4">
                    Role
                  </th>
                  <th className="text-left text-gray-400 font-medium px-6 py-4">
                    Joined
                  </th>
                  <th className="text-right text-gray-400 font-medium px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {members.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center text-gray-500 py-12">
                      No team members found.
                    </td>
                  </tr>
                )}
                {members.map((member) => {
                  const meta = ROLE_META[member.role] ?? ROLE_META.STAFF;
                  const isSelf = member.id === user?.id;
                  return (
                    <tr
                      key={member.id}
                      className="border-b border-gray-800/50 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4 text-white font-medium">
                        {member.name}
                        {isSelf && (
                          <span className="ml-2 text-[10px] text-gray-500 font-normal">
                            (you)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-400 flex items-center gap-2">
                        <Mail size={14} />
                        {member.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${meta.colour}`}
                        >
                          {meta.icon}
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(member.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {!isSelf && (
                          <button
                            onClick={() => setConfirmDeleteId(member.id)}
                            disabled={deletingId === member.id}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                            title="Remove user"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle className="text-red-500" size={22} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Remove User
                </h3>
                <p className="text-xs text-gray-400">This cannot be undone</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-6">
              Are you sure you want to permanently remove this user from the
              platform?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 px-4 py-2.5 bg-[#2a2a2a] border border-gray-700 text-gray-300 rounded-lg hover:bg-[#333] transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                disabled={!!deletingId}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium disabled:opacity-60"
              >
                {deletingId === confirmDeleteId ? "Removing…" : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
