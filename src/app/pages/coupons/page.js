"use client"; 
import { useEffect, useState } from "react"; 
import { Tag, DollarSign, Calendar, Clock, User, Mail, Phone } from "lucide-react";
import api from "@/app/lib/api";

export default function ShowCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [displayCoupons, setDisplayCoupons] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await api.get("/admin/coupons");
        setCoupons(res.data.coupons || []);
        setDisplayCoupons(res.data.coupons || []);
      } catch (err) {
        console.error("Error fetching coupons:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  // Search Filter
  useEffect(() => {
    const filtered = coupons.filter(
      (c) =>
        c.code?.toLowerCase().includes(search.toLowerCase()) ||
        c.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.type?.toLowerCase().includes(search.toLowerCase())
    );
    setDisplayCoupons(filtered);
    setCurrentPage(1);
  }, [search, coupons]);

  // Pagination Logic
  const totalPages = Math.ceil(displayCoupons.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const paginatedCoupons = displayCoupons.slice(startIndex, startIndex + perPage);

  if (loading) return <div className="p-6 text-center">Loading coupons...</div>;

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold">Coupons</h1>
      <p className="text-gray-600 mt-1">List of all coupons</p>

      {/* Search + Per Page */}
      <div className="mt-6 mb-4 flex flex-col md:flex-row gap-4 md:items-center">
        <input
          type="text"
          placeholder="Search by code, type, user name, or email"
          className="w-full md:w-1/3 border rounded-lg px-4 py-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Select Page Size */}
        <select
          value={perPage}
          onChange={(e) => setPerPage(Number(e.target.value))}
          className="border rounded-lg px-4 py-2"
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
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                Code
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                Value
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase hidden lg:table-cell">
                User
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase hidden md:table-cell">
                Expires
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                Created
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {paginatedCoupons.map((coupon) => (
              <tr key={coupon._id} className="hover:bg-gray-50">
                {/* Code */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900">{coupon.code}</p>
                      <p className="text-xs text-gray-500">{coupon._id}</p>
                    </div>
                  </div>
                </td>

                {/* Type */}
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    coupon.type === 'FIXED' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {coupon.type}
                  </span>
                </td>

                {/* Value */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-gray-900">
                      {coupon.type === 'FIXED' ? `₹${coupon.value}` : `${coupon.value}%`}
                    </span>
                  </div>
                </td>

                {/* User */}
                <td className="px-6 py-4 hidden lg:table-cell">
                  {coupon.userId ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-indigo-500" />
                        <span className="text-sm font-medium">{coupon.userId.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-600">{coupon.userId.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-600">{coupon.userId.phone}</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">N/A</span>
                  )}
                </td>

                {/* Expires At */}
                <td className="px-6 py-4 hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-gray-700">
                      {new Date(coupon.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                </td>

                {/* Created At */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-700">
                      {new Date(coupon.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    coupon.isUsed 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {coupon.isUsed ? 'Used' : 'Active'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No Results */}
      {paginatedCoupons.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No coupons found.</p>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Previous
        </button>

        <p className="text-sm font-medium">
          Page {currentPage} of {totalPages || 1}
        </p>

        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}