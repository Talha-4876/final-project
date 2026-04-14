// src/pages/Dashboard.jsx
import React from "react";
import Sidebar from "../Components/Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = ({ handleLogout }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <Sidebar handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* 🔥 Top Header */}
        <div className="flex items-center justify-between bg-white shadow px-6 py-4">
          <h1 className="text-xl font-bold text-gray-700">
            Admin Dashboard
          </h1>

          {/* Right side */}
          <div className="flex items-center gap-4">

            {/* Future: Notification icon */}
            <span className="text-gray-500 text-sm hidden md:block">
              Welcome Admin 👋
            </span>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* 🔥 Page Content */}
        <div className="p-6">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default DashboardLayout;