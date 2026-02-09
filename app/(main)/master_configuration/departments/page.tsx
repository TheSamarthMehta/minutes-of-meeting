"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Building2,
  Search,
  Users,
  Calendar,
  X,
  AlertCircle,
  Eye,
} from "lucide-react";

interface Department {
  id: string;
  name: string;
  code?: string;
  remarks?: string;
  created: string;
  modified: string;
  _count?: {
    staff: number;
    meetings: number;
  };
}

interface FormData {
  name: string;
  code: string;
  remarks: string;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [viewingDept, setViewingDept] = useState<Department | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    code: "",
    remarks: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/departments");
      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      showToast("Failed to load departments", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openModal = (dept?: Department) => {
    if (dept) {
      setEditingDept(dept);
      setFormData({
        name: dept.name,
        code: dept.code || "",
        remarks: dept.remarks || "",
      });
    } else {
      setEditingDept(null);
      setFormData({ name: "", code: "", remarks: "" });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openViewModal = (dept: Department) => {
    setViewingDept(dept);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewingDept(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDept(null);
    setFormData({ name: "", code: "", remarks: "" });
    setFormErrors({});
  };
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isModalOpen) {
          closeModal();
        } else if (isViewModalOpen) {
          closeViewModal();
        }
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isModalOpen, isViewModalOpen]);
  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      errors.name = "Department name is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSaving(true);

    try {
      const url = editingDept
        ? `/api/departments/${editingDept.id}`
        : "/api/departments";

      const method = editingDept ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          code: formData.code.trim() || undefined,
          remarks: formData.remarks.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save department");
      }

      showToast(
        editingDept
          ? "Department updated successfully"
          : "Department created successfully",
        "success",
      );

      closeModal();
      fetchDepartments();
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (dept: Department) => {
    if (
      !confirm(
        `Are you sure you want to delete "${dept.name}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/departments/${dept.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete department");
      }

      showToast("Department deleted successfully", "success");
      fetchDepartments();
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.code?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Enhanced Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[60] px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 backdrop-blur-sm border ${
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
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Departments</h1>
            <p className="text-gray-400 mt-1">
              Manage organizational departments
            </p>
          </div>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-emerald-500/20"
        >
          <Plus size={18} />
          Add Department
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search departments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
        />
      </div>

      {/* Departments Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : filteredDepartments.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No departments found</p>
          {searchQuery && (
            <p className="text-gray-500 text-sm mt-2">
              Try adjusting your search
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDepartments.map((dept) => (
            <div
              key={dept.id}
              className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-xl p-6 hover:border-emerald-600/30 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {dept.name}
                    </h3>
                    {dept.code && (
                      <p className="text-xs text-emerald-400 mt-0.5 font-mono">
                        {dept.code}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openViewModal(dept)}
                    className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="View department details"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => openModal(dept)}
                    className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Edit department"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(dept)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete department"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {dept.remarks && (
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {dept.remarks}
                </p>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Users size={14} />
                    <span>{dept._count?.staff || 0}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Calendar size={14} />
                    <span>{dept._count?.meetings || 0}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(dept.created).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Enhanced Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-gradient-to-br from-[#1f1f1f] via-[#1a1a1a] to-[#151515] border border-gray-800/50 rounded-2xl w-full max-w-lg shadow-2xl shadow-emerald-500/10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            {/* Modal Header */}
            <div className="relative p-6 pb-4">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {editingDept ? "Edit Department" : "Add Department"}
                </h2>
              </div>
              <p className="text-gray-400 text-sm ml-[52px]">
                {editingDept
                  ? "Update department information"
                  : "Create a new organizational department"}
              </p>

              <button
                onClick={closeModal}
                className="absolute top-6 right-6 text-gray-400 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-5">
              {/* Department Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Department Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={`w-full bg-[#0f0f0f] border-2 ${
                      formErrors.name
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-800 focus:border-emerald-500"
                    } rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${
                      formErrors.name
                        ? "focus:ring-red-500/20"
                        : "focus:ring-emerald-500/20"
                    } transition-all`}
                    placeholder="e.g., Computer Science"
                    autoFocus
                  />
                </div>
                {formErrors.name && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {formErrors.name}
                  </p>
                )}
              </div>

              {/* Department Code */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Department Code
                  <span className="text-gray-500 font-normal ml-2">
                    (Optional)
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full bg-[#0f0f0f] border-2 border-gray-800 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono uppercase tracking-wider"
                  placeholder="e.g., CS, IT, HR"
                  maxLength={10}
                />
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Remarks
                  <span className="text-gray-500 font-normal ml-2">
                    (Optional)
                  </span>
                </label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                  className="w-full bg-[#0f0f0f] border-2 border-gray-800 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
                  rows={4}
                  placeholder="Add any additional notes or description about this department..."
                />
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSaving}
                  className="flex-1 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/70 text-gray-200 rounded-xl font-medium transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700/50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      {editingDept ? (
                        <>
                          <Edit2 size={18} />
                          Update Department
                        </>
                      ) : (
                        <>
                          <Plus size={18} />
                          Create Department
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

      {/* View Department Modal */}
      {isViewModalOpen && viewingDept && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeViewModal();
          }}
        >
          <div className="bg-gradient-to-br from-[#1f1f1f] via-[#1a1a1a] to-[#151515] border border-gray-800/50 rounded-2xl w-full max-w-2xl shadow-2xl shadow-emerald-500/10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            {/* Modal Header */}
            <div className="relative p-6 pb-4 border-b border-gray-800/50">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {viewingDept.name}
                  </h2>
                  {viewingDept.code && (
                    <p className="text-emerald-400 font-mono text-sm">
                      Code: {viewingDept.code}
                    </p>
                  )}
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
              {/* Department Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Department Name
                  </label>
                  <p className="text-lg text-white font-medium">
                    {viewingDept.name}
                  </p>
                </div>

                {viewingDept.code && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                      Department Code
                    </label>
                    <p className="text-lg text-emerald-400 font-mono font-medium">
                      {viewingDept.code}
                    </p>
                  </div>
                )}
              </div>

              {/* Remarks */}
              {viewingDept.remarks && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Remarks
                  </label>
                  <p className="text-white bg-[#0f0f0f] rounded-lg p-4 border border-gray-800">
                    {viewingDept.remarks}
                  </p>
                </div>
              )}

              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#0f0f0f] rounded-xl p-4 border border-gray-800">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Users size={16} />
                    <span className="text-sm font-medium">Staff</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {viewingDept._count?.staff || 0}
                  </p>
                </div>

                <div className="bg-[#0f0f0f] rounded-xl p-4 border border-gray-800">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Calendar size={16} />
                    <span className="text-sm font-medium">Meetings</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {viewingDept._count?.meetings || 0}
                  </p>
                </div>

                <div className="bg-[#0f0f0f] rounded-xl p-4 border border-gray-800">
                  <div className="text-gray-400 mb-2">
                    <span className="text-sm font-medium">Created</span>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {new Date(viewingDept.created).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="bg-[#0f0f0f] rounded-xl p-4 border border-gray-800">
                  <div className="text-gray-400 mb-2">
                    <span className="text-sm font-medium">Modified</span>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {new Date(viewingDept.modified).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex pt-4 border-t border-gray-800">
                <button
                  onClick={closeViewModal}
                  className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-600/30"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
