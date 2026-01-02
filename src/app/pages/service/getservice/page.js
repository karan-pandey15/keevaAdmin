"use client";
import { useState, useEffect } from "react";
import {
  Trash2,
  Edit,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Package,
  Calendar,
  Clock,
  IndianRupee,
  Tag,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertCircle
} from "lucide-react";

const Toast = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  
  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in z-50`}>
      <span>{message}</span>
      <button onClick={onClose} className="hover:bg-white hover:bg-opacity-20 rounded p-1">
        ✕
      </button>
    </div>
  );
};

export default function ServicesTable() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [toast, setToast] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [error, setError] = useState(null);

  const itemsPerPage = 10;

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchServices = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`https://api.keeva.in/services`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.ok) {
        setServices(data.services);
        setPagination(data.pagination);
        setCurrentPage(page);
        showToast(`Loaded ${data.services.length} services`, 'success');
      } else {
        throw new Error('Failed to fetch services');
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setError(error.message);
      showToast("Failed to fetch services. Please check if the server is running.", "error");
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(1);
  }, []);

  const handleDelete = async (id, serviceName) => {
    
    try {
      setDeleteLoading(id);
      
      const response = await fetch(`https://api.keeva.in/services`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete service');
      }

      showToast("Service deleted successfully", "success");
      fetchServices(currentPage);
    } catch (error) {
      console.error("Error deleting service:", error);
      showToast(error.message || "Failed to delete service", "error");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEdit = (service) => {
    console.log("Edit service:", service);
    showToast("Edit functionality - Redirect to edit page", "info");
  };

  const handleView = (service) => {
    console.log("View service:", service);
    showToast("View details", "info");
  };

  const filteredServices = services.filter((service) =>
    service.servicename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getCategoryBadge = (category) => {
    const colors = {
      "home-cleaning": "bg-blue-100 text-blue-700",
      "pandit-ji-booking": "bg-purple-100 text-purple-700",
      "deep-cleaning": "bg-green-100 text-green-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  const formatCategoryName = (category) => {
    return category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Package className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Services Management</h1>
                <p className="text-gray-500 text-sm">Manage all your services from https://api.keeva.in</p>
              </div>
            </div>
            
            <button
              onClick={() => fetchServices(currentPage)}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by service name, category, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Stats */}
          {pagination && (
            <div className="mt-4 flex gap-4 text-sm flex-wrap">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-gray-600">Total Services: </span>
                <span className="font-bold text-blue-600">{pagination.totalServices}</span>
              </div>
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <span className="text-gray-600">Active: </span>
                <span className="font-bold text-green-600">
                  {services.filter(s => s.status === 'active').length}
                </span>
              </div>
              <div className="bg-red-50 px-4 py-2 rounded-lg">
                <span className="text-gray-600">Inactive: </span>
                <span className="font-bold text-red-600">
                  {services.filter(s => s.status === 'inactive').length}
                </span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-red-800 font-semibold">Error Loading Services</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
                <p className="text-red-600 text-sm mt-1">Make sure your server is running on https://api.keeva.in</p>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
              <p className="text-gray-600">Loading services from API...</p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-20">
              <Package className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-500 text-lg">No services found</p>
              {searchTerm && (
                <p className="text-gray-400 text-sm mt-2">Try adjusting your search</p>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Service ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Service Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Discount</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Time</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredServices.map((service, index) => (
                      <tr
                        key={service._id}
                        className={`hover:bg-blue-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {service.id}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Package size={16} className="text-blue-600" />
                            <div>
                              <span className="font-medium text-gray-800 block">
                                {service.servicename}
                              </span>
                              <span className="text-xs text-gray-500">
                                {service.description?.substring(0, 40)}...
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryBadge(service.category)}`}>
                            <Tag size={12} className="inline mr-1" />
                            {formatCategoryName(service.category)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-gray-500 text-xs line-through">
                              ₹{service.price.mrp}
                            </span>
                            <span className="text-green-600 font-bold flex items-center">
                              <IndianRupee size={14} />
                              {service.price.selling_price}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                            {service.price.discount_percent.toFixed(1)}% OFF
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar size={14} />
                            {formatDate(service.date)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Clock size={14} />
                            {service.time}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {service.status === 'active' ? (
                            <span className="flex items-center gap-1 text-green-600 font-semibold">
                              <CheckCircle size={16} />
                              Active
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-600 font-semibold">
                              <XCircle size={16} />
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleView(service)}
                              className="p-2 hover:bg-blue-100 rounded-lg transition-colors group"
                              title="View Details"
                            >
                              <Eye size={18} className="text-blue-600 group-hover:scale-110 transition-transform" />
                            </button>
                            <button
                              onClick={() => handleEdit(service)}
                              className="p-2 hover:bg-green-100 rounded-lg transition-colors group"
                              title="Edit Service"
                            >
                              <Edit size={18} className="text-green-600 group-hover:scale-110 transition-transform" />
                            </button>
                            <button
                              onClick={() => handleDelete(service._id, service.servicename)}
                              disabled={deleteLoading === service._id}
                              className="p-2 hover:bg-red-100 rounded-lg transition-colors group disabled:opacity-50"
                              title="Delete Service"
                            >
                              {deleteLoading === service._id ? (
                                <Loader2 size={18} className="text-red-600 animate-spin" />
                              ) : (
                                <Trash2 size={18} className="text-red-600 group-hover:scale-110 transition-transform" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
                  <div className="text-sm text-gray-600">
                    Page {pagination.currentPage} of {pagination.totalPages} • Total: {pagination.totalServices} services
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => fetchServices(currentPage - 1)}
                      disabled={!pagination.hasPrev || loading}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                    >
                      <ChevronLeft size={18} />
                      Previous
                    </button>
                    
                    <div className="flex gap-1">
                      {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => fetchServices(pageNum)}
                            disabled={loading}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                              currentPage === pageNum
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => fetchServices(currentPage + 1)}
                      disabled={!pagination.hasNext || loading}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                    >
                      Next
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
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