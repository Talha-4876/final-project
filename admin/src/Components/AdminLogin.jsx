import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { backendUrl } from "../config";

const AdminLogin = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${backendUrl}/api/admin/login`, {
        email,
        password,
      });

      if (res.data.success) {
        // ✅ Save token
        localStorage.setItem("adminToken", res.data.token);
        localStorage.setItem("adminData", JSON.stringify(res.data.admin));

        // ✅ Update state (no reload needed)
        if (setToken) setToken(res.data.token);

        toast.success("Login successful");

        // ✅ Redirect
        navigate("/admin/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-[320px]"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Admin Login
        </h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password with Eye Icon */}
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="border p-2 w-full pr-10 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <span
            className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        {/* Button */}
        <button className="bg-black text-white py-2 w-full rounded hover:bg-gray-800 transition">
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;