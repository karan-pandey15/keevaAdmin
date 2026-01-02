 "use client"
import React, { useState, useEffect } from "react";
import {
  Users,
  ShoppingCart,
  Handshake,

  CreditCard,
  Ticket,
  Briefcase,
  TrendingUp,
  Activity,
  ArrowUp,
  ArrowDown,
} from "lucide-react"; 
export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    partners: 0,
    payments: 0,
    coupons: 0, 
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
 

     
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    try {
      const endpoints = [
        { url: "/admin/users", key: "users" },
        { url: "/admin/orders", key: "orders" },
        { url: "/admin/partners", key: "partners" },
        { url: "/admin/payments", key: "payments" },
        { url: "/admin/coupons", key: "coupons" }, 
      ];

      const responses = await Promise.all(
        endpoints.map((e) =>
          fetch(`https://api.keeva.in${e.url}`, { headers }).then((res) =>
            res.json()
          )
        )
      );

      const newStats = {
        users: responses[0]?.users?.length || 0,
        orders: responses[1]?.orders?.length || 0,
        partners: responses[2]?.partners?.length || 0,
        payments: responses[3]?.payments?.length || 0,
        coupons: responses[4]?.coupons?.length || 0, 
      };

      setStats(newStats);
    } catch (err) {
      console.error("Stats fetch error:", err);
    }

    setLoading(false); 
  };

  const MiniChart = ({ color, data }) => {
    const points = data.map((val, idx) => `${idx * 20},${60 - val}`).join(" ");
    
    return (
      <svg className="w-full h-full" viewBox="0 0 100 60" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: 'white', stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: 'white', stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        <polyline
          fill={`url(#grad-${color})`}
          stroke="white"
          strokeWidth="2"
          points={`0,60 ${points} 100,60`}
        />
        <polyline
          fill="none"
          stroke="white"
          strokeWidth="2"
          points={points}
        />
      </svg>
    );
  };
 
 

  const cards = [
    {
      id: "users",
      title: "Total Users",
      count: stats.users,
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      change: "+12.5%",
      isPositive: true,
      chartData: [45, 52, 48, 60, 55, 58],
    },
    {
      id: "orders",
      title: "Orders",
      count: stats.orders,
      icon: ShoppingCart,
      gradient: "from-rose-500 to-rose-600",
      change: "+8.2%",
      isPositive: true,
      chartData: [35, 42, 38, 45, 48, 52],
    },
    {
      id: "partners",
      title: "Partners",
      count: stats.partners,
      icon: Handshake,
      gradient: "from-amber-500 to-amber-600",
      change: "+5.1%",
      isPositive: true,
      chartData: [25, 28, 32, 30, 35, 38],
    },
    {
      id: "payments",
      title: "Payments",
      count: stats.payments,
      icon: CreditCard,
      gradient: "from-teal-500 to-teal-600",
      change: "+18.3%",
      isPositive: true,
      chartData: [55, 58, 52, 60, 65, 68],
    },
    {
      id: "coupons",
      title: "Coupons",
      count: stats.coupons,
      icon: Ticket,
      gradient: "from-purple-500 to-purple-600",
      change: "-2.4%",
      isPositive: false,
      chartData: [40, 38, 35, 32, 30, 28],
    },   
  ];

  const handleCardClick = (card) => {
    if (card.id === "users") window.location.href = "/pages/users";
    if (card.id === "orders") window.location.href = "/pages/orders";
    if (card.id === "partners") window.location.href = "/pages/partners/all";
    if (card.id === "payments") window.location.href = "/pages/payments";
    if (card.id === "coupons") window.location.href = "/pages/coupons";
    if (card.id === "services") window.location.href = "/pages/service/getservice";
  };

  const weeklyData = [
    { label: "Mon", value: 120 },
    { label: "Tue", value: 150 },
    { label: "Wed", value: 180 },
    { label: "Thu", value: 140 },
    { label: "Fri", value: 200 },
    { label: "Sat", value: 170 },
    { label: "Sun", value: 190 },
  ];

  const trendData = [
    { label: "Jan", value: 300 },
    { label: "Feb", value: 350 },
    { label: "Mar", value: 400 },
    { label: "Apr", value: 380 },
    { label: "May", value: 450 },
    { label: "Jun", value: 500 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 p-3 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">Welcome back! Here's what's happening today.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 text-sm">Loading dashboard...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
            {cards.map((card, index) => {
              const Icon = card.icon;
              const TrendIcon = card.isPositive ? ArrowUp : ArrowDown;
              
              return (
                <div
                  key={index}
                  onClick={() => handleCardClick(card)}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1 border border-gray-100"
                >
                  {/* Gradient Header */}
                  <div className={`bg-gradient-to-br ${card.gradient} p-4 sm:p-5 relative`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-white/90 text-xs sm:text-sm font-medium mb-1">{card.title}</p>
                        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                          {card.count.toLocaleString()}
                        </h3>
                        <div className="flex items-center gap-1">
                          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${
                            card.isPositive ? 'bg-green-400/30' : 'bg-red-400/30'
                          }`}>
                            <TrendIcon className="w-3 h-3 text-white" />
                            <span className="text-xs font-semibold text-white">
                              {card.change}
                            </span>
                          </div>
                          <span className="text-white/70 text-xs ml-1">this week</span>
                        </div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm p-2.5 sm:p-3 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                    </div>

                    {/* Mini Chart */}
                    <div className="h-12 sm:h-14 w-full">
                      <MiniChart color={index} data={card.chartData} />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100">
                    <p className="text-xs text-gray-600 text-center">Click to view details</p>
                  </div>
                </div>
              );
            })}
          </div>

      
        </>
      )}
    </div>
  );
}