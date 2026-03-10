"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  FileText,
  Save,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DynamicSelect } from "@/app/components/DynamicSelect";

interface MeetingType {
  id: string;
  meetingTypeName: string;
}

interface Venue {
  id: string;
  name: string;
}

export default function CreateMeetingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    meetingType: "",
    date: "",
    startTime: "",
    endTime: "",
    venue: "",
    description: "",
    agenda: "",
    participants: [],
  });

  const [meetingTypes, setMeetingTypes] = useState<MeetingType[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoadingMeetingTypes, setIsLoadingMeetingTypes] = useState(true);
  const [isLoadingVenues, setIsLoadingVenues] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      // Submit logic here
      console.log("Creating meeting:", formData);
      // TODO: Add API call here
    } catch (error) {
      console.error("Error creating meeting:", error);
    } finally {
      setIsSubmitting(false);
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
          <h1 className="text-3xl font-bold text-white">Create New Meeting</h1>
          <p className="text-gray-400 mt-1">
            Schedule a new meeting with participants
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Meeting Title *
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
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            Date & Time
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={(e) => {
                  setFormData({ ...formData, date: e.target.value });
                  if (errors.date) {
                    setErrors({ ...errors, date: "" });
                  }
                }}
                className={`w-full bg-[#0f0f0f] border ${
                  errors.date ? "border-red-500" : "border-gray-800"
                } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all hover:border-gray-700 [color-scheme:dark]`}
                style={{ colorScheme: "dark" }}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-400">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Time *
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={(e) => {
                  setFormData({ ...formData, startTime: e.target.value });
                  if (errors.startTime) {
                    setErrors({ ...errors, startTime: "" });
                  }
                }}
                className={`w-full bg-[#0f0f0f] border ${
                  errors.startTime ? "border-red-500" : "border-gray-800"
                } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all hover:border-gray-700 [color-scheme:dark]`}
                style={{ colorScheme: "dark" }}
              />
              {errors.startTime && (
                <p className="mt-1 text-sm text-red-400">{errors.startTime}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Time *
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={(e) => {
                  setFormData({ ...formData, endTime: e.target.value });
                  if (errors.endTime) {
                    setErrors({ ...errors, endTime: "" });
                  }
                }}
                className={`w-full bg-[#0f0f0f] border ${
                  errors.endTime ? "border-red-500" : "border-gray-800"
                } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all hover:border-gray-700 [color-scheme:dark]`}
                style={{ colorScheme: "dark" }}
              />
              {errors.endTime && (
                <p className="mt-1 text-sm text-red-400">{errors.endTime}</p>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-2xl p-6">
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
            href="/dashboard/meeting_management"
            className="flex-1 px-6 py-3 bg-[#1a1a1a] border border-gray-800 text-white rounded-lg hover:bg-[#252525] transition-colors text-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {isSubmitting ? "Creating..." : "Create Meeting"}
          </button>
        </div>
      </form>
    </div>
  );
}
