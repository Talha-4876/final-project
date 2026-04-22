import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NAV_GROUPS = [
  {
    label: "Operations",
    items: [
      { path: "/admin/dashboard",  label: "Add Menu",         icon: "🍔", badge: null },
      { path: "/admin/list",       label: "List Menu",        icon: "📋", badge: null },
      { path: "/admin/table",      label: "Reservations",     icon: "📅", badge: 3    },
      { path: "/admin/deliveries", label: "Deliveries",       icon: "🚚", badge: 7    },
    ],
  },
  {
    label: "People",
    items: [
      { path: "/admin/reviews",    label: "Customer Reviews", icon: "⭐", badge: null },
      { path: "/admin/inbox",      label: "Messages Inbox",   icon: "📩", badge: 12   },
      { path: "/admin/chefs",      label: "Chefs",            icon: "👨‍🍳", badge: null },
    ],
  },
];

const MenuItem = ({ path, label, icon, badge, isActive, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        relative flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 cursor-pointer
        border transition-all duration-200 select-none
        ${isActive
          ? "bg-orange-500/10 border-orange-400/25"
          : hovered
          ? "bg-white/[0.03] border-white/[0.05]"
          : "border-transparent"
        }
        ${hovered && !isActive ? "translate-x-1" : "translate-x-0"}
      `}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[15px] shrink-0
        transition-colors duration-200 ${isActive ? "bg-orange-400/20" : "bg-white/[0.05]"}`}>
        {icon}
      </div>

      <span className={`flex-1 text-[13.5px] tracking-wide transition-colors duration-200
        ${isActive ? "text-orange-400 font-semibold" : hovered ? "text-neutral-300 font-normal" : "text-neutral-500 font-normal"}`}>
        {label}
      </span>

      {badge !== null && badge > 0 && (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
          ${isActive ? "bg-orange-400/20 text-orange-400" : "bg-red-500/15 text-red-400"}`}>
          {badge}
        </span>
      )}

      {isActive && (
        <div className="absolute -right-px top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-l-sm bg-gradient-to-b from-orange-400 to-red-500" />
      )}
    </div>
  );
};

const Sidebar = ({ handleLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutHov, setLogoutHov] = useState(false);

  // ✅ localStorage se real admin info lo
  const rawUser = JSON.parse(localStorage.getItem("adminUser")) || {};
  const adminName = rawUser.name
    || rawUser.email?.split("@")[0]
        ?.replace(/[._-]/g, " ")
        ?.replace(/\b\w/g, (c) => c.toUpperCase())
    || "Admin";
  const adminRole = rawUser.role || "Admin";
  const adminInitials = adminName
    .split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="relative w-60 min-h-screen bg-[#0f0f12] border-r border-white/[0.07] flex flex-col overflow-hidden font-sans">

      <div className="pointer-events-none absolute -top-20 -left-14 w-72 h-72 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-14 w-52 h-52 rounded-full bg-red-600/8 blur-3xl" />

      {/* Logo */}
      <div className="px-5 pt-7 pb-5 border-b border-white/[0.07]">
        <p className="text-orange-400 text-[19px] font-bold tracking-wide">🍽 Savoria</p>
        <p className="text-[10px] text-neutral-600 tracking-[2px] uppercase mt-1">Admin Panel</p>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-3 py-3 scrollbar-none">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-semibold tracking-[2px] uppercase text-neutral-700 px-2 pt-4 pb-1.5">
              {group.label}
            </p>
            {group.items.map((item) => (
              <MenuItem
                key={item.path}
                {...item}
                isActive={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-3 pb-5 pt-3 border-t border-white/[0.07]">

        {/* ✅ Dynamic Admin Card */}
        <div className="flex items-center gap-2.5 px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl mb-3">
          <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-orange-400 to-red-500
            flex items-center justify-center text-white text-sm font-bold shrink-0">
            {adminInitials}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-neutral-200 truncate">{adminName}</p>
            <p className="text-[11px] text-neutral-600 truncate">{adminRole}</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onMouseEnter={() => setLogoutHov(true)}
          onMouseLeave={() => setLogoutHov(false)}
          onClick={() => { handleLogout(); navigate("/login"); }}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
            border text-[13px] font-semibold text-red-400 cursor-pointer transition-all duration-200
            ${logoutHov ? "bg-red-500/15 border-red-500/40" : "bg-red-500/[0.07] border-red-500/20"}`}
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;