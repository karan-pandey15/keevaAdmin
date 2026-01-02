"use client"; 
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/lib/api";
import {
  User,
  Phone,
  MapPin, 
  Star,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Calendar,
  Pencil,
  Trash2,
  BadgeCheck,
  AlertCircle,
  Car,
} from "lucide-react";

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

export default function PartnerDisplay() {
  const router = useRouter();
  const [partners, setPartners] = useState([]);
  const [displayPartners, setDisplayPartners] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toast, setToast] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await api.get("/admin/partners");
        setPartners(res.data.partners || []);
        setDisplayPartners(res.data.partners || []);
      } catch (err) {
        console.error("Error fetching partners:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  // Search & Filter Logic
  useEffect(() => {
    let temp = [...partners];

    temp = temp.filter(
      (p) =>
        p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        p.phone_number?.includes(search) ||
        p.city?.toLowerCase().includes(search.toLowerCase())
    );

    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      temp = temp.filter((p) => p.is_active === isActive);
    }

    setDisplayPartners(temp);
    setCurrentPage(1);
  }, [search, statusFilter, partners]);

  // Pagination Logic
  const totalPages = Math.ceil(displayPartners.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const paginatedPartners = displayPartners.slice(
    startIndex,
    startIndex + perPage
  );

  const handleDelete = async (id) => {
    try {
      await api.delete(`/partner/${id}`);
      setPartners((prev) => prev.filter((u) => u._id !== id));
      showToast("Partner deleted successfully!", "success");
    } catch (err) {
      console.error("Delete failed:", err);
      showToast("Failed to delete partner", "error");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading partners...</div>;

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

      <div className="p-6 bg-white min-h-screen">
        <h1 className="text-3xl font-bold">Partners</h1>
        <p className="text-gray-600 mt-1">List of all verified partners</p>

      {/* Search + Filters + Per Page */}
      <div className="mt-6 mb-4 flex flex-col md:flex-row gap-4 md:items-center">

        {/* Search */}
        <div className="flex items-center border px-4 py-2 w-full md:w-1/3">
          <Search className="w-5 h-5 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search by name, phone, or city"
            className="w-full outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter */}
        <div className="flex items-center border px-4 py-2">
          <Filter className="w-5 h-5 text-gray-600 mr-2" />
          <select
            className="bg-transparent outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Partners</option>
            <option value="active">Active</option>
            <option value="inactive">Not Active</option>
          </select>
        </div>

        {/* Per Page */}
        <select
          value={perPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
          className="border px-4 py-2"
        >
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                Partner
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase hidden md:table-cell">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase hidden lg:table-cell">
                Vehicle
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                Rating
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                Joined
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {paginatedPartners.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50">
                
                {/* Partner */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium">{p.full_name}</p>
                      <p className="text-xs text-gray-500">{p._id}</p>
                    </div>
                  </div>
                </td>

                {/* Contact */}
                <td className="px-6 py-4 hidden md:table-cell">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{p.phone_number}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-red-500" />
                      <span className="text-sm">{p.city}</span>
                    </div>
                  </div>
                </td>

                {/* Vehicle */}
                <td className="px-6 py-4 hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-gray-700" />
                    <span className="text-sm">
                      {p.vehicle_type || "No Vehicle"} — {p.vehicle_model}
                    </span>
                  </div>
                </td>

                {/* Role */}
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1 text-sm text-gray-700">
                    <BadgeCheck className="w-4 h-4 text-indigo-600" />
                    {p.role}
                  </span>
                </td>

                {/* Rating */}
                <td className="px-6 py-4"> 
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 text-yellow-500" />
                    {p.average_rating || 0}
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  {p.is_active ? (
                    <span className="flex items-center gap-1 text-green-600 text-sm">
                      <CheckCircle className="w-4 h-4" /> Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-600 text-sm">
                      <XCircle className="w-4 h-4" /> Not Active
                    </span>
                  )}
                </td>

                {/* Joined */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <span className="text-sm">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </td>

                {/* Action */}
                <td className="px-6 py-4">
                  <div className="flex gap-4">
                    <Pencil
                      className="w-5 h-5 text-blue-600 cursor-pointer"
                      onClick={() => router.push(`/partners/id/${p._id}`)}
                    />
                    <Trash2
                      className="w-5 h-5 text-red-600 cursor-pointer"
                      onClick={() => handleDelete(p._id)}
                    />
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No Results */}
      {paginatedPartners.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No partners found.</p>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          className="px-4 py-2 bg-gray-200 disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Previous
        </button>

        <p className="text-sm font-medium">
          Page {currentPage} of {totalPages || 1}
        </p>

        <button
          className="px-4 py-2 bg-gray-200 disabled:opacity-50"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
    </>
  );
}
