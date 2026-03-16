"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CalendarPlus,
  ChevronDown,
  FileText,
  Save,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DynamicSelect } from "@/app/components/DynamicSelect";
import { useToast } from "@/app/components/ui/toast";
import { useAuthStore } from "@/lib/store/authStore";

interface MeetingType {
  id: string;
  meetingTypeName: string;
}

interface Venue {
  id: string;
  name: string;
}

interface NativePickerFieldProps {
  name: string;
  type: "date" | "time";
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  error?: string;
  min?: string;
  step?: number;
}

function formatDateDisplay(value: string): string {
  if (!value) return "";
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return value;
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTimeDisplay(value: string): string {
  if (!value) return "";
  const [h, m] = value.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return value;
  const date = new Date();
  date.setHours(h, m, 0, 0);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function NativePickerField({
  name,
  type,
  value,
  onChange,
  placeholder,
  icon,
  error,
  min,
  step,
}: NativePickerFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const displayValue =
    type === "date" ? formatDateDisplay(value) : formatTimeDisplay(value);

  return (
    <div className="relative">
      <button
        type="button"
        data-field={name}
        onClick={() => {
          if (inputRef.current?.showPicker) {
            inputRef.current.showPicker();
          } else {
            inputRef.current?.focus();
          }
        }}
        className={`w-full bg-[#0f0f0f] border ${
          error ? "border-red-500" : "border-gray-800"
        } rounded-lg px-4 py-3 text-left flex items-center justify-between gap-3 hover:border-gray-700 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all`}
      >
        <span className="flex items-center gap-2 min-w-0">
          <span className="text-gray-300 shrink-0">{icon}</span>
          <span className={displayValue ? "text-white" : "text-gray-500"}>
            {displayValue || placeholder}
          </span>
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      <input
        ref={inputRef}
        name={name}
        type={type}
        value={value}
        min={min}
        step={step}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 z-10 cursor-pointer opacity-0"
      />
    </div>
  );
}

export default function CreateMeetingPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { user, token } = useAuthStore();
  const [formData, setFormData] = useState({
    title: "",
    meetingType: "",
    date: "",
    startTime: "",
    endTime: "",
    venue: "",
    description: "",
    agenda: "",
  });

  const [meetingTypes, setMeetingTypes] = useState<MeetingType[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoadingMeetingTypes, setIsLoadingMeetingTypes] = useState(true);
  const [isLoadingVenues, setIsLoadingVenues] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const todayMinDate = new Date().toISOString().split("T")[0];

  const getRoundedQuarterTime = () => {
    const now = new Date();
    const rounded = new Date(now);
    const nextQuarter = Math.ceil(rounded.getMinutes() / 15) * 15;
    rounded.setMinutes(nextQuarter, 0, 0);

    if (rounded.getDate() !== now.getDate()) {
      return "23:45";
    }

    return `${String(rounded.getHours()).padStart(2, "0")}:${String(
      rounded.getMinutes(),
    ).padStart(2, "0")}`;
  };

  const addMinutes = (time: string, minutesToAdd: number) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":").map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return "";
    const total = hours * 60 + minutes + minutesToAdd;
    if (total >= 24 * 60) return "23:59";
    const h = Math.floor(total / 60);
    const m = total % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const isSelectedDateToday = (() => {
    if (!formData.date) return false;
    const selected = new Date(formData.date);
    const now = new Date();
    return (
      selected.getFullYear() === now.getFullYear() &&
      selected.getMonth() === now.getMonth() &&
      selected.getDate() === now.getDate()
    );
  })();

  const startTimeMin = isSelectedDateToday
    ? getRoundedQuarterTime()
    : undefined;
  const endTimeMin = formData.startTime
    ? addMinutes(formData.startTime, 15)
    : startTimeMin;

  // Fetch meeting types
  useEffect(() => {
    fetchMeetingTypes();
  }, []);

  // Fetch venues
  useEffect(() => {
    fetchVenues();
  }, []);

  // Refetch data when page becomes visible (user returns from other pages)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchMeetingTypes();
        fetchVenues();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const fetchMeetingTypes = async () => {
    setIsLoadingMeetingTypes(true);
    try {
      const response = await fetch("/api/meeting-types");
      if (response.ok) {
        const data = await response.json();
        console.log("Meeting Types loaded:", data);
        setMeetingTypes(data);
      } else {
        console.error("Failed to fetch meeting types:", response.status);
      }
    } catch (error) {
      console.error("Error fetching meeting types:", error);
    } finally {
      setIsLoadingMeetingTypes(false);
    }
  };

  const fetchVenues = async () => {
    setIsLoadingVenues(true);
    try {
      const response = await fetch("/api/venues");
      if (response.ok) {
        const data = await response.json();
        console.log("Venues loaded:", data);
        setVenues(data);
      } else {
        console.error("Failed to fetch venues:", response.status);
      }
    } catch (error) {
      console.error("Error fetching venues:", error);
    } finally {
      setIsLoadingVenues(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate title
    if (!formData.title.trim()) {
      newErrors.title = "Meeting title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Meeting title must be at least 3 characters";
    }

    // Validate meeting type
    if (!formData.meetingType) {
      newErrors.meetingType = "Meeting type is required";
    }

    // Validate venue
    if (!formData.venue) {
      newErrors.venue = "Venue is required";
    }

    // Validate date
    if (!formData.date) {
      newErrors.date = "Date is required";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = "Date cannot be in the past";
      }
    }

    // Validate start time
    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
    }

    // Validate end time
    if (!formData.endTime) {
      newErrors.endTime = "End time is required";
    }

    // Validate time logic
    if (formData.startTime && formData.endTime) {
      if (formData.startTime >= formData.endTime) {
        newErrors.endTime = "End time must be after start time";
      }

      if (formData.date) {
        const selectedDate = new Date(formData.date);
        const now = new Date();
        const isToday =
          selectedDate.getFullYear() === now.getFullYear() &&
          selectedDate.getMonth() === now.getMonth() &&
          selectedDate.getDate() === now.getDate();

        if (isToday) {
          const [hours, minutes] = formData.startTime.split(":").map(Number);
          const startAt = new Date(selectedDate);
          startAt.setHours(hours, minutes, 0, 0);
          if (startAt < now) {
            newErrors.startTime = "Start time cannot be in the past for today";
          }
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys({
        ...(formData.title.trim() ? {} : { title: true }),
        ...(formData.meetingType ? {} : { meetingType: true }),
        ...(formData.venue ? {} : { venue: true }),
        ...(formData.date ? {} : { date: true }),
        ...(formData.startTime ? {} : { startTime: true }),
        ...(formData.endTime ? {} : { endTime: true }),
      })[0];
      const element = document.querySelector(
        `[name="${firstErrorField}"], [data-field="${firstErrorField}"]`,
      );
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      showToast("Please fix the highlighted required fields", "error");
      return;
    }

    if (!user?.id) {
      showToast("Session expired. Please login again.", "error");
      router.push("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/meetings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          meetingTypeId: formData.meetingType,
          venueId: formData.venue,
          date: formData.date,
          time: `${formData.startTime} - ${formData.endTime}`,
          description: formData.description.trim() || undefined,
          agenda: formData.agenda.trim() || undefined,
          content:
            formData.description.trim() || formData.agenda.trim()
              ? `Start Time: ${formData.startTime}\nEnd Time: ${formData.endTime}`
              : undefined,
          status: "UPCOMING",
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to create meeting");
      }

      showToast("Meeting created successfully", "success");
      router.push(`/meeting_management/details?id=${data.meeting.id}`);
    } catch (error) {
      console.error("Error creating meeting:", error);
      showToast(
        error instanceof Error ? error.message : "Failed to create meeting",
        "error",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/meeting_management"
          className="w-10 h-10 bg-[#1a1a1a] border border-gray-800 rounded-lg flex items-center justify-center hover:bg-[#252525] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </Link>
        <div className="w-12 h-12 bg-linear-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <CalendarPlus className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Create New Meeting</h1>
          <p className="text-gray-400 mt-1">
            Schedule a new meeting with participants
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-linear-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Meeting Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={(e) => {
                  const value = e.target.value;
                  // Capitalize first letter automatically
                  const formattedValue =
                    value.length === 1
                      ? value.toUpperCase()
                      : value.charAt(0).toUpperCase() + value.slice(1);
                  setFormData({ ...formData, title: formattedValue });
                  if (errors.title) {
                    setErrors({ ...errors, title: "" });
                  }
                }}
                className={`w-full bg-[#0f0f0f] border ${
                  errors.title ? "border-red-500" : "border-gray-800"
                } rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all hover:border-gray-700`}
                placeholder="e.g., Board Meeting Q1 2026"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-400">{errors.title}</p>
              )}
            </div>

            <DynamicSelect
              label="Meeting Type"
              value={formData.meetingType}
              onChange={(value) => {
                setFormData({ ...formData, meetingType: value });
                if (errors.meetingType) {
                  setErrors({ ...errors, meetingType: "" });
                }
              }}
              options={meetingTypes.map((type) => ({
                value: type.id,
                label: type.meetingTypeName,
              }))}
              placeholder={
                isLoadingMeetingTypes
                  ? "Loading..."
                  : meetingTypes.length === 0
                    ? "No meeting types - Click + to add"
                    : "Select type"
              }
              required
              onAddNew={() =>
                router.push("/master_configuration/meeting-types")
              }
              isLoading={isLoadingMeetingTypes}
              error={errors.meetingType}
            />

            <DynamicSelect
              label="Venue"
              value={formData.venue}
              onChange={(value) => {
                setFormData({ ...formData, venue: value });
                if (errors.venue) {
                  setErrors({ ...errors, venue: "" });
                }
              }}
              options={venues.map((venue) => ({
                value: venue.id,
                label: venue.name,
              }))}
              placeholder={
                isLoadingVenues
                  ? "Loading..."
                  : venues.length === 0
                    ? "No venues - Click + to add"
                    : "Select venue"
              }
              required
              onAddNew={() => router.push("/master_configuration/venues")}
              isLoading={isLoadingVenues}
              error={errors.venue}
            />
          </div>
        </div>

        {/* Date & Time */}
        <div className="bg-linear-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            Date & Time
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date <span className="text-red-400">*</span>
              </label>
              <NativePickerField
                name="date"
                type="date"
                value={formData.date}
                onChange={(value) => {
                  setFormData({ ...formData, date: value });
                  if (errors.date) {
                    setErrors({ ...errors, date: "" });
                  }
                }}
                placeholder="Select a date"
                icon={<Calendar className="w-4 h-4" />}
                error={errors.date}
                min={todayMinDate}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-400">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Time <span className="text-red-400">*</span>
              </label>
              <NativePickerField
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={(value) => {
                  const shouldResetEnd =
                    !!formData.endTime && formData.endTime <= value;

                  setFormData({
                    ...formData,
                    startTime: value,
                    endTime: shouldResetEnd ? "" : formData.endTime,
                  });

                  setErrors({
                    ...errors,
                    startTime: "",
                    endTime: shouldResetEnd ? "" : errors.endTime,
                  });
                }}
                placeholder="Select start time"
                icon={<Clock className="w-4 h-4" />}
                error={errors.startTime}
                min={startTimeMin}
                step={900}
              />
              {errors.startTime && (
                <p className="mt-1 text-sm text-red-400">{errors.startTime}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Time <span className="text-red-400">*</span>
              </label>
              <NativePickerField
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={(value) => {
                  setFormData({ ...formData, endTime: value });
                  if (errors.endTime) {
                    setErrors({ ...errors, endTime: "" });
                  }
                }}
                placeholder="Select end time"
                icon={<Clock className="w-4 h-4" />}
                error={errors.endTime}
                min={endTimeMin}
                step={900}
              />
              {!errors.endTime && formData.startTime && (
                <p className="mt-1 text-xs text-gray-500">
                  End time should be after start time.
                </p>
              )}
              {errors.endTime && (
                <p className="mt-1 text-sm text-red-400">{errors.endTime}</p>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-linear-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            Meeting Details
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full bg-[#0f0f0f] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all hover:border-gray-700 resize-none"
                placeholder="Provide a brief description of the meeting..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Agenda
              </label>
              <textarea
                rows={6}
                value={formData.agenda}
                onChange={(e) =>
                  setFormData({ ...formData, agenda: e.target.value })
                }
                className="w-full bg-[#0f0f0f] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all hover:border-gray-700 resize-none"
                placeholder="List the meeting agenda items..."
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link
            href="/meeting_management"
            className="flex-1 px-6 py-3 bg-[#1a1a1a] border border-gray-800 text-white rounded-lg hover:bg-[#252525] transition-colors text-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {isSubmitting ? "Creating..." : "Create Meeting"}
          </button>
        </div>
      </form>
    </div>
  );
}
