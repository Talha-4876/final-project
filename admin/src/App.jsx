// FILE: src/App.jsx (ADMIN SIDE) — UPDATED CLEAN VERSION

import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

/* =========================
   AUTH
========================= */
import Login from "./Components/AdminLogin";

/* =========================
   LAYOUT
========================= */
import DashboardLayout from "./pages/Dashboard";

/* =========================
   PAGES
========================= */
import AddMenu from "./pages/AddMenu";
import AdminDashboard from "./pages/AdminDashboard";
import UpdateMenu from "./pages/UpdateMenu";
import ListMenu from "./pages/ListMenu";
import AdminTable from "./pages/AdminTable";
import AdminReviews from "./pages/AdminReviews";
import Deliveries from "./pages/Deliveries";
import AdminInbox from "./pages/AdminInbox";
import ChefManager from "./Components/ChefManager";
import AdminSettings from "./pages/AdminSettings";
import AddTable from "./pages/AddTable";
import AdminNewsletterDashboard from "./pages/AdminNewsletterDashboard";

const App = () => {
  const [token, setToken] = useState("");

  /* =========================
     LOAD TOKEN
  ========================= */
  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  /* =========================
     LOGOUT
  ========================= */
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminData");
    setToken("");
  };

  return (
    <>
      {/* =========================
          TOAST CONFIG
      ========================= */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        toastStyle={{
          background: "#16161b",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#e8e5e0",
        }}
      />

      {/* =========================
          ROUTES
      ========================= */}
      <Routes>

        {/* LOGIN ROUTE */}
        <Route
          path="/login"
          element={
            !token ? (
              <Login setToken={setToken} />
            ) : (
              <Navigate to="/admin/dashboard" replace />
            )
          }
        />

        {/* =========================
            PROTECTED ADMIN ROUTES
        ========================= */}
        {token ? (
          <Route
            path="/admin"
            element={<DashboardLayout handleLogout={handleLogout} />}
          >
            {/* Default redirect */}
            <Route index element={<Navigate to="dashboard" replace />} />

            {/* Dashboard */}
            <Route path="dashboard" element={<AdminDashboard />} />

            {/* Menu */}
            <Route path="add" element={<AddMenu />} />
            <Route path="list" element={<ListMenu />} />
            <Route path="update/:id" element={<UpdateMenu />} />

            {/* Admin Modules */}
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="inbox" element={<AdminInbox />} />
            <Route path="deliveries" element={<Deliveries />} />
            <Route path="chefs" element={<ChefManager />} />
            <Route path="settings" element={<AdminSettings />} />

            {/* Tables / Reservations */}
            <Route path="addtable" element={<AddTable />} />
            <Route path="admintable" element={<AdminTable />} />

            {/* Newsletter */}
            <Route path="newsletter" element={<AdminNewsletterDashboard />} />
          </Route>
        ) : (
          // If no token → force login
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}

        {/* FINAL FALLBACK */}
        <Route
          path="*"
          element={
            <Navigate to={token ? "/admin/dashboard" : "/login"} replace />
          }
        />
      </Routes>
    </>
  );
};

export default App;