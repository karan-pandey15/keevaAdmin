"use client";
import { useState } from "react"; 
import { 
  Upload, 
  Plus, 
  Loader2, 
  Home, 
  Sparkles, 
  Users, 
  Calendar,
  Clock,
  IndianRupee,
  FileText,
  Tag,
  Camera,
  X
} from "lucide-react"; 
import api from "@/app/lib/api";

// Toast Component
const Toast = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  
  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in z-50`}>
      <span>{message}</span>
      <button onClick={onClose} className="hover:bg-white hover:bg-opacity-20 rounded p-1">
        <X size={16} />
      </button>
    </div>
  );
}; 
export default function CreateService() {
  const [form, setForm] = useState({
    id: `SRV-${Date.now()}`,
    servicename: "",
    description: "",
    category: "",
    price_mrp: "",
    price_selling: "",
    status: true,
    date: "",
    time: "",
    start_time: "",
    end_time: "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const categories = [
    { value: "home-cleaning", label: "Home Cleaning", icon: Home },
    { value: "pandit-ji-booking", label: "Pandit Ji Booking", icon: Users },
    { value: "deep-cleaning", label: "Deep Cleaning", icon: Sparkles },
  ];

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ 
      ...form, 
      [name]: type === "checkbox" ? checked : value 
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      showToast("Max 5 images allowed", "error");
      return;
    }
    setImages(files);
    showToast(`${files.length} image(s) selected`, "success");
  };

  const removeImage = (idx) => {
    setImages(images.filter((_, i) => i !== idx));
    showToast("Image removed", "info");
  };

  const handleSubmit = async () => {
    try {
      // Validation
      if (!form.servicename || !form.description || !form.category || !form.price_mrp || !form.price_selling) {
        showToast("Please fill all required fields", "error");
        return;
      }

      setLoading(true);
      const fd = new FormData();
  
      // Append basic fields
      fd.append("id", form.id);
      fd.append("servicename", form.servicename);
      fd.append("description", form.description);
      fd.append("category", form.category);
      fd.append("status", form.status ? "active" : "inactive");
      fd.append("date", form.date);
      fd.append("time", form.time); 

      // Calculate and append price object
      const mrp = Number(form.price_mrp);
      const selling = Number(form.price_selling);
      const discount = mrp > 0 ? ((mrp - selling) / mrp) * 100 : 0;

      const price = {
        mrp: mrp,
        selling_price: selling,
        discount_percent: Math.round(discount * 100) / 100,
      };

      fd.append("price", JSON.stringify(price));

      // Append images
      images.forEach((img) => fd.append("files", img));

      // Make API call
      const response = await api.post("/services", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("Service created successfully!", "success");
      console.log("Service created:", response.data);

      // Reset form
      setForm({
        id: `SRV-${Date.now()}`,
        servicename: "",
        description: "",
        category: "",
        price_mrp: "",
        price_selling: "",
        status: true,
        date: "",
        time: "",
        start_time: "",
        end_time: "",
      });
      setImages([]);

    } catch (err) {
      console.error("Error:", err);
      showToast(err.response?.data?.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  const discount = form.price_mrp && form.price_selling 
    ? Math.round(((form.price_mrp - form.price_selling) / form.price_mrp) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-blue-600 p-3 rounded-lg">
            <Plus className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Create New Service</h1>
            <p className="text-gray-500 text-sm">Fill in the details below to add a new service</p>
          </div>
        </div>

        {/* Service ID Display */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-600">Service ID: <span className="font-mono font-semibold text-blue-600">{form.id}</span></p>
        </div>

        {/* Basic Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <FileText size={20} className="text-blue-600" />
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name *
              </label>
              <input
                type="text"
                name="servicename"
                placeholder="e.g., Premium Home Cleaning"
                value={form.servicename}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Tag size={16} />
                Category *
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Date
              </label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              placeholder="Describe the service in detail..."
              value={form.description}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <IndianRupee size={20} className="text-green-600" />
            Pricing
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                MRP (₹) *
              </label>
              <input
                type="number"
                name="price_mrp"
                placeholder="1000"
                value={form.price_mrp}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                name="price_selling"
                placeholder="800"
                value={form.price_selling}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discount
              </label>
              <div className="border border-gray-300 p-3 rounded-lg bg-gray-50">
                <span className="text-2xl font-bold text-green-600">{discount}%</span>
                <span className="text-sm text-gray-600 ml-2">off</span>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule & Availability */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Clock size={20} className="text-purple-600" />
            Schedule & Availability
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Time
              </label>
              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Clock size={14} />
                Availability Start
              </label>
              <input
                type="time"
                name="start_time"
                value={form.start_time}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Clock size={14} />
                Availability End
              </label>
              <input
                type="time"
                name="end_time"
                value={form.end_time}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Camera size={20} className="text-pink-600" />
            Service Images
          </h2>
          
          <label className="flex items-center justify-center gap-3 cursor-pointer w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <Upload className="text-gray-400" size={24} />
            <div className="text-center">
              <span className="text-gray-600 font-medium">Upload Images</span>
              <p className="text-sm text-gray-400">Maximum 5 images</p>
            </div>
            <input 
              type="file" 
              multiple 
              accept="image/*"
              className="hidden" 
              onChange={handleFileChange} 
            />
          </label>

          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Status</h2>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="status"
                checked={form.status}
                onChange={handleChange}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="font-medium text-gray-700">
                Service is {form.status ? "Active" : "Inactive"}
              </span>
            </label>
            <div className={`ml-auto px-4 py-2 rounded-full text-sm font-semibold ${
              form.status 
                ? "bg-green-100 text-green-700" 
                : "bg-red-100 text-red-700"
            }`}>
              {form.status ? "✓ Active" : "✕ Inactive"}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-lg font-semibold flex items-center justify-center gap-3 hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Creating Service...
              </>
            ) : (
              <>
                <Plus size={20} />
                Create Service
              </>
            )}
          </button>
        </div>

        {/* Info Note */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Fields marked with * are required. Date added and last updated timestamps will be automatically generated by the backend.
          </p>
        </div>
      </div>

      <style jsx>{`
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
    </div>
  );
}