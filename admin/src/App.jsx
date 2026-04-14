// frontend/src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Login from "./Components/AdminLogin";
import DashboardLayout from "./pages/Dashboard"; 
import AddMenu from "./pages/AddMenu";
import UpdateMenu from "./pages/UpdateMenu"; // ✅ Added
import ListMenu from "./pages/ListMenu";
import AdminTable from "./pages/AdminTable";
import AdminReviews from "./pages/AdminReviews";
import AdminContacts from "./pages/AdminContacts"; // ✅ ADD THIS

const App = () => {
  const [token, setToken] = useState("");

useEffect(() => {
  const storedToken = localStorage.getItem("adminToken");
  if (storedToken) {
    setToken(storedToken);
  }
}, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    setToken("");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) setToken(storedToken);
  }, []);

  return (
    <>
      <ToastContainer />

      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/admin/dashboard" />}
        />

        {/* Admin routes */}
        {token && (
          <Route path="/admin" element={<DashboardLayout handleLogout={handleLogout} />}>
            <Route path="dashboard" element={<AddMenu />} />
            <Route path="list" element={<ListMenu />} />
            <Route path="update/:id" element={<UpdateMenu />} /> {/* ✅ Update route */}
            <Route path="table" element={<AdminTable />} />
            <Route path="reviews" element={<AdminReviews />} />
 <Route path="contacts" element={<AdminContacts />} />

          </Route>
        )}

        {/* Fallback */}
        <Route path="*" element={<Navigate to={token ? "/admin/dashboard" : "/login"} />} />
      </Routes>
    </>
  );
};

export default App;