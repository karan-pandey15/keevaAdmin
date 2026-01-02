"use client";

import { useEffect, useState } from "react";
import { CreditCard, ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/app/lib/api";

 

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get("/admin/payments");
        setPayments(res.data.payments || []);
        setFilteredData(res.data.payments || []);
      } catch (err) {
        console.error("Error fetching payments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Apply Filters
  useEffect(() => {
    let filtered = [...payments];

    filtered = filtered.filter(
      (p) =>
        p.orderId.toLowerCase().includes(search.toLowerCase()) ||
        p.user?.phone?.includes(search) ||
        p.user?.name?.toLowerCase().includes(search.toLowerCase())
    );

    if (methodFilter !== "all") {
      filtered = filtered.filter(
        (p) => p.payment?.method?.toLowerCase() === methodFilter
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (p) => p.payment?.status?.toLowerCase() === statusFilter
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [search, methodFilter, statusFilter, payments]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12   "></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white" style={{ scrollBehavior: 'smooth' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Payments</h1>
        <p className="text-gray-600">Manage and track all payment records from user orders</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm  p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Order ID, Name, Phone..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Payment Method Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
            >
              <option value="all">All Methods</option>
              <option value="online">Online</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Status
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="done">Completed</option>
              <option value="pending">Pending</option>
              <option value="cancel">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="  text-sm text-gray-600">
        Showing {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of {filteredData.length} payments
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl    overflow-hidden">
        <div className="overflow-x-auto" style={{ scrollBehavior: 'smooth' }}>
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                  User Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                  Payment Method
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden xl:table-cell">
                  Transaction ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                  Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {currentData.map((payment, idx) => (
                <tr 
                  key={payment.orderId} 
                  className="hover:bg-gray-50 transition-all duration-200 ease-in-out"
                  style={{ 
                    animation: `fadeIn 0.3s ease-in-out ${idx * 0.05}s both`
                  }}
                >
                  {/* Order ID */}
                  <td className="px-6 py-4">
                    <p className="font-mono text-sm font-semibold text-indigo-600">
                      {payment.orderId}
                    </p>
                  </td>

                  {/* User */}
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {payment.user?.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{payment.user?.phone}</p>
                    </div>
                  </td>

                  {/* Method */}
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-indigo-100 rounded-lg">
                        <CreditCard className="w-4 h-4 text-indigo-600" />
                      </div>
                      <span className="text-sm capitalize font-medium text-gray-700">
                        {payment.payment?.method}
                      </span>
                    </div>
                  </td>

                  {/* Transaction ID */}
                  <td className="px-6 py-4 hidden xl:table-cell">
                    <p className="text-sm font-mono text-gray-600">
                      {payment.payment?.razorpayOrderId || "N/A"}
                    </p>
                  </td>

                  {/* Status Badge */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 text-xs font-bold rounded-full transition-all ${
                        payment.payment?.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700 shadow-md shadow-yellow-200"
                          : payment.payment?.status === "Done"
                          ? "bg-green-100 text-green-700 shadow-md shadow-green-200"
                          : "bg-red-100 text-red-700 shadow-md shadow-red-200"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        payment.payment?.status === "Pending"
                          ? "bg-yellow-500"
                          : payment.payment?.status === "Done"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}></span>
                      {payment.payment?.status === "Done" ? "Completed" : 
                       payment.payment?.status === "Pending" ? "Pending" : "Cancelled"}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">
                    {new Date(payment.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* No Results */}
      {filteredData.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl   mt-6">
          <div className="text-gray-400 mb-4">
            <CreditCard className="w-16 h-16 mx-auto" />
          </div>
          <p className="text-gray-600 text-lg font-medium">No payments found</p>
          <p className="text-gray-500 text-sm mt-1">Try adjusting your filters</p>
        </div>
      )}

      {/* Pagination */}
      {filteredData.length > 0 && (
        <div className="mt-6 flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-4">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="hidden sm:flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-2 rounded-lg font-medium transition-all ${
                        currentPage === page
                          ? "bg-indigo-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-2 text-gray-400">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-1 px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md"
              }`}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        * {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}