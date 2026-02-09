"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  ListChecks,
  Search,
  X,
  AlertCircle,
  Eye,
  Calendar,
} from "lucide-react";
import EntityCard from "@/app/components/EntityCard";

interface MeetingType {
  id: string;
  meetingTypeName: string;
  remarks?: string;
  createdBy?: string;
  modifiedBy?: string;
  created: string;
  modified?: string;
  _count?: {
    meetings: number;
  };
}

interface FormData {
  meetingTypeName: string;
  remarks: string;
}

export default function MeetingTypesPage() {
  const [meetingTypes, setMeetingTypes] = useState<MeetingType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<MeetingType | null>(null);
  const [viewingType, setViewingType] = useState<MeetingType | null>(null);
  const [deletingType, setDeletingType] = useState<MeetingType | null>(null);
  const [formData, setFormData] = useState<FormData>({
    meetingTypeName: "",
    remarks: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    fetchMeetingTypes();
  }, []);

  const fetchMeetingTypes = async () => {
    try {
      const response = await fetch("/api/meeting-types");
      if (response.ok) {
        const data = await response.json();
        setMeetingTypes(data);
      }
    } catch (error) {
      console.error("Error fetching meeting types:", error);
      showToast("Failed to load meeting types", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const validateForm = () => {
    const errors: Partial<FormData> = {};
    if (!formData.meetingTypeName.trim()) {
      errors.meetingTypeName = "Meeting type name is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openAddModal = () => {
    setEditingType(null);
    setFormData({ meetingTypeName: "", remarks: "" });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (type: MeetingType) => {
    setEditingType(type);
    setFormData({
      meetingTypeName: type.meetingTypeName,
      remarks: type.remarks || "",
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingType(null);
    setFormData({ meetingTypeName: "", remarks: "" });
    setFormErrors({});
  };

  const openViewModal = (type: MeetingType) => {
    setViewingType(type);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewingType(null);
  };

  const openDeleteModal = (type: MeetingType) => {
    setDeletingType(type);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingType(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const url = editingType
        ? `/api/meeting-types/${editingType.id}`
        : "/api/meeting-types";
      const method = editingType ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save meeting type");
      }

      showToast(
        `Meeting type ${editingType ? "updated" : "created"} successfully`,
        "success",
      );
      fetchMeetingTypes();
      closeModal();
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingType) return;

    try {
      const response = await fetch(`/api/meeting-types/${deletingType.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete meeting type");
      }

      showToast("Meeting type deleted successfully", "success");
      fetchMeetingTypes();
      closeDeleteModal();
    } catch (error: any) {
      showToast(error.message, "error");
      closeDeleteModal();
    }
  };

  const filteredTypes = meetingTypes.filter((type) =>
    type.meetingTypeName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-60 px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 backdrop-blur-sm border ${
            toast.type === "success"
              ? "bg-emerald-600/95 border-emerald-500 text-white"
              : "bg-red-600/95 border-red-500 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          ) : (
            <AlertCircle size={20} />
          )}
          <span className="font-medium">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 hover:bg-white/10 p-1 rounded transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <ListChecks className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Meeting Types</h1>
            <p className="text-gray-400 mt-1">
              Manage different types of meetings
            </p>
          </div>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:scale-105"
        >
          <Plus size={18} />
          Add Meeting Type
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search meeting types..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Meeting Types Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : filteredTypes.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No meeting types found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTypes.map((type) => (
            <EntityCard
              key={type.id}
              icon={ListChecks}
              iconClassName="bg-gradient-to-br from-blue-500 to-indigo-500"
              hoverBorderClassName="hover:border-blue-600/30"
              title={type.meetingTypeName}
              subtitle=""
              description={type.remarks}
              stats={[
                {
                  icon: Calendar,
                  value: type._count?.meetings || 0,
                  label: "meetings",
                },
              ]}
              date={type.created}
              onView={() => openViewModal(type)}
              onEdit={() => openEditModal(type)}
              onDelete={() => openDeleteModal(type)}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-gradient-to-br from-[#1f1f1f] via-[#1a1a1a] to-[#151515] border border-gray-800/50 rounded-2xl w-full max-w-lg shadow-2xl shadow-blue-500/10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            {/* Modal Header */}
            <div className="relative p-6 pb-4 border-b border-gray-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <ListChecks className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  {editingType ? "Edit Meeting Type" : "Add Meeting Type"}
                </h2>
              </div>
              <p className="text-gray-400 text-sm ml-13">
                {editingType
                  ? "Update meeting type information"
                  : "Create a new meeting type"}
              </p>
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 text-gray-400 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Meeting Type Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.meetingTypeName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        meetingTypeName: e.target.value,
                      })
                    }
                    className={`w-full bg-[#0f0f0f] border ${
                      formErrors.meetingTypeName
                        ? "border-red-500"
                        : "border-gray-800"
                    } rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors`}
                    placeholder="e.g., Board Meeting"
                  />
                  {formErrors.meetingTypeName && (
                    <p className="text-red-400 text-sm mt-1.5 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {formErrors.meetingTypeName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Remarks
                  </label>
                  <textarea
                    value={formData.remarks}
                    onChange={(e) =>
                      setFormData({ ...formData, remarks: e.target.value })
                    }
                    rows={3}
                    className="w-full bg-[#0f0f0f] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    placeholder="Add any additional notes..."
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 bg-[#0f0f0f] border border-gray-800 text-white rounded-xl font-semibold hover:bg-[#1a1a1a] transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      {editingType ? (
                        <>
                          <Edit2 size={18} />
                          Update Type
                        </>
                      ) : (
                        <>
                          <Plus size={18} />
                          Create Type
                        </>
                      )}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && viewingType && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeViewModal();
          }}
        >
          <div className="bg-gradient-to-br from-[#1f1f1f] via-[#1a1a1a] to-[#151515] border border-gray-800/50 rounded-2xl w-full max-w-2xl shadow-2xl shadow-blue-500/10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            {/* Modal Header */}
            <div className="relative p-6 pb-4 border-b border-gray-800/50">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shrink-0">
                  <ListChecks className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {viewingType.meetingTypeName}
                  </h2>
                </div>
              </div>

              <button
                onClick={closeViewModal}
                className="absolute top-6 right-6 text-gray-400 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Meeting Type Information */}
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Meeting Type Name
                  </label>
                  <p className="text-lg text-white font-medium">
                    {viewingType.meetingTypeName}
                  </p>
                </div>
              </div>

              {/* User Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Created By
                  </label>
                  <p className="text-base text-white font-medium">
                    {viewingType.createdBy || "Unknown"}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Modified By
                  </label>
                  <p className="text-base text-white font-medium">
                    {viewingType.modifiedBy || "-"}
                  </p>
                </div>
              </div>

              {/* Remarks */}
              {viewingType.remarks && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Remarks
                  </label>
                  <p className="text-white bg-[#0f0f0f] rounded-lg p-4 border border-gray-800">
                    {viewingType.remarks}
                  </p>
                </div>
              )}

              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-[#0f0f0f] rounded-xl p-4 border border-gray-800">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Calendar size={16} />
                    <span className="text-sm font-medium">Meetings</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {viewingType._count?.meetings || 0}
                  </p>
                </div>

                <div className="bg-[#0f0f0f] rounded-xl p-4 border border-gray-800">
                  <div className="text-gray-400 mb-2">
                    <span className="text-sm font-medium">Created</span>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {new Date(viewingType.created).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(viewingType.created).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>

                <div className="bg-[#0f0f0f] rounded-xl p-4 border border-gray-800">
                  <div className="text-gray-400 mb-2">
                    <span className="text-sm font-medium">Modified</span>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {viewingType.modified
                      ? new Date(viewingType.modified).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )
                      : "-"}
                  </p>
                  {viewingType.modified && (
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(viewingType.modified).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        },
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && deletingType && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDeleteModal();
          }}
        >
          <div className="bg-gradient-to-br from-[#1f1f1f] via-[#1a1a1a] to-[#151515] border border-red-900/50 rounded-2xl w-full max-w-md shadow-2xl shadow-red-500/10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            {/* Modal Header */}
            <div className="relative p-6 pb-4 border-b border-red-900/30">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shrink-0">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white mb-1">
                    Delete Meeting Type
                  </h2>
                  <p className="text-sm text-gray-400">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <button
                onClick={closeDeleteModal}
                className="absolute top-6 right-6 text-gray-400 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-4">
                <p className="text-gray-300 text-sm">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-white">
                    "{deletingType.meetingTypeName}"
                  </span>
                  ?
                </p>
                {(deletingType._count?.meetings || 0) > 0 && (
                  <p className="text-yellow-400 text-sm mt-2 flex items-center gap-2">
                    <AlertCircle size={16} />
                    This meeting type has {deletingType._count?.meetings}{" "}
                    meeting(s)
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
