import React, { useState, useContext, useRef, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { SearchContext } from "../context/SearchContext";
import { useNavigate, useLocation } from "react-router-dom";
import { FaShoppingCart, FaSearch, FaBars, FaTimes, FaUserCircle } from "react-icons/fa";

const Navbar = ({ openAuth }) => {
  const [isOpen,      setIsOpen]      = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [active,      setActive]      = useState("Home");
  const [scrolled,    setScrolled]    = useState(false);
  const [shakeCart,   setShakeCart]   = useState(false);

  const { cartItems }                   = useContext(CartContext);
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const navigate  = useNavigate();
  const location  = useLocation();

  const menuItems = [
    { name: "Home",   type: "scroll", target: "hero"    },
    { name: "Menu",   type: "scroll", target: "menu"    },
    { name: "About",  type: "scroll", target: "about"   },
    { name: "Tables", type: "route",  target: "/tables" },
  ];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = () => {
      const pos = window.scrollY + 150;
      ["hero","menu","about"].forEach(id => {
        const el = document.getElementById(id);
        if (el && pos >= el.offsetTop && pos < el.offsetTop + el.offsetHeight) {
          if (id==="hero")  setActive("Home");
          if (id==="menu")  setActive("Menu");
          if (id==="about") setActive("About");
        }
      });
    };
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      setShakeCart(true);
      setTimeout(() => setShakeCart(false), 500);
    }
  }, [cartItems]);

  const handleScroll = (id, name) => {
    setActive(name);
    if (location.pathname !== "/") navigate("/", { state: { scrollTo: id } });
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  const handleRoute = (path, name) => {
    setActive(name);
    navigate(path);
    setIsOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim())
      document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Lora:wght@400;500;600&display=swap');
        .font-playfair { font-family: 'Playfair Display', Georgia, serif; }
        .font-lora     { font-family: 'Lora', Georgia, serif; }

        @keyframes cartShake {
          0%,100%{ transform:rotate(0deg); }
          20%    { transform:rotate(-14deg); }
          40%    { transform:rotate(14deg); }
          60%    { transform:rotate(-8deg); }
          80%    { transform:rotate(8deg); }
        }
        .shake { animation: cartShake 0.5s ease; }

        @keyframes searchDrop {
          from { opacity:0; transform:translateY(-8px) scale(.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        .search-drop { animation: searchDrop .25s cubic-bezier(.34,1.56,.64,1); }

        .nav-link {
          position: relative;
          padding-bottom: 3px;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 50%;
          width: 0; height: 2px;
          background: linear-gradient(90deg, #ea580c, #f97316);
          border-radius: 2px;
          transform: translateX(-50%);
          transition: width 0.3s cubic-bezier(.34,1.56,.64,1);
        }
        .nav-link:hover::after,
        .nav-link.is-active::after { width: 100%; }
      `}</style>

      {/* ══════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════ */}
      <nav className={`
        font-lora fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled
          ? "bg-orange-50/97 backdrop-blur-xl shadow-[0_4px_32px_rgba(234,88,12,0.12)] border-b border-orange-200/70"
          : "bg-orange-50/85 backdrop-blur-md border-b border-orange-100/50"
        }
      `}>

        {/* Top shimmer line */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-80" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* ── LOGO ───────────────────────────────── */}
            <div
              onClick={() => handleScroll("hero", "Home")}
              className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
            >
              {/* BB Monogram badge */}
              <div className="
                w-12 h-12 rounded-2xl flex-shrink-0
                bg-gradient-to-br from-orange-400 via-orange-500 to-orange-700
                flex items-center justify-center
                shadow-[0_4px_18px_rgba(234,88,12,0.38)]
                group-hover:shadow-[0_6px_26px_rgba(234,88,12,0.55)]
                group-hover:scale-105
                transition-all duration-300
                border border-orange-300/40
                relative overflow-hidden
              ">
                {/* Inner shine */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-2xl" />
                <span className="font-playfair text-white font-black text-lg leading-none tracking-tight select-none relative z-10">
                  BB
                </span>
              </div>

              {/* Brand name */}
              <div className="flex flex-col">
                <span className="font-playfair font-black text-stone-800 leading-none tracking-tight"
                  style={{ fontSize: "1.18rem" }}>
                  Bite Boss
                </span>
                <span className="font-lora font-medium text-orange-500 uppercase tracking-[0.22em] leading-none mt-1"
                  style={{ fontSize: "0.52rem" }}>
                  Fine Dining
                </span>
              </div>
            </div>

            {/* ── DESKTOP NAV LINKS ───────────────────── */}
            <ul className="hidden md:flex items-center gap-9 list-none m-0 p-0">
              {menuItems.map((item, i) => (
                <li
                  key={i}
                  onClick={() => item.type === "route"
                    ? handleRoute(item.target, item.name)
                    : handleScroll(item.target, item.name)
                  }
                  className={`
                    nav-link cursor-pointer select-none
                    font-lora font-semibold text-sm tracking-widest uppercase
                    transition-colors duration-200
                    ${active === item.name
                      ? "is-active text-orange-600"
                      : "text-stone-500 hover:text-orange-600"
                    }
                  `}
                >
                  {item.name}
                </li>
              ))}
            </ul>

            {/* ── DESKTOP RIGHT ───────────────────────── */}
            <div className="hidden md:flex items-center gap-1">

              {/* Search btn */}
              <button
                onClick={() => setSearchOpen(o => !o)}
                className="
                  w-9 h-9 rounded-full flex items-center justify-center
                  text-stone-500 hover:text-orange-600 hover:bg-orange-100/80
                  transition-all duration-200 border-none bg-transparent cursor-pointer
                "
              >
                <FaSearch size={14} />
              </button>

              <div className="w-px h-5 bg-orange-200 mx-2" />

              {/* Cart btn */}
              <button
                onClick={() => handleRoute("/cart", "Cart")}
                className="
                  relative w-9 h-9 rounded-full flex items-center justify-center
                  text-stone-500 hover:text-orange-600 hover:bg-orange-100/80
                  transition-all duration-200 border-none bg-transparent cursor-pointer
                "
              >
                <FaShoppingCart size={15} className={shakeCart ? "shake" : ""} />
                {cartItems.length > 0 && (
                  <span className="
                    absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full
                    bg-gradient-to-br from-orange-500 to-orange-700
                    text-white font-bold flex items-center justify-center
                    border-2 border-orange-50 shadow-md
                    leading-none
                  " style={{ fontSize: "0.58rem" }}>
                    {cartItems.length}
                  </span>
                )}
              </button>

              {/* Profile btn */}
              <button
                onClick={() => handleRoute("/profile", "Profile")}
                className="
                  w-9 h-9 rounded-full flex items-center justify-center
                  text-stone-500 hover:text-orange-600 hover:bg-orange-100/80
                  transition-all duration-200 border-none bg-transparent cursor-pointer
                "
              >
                <FaUserCircle size={16} />
              </button>

              <div className="w-px h-5 bg-orange-200 mx-2" />

              {/* Sign Up */}
              <button
                onClick={openAuth}
                className="
                  font-lora font-semibold text-xs tracking-widest uppercase
                  px-5 py-2.5 rounded-full text-white cursor-pointer
                  bg-gradient-to-r from-orange-500 to-orange-600
                  hover:from-orange-600 hover:to-orange-700
                  shadow-[0_4px_16px_rgba(234,88,12,0.32)]
                  hover:shadow-[0_6px_24px_rgba(234,88,12,0.48)]
                  hover:-translate-y-0.5 hover:scale-105
                  active:scale-95
                  transition-all duration-200 border-none
                "
              >
                Sign Up
              </button>
            </div>

            {/* ── MOBILE RIGHT ────────────────────────── */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => handleRoute("/cart","Cart")}
                className="relative w-9 h-9 rounded-full flex items-center justify-center text-stone-600 hover:text-orange-600 hover:bg-orange-100 transition-all border-none bg-transparent cursor-pointer"
              >
                <FaShoppingCart size={17} className={shakeCart ? "shake" : ""} />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-orange-500 text-white font-bold flex items-center justify-center border-2 border-orange-50 leading-none" style={{ fontSize:"0.58rem" }}>
                    {cartItems.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setIsOpen(true)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-stone-600 hover:text-orange-600 hover:bg-orange-100 transition-all border-none bg-transparent cursor-pointer"
              >
                <FaBars size={18} />
              </button>
            </div>

          </div>
        </div>

        {/* ── Search Dropdown ─────────────────────────── */}
        {searchOpen && (
          <div className="search-drop absolute right-6 top-[calc(100%+10px)] w-72 bg-orange-50 rounded-2xl p-4 border border-orange-200/70 shadow-[0_12px_40px_rgba(234,88,12,0.14)] z-50">
            <p className="font-lora text-[0.55rem] tracking-[0.2em] uppercase text-orange-400 mb-2.5 font-medium">
              ◆ Search Menu
            </p>
            <div className="relative">
              <FaSearch size={11} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-300" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search food items..."
                autoFocus
                className="
                  w-full font-lora text-sm text-stone-800 pl-9 pr-4 py-2.5 rounded-xl
                  bg-white/80 border border-orange-200 placeholder-orange-300
                  focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400
                  transition-all duration-200
                "
              />
            </div>
          </div>
        )}

        {/* Bottom line */}
        <div className="h-px bg-gradient-to-r from-transparent via-orange-200/60 to-transparent" />
      </nav>

      {/* ══════════════════════════════════════════
          MOBILE OVERLAY
      ══════════════════════════════════════════ */}
      <div
        onClick={() => setIsOpen(false)}
        className={`
          fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm
          transition-opacity duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* ══════════════════════════════════════════
          MOBILE DRAWER
      ══════════════════════════════════════════ */}
      <div className={`
        font-lora fixed top-0 right-0 h-full w-72 z-50
        bg-orange-50 border-l border-orange-200/60
        shadow-[-8px_0_48px_rgba(234,88,12,0.13)]
        flex flex-col
        transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}>

        {/* Drawer top line */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-80" />

        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-orange-100">
          <div className="flex items-center gap-3">
            {/* Same BB badge */}
            <div className="
              w-10 h-10 rounded-xl flex-shrink-0
              bg-gradient-to-br from-orange-400 via-orange-500 to-orange-700
              flex items-center justify-center
              shadow-[0_3px_12px_rgba(234,88,12,0.35)]
              border border-orange-300/40 relative overflow-hidden
            ">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent" />
              <span className="font-playfair text-white font-black text-base leading-none tracking-tight select-none relative z-10">
                BB
              </span>
            </div>
            <div>
              <p className="font-playfair font-black text-stone-800 leading-none" style={{ fontSize:"1.05rem" }}>
                Bite Boss
              </p>
              <p className="font-lora font-medium text-orange-500 uppercase tracking-[0.2em] mt-0.5" style={{ fontSize:"0.5rem" }}>
                Fine Dining
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-stone-400 hover:text-orange-600 hover:bg-orange-100 transition-all border-none bg-transparent cursor-pointer"
          >
            <FaTimes size={15} />
          </button>
        </div>

        {/* Drawer Links */}
        <div className="flex-1 px-4 py-5 overflow-y-auto">
          <p className="font-lora text-[0.52rem] tracking-[0.22em] uppercase text-orange-300 font-medium mb-3 px-1">
            Navigation
          </p>
          <ul className="space-y-1.5 list-none p-0 m-0">
            {menuItems.map((item, i) => (
              <li
                key={i}
                onClick={() => item.type === "route"
                  ? handleRoute(item.target, item.name)
                  : handleScroll(item.target, item.name)
                }
                className={`
                  flex items-center gap-3 px-4 py-3.5 rounded-2xl cursor-pointer
                  font-lora font-semibold text-sm tracking-widest uppercase
                  transition-all duration-200
                  ${active === item.name
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-[0_4px_16px_rgba(234,88,12,0.3)]"
                    : "text-stone-500 hover:bg-orange-100 hover:text-orange-600"
                  }
                `}
              >
                <span className={`text-[0.6rem] ${active === item.name ? "text-orange-200" : "text-orange-300"}`}>
                  ◆
                </span>
                {item.name}
              </li>
            ))}
          </ul>

          {/* Search inside drawer */}
          <div className="mt-6">
            <p className="font-lora text-[0.52rem] tracking-[0.22em] uppercase text-orange-300 font-medium mb-3 px-1">
              Search
            </p>
            <div className="relative">
              <FaSearch size={11} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-300" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search food..."
                className="
                  w-full font-lora text-sm text-stone-800 pl-9 pr-4 py-2.5 rounded-xl
                  bg-white/80 border border-orange-200 placeholder-orange-300
                  focus:outline-none focus:ring-2 focus:ring-orange-400/40 focus:border-orange-400
                  transition-all duration-200
                "
              />
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="px-4 py-4 border-t border-orange-100 space-y-2.5">
          <button
            onClick={() => handleRoute("/profile","Profile")}
            className="
              w-full flex items-center justify-center gap-2
              px-4 py-2.5 rounded-xl
              bg-white/70 border border-orange-200
              text-stone-600 hover:text-orange-600 hover:border-orange-400 hover:bg-orange-50
              font-lora font-semibold text-sm tracking-wide
              transition-all duration-200 cursor-pointer
            "
          >
            <FaUserCircle size={15} />
            My Profile
          </button>
          <button
            onClick={openAuth}
            className="
              w-full px-4 py-2.5 rounded-xl text-white cursor-pointer
              font-lora font-semibold text-sm tracking-widest uppercase
              bg-gradient-to-r from-orange-500 to-orange-600
              hover:from-orange-600 hover:to-orange-700
              shadow-[0_4px_16px_rgba(234,88,12,0.3)]
              hover:shadow-[0_6px_24px_rgba(234,88,12,0.45)]
              active:scale-95 transition-all duration-200 border-none
            "
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-20" />
    </>
  );
};

export default Navbar;