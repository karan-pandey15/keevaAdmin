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

  const statusList = ['Pending', 'Accepted', 'Assigned', 'OutForDelivery', 'Delivered', 'Cancelled'];

  const getCountByStatus = (status) => orders.filter((o) => o.status === status).length;

  const getStatusColor = (status) => {
    switch(status) {
      case "Pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Accepted": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Assigned": return "bg-purple-100 text-purple-800 border-purple-200";
      case "OutForDelivery": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Delivered": return "bg-green-100 text-green-800 border-green-200";
      case "Cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "Pending": return <Clock className="w-4 h-4" />;
      case "Accepted": return <CheckCircle2 className="w-4 h-4" />;
      case "Assigned": return <User className="w-4 h-4" />;
      case "OutForDelivery": return <Package className="w-4 h-4" />;
      case "Delivered": return <CheckCircle2 className="w-4 h-4" />;
      case "Cancelled": return <XCircle className="w-4 h-4" />;
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
                <p className="text-3xl font-bold text-gray-900 mt-1">{getCountByStatus("Pending")}</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Delivered</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{getCountByStatus("Delivered")}</p>
              </div>
              <CheckCircle2 className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Cancelled</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{getCountByStatus("Cancelled")}</p>
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
              { label: "Pending", count: getCountByStatus("Pending"), icon: Clock, color: "yellow" },
              { label: "Accepted", count: getCountByStatus("Accepted"), icon: CheckCircle2, color: "blue" },
              { label: "Assigned", count: getCountByStatus("Assigned"), icon: User, color: "purple" },
              { label: "OutForDelivery", count: getCountByStatus("OutForDelivery"), icon: Package, color: "orange" },
              { label: "Delivered", count: getCountByStatus("Delivered"), icon: CheckCircle2, color: "green" },
              { label: "Cancelled", count: getCountByStatus("Cancelled"), icon: XCircle, color: "red" },
            ].map((btn) => {
              const Icon = btn.icon;
              const isActive = statusFilter === btn.label;
              const colorClasses = {
                indigo: isActive ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                yellow: isActive ? "bg-yellow-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                blue: isActive ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                purple: isActive ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                orange: isActive ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                green: isActive ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                red: isActive ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              };
              return (
                <button
                  key={btn.label}
                  onClick={() => setStatusFilter(btn.label)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-all ${
                    isActive ? "shadow-md scale-105" : ""
                  } ${colorClasses[btn.color]}`}
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
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] space-y-6">
              {/* Order Status & ID */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Order Status</p>
                  <span className={`mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusIcon(selectedOrder.status)}
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Ordered On</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Payment Status</p>
                  <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedOrder.payment?.status === 'Success' ? 'bg-green-100 text-green-800' : 
                    selectedOrder.payment?.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedOrder.payment?.status || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer & Address Info */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                    <User className="w-5 h-5 text-indigo-600" />
                    Customer Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{selectedOrder.address?.contactName}</p>
                        <p className="text-sm text-gray-500">{selectedOrder.address?.contactPhone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 pt-2">
                      <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Delivery Address ({selectedOrder.address?.label})</p>
                        <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                          {selectedOrder.address?.houseNo}, {selectedOrder.address?.street}<br />
                          {selectedOrder.address?.landmark && <span className="text-gray-500 italic">Near {selectedOrder.address.landmark}<br /></span>}
                          {selectedOrder.address?.city}, {selectedOrder.address?.state} - <span className="font-semibold">{selectedOrder.address?.pincode}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment & Delivery Info */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                    <BadgeIndianRupee className="w-5 h-5 text-indigo-600" />
                    Payment & Delivery
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Payment Method</p>
                        <p className="text-sm font-medium text-gray-900 mt-1 uppercase">{selectedOrder.payment?.method || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Delivery Type</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">{selectedOrder.delivery?.type || 'Standard'}</p>
                      </div>
                    </div>
                    
                    {selectedOrder.payment?.transactionId && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Transaction ID</p>
                        <p className="text-xs font-mono text-gray-600 mt-1 break-all bg-gray-50 p-2 rounded">{selectedOrder.payment.transactionId}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Expected Delivery</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-4 h-4 text-indigo-500" />
                        <p className="text-sm font-medium text-gray-900">
                          {selectedOrder.delivery?.expectedTime ? new Date(selectedOrder.delivery.expectedTime).toLocaleDateString() : 'TBD'}
                        </p>
                      </div>
                    </div>

                    {selectedOrder.delivery?.instructions && (
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <p className="text-xs text-blue-600 uppercase font-bold mb-1">Delivery Instructions</p>
                        <p className="text-sm text-blue-800 italic">"{selectedOrder.delivery.instructions}"</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                  <ShoppingCart className="w-5 h-5 text-indigo-600" />
                  Order Items ({selectedOrder.items?.length})
                </h3>
                <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="py-4 flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Unit Price: ₹{item.unitPrice} {item.discount > 0 && <span className="text-red-500 ml-1">(-₹{item.discount})</span>}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">₹{item.finalPrice * item.quantity}</p>
                        <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status History Timeline */}
              {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                    <Clock className="w-5 h-5 text-indigo-600" />
                    Order Timeline
                  </h3>
                  <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-100">
                    {selectedOrder.statusHistory.slice().reverse().map((history, idx) => (
                      <div key={idx} className="relative">
                        <div className={`absolute -left-[1.65rem] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          idx === 0 ? 'bg-indigo-600 scale-125 ring-4 ring-indigo-50' : 'bg-indigo-200'
                        }`}></div>
                        <div>
                          <p className={`text-sm font-bold ${idx === 0 ? 'text-indigo-600' : 'text-gray-700'}`}>{history.status}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{new Date(history.updatedAt).toLocaleString()}</p>
                          {history.updatedBy && (
                            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-tighter">Updated by {history.updatedBy.role}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Summary / Pricing */}
              <div className="bg-indigo-900 text-white rounded-xl p-6 shadow-lg">
                <div className="space-y-3">
                  <div className="flex justify-between text-indigo-200 text-sm">
                    <span>Subtotal</span>
                    <span className="font-medium text-white">₹{selectedOrder.pricing?.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-indigo-200 text-sm">
                    <span>Delivery Fee</span>
                    <span className="font-medium text-white">₹{selectedOrder.pricing?.deliveryFee}</span>
                  </div>
                  {selectedOrder.pricing?.couponDiscount > 0 && (
                    <div className="flex justify-between text-green-400 text-sm">
                      <span>Coupon Discount</span>
                      <span className="font-medium">-₹{selectedOrder.pricing?.couponDiscount}</span>
                    </div>
                  )}
                  {selectedOrder.pricing?.tax > 0 && (
                    <div className="flex justify-between text-indigo-200 text-sm">
                      <span>Tax (GST)</span>
                      <span className="font-medium text-white">₹{selectedOrder.pricing?.tax}</span>
                    </div>
                  )}
                  <div className="border-t border-indigo-800 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xl font-bold">Total Amount</p>
                        <p className="text-indigo-300 text-xs mt-1">Inclusive of all taxes</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-black text-white">₹{selectedOrder.pricing?.grandTotal}</p>
                      </div>
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