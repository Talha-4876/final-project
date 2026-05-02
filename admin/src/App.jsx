import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Login from "./Components/AdminLogin";
import DashboardLayout from "./pages/Dashboard";
import AddMenu from "./pages/AddMenu";
import AdminDashboard from "./pages/AdminDashboard";
import UpdateMenu from "./pages/UpdateMenu";
import ListMenu from "./pages/ListMenu";
import AdminTable from "./pages/AdminTable";
import AdminReviews from "./pages/AdminReviews";
import AdminContacts from "./pages/AdminContacts";
import Deliveries from "./pages/Deliveries";
import AdminInbox from "./pages/AdminInbox";
import ChefManager from "./Components/ChefManager";
import AdminSettings from "./pages/AdminSettings";
import AddTable from "./pages/AddTable";
const App = () => {
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) setToken(storedToken);
  }, []);

  // ✅ Logout — sab clear karo
 const handleLogout = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");  // ← yeh hona chahiye
  localStorage.removeItem("adminData");  // ← yeh bhi add karo (purani key)
  setToken("");
};
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        toastStyle={{ background: "#16161b", border: "1px solid rgba(255,255,255,0.08)", color: "#e8e5e0" }}
      />
      <Routes>

        {/* Login — token ho to dashboard pe bhejo */}
        <Route
          path="/login"
          element={
            !token
              ? <Login setToken={setToken} />   // ✅ setToken pass karo
              : <Navigate to="/admin/dashboard" />
          }
        />

        {/* Protected admin routes */}
       {/* Protected admin routes */}
{token && (
  <Route
    path="/admin"
    element={<DashboardLayout handleLogout={handleLogout} />}
  >
    <Route index element={<Navigate to="dashboard" />} /> {/* optional but best */}

    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="add"        element={<AddMenu />} />   {/* ✅ YE ADD KIYA */}
    <Route path="list"       element={<ListMenu />} />
    <Route path="update/:id" element={<UpdateMenu />} />
    <Route path="table"      element={<AdminTable />} />
    <Route path="reviews"    element={<AdminReviews />} />
    <Route path="contacts"   element={<AdminContacts />} />
    <Route path="inbox"      element={<AdminInbox />} />
    <Route path="deliveries" element={<Deliveries />} />
    <Route path="chefs"      element={<ChefManager />} />
    <Route path="settings"   element={<AdminSettings />} />
    <Route path="/admin/addtable" element={<AddTable />} />
  </Route>
)}

        {/* Fallback */}
        <Route
          path="*"
          element={<Navigate to={token ? "/admin/dashboard" : "/login"} />}
        />

      </Routes>
    </>
  );
};

export default App;