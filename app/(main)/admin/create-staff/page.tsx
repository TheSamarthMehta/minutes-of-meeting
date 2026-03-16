"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import {
  UserRoundCog,
  Mail,
  User,
  Lock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface FormState {
  name: string;
  email: string;
  password: string;
}

const INITIAL: FormState = { name: "", email: "", password: "" };

export default function CreateStaffPage() {
  const { token } = useAuthStore();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setWarning(null);

    try {
      const res = await fetch("/api/admin/create-staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create staff");

      setSuccess(`Staff member "${data.user?.name}" created successfully.`);

      if (data.email?.sent) {
        setWarning(null);
      } else {
        setWarning(
          data.email?.reason ||
            "Welcome email was not sent. Please check SMTP configuration.",
        );
      }

      setForm(INITIAL);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <UserRoundCog className="text-blue-400" size={20} />
          </div>
          <h1 className="text-2xl font-bold text-white">Create Staff</h1>
        </div>
        <p className="text-gray-400 text-sm">
          Add a new Staff member. A welcome email will be sent automatically.
        </p>
      </div>

      {/* Feedback */}
      {success && (
        <div className="flex items-start gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
          <CheckCircle size={18} className="shrink-0 mt-0.5" />
          {success}
        </div>
      )}
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          {error}
        </div>
      )}
      {warning && (
        <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-300 text-sm">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          {warning}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#111] border border-gray-800 rounded-xl p-6 space-y-5"
      >
        {/* Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Full Name <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <User
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="John Smith"
              className="w-full bg-[#1a1a1a] border border-gray-700 text-gray-100 placeholder-gray-600 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Email Address <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="john@example.com"
              className="w-full bg-[#1a1a1a] border border-gray-700 text-gray-100 placeholder-gray-600 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">
            Temporary Password{" "}
            <span className="text-gray-500 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <Lock
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Leave blank to auto-generate"
              className="w-full bg-[#1a1a1a] border border-gray-700 text-gray-100 placeholder-gray-600 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/60 transition"
            />
          </div>
          <p className="text-[11px] text-gray-500">
            If left blank, a secure random password is generated and sent via
            email.
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
        >
          <UserRoundCog size={16} />
          {isLoading ? "Creating Staff…" : "Create Staff Member"}
        </button>
      </form>
    </div>
  );
}
