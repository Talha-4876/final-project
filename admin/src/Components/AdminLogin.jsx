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
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/admin/login`, {
        email,
        password,
      });

      if (res.data.success) {
        // ✅ Token save
        localStorage.setItem("adminToken", res.data.token);

        // ✅ Email se clean name banao — "ahmed.raza@gmail.com" → "Ahmed Raza"
        const emailName = email
          .split("@")[0]
          .replace(/[._]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

        // ✅ adminUser save karo
        localStorage.setItem(
          "adminUser",
          JSON.stringify({
            name:  res.data.admin?.name  || emailName,
            email: res.data.admin?.email || email,
            role:  res.data.admin?.role  || "Admin",
          })
        );

        if (setToken) setToken(res.data.token);
        toast.success("Login successful");
        navigate("/admin/dashboard");
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0b0b0e]">

      {/* Ambient glow */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2
        w-[500px] h-[300px] rounded-full bg-orange-500/10 blur-3xl" />

      <form
        onSubmit={handleSubmit}
        className="relative w-[360px] bg-[#0f0f12] border border-white/[0.08]
          rounded-2xl p-8 shadow-2xl"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <p className="text-3xl mb-1">🍽</p>
          <h1 className="text-orange-400 text-xl font-bold tracking-wide">Savoria</h1>
          <p className="text-neutral-600 text-[11px] tracking-[2px] uppercase mt-1">
            Admin Panel
          </p>
        </div>

        <h2 className="text-neutral-200 text-[16px] font-semibold mb-6 text-center">
          Sign in to your account
        </h2>

        {/* Email */}
        <div className="mb-4">
          <label className="text-[11px] text-neutral-500 uppercase tracking-widest mb-1.5 block">
            Email
          </label>
          <input
            type="email"
            placeholder="admin@savoria.com"
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl
              px-4 py-2.5 text-[13.5px] text-neutral-200 placeholder-neutral-700
              outline-none focus:border-orange-400/40 focus:bg-white/[0.06]
              transition-all font-sans"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-[11px] text-neutral-500 uppercase tracking-widest mb-1.5 block">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl
                px-4 py-2.5 pr-11 text-[13.5px] text-neutral-200 placeholder-neutral-700
                outline-none focus:border-orange-400/40 focus:bg-white/[0.06]
                transition-all font-sans"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2
                text-neutral-600 hover:text-orange-400 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl font-semibold text-[14px] text-white
            bg-gradient-to-r from-orange-500 to-red-500
            hover:from-orange-400 hover:to-red-400
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all shadow-lg shadow-orange-500/10"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-center text-neutral-700 text-[11px] mt-6">
          © 2026 Savoria Restaurant Management
        </p>
      </form>
    </div>
  );
};

export default AdminLogin;