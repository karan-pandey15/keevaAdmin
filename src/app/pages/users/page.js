"use client";

import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import { User, Mail, Phone, MapPin, Calendar, Eye, X } from "lucide-react";

const UserDetailsModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">User Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Full Name</label>
              <p className="text-lg font-medium text-gray-900">{user.name}</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">User ID</label>
              <p className="text-sm font-mono text-gray-600">{user._id}</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Email Address</label>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-500" />
                <p className="text-gray-900">{user.email}</p>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Phone Number</label>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-500" />
                <p className="text-gray-900">{user.phone}</p>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Role</label>
              <p className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 uppercase">
                {user.role}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500 uppercase">Account Created</label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-500" />
                <p className="text-gray-900">
                  {new Date(user.createdAt).toLocaleString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>

          <hr />

          {/* Addresses */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Saved Addresses</h3>
            {user.addresses && user.addresses.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {user.addresses.map((addr) => (
                  <div key={addr._id} className={`p-4 rounded-lg border ${addr.isDefault ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-gray-800">
                        {addr.label || addr.houseNo || 'Address'}
                        {addr.isDefault && <span className="ml-2 text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase">Default</span>}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {addr.houseNo}, {addr.street}, {addr.landmark && `${addr.landmark}, `}{addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    {addr.latitude && addr.longitude && (
                      <p className="text-xs text-gray-400 mt-2">
                        Coords: {addr.latitude}, {addr.longitude}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No addresses found for this user.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function UserDisplay() {
  const [users, setUsers] = useState([]);
  const [displayUsers, setDisplayUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

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
                Default Address
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                Joined
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {paginatedUsers.map((user) => {
              const defaultAddress = user.addresses?.find(a => a.isDefault) || user.addresses?.[0];
              return (
                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                  {/* User Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-400 font-mono">{user._id}</p>
                      </div>
                    </div>
                  </td>

                  {/* Contact */}
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm text-gray-600">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm text-gray-600">{user.phone}</span>
                      </div>
                    </div>
                  </td>

                  {/* Address */}
                  <td className="px-6 py-4 hidden lg:table-cell max-w-xs">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-600 line-clamp-2">
                        {defaultAddress 
                          ? `${defaultAddress.houseNo}, ${defaultAddress.street}, ${defaultAddress.city}`
                          : "No address saved"}
                      </span>
                    </div>
                  </td>

                  {/* Created Date */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span className="text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => setSelectedUser(user)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
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

      <UserDetailsModal 
        user={selectedUser} 
        onClose={() => setSelectedUser(null)} 
      />
    </div>
  );
}
