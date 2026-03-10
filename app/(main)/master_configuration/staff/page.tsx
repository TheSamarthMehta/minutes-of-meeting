"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Users,
  Search,
  Mail,
  Phone,
  X,
  AlertCircle,
  Eye,
  Calendar,
  ChevronDown,
} from "lucide-react";
import EntityCard from "@/app/components/EntityCard";

interface Department {
  id: string;
  name: string;
  code?: string;
}

interface Staff {
  id: string;
  staffName: string;
  employeeId?: string;
  designation?: string;
  emailAddress: string;
  mobileNo?: string;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  motherTongue?: string;
  bloodGroup?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  dateOfJoining?: string;
  departmentId?: string;
  department?: Department;
  remarks?: string;
  createdBy?: string;
  modifiedBy?: string;
  created: string;
  modified?: string;
  creationOrder?: number;
  _count?: {
    meetingMembers: number;
  };
}

interface FormData {
  staffName: string;
  employeeId: string;
  designation: string;
  emailAddress: string;
  mobileNo: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  motherTongue: string;
  bloodGroup: string;
  address: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  dateOfJoining: string;
  departmentId: string;
  remarks: string;
}

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [viewingStaff, setViewingStaff] = useState<Staff | null>(null);
  const [deletingStaff, setDeletingStaff] = useState<Staff | null>(null);
  const [formData, setFormData] = useState<FormData>({
    staffName: "",
    employeeId: "",
    designation: "",
    emailAddress: "",
    mobileNo: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    motherTongue: "",
    bloodGroup: "",
    address: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    dateOfJoining: "",
    departmentId: "",
    remarks: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Searchable dropdown states
  const [nationalitySearch, setNationalitySearch] = useState("");
  const [nationalityDropdownOpen, setNationalityDropdownOpen] = useState(false);
  const [languageSearch, setLanguageSearch] = useState("");
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [genderSearch, setGenderSearch] = useState("");
  const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
  const [bloodGroupSearch, setBloodGroupSearch] = useState("");
  const [bloodGroupDropdownOpen, setBloodGroupDropdownOpen] = useState(false);
  const [departmentSearch, setDepartmentSearch] = useState("");
  const [departmentDropdownOpen, setDepartmentDropdownOpen] = useState(false);

  // Countries list
  const countries = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Cape Verde",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "East Timor",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "North Korea",
    "South Korea",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macedonia",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Swaziland",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];

  // Languages list
  const languages = [
    "Afrikaans",
    "Albanian",
    "Amharic",
    "Arabic",
    "Armenian",
    "Assamese",
    "Azerbaijani",
    "Basque",
    "Belarusian",
    "Bengali",
    "Bhojpuri",
    "Bosnian",
    "Bulgarian",
    "Burmese",
    "Cantonese",
    "Catalan",
    "Cebuano",
    "Chichewa",
    "Chinese",
    "Croatian",
    "Czech",
    "Danish",
    "Dari",
    "Dutch",
    "English",
    "Esperanto",
    "Estonian",
    "Filipino",
    "Finnish",
    "French",
    "Galician",
    "Georgian",
    "German",
    "Greek",
    "Gujarati",
    "Haitian Creole",
    "Hausa",
    "Hawaiian",
    "Hebrew",
    "Hindi",
    "Hmong",
    "Hungarian",
    "Icelandic",
    "Igbo",
    "Indonesian",
    "Irish",
    "Italian",
    "Japanese",
    "Javanese",
    "Kannada",
    "Kazakh",
    "Khmer",
    "Kinyarwanda",
    "Korean",
    "Kurdish",
    "Kyrgyz",
    "Lao",
    "Latin",
    "Latvian",
    "Lithuanian",
    "Luxembourgish",
    "Macedonian",
    "Malagasy",
    "Malay",
    "Malayalam",
    "Maltese",
    "Maori",
    "Marathi",
    "Mongolian",
    "Nepali",
    "Norwegian",
    "Odia",
    "Oromo",
    "Pashto",
    "Persian",
    "Polish",
    "Portuguese",
    "Punjabi",
    "Quechua",
    "Romanian",
    "Russian",
    "Samoan",
    "Sanskrit",
    "Scottish Gaelic",
    "Serbian",
    "Sesotho",
    "Shona",
    "Sindhi",
    "Sinhala",
    "Slovak",
    "Slovenian",
    "Somali",
    "Spanish",
    "Sundanese",
    "Swahili",
    "Swedish",
    "Tagalog",
    "Tajik",
    "Tamil",
    "Tatar",
    "Telugu",
    "Thai",
    "Tibetan",
    "Tigrinya",
    "Tongan",
    "Turkish",
    "Turkmen",
    "Ukrainian",
    "Urdu",
    "Uyghur",
    "Uzbek",
    "Vietnamese",
    "Welsh",
    "Xhosa",
    "Yiddish",
    "Yoruba",
    "Zulu",
  ];

  // Genders list
  const genders = ["Male", "Female", "Other"];

  // Blood Groups list
  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  useEffect(() => {
    fetchStaff();
    fetchDepartments();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetch("/api/staff");
      if (response.ok) {
        const data = await response.json();
        // Sort by creation date (oldest first) to maintain creation order
        const sortedData = data.sort(
          (a: Staff, b: Staff) =>
            new Date(a.created).getTime() - new Date(b.created).getTime(),
        );
        setStaff(sortedData);
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
      showToast("Failed to load staff", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch("/api/departments");
      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const validateForm = () => {
    const errors: Partial<FormData> = {};

    if (!formData.staffName.trim()) {
      errors.staffName = "Staff name is required";
    }

    if (!formData.emailAddress.trim()) {
      errors.emailAddress = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      errors.emailAddress = "Invalid email address";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const openModal = (staffMember?: Staff) => {
    if (staffMember) {
      setEditingStaff(staffMember);
      setFormData({
        staffName: staffMember.staffName,
        employeeId: staffMember.employeeId || "",
        designation: staffMember.designation || "",
        emailAddress: staffMember.emailAddress,
        mobileNo: staffMember.mobileNo || "",
        dateOfBirth: staffMember.dateOfBirth
          ? staffMember.dateOfBirth.split("T")[0]
          : "",
        gender: staffMember.gender || "",
        nationality: staffMember.nationality || "",
        motherTongue: staffMember.motherTongue || "",
        bloodGroup: staffMember.bloodGroup || "",
        address: staffMember.address || "",
        emergencyContactName: staffMember.emergencyContactName || "",
        emergencyContactNumber: staffMember.emergencyContactNumber || "",
        dateOfJoining: staffMember.dateOfJoining
          ? staffMember.dateOfJoining.split("T")[0]
          : "",
        departmentId: staffMember.departmentId || "",
        remarks: staffMember.remarks || "",
      });
    } else {
      setEditingStaff(null);
      setFormData({
        staffName: "",
        employeeId: "",
        designation: "",
        emailAddress: "",
        mobileNo: "",
        dateOfBirth: "",
        gender: "",
        nationality: "",
        motherTongue: "",
        bloodGroup: "",
        address: "",
        emergencyContactName: "",
        emergencyContactNumber: "",
        dateOfJoining: "",
        departmentId: "",
        remarks: "",
      });
    }
    setFormErrors({});
    setNationalityDropdownOpen(false);
    setNationalitySearch("");
    setLanguageDropdownOpen(false);
    setLanguageSearch("");
    setGenderDropdownOpen(false);
    setGenderSearch("");
    setBloodGroupDropdownOpen(false);
    setBloodGroupSearch("");
    setDepartmentDropdownOpen(false);
    setDepartmentSearch("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStaff(null);
    setFormData({
      staffName: "",
      employeeId: "",
      designation: "",
      emailAddress: "",
      mobileNo: "",
      dateOfBirth: "",
      gender: "",
      nationality: "",
      motherTongue: "",
      bloodGroup: "",
      address: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
      dateOfJoining: "",
      departmentId: "",
      remarks: "",
    });
    setFormErrors({});
    setNationalityDropdownOpen(false);
    setNationalitySearch("");
    setLanguageDropdownOpen(false);
    setLanguageSearch("");
    setGenderDropdownOpen(false);
    setGenderSearch("");
    setBloodGroupDropdownOpen(false);
    setBloodGroupSearch("");
    setDepartmentDropdownOpen(false);
    setDepartmentSearch("");
  };

  const openViewModal = (staffMember: Staff) => {
    setViewingStaff(staffMember);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setViewingStaff(null);
  };

  const openDeleteModal = (staffMember: Staff) => {
    setDeletingStaff(staffMember);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingStaff(null);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSaving(true);

    try {
      const url = editingStaff ? `/api/staff/${editingStaff.id}` : "/api/staff";

      const method = editingStaff ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staffName: formData.staffName.trim(),
          employeeId: formData.employeeId.trim() || undefined,
          designation: formData.designation.trim() || undefined,
          emailAddress: formData.emailAddress.trim(),
          mobileNo: formData.mobileNo.trim() || undefined,
          dateOfBirth: formData.dateOfBirth || undefined,
          gender: formData.gender || undefined,
          nationality: formData.nationality || undefined,
          motherTongue: formData.motherTongue || undefined,
          bloodGroup: formData.bloodGroup || undefined,
          address: formData.address.trim() || undefined,
          emergencyContactName:
            formData.emergencyContactName.trim() || undefined,
          emergencyContactNumber:
            formData.emergencyContactNumber.trim() || undefined,
          dateOfJoining: formData.dateOfJoining || undefined,
          departmentId: formData.departmentId || undefined,
          remarks: formData.remarks.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save staff");
      }

      showToast(
        editingStaff
          ? "Staff updated successfully"
          : "Staff created successfully",
        "success",
      );

      closeModal();
      fetchStaff();
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingStaff) return;

    try {
      const response = await fetch(`/api/staff/${deletingStaff.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete staff");
      }

      showToast("Staff deleted successfully", "success");
      fetchStaff();
      closeDeleteModal();
    } catch (error: any) {
      showToast(error.message, "error");
      closeDeleteModal();
    }
  };

  // Filter staff while maintaining original creation order number
  const filteredStaff = staff
    .map((s, index) => ({ ...s, creationOrder: index + 1 }))
    .filter(
      (s) =>
        s.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.emailAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.department?.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[60] px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 backdrop-blur-sm border ${
            toast.type === "success"
              ? "bg-emerald-500/90 border-emerald-400/50 text-white"
              : "bg-red-500/90 border-red-400/50 text-white"
          }`}
        >
          <AlertCircle size={20} />
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Staff Management</h1>
            <p className="text-gray-400 mt-1">
              Manage staff members and their details
            </p>
          </div>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-lg shadow-purple-500/20"
        >
          <Plus size={18} />
          Add Staff Member
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, or department..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
        />
      </div>

      {/* Staff List */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : filteredStaff.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No staff members found</p>
          {searchQuery && (
            <p className="text-gray-500 text-sm mt-2">
              Try adjusting your search
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.map((member) => (
            <EntityCard
              key={member.id}
              displayNumber={member.creationOrder}
              iconClassName="bg-gradient-to-br from-purple-500 to-pink-500"
              hoverBorderClassName="hover:border-purple-600/30"
              title={member.staffName}
              subtitle={member.department?.name}
              description={member.remarks}
              stats={[]}
              date={member.created}
              onView={() => openViewModal(member)}
              onEdit={() => openModal(member)}
              onDelete={() => openDeleteModal(member)}
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
          <div className="bg-gradient-to-br from-[#1f1f1f] via-[#1a1a1a] to-[#151515] border border-gray-800/50 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl shadow-purple-500/10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="flex items-start justify-between p-6 border-b border-gray-800/50 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shrink-0">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {editingStaff
                      ? "Edit Staff Member"
                      : "Add New Staff Member"}
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">
                    {editingStaff
                      ? "Update staff member information"
                      : "Fill in the details to add a new staff member"}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Staff Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Staff Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.staffName}
                  onChange={(e) => {
                    const value = e.target.value;
                    const transformed =
                      value.length === 1
                        ? value.toUpperCase()
                        : value.charAt(0).toUpperCase() + value.slice(1);
                    setFormData({ ...formData, staffName: transformed });
                    if (formErrors.staffName) {
                      setFormErrors({ ...formErrors, staffName: undefined });
                    }
                  }}
                  className={`w-full bg-[#2a2a2a] border ${
                    formErrors.staffName ? "border-red-500" : "border-gray-700"
                  } rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors`}
                  placeholder="Enter staff name"
                />
                {formErrors.staffName && (
                  <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {formErrors.staffName}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={formData.emailAddress}
                  onChange={(e) => {
                    setFormData({ ...formData, emailAddress: e.target.value });
                    if (formErrors.emailAddress) {
                      setFormErrors({ ...formErrors, emailAddress: undefined });
                    }
                  }}
                  className={`w-full bg-[#2a2a2a] border ${
                    formErrors.emailAddress
                      ? "border-red-500"
                      : "border-gray-700"
                  } rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors`}
                  placeholder="staff@example.com"
                />
                {formErrors.emailAddress && (
                  <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {formErrors.emailAddress}
                  </p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={formData.mobileNo}
                  onChange={(e) =>
                    setFormData({ ...formData, mobileNo: e.target.value })
                  }
                  className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Mobile Number"
                />
              </div>

              {/* Employee ID and Designation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) =>
                      setFormData({ ...formData, employeeId: e.target.value })
                    }
                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="Employee ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => {
                      const value = e.target.value;
                      const transformed =
                        value.length === 1
                          ? value.toUpperCase()
                          : value.charAt(0).toUpperCase() + value.slice(1);
                      setFormData({ ...formData, designation: transformed });
                    }}
                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="Job Title"
                  />
                </div>
              </div>

              {/* Date of Birth and Gender */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
                    }
                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors [color-scheme:dark]"
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gender
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={
                        genderDropdownOpen ? genderSearch : formData.gender
                      }
                      onChange={(e) => {
                        setGenderSearch(e.target.value);
                        setGenderDropdownOpen(true);
                      }}
                      onFocus={() => {
                        setGenderSearch("");
                        setGenderDropdownOpen(true);
                      }}
                      placeholder="Gender"
                      className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl px-4 py-3 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                    <ChevronDown
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={20}
                    />
                  </div>
                  {genderDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => {
                          setGenderDropdownOpen(false);
                          setGenderSearch("");
                        }}
                      />
                      <div className="absolute z-20 w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                        {genders
                          .filter((gender) =>
                            gender
                              .toLowerCase()
                              .includes(genderSearch.toLowerCase()),
                          )
                          .map((gender) => (
                            <div
                              key={gender}
                              onClick={() => {
                                setFormData({ ...formData, gender: gender });
                                setGenderDropdownOpen(false);
                                setGenderSearch("");
                              }}
                              className="px-4 py-2.5 hover:bg-purple-600/20 text-white cursor-pointer transition-colors"
                            >
                              {gender}
                            </div>
                          ))}
                        {genders.filter((gender) =>
                          gender
                            .toLowerCase()
                            .includes(genderSearch.toLowerCase()),
                        ).length === 0 && (
                          <div className="px-4 py-2.5 text-gray-400 text-sm">
                            No genders found
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Nationality and Mother Tongue */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nationality
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={
                        nationalityDropdownOpen
                          ? nationalitySearch
                          : formData.nationality
                      }
                      onChange={(e) => {
                        setNationalitySearch(e.target.value);
                        setNationalityDropdownOpen(true);
                      }}
                      onFocus={() => {
                        setNationalitySearch("");
                        setNationalityDropdownOpen(true);
                      }}
                      placeholder="Nationality"
                      className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl px-4 py-3 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                    <ChevronDown
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={20}
                    />
                  </div>
                  {nationalityDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => {
                          setNationalityDropdownOpen(false);
                          setNationalitySearch("");
                        }}
                      />
                      <div className="absolute z-20 w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                        {countries
                          .filter((country) =>
                            country
                              .toLowerCase()
                              .includes(nationalitySearch.toLowerCase()),
                          )
                          .map((country) => (
                            <div
                              key={country}
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  nationality: country,
                                });
                                setNationalityDropdownOpen(false);
                                setNationalitySearch("");
                              }}
                              className="px-4 py-2.5 hover:bg-purple-600/20 text-white cursor-pointer transition-colors"
                            >
                              {country}
                            </div>
                          ))}
                        {countries.filter((country) =>
                          country
                            .toLowerCase()
                            .includes(nationalitySearch.toLowerCase()),
                        ).length === 0 && (
                          <div className="px-4 py-2.5 text-gray-400 text-sm">
                            No countries found
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Mother Tongue
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={
                        languageDropdownOpen
                          ? languageSearch
                          : formData.motherTongue
                      }
                      onChange={(e) => {
                        setLanguageSearch(e.target.value);
                        setLanguageDropdownOpen(true);
                      }}
                      onFocus={() => {
                        setLanguageSearch("");
                        setLanguageDropdownOpen(true);
                      }}
                      placeholder="Mother Tongue"
                      className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl px-4 py-3 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                    <ChevronDown
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={20}
                    />
                  </div>
                  {languageDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => {
                          setLanguageDropdownOpen(false);
                          setLanguageSearch("");
                        }}
                      />
                      <div className="absolute z-20 w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                        {languages
                          .filter((language) =>
                            language
                              .toLowerCase()
                              .includes(languageSearch.toLowerCase()),
                          )
                          .map((language) => (
                            <div
                              key={language}
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  motherTongue: language,
                                });
                                setLanguageDropdownOpen(false);
                                setLanguageSearch("");
                              }}
                              className="px-4 py-2.5 hover:bg-purple-600/20 text-white cursor-pointer transition-colors"
                            >
                              {language}
                            </div>
                          ))}
                        {languages.filter((language) =>
                          language
                            .toLowerCase()
                            .includes(languageSearch.toLowerCase()),
                        ).length === 0 && (
                          <div className="px-4 py-2.5 text-gray-400 text-sm">
                            No languages found
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Blood Group and Date of Joining */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Blood Group
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={
                        bloodGroupDropdownOpen
                          ? bloodGroupSearch
                          : formData.bloodGroup
                      }
                      onChange={(e) => {
                        setBloodGroupSearch(e.target.value);
                        setBloodGroupDropdownOpen(true);
                      }}
                      onFocus={() => {
                        setBloodGroupSearch("");
                        setBloodGroupDropdownOpen(true);
                      }}
                      placeholder="Blood Group"
                      className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl px-4 py-3 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                    <ChevronDown
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={20}
                    />
                  </div>
                  {bloodGroupDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => {
                          setBloodGroupDropdownOpen(false);
                          setBloodGroupSearch("");
                        }}
                      />
                      <div className="absolute z-20 w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                        {bloodGroups
                          .filter((group) =>
                            group
                              .toLowerCase()
                              .includes(bloodGroupSearch.toLowerCase()),
                          )
                          .map((group) => (
                            <div
                              key={group}
                              onClick={() => {
                                setFormData({ ...formData, bloodGroup: group });
                                setBloodGroupDropdownOpen(false);
                                setBloodGroupSearch("");
                              }}
                              className="px-4 py-2.5 hover:bg-purple-600/20 text-white cursor-pointer transition-colors"
                            >
                              {group}
                            </div>
                          ))}
                        {bloodGroups.filter((group) =>
                          group
                            .toLowerCase()
                            .includes(bloodGroupSearch.toLowerCase()),
                        ).length === 0 && (
                          <div className="px-4 py-2.5 text-gray-400 text-sm">
                            No blood groups found
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date of Joining
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfJoining}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dateOfJoining: e.target.value,
                      })
                    }
                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors [color-scheme:dark]"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => {
                    const value = e.target.value;
                    const transformed =
                      value.length === 1
                        ? value.toUpperCase()
                        : value.charAt(0).toUpperCase() + value.slice(1);
                    setFormData({ ...formData, address: transformed });
                  }}
                  rows={2}
                  className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                  placeholder="Residential Address"
                />
              </div>

              {/* Emergency Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContactName}
                    onChange={(e) => {
                      const value = e.target.value;
                      const transformed =
                        value.length === 1
                          ? value.toUpperCase()
                          : value.charAt(0).toUpperCase() + value.slice(1);
                      setFormData({
                        ...formData,
                        emergencyContactName: transformed,
                      });
                    }}
                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="Contact Person Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Emergency Contact Number
                  </label>
                  <input
                    type="tel"
                    value={formData.emergencyContactNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyContactNumber: e.target.value,
                      })
                    }
                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="Emergency Number"
                  />
                </div>
              </div>

              {/* Department */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Department
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={
                      departmentDropdownOpen
                        ? departmentSearch
                        : departments.find(
                            (d) => d.id === formData.departmentId,
                          )?.name || ""
                    }
                    onChange={(e) => {
                      setDepartmentSearch(e.target.value);
                      setDepartmentDropdownOpen(true);
                    }}
                    onFocus={() => {
                      setDepartmentSearch("");
                      setDepartmentDropdownOpen(true);
                    }}
                    placeholder="Department"
                    className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl px-4 py-3 pr-10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  <ChevronDown
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size={20}
                  />
                </div>
                {departmentDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => {
                        setDepartmentDropdownOpen(false);
                        setDepartmentSearch("");
                      }}
                    />
                    <div className="absolute z-20 w-full mt-1 bg-[#2a2a2a] border border-gray-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                      {departments
                        .filter(
                          (dept) =>
                            dept.name
                              .toLowerCase()
                              .includes(departmentSearch.toLowerCase()) ||
                            (dept.code &&
                              dept.code
                                .toLowerCase()
                                .includes(departmentSearch.toLowerCase())),
                        )
                        .map((dept) => (
                          <div
                            key={dept.id}
                            onClick={() => {
                              setFormData({
                                ...formData,
                                departmentId: dept.id,
                              });
                              setDepartmentDropdownOpen(false);
                              setDepartmentSearch("");
                            }}
                            className="px-4 py-2.5 hover:bg-purple-600/20 text-white cursor-pointer transition-colors"
                          >
                            {dept.name} {dept.code && `(${dept.code})`}
                          </div>
                        ))}
                      {departments.filter(
                        (dept) =>
                          dept.name
                            .toLowerCase()
                            .includes(departmentSearch.toLowerCase()) ||
                          (dept.code &&
                            dept.code
                              .toLowerCase()
                              .includes(departmentSearch.toLowerCase())),
                      ).length === 0 && (
                        <div className="px-4 py-2.5 text-gray-400 text-sm">
                          No departments found
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Remarks
                </label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                  rows={3}
                  className="w-full bg-[#2a2a2a] border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                  placeholder="Additional notes or information..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-800/50 bg-[#1a1a1a]/50 shrink-0">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl font-semibold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
              >
                {isSaving
                  ? "Saving..."
                  : editingStaff
                    ? "Update Staff"
                    : "Add Staff"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && viewingStaff && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeViewModal();
          }}
        >
          <div className="bg-gradient-to-br from-[#1f1f1f] via-[#1a1a1a] to-[#151515] border border-gray-800/50 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl shadow-purple-500/10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            {/* Modal Header */}
            <div className="relative p-6 pb-4 border-b border-gray-800/50 shrink-0">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shrink-0">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {viewingStaff.staffName}
                  </h2>
                  {viewingStaff.department && (
                    <p className="text-sm text-emerald-400 font-medium">
                      {viewingStaff.department.name}
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
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Staff Information */}
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Staff Name
                  </label>
                  <p className="text-lg text-white font-medium">
                    {viewingStaff.staffName}
                  </p>
                </div>
              </div>

              {/* Employee Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Employee ID
                  </label>
                  <p className="text-base text-white font-medium">
                    {viewingStaff.employeeId || "-"}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Designation
                  </label>
                  <p className="text-base text-white font-medium">
                    {viewingStaff.designation || "-"}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Email Address
                  </label>
                  <p className="text-base text-white font-medium break-all">
                    {viewingStaff.emailAddress}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Mobile Number
                  </label>
                  <p className="text-base text-white font-medium">
                    {viewingStaff.mobileNo || "-"}
                  </p>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Date of Birth
                  </label>
                  <p className="text-base text-white font-medium">
                    {viewingStaff.dateOfBirth
                      ? new Date(viewingStaff.dateOfBirth).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          },
                        )
                      : "-"}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Gender
                  </label>
                  <p className="text-base text-white font-medium">
                    {viewingStaff.gender || "-"}
                  </p>
                </div>
              </div>

              {/* Origin and Language */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Nationality
                  </label>
                  <p className="text-base text-white font-medium">
                    {viewingStaff.nationality || "-"}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Mother Tongue
                  </label>
                  <p className="text-base text-white font-medium">
                    {viewingStaff.motherTongue || "-"}
                  </p>
                </div>
              </div>

              {/* Blood Group and Date of Joining */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Blood Group
                  </label>
                  <p className="text-base text-white font-medium">
                    {viewingStaff.bloodGroup || "-"}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Date of Joining
                  </label>
                  <p className="text-base text-white font-medium">
                    {viewingStaff.dateOfJoining
                      ? new Date(viewingStaff.dateOfJoining).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          },
                        )
                      : "-"}
                  </p>
                </div>
              </div>

              {/* Department */}
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Department
                  </label>
                  <p className="text-base text-white font-medium">
                    {viewingStaff.department?.name || "Not assigned"}
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Address
                </label>
                <p className="text-white bg-[#0f0f0f] rounded-lg p-4 border border-gray-800">
                  {viewingStaff.address || "-"}
                </p>
              </div>

              {/* Emergency Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Emergency Contact Name
                  </label>
                  <p className="text-base text-white font-medium">
                    {viewingStaff.emergencyContactName || "-"}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Emergency Contact Number
                  </label>
                  <p className="text-base text-white font-medium">
                    {viewingStaff.emergencyContactNumber || "-"}
                  </p>
                </div>
              </div>

              {/* Remarks */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Remarks
                </label>
                <p className="text-white bg-[#0f0f0f] rounded-lg p-4 border border-gray-800">
                  {viewingStaff.remarks || "-"}
                </p>
              </div>

              {/* Created By and Modified By */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Created By
                  </label>
                  <p className="text-base text-white font-medium">
                    {viewingStaff.createdBy || "System"}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Modified By
                  </label>
                  <p className="text-base text-white font-medium">
                    {viewingStaff.modifiedBy || "-"}
                  </p>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0f0f0f] rounded-xl p-4 border border-gray-800">
                  <div className="text-gray-400 mb-2">
                    <span className="text-sm font-medium">Created</span>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {new Date(viewingStaff.created).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(viewingStaff.created).toLocaleTimeString(
                      "en-US",
                      {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      },
                    )}
                  </p>
                </div>

                <div className="bg-[#0f0f0f] rounded-xl p-4 border border-gray-800">
                  <div className="text-gray-400 mb-2">
                    <span className="text-sm font-medium">Modified</span>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {viewingStaff.modified
                      ? new Date(viewingStaff.modified).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )
                      : "-"}
                  </p>
                  {viewingStaff.modified && (
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(viewingStaff.modified).toLocaleTimeString(
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
      {isDeleteModalOpen && deletingStaff && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDeleteModal();
          }}
        >
          <div className="bg-gradient-to-br from-[#1f1f1f] via-[#1a1a1a] to-[#151515] border border-red-900/50 rounded-2xl w-full max-w-md shadow-2xl shadow-red-500/10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="flex items-start gap-4 p-6 border-b border-gray-800/50">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white mb-1">
                  Delete Staff Member
                </h2>
                <p className="text-gray-400 text-sm">
                  This action cannot be undone
                </p>
              </div>
              <button
                onClick={closeDeleteModal}
                className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-300 mb-2">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-white">
                  "{deletingStaff.staffName}"
                </span>
                ?
              </p>
              <p className="text-sm text-gray-400">
                All associated data will be permanently removed from the system.
              </p>
            </div>

            <div className="flex items-center gap-3 p-6 border-t border-gray-800/50 bg-[#1a1a1a]/50">
              <button
                onClick={closeDeleteModal}
                className="flex-1 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
              >
                <Trash2 size={16} />
                Delete Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
