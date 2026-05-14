// src/pages/NotificationsPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBell, FaArrowLeft, FaCheckCircle, FaShoppingBag,
  FaCreditCard, FaStar, FaGift, FaMotorcycle, FaTrash,
  FaCheck, FaSpinner, FaExclamationCircle,
} from "react-icons/fa";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:3200";

const iconMap = {
  bag:  { Icon: FaShoppingBag, bg: "from-orange-400 to-orange-600",  shadow: "rgba(234,88,12,0.35)"  },
  bike: { Icon: FaMotorcycle,  bg: "from-blue-400 to-blue-600",      shadow: "rgba(59,130,246,0.35)" },
  card: { Icon: FaCreditCard,  bg: "from-green-400 to-emerald-600",  shadow: "rgba(16,185,129,0.35)" },
  check:{ Icon: FaCheckCircle, bg: "from-teal-400 to-teal-600",      shadow: "rgba(20,184,166,0.35)" },
  gift: { Icon: FaGift,        bg: "from-pink-400 to-rose-500",      shadow: "rgba(244,63,94,0.35)"  },
  star: { Icon: FaStar,        bg: "from-amber-400 to-yellow-500",   shadow: "rgba(245,158,11,0.35)" },
};

const timeAgo = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)    return "Just now";
  if (diff < 3600)  return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr${Math.floor(diff/3600)>1?"s":""} ago`;
  if (diff < 604800)return `${Math.floor(diff / 86400)} day${Math.floor(diff/86400)>1?"s":""} ago`;
  return new Date(dateStr).toLocaleDateString();
};

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  "Content-Type": "application/json",
});

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifs,   setNotifs]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [filter,   setFilter]   = useState("all");
  const [deleting, setDeleting] = useState(null);

  // ── Fetch from DB ────────────────────────────────────────────────────────
  const fetchNotifs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res  = await fetch(`${API}/api/notifications`, { headers: authHeader() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load");
      setNotifs(data.data);

      // silently mark all as read
      fetch(`${API}/api/notifications/read-all`, {
        method: "PATCH", headers: authHeader(),
      }).catch(() => {});

      window.dispatchEvent(new Event("notifsRead"));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotifs(); }, [fetchNotifs]);

  // ── Delete one ───────────────────────────────────────────────────────────
  const deleteOne = async (id) => {
    setDeleting(id);
    try {
      await fetch(`${API}/api/notifications/${id}`, {
        method: "DELETE", headers: authHeader(),
      });
      setNotifs(prev => prev.filter(n => n._id !== id));
    } catch {}
    finally { setDeleting(null); }
  };

  // ── Clear all ────────────────────────────────────────────────────────────
  const clearAll = async () => {
    try {
      await fetch(`${API}/api/notifications`, {
        method: "DELETE", headers: authHeader(),
      });
      setNotifs([]);
    } catch {}
  };

  const filtered =
    filter === "all"    ? notifs :
    filter === "unread" ? notifs.filter(n => !n.read) :
    notifs.filter(n => n.type === filter);

  const unreadCount = notifs.filter(n => !n.read).length;

  const tabs = [
    { key: "all",      label: "All"      },
    { key: "order",    label: "Orders"   },
    { key: "payment",  label: "Payments" },
    { key: "delivery", label: "Delivery" },
    { key: "promo",    label: "Offers"   },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lora:wght@400;500;600&display=swap');
        .font-playfair { font-family: 'Playfair Display', Georgia, serif; }
        .font-lora     { font-family: 'Lora', Georgia, serif; }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0);    }
        }
        .fade-up { animation: fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both; }

        @keyframes bellBounce {
          0%,100%{ transform:rotate(0deg); }
          25%    { transform:rotate(-14deg); }
          50%    { transform:rotate(12deg); }
          75%    { transform:rotate(-7deg); }
        }
        .bell-anim { animation: bellBounce 1.1s ease 0.2s both; }

        @keyframes spin { to { transform:rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }

        .notif-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.25s ease;
        }
        .notif-card:hover { transform: translateX(4px); }
        .notif-card.removing { opacity:0; transform:scale(0.93); }

        .tab-pill { transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1); }
        .tab-pill:hover { transform: translateY(-1px); }

        .grain-bg {
          background-image:
            radial-gradient(ellipse at 15% 0%,  rgba(234,88,12,0.07) 0%, transparent 55%),
            radial-gradient(ellipse at 85% 100%, rgba(251,146,60,0.05) 0%, transparent 55%);
        }

        @keyframes emptyBell {
          0%,100%{ transform:translateY(0) rotate(0deg); }
          30%    { transform:translateY(-5px) rotate(-10deg); }
          60%    { transform:translateY(-2px) rotate(8deg); }
        }
        .empty-bell { animation: emptyBell 2.2s ease infinite; }

        ::-webkit-scrollbar { width:0; }
      `}</style>

      <div className="font-lora min-h-screen grain-bg bg-orange-50">

        {/* ── HEADER ── */}
        <div className="sticky top-0 z-20 bg-orange-50/95 backdrop-blur-xl border-b border-orange-100 shadow-[0_2px_20px_rgba(234,88,12,0.08)]">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">

              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-stone-500 hover:text-orange-600 transition-colors font-lora font-semibold text-sm border-none bg-transparent cursor-pointer group"
              >
                <span className="w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-orange-100 transition-all">
                  <FaArrowLeft size={13} />
                </span>
                Back
              </button>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-[0_4px_14px_rgba(234,88,12,0.38)]">
                  <FaBell size={14} className="text-white bell-anim" />
                </div>
                <div>
                  <h1 className="font-playfair font-black text-stone-800 leading-none" style={{ fontSize: "1.12rem" }}>
                    Notifications
                  </h1>
                  <p className="font-lora leading-none mt-0.5 text-orange-400 font-medium" style={{ fontSize: "0.58rem" }}>
                    {loading ? "Loading…" : unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                  </p>
                </div>
              </div>

              {notifs.length > 0 && !loading ? (
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1.5 text-stone-400 hover:text-red-500 transition-colors font-lora font-medium text-xs border-none bg-transparent cursor-pointer"
                >
                  <FaTrash size={11} /> Clear All
                </button>
              ) : <div className="w-16" />}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 pb-3 overflow-x-auto">
              {tabs.map(t => (
                <button
                  key={t.key}
                  onClick={() => setFilter(t.key)}
                  className={`tab-pill flex-shrink-0 px-4 py-1.5 rounded-full font-lora font-semibold text-xs tracking-widest uppercase border-none cursor-pointer ${
                    filter === t.key
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-[0_4px_14px_rgba(234,88,12,0.32)]"
                      : "bg-white/80 text-stone-400 hover:text-orange-500 border border-orange-100"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">

          {loading && (
            <div className="flex flex-col items-center justify-center py-28 fade-up">
              <FaSpinner size={30} className="text-orange-400 spin mb-4" />
              <p className="font-lora text-stone-400 text-sm">Fetching notifications…</p>
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-24 fade-up">
              <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-4">
                <FaExclamationCircle size={26} className="text-red-400" />
              </div>
              <h2 className="font-playfair font-black text-stone-700 text-lg mb-1">Something went wrong</h2>
              <p className="font-lora text-stone-400 text-sm mb-5 text-center">{error}</p>
              <button
                onClick={fetchNotifs}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-lora font-semibold text-sm shadow-[0_4px_14px_rgba(234,88,12,0.3)] border-none cursor-pointer hover:scale-105 active:scale-95 transition-all"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 fade-up">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-100 to-amber-100 border border-orange-200/60 flex items-center justify-center mb-5 shadow-inner">
                <FaBell size={32} className="text-orange-300 empty-bell" />
              </div>
              <h2 className="font-playfair font-black text-stone-700 text-xl mb-2">All Caught Up!</h2>
              <p className="font-lora text-stone-400 text-sm text-center max-w-xs leading-relaxed">
                No notifications here. We'll let you know when something exciting happens.
              </p>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="space-y-3">
              {filtered.map((n, i) => {
                const { Icon, bg, shadow } = iconMap[n.icon] || iconMap.bag;
                const isDel = deleting === n._id;
                return (
                  <div
                    key={n._id}
                    className={`notif-card relative flex gap-4 p-4 rounded-2xl border fade-up ${isDel ? "removing" : ""} ${
                      n.read
                        ? "bg-white/60 border-orange-100/80"
                        : "bg-white border-orange-200 shadow-[0_4px_20px_rgba(234,88,12,0.09)]"
                    }`}
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {!n.read && (
                      <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-full bg-gradient-to-b from-orange-400 to-orange-600" />
                    )}

                    <div
                      className={`flex-shrink-0 w-11 h-11 rounded-2xl bg-gradient-to-br ${bg} flex items-center justify-center`}
                      style={{ boxShadow: `0 4px 14px ${shadow}` }}
                    >
                      <Icon size={16} className="text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          className={`font-lora font-semibold leading-snug ${n.read ? "text-stone-500" : "text-stone-800"}`}
                          style={{ fontSize: "0.88rem" }}
                        >
                          {n.title}
                        </h3>
                        <span className="font-lora text-stone-400 flex-shrink-0 mt-0.5" style={{ fontSize: "0.63rem" }}>
                          {timeAgo(n.createdAt)}
                        </span>
                      </div>
                      <p className="font-lora text-stone-400 leading-relaxed mt-0.5" style={{ fontSize: "0.78rem" }}>
                        {n.message}
                      </p>
                      {n.orderId && (
                        <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-orange-50 border border-orange-100 font-lora font-semibold text-orange-400" style={{ fontSize: "0.62rem" }}>
                          #{n.orderId}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => deleteOne(n._id)}
                      disabled={isDel}
                      className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-stone-300 hover:text-red-400 hover:bg-red-50 transition-all border-none bg-transparent cursor-pointer self-start mt-0.5"
                    >
                      {isDel ? <FaSpinner size={10} className="spin" /> : <FaTrash size={10} />}
                    </button>
                  </div>
                );
              })}

              <div className="flex items-center justify-center gap-2 pt-4 pb-2">
                <FaCheck size={10} className="text-orange-300" />
                <span className="font-lora text-orange-300 text-xs tracking-wide">
                  {notifs.length} notification{notifs.length !== 1 ? "s" : ""} total
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
