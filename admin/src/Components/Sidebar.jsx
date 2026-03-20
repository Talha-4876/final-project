import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ handleLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const MenuItem = ({ path, label, icon }) => {
    const isActive = location.pathname === path;
    return (
      <button
        onClick={() => navigate(path)}
        className={`
          relative flex items-center gap-3 p-3 rounded-xl font-semibold text-white
          transition-all duration-300
          ${
            isActive
              ? "bg-gradient-to-r from-orange-400 to-pink-500 shadow-lg scale-105"
              : "bg-gradient-to-r from-orange-300 to-orange-400 hover:scale-105 hover:shadow-xl hover:from-yellow-400 hover:to-orange-500"
          }
        `}
      >
        {icon && <span className="text-lg">{icon}</span>}
        <span>{label}</span>
        {isActive && <span className="absolute -right-3 w-2 h-2 rounded-full bg-white animate-pulse"></span>}
      </button>
    );
  };

  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-orange-100 to-orange-200 p-5 flex flex-col gap-4 shadow-2xl">
      <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400 mb-6 animate-pulse">
        🌟 Admin Panel
      </h2>

      <MenuItem path="/admin/dashboard" label="Add Menu" icon="🍔" />
      <MenuItem path="/admin/list" label="List Menu" icon="📋" />
      <MenuItem path="/admin/table" label="Reservations" icon="📅" />
      <MenuItem path="/admin/reviews" label="Customer Reviews" icon="⭐" />

      <div className="flex-1" />

      <button
        onClick={() => {
          handleLogout();
          navigate("/login");
        }}
        className="mt-auto w-full p-3 rounded-xl bg-red-400 hover:bg-red-500 text-white font-bold shadow-lg transition-transform transform hover:scale-105"
      >
        🚪 Logout
      </button>
    </div>
  );
};

export default Sidebar;