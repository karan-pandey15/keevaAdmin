"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import {
  LayoutDashboard,
  Users,
  UserCheck,
  Wrench,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CreditCard,
  Gift,
  MessageSquare,
  BarChart2,
  User ,
  Menu,
  X,
  DollarSign,
  UserCog,
  LogOut
} from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false); 
  const [partnerOpen, setPartnerOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const menuItems = [
    { path: "/pages/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/pages/users", icon: Users, label: "Users" },
  ];

  const partnerItems = [
    { path: "/pages/partners/all", label: "All Partners" },
    { path: "/pages/partners/register", label: "Register Partner" }, 
  ];
  
    const ProductsItems = [
  { path: "/pages/products", icon: BarChart2, label: "Add Products" },
    { path: "/pages/displayproducts", label: "All Products" }, 
  ];

  const moreMenu = [ 
    
    
    { path: "/pages/orders", icon: BarChart2, label: "Orders" },

    { path: "/pages/payments", icon: DollarSign, label: "Payments" },
    { path: "/pages/coupons", icon: Gift, label: "Coupons" },
    { path: "/pages/profile", icon: User , label: "Profile" },
  ];

 

  const isActive = (path) => pathname === path;
  const isServiceActive = pathname.startsWith("/pages/services");
  const isPartnerActive = pathname.startsWith("/pages/partners");
  const isProductsActive = pathname.startsWith("/pages/products") || pathname.startsWith("/pages/displayproducts");

  return (
    <>
      {/* Mobile Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-indigo-600 text-white rounded-lg shadow-lg"
      >
        {mobileOpen ? <X /> : <Menu />}
      </button>

      {/* Black overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div
   className={`
    fixed lg:sticky top-0
    min-h-full
    bg-gradient-to-b from-slate-900 to-slate-800
    shadow-xl transition-all duration-300
    flex flex-col z-40
    ${open ? "w-72" : "w-20"}
    ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
  `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-6 border-b border-slate-700">
          {open && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">H</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">Keeva</h1>
                <p className="text-slate-400 text-xs">Admin Panel</p>
              </div>
            </div>
          )}

          <button
            onClick={() => setOpen(!open)}
            className="hidden lg:block p-2 rounded-lg hover:bg-slate-700 text-slate-400"
          >
            {open ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>

        {/* MENU */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {/* Main Menu */}
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all 
                  ${isActive(item.path)
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-700/40"}
                `}
              >
                <Icon className={`${open ? "" : "mx-auto"}`} />
                {open && <span>{item.label}</span>}
              </Link>
            );
          })}

          {/* PARTNERS DROPDOWN */}
          <div>
            <button
              onClick={() => setPartnerOpen(!partnerOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl
                ${isPartnerActive ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-700/40"}
              `}
            >
              <div className="flex items-center gap-4">
                <UserCog className={`${open ? "" : "mx-auto"}`} />
                {open && <span>Partners</span>}
              </div>
              {open && (
                <ChevronDown className={`transition ${partnerOpen ? "rotate-180" : ""}`} />
              )}
            </button>

            {partnerOpen && open && (
              <div className="ml-6 mt-1 space-y-1 border-l border-slate-700 pl-3">
                {partnerItems.map((p) => (
                  <Link
                    key={p.path}
                    href={p.path}
                    className={`block px-3 py-2 rounded-lg text-sm
                      ${isActive(p.path)
                        ? "bg-indigo-600/30 text-indigo-300"
                        : "text-slate-400 hover:bg-slate-700/30"}
                    `}
                  >
                    {p.label}
                  </Link>
                ))}
              </div>
            )}
            
          </div>

          {/* PRODUCTS DROPDOWN */}
          <div>
            <button
              onClick={() => setProductsOpen(!productsOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl
                ${isProductsActive ? "bg-indigo-600 text-white" : "text-slate-300 hover:bg-slate-700/40"}
              `}
            >
              <div className="flex items-center gap-4">
                <BarChart2 className={`${open ? "" : "mx-auto"}`} />
                {open && <span>Products</span>}
              </div>
              {open && (
                <ChevronDown className={`transition ${productsOpen ? "rotate-180" : ""}`} />
              )}
            </button>

            {productsOpen && open && (
              <div className="ml-6 mt-1 space-y-1 border-l border-slate-700 pl-3">
                {ProductsItems.map((p) => (
                  <Link
                    key={p.path}
                    href={p.path}
                    className={`block px-3 py-2 rounded-lg text-sm
                      ${isActive(p.path)
                        ? "bg-indigo-600/30 text-indigo-300"
                        : "text-slate-400 hover:bg-slate-700/30"}
                    `}
                  >
                    {p.label}
                  </Link>
                ))}
              </div>
            )}
            
          </div>

          {/* More Menu */}
          {moreMenu.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all 
                  ${isActive(item.path)
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-700/40"}
                `}
              >
                <Icon className={`${open ? "" : "mx-auto"}`} />
                {open && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 space-y-2">
          {open && (
            <div className="mb-4">
              <p className="text-white font-medium text-sm">Need Help?</p>
              <p className="text-slate-400 text-xs">Contact Support</p>
            </div>
          )}
          <button
            onClick={() => setShowLogoutModal(true)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-red-400 hover:bg-red-500/10 group`}
          >
            <LogOut size={22} className={`${open ? "" : "mx-auto"}`} />
            {open && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 overflow-hidden"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                  <LogOut className="text-red-500" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Confirm Logout</h3>
                <p className="text-slate-400 mb-8">
                  Are you sure you want to logout? You will need to login again to access your account.
                </p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-800 text-slate-300 font-medium hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
