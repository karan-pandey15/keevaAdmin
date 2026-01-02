"use client";

import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import { User, Mail, Phone, MapPin, Calendar } from "lucide-react";

export default function UserDisplay() {
  const [users, setUsers] = useState([]);
  const [displayUsers, setDisplayUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data.users || []);
        setDisplayUsers(res.data.users || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Search Filter
  useEffect(() => {
    const filtered = users.filter(
      (u) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.phone?.includes(search)
    );
    setDisplayUsers(filtered);
    setCurrentPage(1);
  }, [search, users]);

  // Pagination Logic
  const totalPages = Math.ceil(displayUsers.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const paginatedUsers = displayUsers.slice(startIndex, startIndex + perPage);

  if (loading) return <div className="p-6 text-center">Loading users...</div>;

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl font-bold">Users</h1>
      <p className="text-gray-600 mt-1">List of all registered users</p>

      {/* Search + Per Page */}
      <div className="mt-6 mb-4 flex flex-col md:flex-row gap-4 md:items-center">
        <input
          type="text"
          placeholder="Search by name, email, or phone"
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
                User
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase hidden md:table-cell">
                Contact
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase hidden lg:table-cell">
                Address
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                Joined
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {paginatedUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                {/* User Name */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user._id}</p>
                    </div>
                  </div>
                </td>

                {/* Contact */}
                <td className="px-6 py-4 hidden md:table-cell">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-indigo-500" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{user.phone}</span>
                    </div>
                  </div>
                </td>

                {/* Address */}
                <td className="px-6 py-4 hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-700">
                      {user.address || "N/A"}
                    </span>
                  </div>
                </td>

                {/* Created Date */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-700">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No Results */}
      {paginatedUsers.length === 0 && (
        <p className="text-center text-gray-500 mt-6">No users found.</p>
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
