// src/pages/Dashboard.jsx
import React from "react";
import Sidebar from "../Components/Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = ({ handleLogout }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar handleLogout={handleLogout} />

      {/* Main content */}
      <div className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;