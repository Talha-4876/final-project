import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";

const PAGE_TITLES = {
  "/admin/dashboard":  { title: "Add Menu",         sub: "Create new dishes for your menu" },
  "/admin/list":       { title: "List Menu",         sub: "Manage all your menu items" },
  "/admin/table":      { title: "Reservations",      sub: "View and manage table bookings" },
  "/admin/deliveries": { title: "Deliveries",        sub: "Track all ongoing deliveries" },
  "/admin/reviews":    { title: "Customer Reviews",  sub: "Read what your guests are saying" },
  "/admin/inbox":      { title: "Messages Inbox",    sub: "Respond to customer messages" },
  "/admin/chefs":      { title: "Chefs",             sub: "Manage your kitchen staff" },
};

const DashboardLayout = ({ handleLogout }) => {
  const location = useLocation();
  const [notifOpen, setNotifOpen] = useState(false);

  // ✅ localStorage se real admin info lo
  const rawUser = JSON.parse(localStorage.getItem("adminUser")) || {};

  const adminUser = {
    name:  rawUser.name  || rawUser.email?.split("@")[0]
             ?.replace(/[._]/g, " ")
             ?.replace(/\b\w/g, (c) => c.toUpperCase())
           || "Admin",
    email: rawUser.email || "",
    role:  rawUser.role  || "Admin",
  };

  // ✅ "Ahmed Raza" → "AR"
  const getInitials = (name) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const page = PAGE_TITLES[location.pathname] || { title: "Dashboard", sub: "Welcome back" };

  const now = new Date().toLocaleDateString("en-PK", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="flex min-h-screen bg-[#0b0b0e] font-sans">

      <Sidebar handleLogout={handleLogout} />

      <div className="flex-1 flex flex-col min-w-0">

        {/* ── Topbar ── */}
        <header className="sticky top-0 z-50 flex items-center gap-4 px-8 h-16
          bg-[#0f0f12]/90 backdrop-blur-md border-b border-white/[0.07]">

          {/* Page title */}
          <div className="flex-1 min-w-0">
            <h1 className="text-[17px] font-bold text-neutral-100 leading-tight truncate">
              {page.title}
            </h1>
            <p className="text-[11px] text-neutral-600 truncate">{page.sub}</p>
          </div>

          {/* Date + welcome — real name */}
          <p className="hidden lg:block text-[11px] text-neutral-600 shrink-0">
            {now} &nbsp;·&nbsp;
            <span className="text-orange-400 font-medium">
              Welcome, {adminUser.name.split(" ")[0]} 👋
            </span>
          </p>

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-white/[0.04] border border-white/[0.07]
            rounded-xl px-3 py-2 w-52 focus-within:border-orange-400/40 transition-colors">
            <span className="text-neutral-600 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent outline-none text-[13px] text-neutral-300
                placeholder-neutral-600 w-full font-sans"
            />
          </div>

          {/* Notification bell */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative w-9 h-9 flex items-center justify-center rounded-xl
                bg-white/[0.04] border border-white/[0.07] text-neutral-400
                hover:border-orange-400/30 hover:text-orange-400 transition-all"
            >
              🔔
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full
                bg-red-500 border-2 border-[#0f0f12]" />
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-12 w-72 bg-[#16161b] border border-white/[0.08]
                rounded-2xl shadow-2xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-white/[0.07] flex items-center justify-between">
                  <p className="text-[13px] font-semibold text-neutral-200">Notifications</p>
                  <span className="text-[10px] text-orange-400 font-semibold">3 new</span>
                </div>
                {[
                  { icon: "🧾", text: "New order #1043 — Table 03", time: "2m ago"  },
                  { icon: "⭐", text: "New 5-star review received",  time: "15m ago" },
                  { icon: "📦", text: "Basmati rice stock is low",   time: "1h ago"  },
                ].map((n, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3
                    hover:bg-white/[0.03] cursor-pointer border-b border-white/[0.05] last:border-0">
                    <span className="text-lg mt-0.5">{n.icon}</span>
                    <div className="flex-1">
                      <p className="text-[12.5px] text-neutral-300">{n.text}</p>
                      <p className="text-[11px] text-neutral-600 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ✅ Real admin avatar — login ki email/name se */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-white/[0.07]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500
              flex items-center justify-center text-white text-xs font-bold shrink-0">
              {getInitials(adminUser.name)}
            </div>
            <div className="hidden sm:block">
              <p className="text-[12px] font-semibold text-neutral-200 leading-tight">
                {adminUser.name}
              </p>
              <p className="text-[10px] text-neutral-600">{adminUser.role}</p>
            </div>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="flex items-center gap-2 text-[11px] text-neutral-600 mb-6">
            <span>🏠</span>
            <span>/</span>
            <span className="text-orange-400 font-medium">{page.title}</span>
          </div>

          <div className="bg-[#0f0f12] border border-white/[0.07] rounded-2xl min-h-[60vh] p-6">
            <Outlet />
          </div>
        </main>

        {/* ── Footer ── */}
        <footer className="px-8 py-3 border-t border-white/[0.06] flex items-center
          justify-between text-[11px] text-neutral-700">
          <span>© 2026 Savoria Restaurant Management</span>
          <span>v1.0.0</span>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;