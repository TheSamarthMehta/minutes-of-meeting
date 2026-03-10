"use client";

import { useState } from "react";
import { Modal } from "./ui/modal";
import { Loader2 } from "lucide-react";

interface AddVenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (venue: any) => void;
}

export function AddVenueModal({
  isOpen,
  onClose,
  onSuccess,
}: AddVenueModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    capacity: "",
    remarks: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/venues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create venue");
      }

      onSuccess(data);
      setFormData({ name: "", location: "", capacity: "", remarks: "" });
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({ name: "", location: "", capacity: "", remarks: "" });
      setError("");
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Venue">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Venue Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={isSubmitting}
            className="w-full bg-[#0f0f0f] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all hover:border-gray-700 disabled:opacity-50"
            placeholder="e.g., Conference Room A"
          />
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
            disabled={isSubmitting}
            className="w-full bg-[#0f0f0f] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all hover:border-gray-700 disabled:opacity-50"
            placeholder="e.g., Building A, 3rd Floor"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Capacity
          </label>
          <input
            type="number"
            min="1"
            value={formData.capacity}
            onChange={(e) =>
              setFormData({ ...formData, capacity: e.target.value })
            }
            disabled={isSubmitting}
            className="w-full bg-[#0f0f0f] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all hover:border-gray-700 disabled:opacity-50"
            placeholder="e.g., 50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Remarks
          </label>
          <textarea
            rows={3}
            value={formData.remarks}
            onChange={(e) =>
              setFormData({ ...formData, remarks: e.target.value })
            }
            disabled={isSubmitting}
            className="w-full bg-[#0f0f0f] border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all hover:border-gray-700 resize-none disabled:opacity-50"
            placeholder="Add any additional notes..."
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-gray-800 text-white rounded-lg hover:bg-[#252525] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 font-medium disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Venue"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
