// src/pages/Signup.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const backendUrl = "http://localhost:3200";

const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    ) : (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    )}
  </svg>
);

const Signup = () => {
  const [mode, setMode] = useState("login"); // login | signup | forgot
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [newPassword, setNewPassword] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
      const res = await axios.post(`${backendUrl}${endpoint}`, formData);
      const data = res?.data;
      if (data?.token) {
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userInfo", JSON.stringify(data.user));
        toast.success(data.message || "Welcome!");
        navigate("/");
      } else {
        toast.error(data?.message || "Failed");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/auth/reset-password`, {
        email: formData.email,
        newPassword,
      });
      toast.success(res?.data?.message || "Password reset successful");
      setMode("login");
      setNewPassword("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap');

        .auth-bg {
          min-height: 100vh;
          background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 40%, #fed7aa 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          position: relative;
          overflow: hidden;
          font-family: 'Lora', Georgia, serif;
        }

        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          opacity: 0.35;
          pointer-events: none;
        }
        .blob-1 {
          width: 420px; height: 420px;
          background: radial-gradient(circle, #fb923c, #ea580c);
          top: -100px; right: -100px;
        }
        .blob-2 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, #fbbf24, #f97316);
          bottom: -80px; left: -60px;
        }
        .blob-3 {
          width: 180px; height: 180px;
          background: radial-gradient(circle, #fdba74, #fb923c);
          top: 50%; left: 20%;
          transform: translateY(-50%);
          opacity: 0.2;
        }

        .food-pattern {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, #ea580c18 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none;
        }

        .auth-card {
          position: relative;
          width: 100%;
          max-width: 460px;
          background: rgba(255,255,255,0.82);
          backdrop-filter: blur(24px);
          border-radius: 32px;
          border: 1.5px solid rgba(251,146,60,0.25);
          box-shadow:
            0 32px 80px rgba(234,88,12,0.15),
            0 8px 32px rgba(234,88,12,0.08),
            inset 0 1px 0 rgba(255,255,255,0.9);
          overflow: hidden;
        }

        .card-top-bar {
          height: 4px;
          background: linear-gradient(90deg, #fdba74, #ea580c, #c2410c, #ea580c, #fdba74);
          background-size: 200% 100%;
          animation: shimmerBar 3s linear infinite;
        }
        @keyframes shimmerBar {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .card-inner {
          padding: 2.5rem 2.5rem 2.5rem;
        }

        .brand-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 2rem;
        }
        .brand-badge {
          width: 52px; height: 52px;
          border-radius: 18px;
          background: linear-gradient(135deg, #f97316, #ea580c, #c2410c);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 24px rgba(234,88,12,0.4);
          position: relative;
          overflow: hidden;
        }
        .brand-badge::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent);
          border-radius: 18px;
        }
        .brand-badge span {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          color: white;
          font-size: 1.2rem;
          letter-spacing: -0.5px;
          position: relative; z-index: 1;
        }
        .brand-text h1 {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: 1.35rem;
          color: #1c1917;
          margin: 0; line-height: 1;
        }
        .brand-text p {
          font-family: 'Lora', serif;
          font-size: 0.5rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #ea580c;
          margin: 4px 0 0;
          font-weight: 500;
        }

        .mode-tabs {
          display: flex;
          background: rgba(251,146,60,0.1);
          border-radius: 16px;
          padding: 4px;
          margin-bottom: 2rem;
          gap: 4px;
          border: 1px solid rgba(251,146,60,0.2);
        }
        .tab-btn {
          flex: 1;
          padding: 10px 16px;
          border-radius: 12px;
          border: none;
          font-family: 'Lora', serif;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
          background: transparent;
          color: #92400e;
        }
        .tab-btn.active {
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: white;
          box-shadow: 0 4px 16px rgba(234,88,12,0.35);
          transform: translateY(-1px);
        }

        .section-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          font-weight: 700;
          color: #1c1917;
          text-align: center;
          margin: 0 0 0.3rem;
          line-height: 1.2;
        }
        .section-sub {
          font-size: 0.8rem;
          color: #a8a29e;
          text-align: center;
          margin: 0 0 1.8rem;
          font-style: italic;
        }

        .input-group {
          margin-bottom: 1.1rem;
          position: relative;
        }
        .input-label {
          display: block;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #78716c;
          margin-bottom: 6px;
          transition: color 0.2s;
        }
        .input-wrap {
          position: relative;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #d4a574;
          pointer-events: none;
          transition: color 0.2s;
          display: flex; align-items: center;
        }
        .auth-input {
          width: 100%;
          padding: 13px 44px 13px 42px;
          border-radius: 14px;
          border: 1.5px solid #e7d5c7;
          background: rgba(255,255,255,0.7);
          font-family: 'Lora', serif;
          font-size: 0.9rem;
          color: #1c1917;
          transition: all 0.2s;
          outline: none;
          box-sizing: border-box;
        }
        .auth-input::placeholder {
          color: #c4b5a5;
          font-style: italic;
        }
        .auth-input:focus {
          border-color: #ea580c;
          background: rgba(255,255,255,0.95);
          box-shadow: 0 0 0 4px rgba(234,88,12,0.08), 0 4px 16px rgba(234,88,12,0.06);
        }
        .input-group.is-focused .input-label { color: #ea580c; }
        .input-group.is-focused .input-icon { color: #ea580c; }

        .eye-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #c4a882;
          padding: 4px;
          display: flex; align-items: center;
          border-radius: 8px;
          transition: color 0.2s;
        }
        .eye-btn:hover { color: #ea580c; }

        .submit-btn {
          width: 100%;
          padding: 14px;
          border-radius: 16px;
          border: none;
          cursor: pointer;
          font-family: 'Lora', serif;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: white;
          background: linear-gradient(135deg, #f97316, #ea580c, #c2410c);
          box-shadow: 0 8px 28px rgba(234,88,12,0.38), 0 2px 8px rgba(234,88,12,0.2);
          transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
          position: relative;
          overflow: hidden;
          margin-top: 0.5rem;
        }
        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          pointer-events: none;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 12px 36px rgba(234,88,12,0.48), 0 4px 12px rgba(234,88,12,0.25);
        }
        .submit-btn:active:not(:disabled) { transform: scale(0.97); }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .spinner {
          display: inline-block;
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .forgot-link {
          text-align: right;
          margin-top: -0.4rem;
          margin-bottom: 0.8rem;
        }
        .forgot-link button, .back-link {
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Lora', serif;
          font-size: 0.78rem;
          color: #ea580c;
          font-style: italic;
          padding: 0;
          text-decoration: underline;
          text-decoration-color: transparent;
          transition: text-decoration-color 0.2s;
        }
        .forgot-link button:hover, .back-link:hover {
          text-decoration-color: #ea580c;
        }

        .back-link {
          display: block;
          text-align: center;
          margin-top: 1.2rem;
          color: #78716c;
          font-style: italic;
        }
        .back-link span { color: #ea580c; text-decoration: underline; cursor: pointer; }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 1.4rem 0;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, #e7d5c7, transparent);
        }
        .divider span {
          font-size: 0.62rem;
          color: #c4b5a5;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 500;
        }

        .card-footer {
          padding: 1rem 2.5rem 1.5rem;
          text-align: center;
          border-top: 1px solid rgba(251,146,60,0.12);
        }
        .card-footer p {
          font-size: 0.7rem;
          color: #c4b5a5;
          margin: 0;
          letter-spacing: 0.05em;
        }
        .card-footer strong { color: #ea580c; }

        .floating-emoji {
          position: absolute;
          pointer-events: none;
          animation: floatEmoji 6s ease-in-out infinite;
          opacity: 0.12;
          font-size: 2.5rem;
          user-select: none;
        }
        .fe-1 { top: 8%; left: 6%; animation-delay: 0s; }
        .fe-2 { top: 15%; right: 8%; animation-delay: 1.5s; }
        .fe-3 { bottom: 20%; left: 4%; animation-delay: 3s; }
        .fe-4 { bottom: 10%; right: 6%; animation-delay: 0.8s; }
        @keyframes floatEmoji {
          0%,100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(8deg); }
        }
      `}</style>

      <section className="auth-bg">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="food-pattern" />
        <span className="floating-emoji fe-1">🍔</span>
        <span className="floating-emoji fe-2">🍕</span>
        <span className="floating-emoji fe-3">🍣</span>
        <span className="floating-emoji fe-4">🥗</span>

        <div className="auth-card">
          <div className="card-top-bar" />

          <div className="card-inner">
            <div className="brand-row">
              <div className="brand-badge"><span>BB</span></div>
              <div className="brand-text">
                <h1>Bite Boss</h1>
                <p>Fine Dining</p>
              </div>
            </div>

            {mode === "forgot" ? (
              <>
                <h2 className="section-title">Reset Password</h2>
                <p className="section-sub">Enter your email & set a new password</p>

                <form onSubmit={handleReset}>
                  <div className={`input-group ${focused === "email-r" ? "is-focused" : ""}`}>
                    <label className="input-label">Email Address</label>
                    <div className="input-wrap">
                      <span className="input-icon">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,12 2,6"/></svg>
                      </span>
                      <input
                        type="email" name="email" required
                        value={formData.email} onChange={handleChange}
                        placeholder="your@email.com"
                        className="auth-input"
                        onFocus={() => setFocused("email-r")}
                        onBlur={() => setFocused("")}
                      />
                    </div>
                  </div>

                  <div className={`input-group ${focused === "newpw" ? "is-focused" : ""}`}>
                    <label className="input-label">New Password</label>
                    <div className="input-wrap">
                      <span className="input-icon">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      </span>
                      <input
                        type={showPassword ? "text" : "password"} required
                        value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New secure password"
                        className="auth-input"
                        onFocus={() => setFocused("newpw")}
                        onBlur={() => setFocused("")}
                      />
                      <button type="button" className="eye-btn" onClick={() => setShowPassword(p => !p)}>
                        <EyeIcon open={showPassword} />
                      </button>
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? <><span className="spinner"/>Resetting...</> : "Reset Password"}
                  </button>
                </form>

                <p className="back-link">
                  Remember it? <span onClick={() => setMode("login")}>Back to Login</span>
                </p>
              </>
            ) : (
              <>
                <div className="mode-tabs">
                  <button className={`tab-btn ${mode === "login" ? "active" : ""}`} onClick={() => setMode("login")}>Login</button>
                  <button className={`tab-btn ${mode === "signup" ? "active" : ""}`} onClick={() => setMode("signup")}>Sign Up</button>
                </div>

                <h2 className="section-title">
                  {mode === "login" ? "Welcome Back" : "Join Bite Boss"}
                </h2>
                <p className="section-sub">
                  {mode === "login" ? "Sign in to your account" : "Create your account today"}
                </p>

                <form onSubmit={handleSubmit}>
                  {mode === "signup" && (
                    <div className={`input-group ${focused === "name" ? "is-focused" : ""}`}>
                      <label className="input-label">Full Name</label>
                      <div className="input-wrap">
                        <span className="input-icon">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        </span>
                        <input
                          type="text" name="name" required
                          value={formData.name} onChange={handleChange}
                          placeholder="Your full name"
                          className="auth-input"
                          onFocus={() => setFocused("name")}
                          onBlur={() => setFocused("")}
                        />
                      </div>
                    </div>
                  )}

                  <div className={`input-group ${focused === "email" ? "is-focused" : ""}`}>
                    <label className="input-label">Email Address</label>
                    <div className="input-wrap">
                      <span className="input-icon">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,12 2,6"/></svg>
                      </span>
                      <input
                        type="email" name="email" required
                        value={formData.email} onChange={handleChange}
                        placeholder="your@email.com"
                        className="auth-input"
                        onFocus={() => setFocused("email")}
                        onBlur={() => setFocused("")}
                      />
                    </div>
                  </div>

                  <div className={`input-group ${focused === "password" ? "is-focused" : ""}`}>
                    <label className="input-label">Password</label>
                    <div className="input-wrap">
                      <span className="input-icon">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password" required
                        value={formData.password} onChange={handleChange}
                        placeholder="Your password"
                        className="auth-input"
                        onFocus={() => setFocused("password")}
                        onBlur={() => setFocused("")}
                      />
                      <button type="button" className="eye-btn" onClick={() => setShowPassword(p => !p)}>
                        <EyeIcon open={showPassword} />
                      </button>
                    </div>
                  </div>

                  {mode === "login" && (
                    <div className="forgot-link">
                      <button type="button" onClick={() => setMode("forgot")}>Forgot Password?</button>
                    </div>
                  )}

                  <button type="submit" disabled={loading} className="submit-btn">
                    {loading
                      ? <><span className="spinner"/>Processing...</>
                      : mode === "login" ? "Sign In →" : "Create Account →"
                    }
                  </button>
                </form>

                <div className="divider"><span>◆ Bite Boss ◆</span></div>

                <p style={{ textAlign:"center", fontSize:"0.78rem", color:"#78716c", margin:0, fontStyle:"italic" }}>
                  {mode === "login"
                    ? <>New here? <span style={{color:"#ea580c",cursor:"pointer",textDecoration:"underline"}} onClick={() => setMode("signup")}>Create an account</span></>
                    : <>Already a member? <span style={{color:"#ea580c",cursor:"pointer",textDecoration:"underline"}} onClick={() => setMode("login")}>Sign in</span></>
                  }
                </p>
              </>
            )}
          </div>

          <div className="card-footer">
            <p>🍴 Fine dining, <strong>finest experience</strong> — Bite Boss</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;