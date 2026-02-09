'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Settings } from 'lucide-react';

type Tab = 'meeting-types' | 'staff' | 'departments' | 'venues';

interface MeetingType {
  id: string;
  meetingTypeName: string;
  remarks?: string;
  created: string;
  modified: string;
}

interface Staff {
  id: string;
  staffName: string;
  mobileNo?: string;
  emailAddress: string;
  departmentId?: string;
  department?: { name: string };
  remarks?: string;
  created: string;
  modified: string;
}

interface Department {
  id: string;
  name: string;
  code?: string;
  remarks?: string;
  created: string;
  modified: string;
  _count?: { staff: number; meetings: number };
}

interface Venue {
  id: string;
  name: string;
  location?: string;
  capacity?: number;
  remarks?: string;
  created: string;
  modified: string;
  _count?: { meetings: number };
}

export default function ConfigPage() {
  const [activeTab, setActiveTab] = useState<Tab>('meeting-types');
  const [meetingTypes, setMeetingTypes] = useState<MeetingType[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const endpoints: Record<Tab, string> = {
        'meeting-types': '/api/meeting-types',
        'staff': '/api/staff',
        'departments': '/api/departments',
        'venues': '/api/venues',
      };

      const response = await fetch(endpoints[activeTab]);
      const data = await response.json();

      switch (activeTab) {
        case 'meeting-types':
          setMeetingTypes(data);
          break;
        case 'staff':
          setStaff(data);
          break;
        case 'departments':
          setDepartments(data);
          break;
        case 'venues':
          setVenues(data);
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const endpoints: Record<Tab, string> = {
      'meeting-types': '/api/meeting-types',
      'staff': '/api/staff',
      'departments': '/api/departments',
      'venues': '/api/venues',
    };

    try {
      const response = await fetch(`${endpoints[activeTab]}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadData();
      }
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const openModal = (item?: any) => {
    setEditingItem(item || null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg">
          <Settings className="text-purple-400" size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Master Configuration</h1>
          <p className="text-gray-400 mt-1">Manage system master data</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-700/50">
        {[
          { key: 'meeting-types', label: 'Meeting Types' },
          { key: 'staff', label: 'Staff' },
          { key: 'departments', label: 'Departments' },
          { key: 'venues', label: 'Venues' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as Tab)}
            className={`px-6 py-3 font-medium transition-all relative ${
              activeTab === tab.key
                ? 'text-blue-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">
            {activeTab === 'meeting-types' && 'Meeting Types'}
            {activeTab === 'staff' && 'Staff Members'}
            {activeTab === 'departments' && 'Departments'}
            {activeTab === 'venues' && 'Venues'}
          </h2>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
          >
            <Plus size={18} />
            Add New
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading...</div>
        ) : (
          <>
            {activeTab === 'meeting-types' && (
              <MeetingTypesTable
                data={meetingTypes}
                onEdit={openModal}
                onDelete={handleDelete}
              />
            )}
            {activeTab === 'staff' && (
              <StaffTable
                data={staff}
                onEdit={openModal}
                onDelete={handleDelete}
              />
            )}
            {activeTab === 'departments' && (
              <DepartmentsTable
                data={departments}
                onEdit={openModal}
                onDelete={handleDelete}
              />
            )}
            {activeTab === 'venues' && (
              <VenuesTable
                data={venues}
                onEdit={openModal}
                onDelete={handleDelete}
              />
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <Modal
          activeTab={activeTab}
          editingItem={editingItem}
          departments={departments}
          onClose={closeModal}
          onSuccess={() => {
            closeModal();
            loadData();
          }}
        />
      )}
    </div>
  );
}

// Meeting Types Table
function MeetingTypesTable({
  data,
  onEdit,
  onDelete,
}: {
  data: MeetingType[];
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700/50">
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Meeting Type</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Remarks</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Created</th>
            <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b border-gray-700/30 hover:bg-gray-700/20">
              <td className="py-3 px-4 text-white font-medium">{item.meetingTypeName}</td>
              <td className="py-3 px-4 text-gray-400">{item.remarks || '-'}</td>
              <td className="py-3 px-4 text-gray-400">
                {new Date(item.created).toLocaleDateString()}
              </td>
              <td className="py-3 px-4">
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-12 text-gray-400">No meeting types found</div>
      )}
    </div>
  );
}

// Staff Table
function StaffTable({
  data,
  onEdit,
  onDelete,
}: {
  data: Staff[];
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700/50">
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Mobile</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Department</th>
            <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b border-gray-700/30 hover:bg-gray-700/20">
              <td className="py-3 px-4 text-white font-medium">{item.staffName}</td>
              <td className="py-3 px-4 text-gray-400">{item.emailAddress}</td>
              <td className="py-3 px-4 text-gray-400">{item.mobileNo || '-'}</td>
              <td className="py-3 px-4 text-gray-400">{item.department?.name || '-'}</td>
              <td className="py-3 px-4">
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-12 text-gray-400">No staff members found</div>
      )}
    </div>
  );
}

// Departments Table
function DepartmentsTable({
  data,
  onEdit,
  onDelete,
}: {
  data: Department[];
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700/50">
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Code</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Staff Count</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Remarks</th>
            <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b border-gray-700/30 hover:bg-gray-700/20">
              <td className="py-3 px-4 text-white font-medium">{item.name}</td>
              <td className="py-3 px-4 text-gray-400">{item.code || '-'}</td>
              <td className="py-3 px-4 text-gray-400">{item._count?.staff || 0}</td>
              <td className="py-3 px-4 text-gray-400">{item.remarks || '-'}</td>
              <td className="py-3 px-4">
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-12 text-gray-400">No departments found</div>
      )}
    </div>
  );
}

// Venues Table
function VenuesTable({
  data,
  onEdit,
  onDelete,
}: {
  data: Venue[];
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700/50">
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Location</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Capacity</th>
            <th className="text-left py-3 px-4 text-gray-400 font-medium">Remarks</th>
            <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="border-b border-gray-700/30 hover:bg-gray-700/20">
              <td className="py-3 px-4 text-white font-medium">{item.name}</td>
              <td className="py-3 px-4 text-gray-400">{item.location || '-'}</td>
              <td className="py-3 px-4 text-gray-400">{item.capacity || '-'}</td>
              <td className="py-3 px-4 text-gray-400">{item.remarks || '-'}</td>
              <td className="py-3 px-4">
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => onEdit(item)}
                    className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-12 text-gray-400">No venues found</div>
      )}
    </div>
  );
}

// Modal Component
function Modal({
  activeTab,
  editingItem,
  departments,
  onClose,
  onSuccess,
}: {
  activeTab: Tab;
  editingItem: any;
  departments: Department[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState<any>(editingItem || {});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoints: Record<Tab, string> = {
      'meeting-types': '/api/meeting-types',
      'staff': '/api/staff',
      'departments': '/api/departments',
      'venues': '/api/venues',
    };

    try {
      const url = editingItem
        ? `${endpoints[activeTab]}/${editingItem.id}`
        : endpoints[activeTab];
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-white mb-4">
          {editingItem ? 'Edit' : 'Add'}{' '}
          {activeTab === 'meeting-types' && 'Meeting Type'}
          {activeTab === 'staff' && 'Staff Member'}
          {activeTab === 'departments' && 'Department'}
          {activeTab === 'venues' && 'Venue'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'meeting-types' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Meeting Type Name *
                </label>
                <input
                  type="text"
                  value={formData.meetingTypeName || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, meetingTypeName: e.target.value })
                  }
                  required
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Remarks
                </label>
                <textarea
                  value={formData.remarks || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                  rows={3}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                />
              </div>
            </>
          )}

          {activeTab === 'staff' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Staff Name *
                </label>
                <input
                  type="text"
                  value={formData.staffName || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, staffName: e.target.value })
                  }
                  required
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.emailAddress || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, emailAddress: e.target.value })
                  }
                  required
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={formData.mobileNo || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, mobileNo: e.target.value })
                  }
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Department
                </label>
                <select
                  value={formData.departmentId || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, departmentId: e.target.value || null })
                  }
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Remarks
                </label>
                <textarea
                  value={formData.remarks || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                  rows={3}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                />
              </div>
            </>
          )}

          {activeTab === 'departments' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Department Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Department Code
                </label>
                <input
                  type="text"
                  value={formData.code || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Remarks
                </label>
                <textarea
                  value={formData.remarks || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                  rows={3}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                />
              </div>
            </>
          )}

          {activeTab === 'venues' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Venue Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Capacity
                </label>
                <input
                  type="number"
                  value={formData.capacity || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: e.target.value })
                  }
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Remarks
                </label>
                <textarea
                  value={formData.remarks || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                  rows={3}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white"
                />
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
