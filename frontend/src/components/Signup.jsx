// src/pages/Signup.jsx
import React, { useState } from "react";
import axios from "axios";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const backendUrl = "http://localhost:3200";

const Signup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ================= LOGIN / SIGNUP =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res;

      if (isLogin) {
        res = await axios.post(`${backendUrl}/api/auth/login`, formData);
      } else {
        res = await axios.post(`${backendUrl}/api/auth/signup`, formData);
      }

      if (res.data.token) {
        // ✅ Store token safely in localStorage
        localStorage.setItem("userToken", res.data.token);

        // ✅ Optional: store user info if needed
        localStorage.setItem("userInfo", JSON.stringify(res.data.user));

        toast.success(res.data.message || "Success!");
        navigate("/"); // Redirect to homepage/dashboard
      } else {
        toast.error(res.data.message || "Signup/Login failed");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ================= RESET PASSWORD =================
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${backendUrl}/api/auth/reset-password`, {
        email: formData.email,
        newPassword,
      });

      toast.success(res.data.message || "Password reset successful");

      setIsForgot(false);
      setIsLogin(true);
      setNewPassword("");
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex justify-center items-center min-h-[80vh] bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">

        {/* ================= TOGGLE LOGIN / SIGNUP ================= */}
        {!isForgot && (
          <div className="flex justify-center mb-6 gap-2">
            <button
              onClick={() => { setIsLogin(true); setIsForgot(false); }}
              className={`px-6 py-2 rounded font-semibold transition-colors ${
                isLogin ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              Login
            </button>

            <button
              onClick={() => { setIsLogin(false); setIsForgot(false); }}
              className={`px-6 py-2 rounded font-semibold transition-colors ${
                !isLogin ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* ================= FORGOT PASSWORD FORM ================= */}
        {isForgot ? (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <h2 className="text-xl font-bold text-center">Reset Password</h2>

            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="border p-2 rounded focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="border p-2 rounded focus:ring-2 focus:ring-orange-400"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 text-white py-2 rounded font-semibold hover:scale-105 transition-transform"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <p
              onClick={() => setIsForgot(false)}
              className="text-sm text-center cursor-pointer text-gray-500 hover:text-orange-500"
            >
              Back to Login
            </p>
          </form>
        ) : (
          /* ================= LOGIN / SIGNUP FORM ================= */
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="border p-2 rounded focus:ring-2 focus:ring-orange-400"
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="border p-2 rounded focus:ring-2 focus:ring-orange-400"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="border p-2 rounded w-full focus:ring-2 focus:ring-orange-400"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 cursor-pointer text-gray-500"
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>

            {isLogin && (
              <p
                onClick={() => { setIsForgot(true); setIsLogin(false); }}
                className="text-sm text-right cursor-pointer text-orange-500 hover:underline"
              >
                Forgot Password?
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 text-white py-2 rounded font-semibold hover:scale-105 transition-transform"
            >
              {loading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Signup;


