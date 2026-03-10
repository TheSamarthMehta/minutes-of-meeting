"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  MapPin,
  Search,
  Users as UsersIcon,
  X,
  Calendar,
} from "lucide-react";
import { ActionButtons } from "@/app/components/ActionButtons";
import { useToast } from "@/lib/hooks/useToast";
import { formatDate, formatTime } from "@/lib/utils/dateFormatter";

interface Venue {
  id: string;
  name: string;
  location?: string | null;
  capacity?: number | null;
  remarks?: string | null;
  createdBy?: string | null;
  modifiedBy?: string | null;
  created: string;
  modified?: string | null;
  _count?: {
    meetings: number;
  };
}

interface FormData {
  name: string;
  location: string;
  capacity: string;
  remarks: string;
}

interface FormErrors {
  name?: string;
  capacity?: string;
}

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    location: "",
    capacity: "",
    remarks: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const { toast, showToast } = useToast();

  useEffect(() => {
    fetchVenues();
  }, []);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) {
      errors.name = "Venue name is required";
    }

    if (formData.capacity && isNaN(Number(formData.capacity))) {
      errors.capacity = "Capacity must be a number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openAddModal = () => {
    setSelectedVenue(null);
    setFormData({
      name: "",
      location: "",
      capacity: "",
      remarks: "",
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (venue: Venue) => {
    setSelectedVenue(venue);
    setFormData({
      name: venue.name,
      location: venue.location || "",
      capacity: venue.capacity ? String(venue.capacity) : "",
      remarks: venue.remarks || "",
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVenue(null);
    setFormErrors({});
  };

  const openViewModal = (venue: Venue) => {
    setSelectedVenue(venue);
    setIsViewModalOpen(true);
  };

  const openDeleteModal = (venue: Venue) => {
    setSelectedVenue(venue);
    setIsDeleteModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const url = selectedVenue
        ? `/api/venues/${selectedVenue.id}`
        : "/api/venues";

      const method = selectedVenue ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast(
          `Venue ${selectedVenue ? "updated" : "created"} successfully`,
          "success",
        );
        fetchVenues();
        closeModal();
      } else {
        const error = await response.json();
        showToast(error.error || "Failed to save venue", "error");
      }
    } catch (error) {
      showToast("Failed to save venue", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedVenue) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/venues/${selectedVenue.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showToast("Venue deleted successfully", "success");
        fetchVenues();
        setIsDeleteModalOpen(false);
        setSelectedVenue(null);
      } else {
        const error = await response.json();
        showToast(error.error || "Failed to delete venue", "error");
      }
    } catch (error) {
      showToast("Failed to delete venue", "error");
    } finally {
      setIsSubmitting(false);
    }
  };
  const fetchVenues = async () => {
    try {
      const response = await fetch("/api/venues");
      if (response.ok) {
        const data = await response.json();
        setVenues(data);
      }
    } catch (error) {
      console.error("Error fetching venues:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVenues = venues.filter(
    (venue) =>
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (venue.location?.toLowerCase() || "").includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Venues</h1>
            <p className="text-gray-400 mt-1">
              Manage meeting venues and locations
            </p>
          </div>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-orange-500/20"
        >
          <Plus size={18} />
          Add Venue
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search venues..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
        />
      </div>

      {/* Venues Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : filteredVenues.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No venues found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map((venue) => (
            <div
              key={venue.id}
              className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all group cursor-pointer"
              onClick={() => openViewModal(venue)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <ActionButtons
                  onView={(e) => {
                    e.stopPropagation();
                    openViewModal(venue);
                  }}
                  onEdit={(e) => {
                    e.stopPropagation();
                    openEditModal(venue);
                  }}
                  onDelete={(e) => {
                    e.stopPropagation();
                    openDeleteModal(venue);
                  }}
                  iconSize={18}
                />
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">
                {venue.name}
              </h3>
              <p className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                <MapPin size={14} />
                {venue.location || "No location specified"}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <div className="flex items-center gap-2">
                  <UsersIcon size={14} className="text-gray-400" />
                  <span className="text-sm text-white font-medium">
                    Capacity: {venue.capacity || "N/A"}
                  </span>
                </div>
                {venue._count && venue._count.meetings > 0 && (
                  <span className="text-xs text-gray-400">
                    {venue._count.meetings} meeting(s)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                {selectedVenue ? "Edit Venue" : "Add New Venue"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Venue Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={`w-full bg-[#0a0a0a] border ${formErrors.name ? "border-red-500" : "border-gray-800"} rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors`}
                  placeholder="e.g., Conference Room A"
                />
                {formErrors.name && (
                  <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors"
                  placeholder="e.g., 3rd Floor, Building A"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Capacity
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: e.target.value })
                  }
                  className={`w-full bg-[#0a0a0a] border ${formErrors.capacity ? "border-red-500" : "border-gray-800"} rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors`}
                  placeholder="e.g., 50"
                />
                {formErrors.capacity && (
                  <p className="text-red-400 text-xs mt-1">
                    {formErrors.capacity}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Remarks
                </label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition-colors resize-none"
                  rows={3}
                  placeholder="Additional notes or facilities..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-lg font-medium transition-all disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Saving..."
                    : selectedVenue
                      ? "Update"
                      : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {isViewModalOpen && selectedVenue && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsViewModalOpen(false);
          }}
        >
          <div className="bg-gradient-to-br from-[#1f1f1f] via-[#1a1a1a] to-[#151515] border border-gray-800/50 rounded-2xl w-full max-w-2xl shadow-2xl shadow-orange-500/10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            {/* Modal Header */}
            <div className="relative p-6 pb-4 border-b border-gray-800/50">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {selectedVenue.name}
                  </h2>
                </div>
              </div>

              <button
                onClick={() => setIsViewModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white hover:bg-gray-800 p-2 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Venue Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Venue Name
                  </label>
                  <p className="text-lg text-white font-medium">
                    {selectedVenue.name}
                  </p>
                </div>

                {selectedVenue.location && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                      Location
                    </label>
                    <p className="text-lg text-white font-medium">
                      {selectedVenue.location}
                    </p>
                  </div>
                )}
              </div>

              {/* User Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Created By
                  </label>
                  <p className="text-base text-white font-medium">
                    {selectedVenue.createdBy || "System"}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Modified By
                  </label>
                  <p className="text-base text-white font-medium">
                    {selectedVenue.modifiedBy || "-"}
                  </p>
                </div>
              </div>

              {/* Remarks */}
              {selectedVenue.remarks && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Remarks
                  </label>
                  <p className="text-white bg-[#0f0f0f] rounded-lg p-4 border border-gray-800">
                    {selectedVenue.remarks}
                  </p>
                </div>
              )}

              {/* Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#0f0f0f] rounded-xl p-4 border border-gray-800">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <UsersIcon size={16} />
                    <span className="text-sm font-medium">Capacity</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {selectedVenue.capacity || "N/A"}
                  </p>
                </div>

                <div className="bg-[#0f0f0f] rounded-xl p-4 border border-gray-800">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <Calendar size={16} />
                    <span className="text-sm font-medium">Meetings</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {selectedVenue._count?.meetings || 0}
                  </p>
                </div>

                <div className="bg-[#0f0f0f] rounded-xl p-4 border border-gray-800">
                  <div className="text-gray-400 mb-2">
                    <span className="text-sm font-medium">Created</span>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {formatDate(selectedVenue.created)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatTime(selectedVenue.created)}
                  </p>
                </div>

                <div className="bg-[#0f0f0f] rounded-xl p-4 border border-gray-800">
                  <div className="text-gray-400 mb-2">
                    <span className="text-sm font-medium">Modified</span>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {selectedVenue.modified
                      ? formatDate(selectedVenue.modified)
                      : "-"}
                  </p>
                  {selectedVenue.modified && (
                    <p className="text-xs text-gray-400 mt-1">
                      {formatTime(selectedVenue.modified)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedVenue && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 max-w-sm w-full">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Delete Venue
              </h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete{" "}
                <strong className="text-white">{selectedVenue.name}</strong>?
                {selectedVenue._count && selectedVenue._count.meetings > 0 && (
                  <span className="block mt-2 text-yellow-400 text-sm">
                    This venue is used in {selectedVenue._count.meetings}{" "}
                    meeting(s).
                  </span>
                )}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4">
          <div
            className={`px-6 py-3 rounded-lg shadow-lg ${
              toast.type === "success"
                ? "bg-emerald-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}
