"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";
import api from "@/app/lib/api";

import {
  User, Phone, MapPin, Calendar, BadgeIndianRupee, Receipt, 
  ShoppingCart, Filter, Search, Package, Clock, CheckCircle2, 
  XCircle, Eye, ChevronLeft, ChevronRight, X
} from "lucide-react";

let socket;

export default function OrdersDisplay() {
  const [orders, setOrders] = useState([]);
  const [displayOrders, setDisplayOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [selectedOrder, setSelectedOrder] = useState(null);

  // ⬇️ INITIALIZE SOCKET AND FETCH ORDERS
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    socket = io(process.env.NEXT_PUBLIC_API_URL, {
      auth: {
        token: token
      }
    });

    socket.on('connect', () => {
      console.log('✅ Connected to socket:', socket.id);
    });

    socket.on('orders:init', (ordersData) => {
      console.log('📦 Received initial orders:', ordersData);
      setOrders(ordersData);
      setDisplayOrders(ordersData);
      setLoading(false);
    });

    socket.on('orders:new', (newOrderData) => {
      console.log('🆕 New order received:', newOrderData);
      setOrders((prev) => [newOrderData, ...prev]);
    });

    socket.on('orders:status', (statusUpdate) => {
      console.log('📊 Order status updated:', statusUpdate);
      setOrders((prev) =>
        prev.map((order) =>
          order.orderId === statusUpdate.orderId
            ? { ...order, status: statusUpdate.status }
            : order
        )
      );
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from socket');
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  // ⬇️ FILTERING
  useEffect(() => {
    let filtered = [...orders];

    if (statusFilter !== "All") {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }

    filtered = filtered.filter(
      (o) =>
        o.orderId?.toLowerCase().includes(search.toLowerCase()) ||
        o.address?.contactName?.toLowerCase().includes(search.toLowerCase()) ||
        o.address?.contactPhone?.includes(search)
    );

    setDisplayOrders(filtered);
    setCurrentPage(1);
  }, [search, statusFilter, orders]);

  // PAGINATION
  const totalPages = Math.ceil(displayOrders.length / perPage);
  const start = (currentPage - 1) * perPage;
  const paginatedOrders = displayOrders.slice(start, start + perPage);

  const countPending = orders.filter((o) => o.status === "Pending").length;
  const countDelivered = orders.filter((o) => o.status === "Delivered").length;
  const countCanceled = orders.filter((o) => o.status === "Canceled").length;

  const getStatusColor = (status) => {
    switch(status) {
      case "Pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Delivered": return "bg-green-100 text-green-800 border-green-200";
      case "Canceled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "Pending": return <Clock className="w-4 h-4" />;
      case "Delivered": return <CheckCircle2 className="w-4 h-4" />;
      case "Canceled": return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 animate-pulse text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="p-4 md:p-8">
        {/* HEADER */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          </div>
          <p className="text-gray-600 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Live, real-time order updates
          </p>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{orders.length}</p>
              </div>
              <ShoppingCart className="w-12 h-12 text-indigo-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{countPending}</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Delivered</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{countDelivered}</p>
              </div>
              <CheckCircle2 className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Canceled</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{countCanceled}</p>
              </div>
              <XCircle className="w-12 h-12 text-red-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* FILTERS AND SEARCH */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                className="w-full border border-gray-300 pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Search Order ID, Name or Phone"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              value={perPage}
              onChange={(e) => setPerPage(Number(e.target.value))}
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>

          {/* STATUS FILTER BUTTONS */}
          <div className="flex gap-3 flex-wrap">
            {[
              { label: "All", count: orders.length, icon: ShoppingCart, color: "indigo" },
              { label: "Pending", count: countPending, icon: Clock, color: "yellow" },
              { label: "Delivered", count: countDelivered, icon: CheckCircle2, color: "green" },
              { label: "Canceled", count: countCanceled, icon: XCircle, color: "red" },
            ].map((btn) => {
              const Icon = btn.icon;
              const isActive = statusFilter === btn.label;
              return (
                <button
                  key={btn.label}
                  onClick={() => setStatusFilter(btn.label)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
                    isActive
                      ? `bg-${btn.color}-600 text-white shadow-md scale-105`
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {btn.label} <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${isActive ? 'bg-white/20' : 'bg-gray-200'}`}>{btn.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ORDERS TABLE */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Order ID</th>
                  <th className="px-6 py-4 text-left font-semibold">Customer</th>
                  <th className="px-6 py-4 text-left font-semibold hidden lg:table-cell">Items</th>
                  <th className="px-6 py-4 text-left font-semibold">Total</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-center font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {paginatedOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-indigo-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-gray-400" />
                        <span className="font-mono text-sm font-medium text-gray-900">
                          {order.orderId}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {order.address?.contactName || "N/A"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="space-y-1">
                        {order.items?.slice(0, 2).map((i, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                            <ShoppingCart className="w-3 h-3" />
                            <span>{i.name} × {i.quantity}</span>
                          </div>
                        ))}
                        {order.items?.length > 2 && (
                          <span className="text-xs text-indigo-600 font-medium">
                            +{order.items.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <BadgeIndianRupee className="w-4 h-4 text-green-600" />
                        <span className="font-bold text-gray-900">
                          ₹{order.pricing?.grandTotal || 0}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {paginatedOrders.length === 0 && (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No orders found</p>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
              </div>
            )}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between bg-gray-50">
              <button
                disabled={currentPage === 1}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Page <span className="font-semibold text-gray-900">{currentPage}</span> of <span className="font-semibold text-gray-900">{totalPages}</span>
                </span>
              </div>

              <button
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Receipt className="w-6 h-6" />
                <div>
                  <h2 className="text-xl font-bold">Order Details</h2>
                  <p className="text-indigo-100 text-sm">#{selectedOrder.orderId}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-xl p-5 mb-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-600" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{selectedOrder.address?.contactName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{selectedOrder.address?.contactPhone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-700 md:col-span-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span className="text-sm">
                      {selectedOrder.address?.houseNo}, {selectedOrder.address?.area}, {selectedOrder.address?.city}, {selectedOrder.address?.state} - {selectedOrder.address?.pincode}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-gray-50 rounded-xl p-5 mb-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-indigo-600" />
                  Order Items
                </h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <BadgeIndianRupee className="w-5 h-5 text-indigo-600" />
                  Pricing Details
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span>₹{selectedOrder.pricing?.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Delivery Fee:</span>
                    <span>₹{selectedOrder.pricing?.deliveryFee}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax:</span>
                    <span>₹{selectedOrder.pricing?.tax}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2 mt-2">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Grand Total:</span>
                      <span className="text-green-600">₹{selectedOrder.pricing?.grandTotal}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}