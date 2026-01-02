"use client";

import { useState, useRef } from "react";
import {
  Loader2,
  Phone,
  User,
  Bike,
  MapPin,
  Calendar,
  Users,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle,
  Briefcase,
  Clock,
  FileText
} from "lucide-react";
import api from "@/app/lib/api";

/**
 * Service Partner Create Form
 * - All field names intentionally match your Mongoose schema keys
 * - Sends multipart/form-data to POST /admin/service-partners
 */

const Toast = ({ message, type = "info", onClose }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    info: <AlertCircle className="w-5 h-5" />
  };

  const styles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800"
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-in ${styles[type]}`}
      role="status"
      aria-live="polite"
    >
      {icons[type]}
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <XCircle className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function CreateServicePartnerForm() {
  // Form state keys match your schema
  const initialState = {
    fullName: "",
    phoneNumber: "",
    email: "",
    alternate_phone_number: "",
    date_of_birth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    area_locality: "",
    account_holder_name: "",
    bank_name: "",
    account_number: "",
    ifsc_code: "",
    upi_id: "",
    working_shift: "",
    emergency_contact_name: "",
    emergency_contact_number: "",
    role: "Service Partner", // default per schema
    category: "Cleaner", // single option as requested
    is_active: true,
    average_rating: 0
  };

  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [files, setFiles] = useState({
    profile_photo: null,
    aadhaar_front: null,
    aadhaar_back: null,
    pan_card: null
  });

  const inputRef = useRef(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    // auto dismiss
    setTimeout(() => setToast(null), 4000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((s) => ({ ...s, [name]: checked }));
    } else {
      setForm((s) => ({ ...s, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files: f } = e.target;
    if (!f || f.length === 0) return;
    setFiles((s) => ({ ...s, [name]: f[0] }));
  };

  const resetForm = () => {
    setForm(initialState);
    setFiles({
      profile_photo: null,
      aadhaar_front: null,
      aadhaar_back: null,
      pan_card: null
    });
    if (inputRef.current) inputRef.current.reset();
  };

  const validate = () => {
    if (!form.fullName || !form.phoneNumber) {
      showToast("Full name and phone number are required.", "error");
      return false;
    }
    // Basic phone digits check
    const digits = String(form.phoneNumber).replace(/\D/g, "");
    if (digits.length < 10) {
      showToast("Please enter a valid phone number (min 10 digits).", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    if (!validate()) return;

    setLoading(true);
    try {
      const formData = new FormData();

      // Append scalar form fields (only non-empty to reduce payload)
      Object.entries(form).forEach(([key, value]) => {
        // For booleans/numbers we still append
        if (value !== "" && value !== undefined && value !== null) {
          formData.append(key, typeof value === "object" ? JSON.stringify(value) : String(value));
        }
      });

      // Append files (only if chosen)
      Object.entries(files).forEach(([key, file]) => {
        if (file) formData.append(key, file);
      });

      const res = await api.post("/admin/service-partners", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      showToast("Service Partner created successfully!", "success");
      resetForm();
    } catch (err) {
      // Prefer server message if available
      const msg = err?.response?.data?.message || err.message || "Failed to create service partner";
      showToast(msg, "error");
      console.error("create service partner error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.28s ease-out; }
      `}</style>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="min-h-screen h-screen flex flex-col bg-gray-50">
        <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col">
            {/* Header */}
            <div className="px-6 py-5 border-b">
              <h1 className="text-xl font-semibold text-gray-900">Create Service Partner</h1>
              <p className="text-sm text-gray-500 mt-1">Fill the form to add a new service partner</p>
            </div>

            {/* Form - scrollable area */}
            <form
              ref={inputRef}
              onSubmit={handleSubmit}
              className="px-6 py-6 sm:px-8 sm:py-8 overflow-y-auto flex-1"
              style={{ maxHeight: "100%" }}
            >
              <div className="space-y-8">
                {/* PERSONAL INFORMATION */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          name="fullName"
                          placeholder="Enter full name"
                          value={form.fullName}
                          onChange={handleChange}
                          required
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-900 placeholder-gray-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          name="phoneNumber"
                          placeholder="Enter phone number"
                          value={form.phoneNumber}
                          onChange={handleChange}
                          required
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-900 placeholder-gray-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          name="email"
                          type="email"
                          placeholder="Email"
                          value={form.email}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-900 placeholder-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">Alternate Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          name="alternate_phone_number"
                          placeholder="Alternate phone"
                          value={form.alternate_phone_number}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-900 placeholder-gray-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">Date of Birth</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          name="date_of_birth"
                          value={form.date_of_birth}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">Gender</label>
                      <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-900"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">Role</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          name="role"
                          value={form.role}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-900 appearance-none"
                        >
                          <option value="Service Partner">Service Partner</option>
                          <option value="admin">admin</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">Category</label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          name="category"
                          value={form.category}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-900 appearance-none"
                        >
                          <option value="Cleaner">Cleaner</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">Working Shift</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                          name="working_shift"
                          value={form.working_shift}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-900 appearance-none"
                        >
                          <option value="">Select Shift</option>
                          <option value="day">Day</option>
                          <option value="night">Night</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </section>

                {/* ADDRESS */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <h2 className="text-lg font-bold text-gray-900">Address Details</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          name="address"
                          placeholder="Complete address"
                          value={form.address}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none text-gray-900 placeholder-gray-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">City</label>
                        <input
                          name="city"
                          placeholder="City"
                          value={form.city}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none text-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">State</label>
                        <input
                          name="state"
                          placeholder="State"
                          value={form.state}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none text-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Pincode</label>
                        <input
                          name="pincode"
                          placeholder="Pincode"
                          value={form.pincode}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none text-gray-900"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Area / Locality</label>
                        <input
                          name="area_locality"
                          placeholder="Area / Locality"
                          value={form.area_locality}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none text-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                </section>

                {/* VEHICLE & BANK DETAILS */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Bike className="w-5 h-5 text-purple-600" />
                    <h2 className="text-lg font-bold text-gray-900">Vehicle & Bank Details</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">Account Holder Name</label>
                      <input
                        name="account_holder_name"
                        placeholder="Account holder name"
                        value={form.account_holder_name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">Bank Name</label>
                      <input
                        name="bank_name"
                        placeholder="Bank name"
                        value={form.bank_name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">Account Number</label>
                      <input
                        name="account_number"
                        placeholder="Account number"
                        value={form.account_number}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-gray-900"
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">IFSC Code</label>
                      <input
                        name="ifsc_code"
                        placeholder="IFSC"
                        value={form.ifsc_code}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">UPI ID</label>
                      <input
                        name="upi_id"
                        placeholder="UPI ID"
                        value={form.upi_id}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">Vehicle Model</label>
                      <input
                        name="vehicle_model"
                        placeholder="Vehicle model"
                        value={form.vehicle_model || ""}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-gray-900"
                      />
                    </div>
                  </div>
                </section>

                {/* FILE UPLOADS */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-gray-700" />
                    <h2 className="text-lg font-bold text-gray-900">Uploads</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex flex-col gap-2 border border-gray-200 rounded-lg p-3 cursor-pointer bg-white">
                      <span className="text-sm font-medium">Profile Photo</span>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 truncate">{files.profile_photo?.name || "Choose file"}</span>
                        <input type="file" name="profile_photo" accept="image/*" onChange={handleFileChange} className="hidden" />
                      </div>
                    </label>

                    <label className="flex flex-col gap-2 border border-gray-200 rounded-lg p-3 cursor-pointer bg-white">
                      <span className="text-sm font-medium">Aadhaar Front</span>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 truncate">{files.aadhaar_front?.name || "Choose file"}</span>
                        <input type="file" name="aadhaar_front" accept="image/*,application/pdf" onChange={handleFileChange} className="hidden" />
                      </div>
                    </label>

                    <label className="flex flex-col gap-2 border border-gray-200 rounded-lg p-3 cursor-pointer bg-white">
                      <span className="text-sm font-medium">Aadhaar Back</span>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 truncate">{files.aadhaar_back?.name || "Choose file"}</span>
                        <input type="file" name="aadhaar_back" accept="image/*,application/pdf" onChange={handleFileChange} className="hidden" />
                      </div>
                    </label>

                    <label className="md:col-span-2 flex flex-col gap-2 border border-gray-200 rounded-lg p-3 cursor-pointer bg-white">
                      <span className="text-sm font-medium">PAN Card</span>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 truncate">{files.pan_card?.name || "Choose file"}</span>
                        <input type="file" name="pan_card" accept="image/*,application/pdf" onChange={handleFileChange} className="hidden" />
                      </div>
                    </label>
                  </div>
                </section>

                {/* EMERGENCY */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-orange-600" />
                    <h2 className="text-lg font-bold text-gray-900">Emergency Contact</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">Emergency Contact Name</label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          name="emergency_contact_name"
                          placeholder="Contact name"
                          value={form.emergency_contact_name}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-gray-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">Emergency Contact Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          name="emergency_contact_number"
                          placeholder="Contact number"
                          value={form.emergency_contact_number}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </form>

            {/* Submit area - fixed at bottom of the card */}
            <div className="px-6 py-6 sm:px-8 bg-gray-50 border-t">
              <div className="max-w-3xl mx-auto">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-lg font-semibold flex justify-center items-center gap-3 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Creating Service Partner...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      Create Service Partner
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
