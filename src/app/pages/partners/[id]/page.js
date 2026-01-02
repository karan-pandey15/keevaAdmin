"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Phone, User, Bike, MapPin, Calendar, Users, Mail, CheckCircle, XCircle, AlertCircle, Briefcase, Clock } from "lucide-react";
import api from "@/app/lib/api";

// Toast Component
const Toast = ({ message, type, onClose }) => {
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
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-in ${styles[type]}`}>
      {icons[type]}
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <XCircle className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function PartnerEditForm() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    full_name: "",
    phone_number: "",
    alternate_phone_number: "",
    date_of_birth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    area_locality: "",
    vehicle_type: "",
    vehicle_model: "",
    vehicle_number: "",
    rider_type: "",
    working_shift: "",
    emergency_contact_name: "",
    emergency_contact_number: "",
    role: "rider",
  });

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const fetchPartner = async () => {
      if (!params.id) return;

      try {
        const res = await api.get(`/partner/${params.id}`);
        setForm(res.data.partner);
      } catch (err) {
        showToast("Failed to fetch partner details", "error");
        router.push("/partners/all");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchPartner();
  }, [params.id, router]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!form.full_name || !form.phone_number) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    setLoading(true);
    try {
      await api.put(`/partner/${params.id}`, form);

      showToast("Partner updated successfully!", "success");

      // Redirect back to partners list
      setTimeout(() => {
        router.push("/partners/all");
      }, 1500);
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to update partner", "error");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin w-8 h-8 mx-auto mb-4" />
          <p>Loading partner details...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="min-h-screen   sm:py-12">
        <div className="w-full max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl   overflow-hidden">


            {/* Form Content - Scrollable */}
            <div className="  sm:px-8 sm:py-10 max-h-[calc(100vh-140px)] overflow-y-auto">
              <div className="space-y-8">
                {/* PERSONAL INFORMATION */}
                <div className="  rounded-xl p-0">
                  <div className="flex items-center gap-2 mb-6">
                    <User className="w-5 h-5 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            name="full_name"
                            placeholder="Enter full name"
                            value={form.full_name}
                            onChange={handleChange}
                            required
                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-900 placeholder-gray-400 transition-all"
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
                            name="phone_number"
                            placeholder="Enter phone number"
                            value={form.phone_number}
                            onChange={handleChange}
                            required
                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-900 placeholder-gray-400 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Alternate Phone</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            name="alternate_phone_number"
                            placeholder="Alternate number"
                            value={form.alternate_phone_number}
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-900 placeholder-gray-400 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Date of Birth</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="date"
                            name="date_of_birth"
                            value={form.date_of_birth}
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-900 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Gender</label>
                        <select
                          name="gender"
                          value={form.gender}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-900 transition-all"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Role</label>
                        <div className="relative">
                          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <select
                            name="role"
                            value={form.role}
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-900 transition-all appearance-none"
                          >
                            <option value="rider">Rider</option>
                            <option value="admin">Admin</option>
                            <option value="picker">Picker</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ADDRESS DETAILS */}
                <div className="  rounded-xl p-0">
                  <div className="flex items-center gap-2 mb-6">
                    <MapPin className="w-5 h-5 text-green-600" />
                    <h2 className="text-xl font-bold text-gray-900">Address Details</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">Complete Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          name="address"
                          placeholder="Enter complete address"
                          value={form.address}
                          onChange={handleChange}
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none text-gray-900 placeholder-gray-400 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">City</label>
                        <input
                          name="city"
                          placeholder="City"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none text-gray-900 placeholder-gray-400 transition-all"
                          value={form.city}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">State</label>
                        <input
                          name="state"
                          placeholder="State"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none text-gray-900 placeholder-gray-400 transition-all"
                          value={form.state}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Pincode</label>
                        <input
                          name="pincode"
                          placeholder="Pincode"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none text-gray-900 placeholder-gray-400 transition-all"
                          value={form.pincode}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Area / Locality</label>
                        <input
                          name="area_locality"
                          placeholder="Locality"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none text-gray-900 placeholder-gray-400 transition-all"
                          value={form.area_locality}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* VEHICLE DETAILS */}
                <div className="  rounded-xl p-0">
                  <div className="flex items-center gap-2 mb-6">
                    <Bike className="w-5 h-5 text-purple-600" />
                    <h2 className="text-xl font-bold text-gray-900">Vehicle Details</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Vehicle Type</label>
                        <div className="relative">
                          <Bike className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            name="vehicle_type"
                            placeholder="e.g., Bike, Scooter"
                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-gray-900 placeholder-gray-400 transition-all"
                            value={form.vehicle_type}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Vehicle Model</label>
                        <input
                          name="vehicle_model"
                          placeholder="Model"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-gray-900 placeholder-gray-400 transition-all"
                          value={form.vehicle_model}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Vehicle Number</label>
                        <input
                          name="vehicle_number"
                          placeholder="XX00XX0000"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-gray-900 placeholder-gray-400 transition-all"
                          value={form.vehicle_number}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Rider Type</label>
                        <select
                          name="rider_type"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-gray-900 transition-all"
                          value={form.rider_type}
                          onChange={handleChange}
                        >
                          <option value="">Select Type</option>
                          <option value="full-time">Full Time</option>
                          <option value="part-time">Part Time</option>
                        </select>
                      </div>

                      <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Working Shift</label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <select
                            name="working_shift"
                            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-gray-900 transition-all appearance-none"
                            value={form.working_shift}
                            onChange={handleChange}
                          >
                            <option value="">Select Shift</option>
                            <option value="day">Day Shift</option>
                            <option value="night">Night Shift</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* EMERGENCY CONTACT */}
                <div className=" rounded-xl p-0">
                  <div className="flex items-center gap-2 mb-6">
                    <Users className="w-5 h-5 text-orange-600" />
                    <h2 className="text-xl font-bold text-gray-900">Emergency Contact</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">Contact Name</label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          name="emergency_contact_name"
                          placeholder="Emergency contact name"
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-gray-900 placeholder-gray-400 transition-all"
                          value={form.emergency_contact_name}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-semibold text-gray-700">Contact Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          name="emergency_contact_number"
                          placeholder="Emergency contact number"
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none text-gray-900 placeholder-gray-400 transition-all"
                          value={form.emergency_contact_number}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button - Fixed at bottom */}
            <div className="px-6 py-6 sm:px-8 bg-gray-50 border-t border-gray-200">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-lg font-semibold flex justify-center items-center gap-3 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={22} />
                    Updating Partner Account...
                  </>
                ) : (
                  <>
                    <CheckCircle size={22} />
                    Update Partner Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}