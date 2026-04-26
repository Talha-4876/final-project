import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products, assets } from "../assets/assets";

/* ── Today ka din highlight karne ke liye ─────────────────── */
const DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const todayName = DAYS[new Date().getDay()];

const OpeningHours = () => {
  const [text, setText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [typingDone, setTypingDone] = useState(false);
  const fullText = "Experience Luxury Dining";

  /* Typewriter */
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) { clearInterval(interval); setTypingDone(true); }
    }, 75);
    return () => clearInterval(interval);
  }, []);

  /* Cursor blink */
  useEffect(() => {
    const blink = setInterval(() => setCursorVisible(v => !v), 530);
    return () => clearInterval(blink);
  }, []);

  const schedule = [
    { day: "Monday",    time: "9:00 AM – 11:00 PM" },
    { day: "Tuesday",   time: "9:00 AM – 11:00 PM" },
    { day: "Wednesday", time: "9:00 AM – 11:00 PM" },
    { day: "Thursday",  time: "9:00 AM – 11:00 PM" },
    { day: "Friday",    time: "9:00 AM – 11:00 PM" },
    { day: "Saturday",  time: "10:00 AM – 12:00 AM" },
    { day: "Sunday",    time: "Closed" },
  ];

  const leftProducts  = [products[0], products[1], products[2]];
  const rightProducts = [products[3], products[4], products[5]];

  return (
    <section className="relative w-full min-h-screen overflow-hidden font-lora">

      {/* ── Global fonts ──────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=Lora:wght@400;500;600&display=swap');
        .font-playfair { font-family: 'Playfair Display', Georgia, serif; }
        .font-lora     { font-family: 'Lora', Georgia, serif; }

        @keyframes gradientShift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatUp {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-10px); }
        }
        @keyframes orbDrift {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(30px,-20px) scale(1.05); }
          66%      { transform: translate(-15px,25px) scale(0.97); }
        }
        @keyframes sparkle {
          0%,100% { opacity:0; transform:scale(0.5) rotate(0deg); }
          50%      { opacity:1; transform:scale(1.2) rotate(180deg); }
        }
        @keyframes shimmerLine {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #ea580c 0%, #f97316 25%, #fed7aa 50%, #f97316 75%, #ea580c 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmerLine 4s linear infinite;
        }
        .product-card { transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1); }
        .product-card:hover { transform: translateY(-6px) scale(1.04); }
        .schedule-row { transition: all 0.2s ease; }
        .schedule-row:hover { background: rgba(234,88,12,0.06); border-radius: 10px; padding-left: 10px; padding-right: 10px; }
      `}</style>

      {/* ── VIDEO BACKGROUND ──────────────────────────────── */}
      <video autoPlay loop muted playsInline
        className="absolute inset-0 w-full h-full object-cover">
        <source src={assets.restaurant} type="video/mp4" />
      </video>

      {/* ── Layered overlays for depth ────────────────────── */}
      {/* Base dark */}
      <div className="absolute inset-0 bg-black/65" />
      {/* Warm orange tint from bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-orange-950/50 via-transparent to-black/20" />
      {/* Vignette sides */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />

      {/* ── Ambient glow orbs ─────────────────────────────── */}
      <div className="absolute pointer-events-none"
        style={{
          width:600, height:600, top:-150, left:-200, borderRadius:"50%",
          background:"radial-gradient(circle, rgba(234,88,12,0.12) 0%, transparent 70%)",
          animation:"orbDrift 20s ease-in-out infinite",
        }}/>
      <div className="absolute pointer-events-none"
        style={{
          width:500, height:500, bottom:-100, right:-150, borderRadius:"50%",
          background:"radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)",
          animation:"orbDrift 25s ease-in-out infinite reverse",
        }}/>

      {/* ── Floating sparkles (subtle) ────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(18)].map((_,i) => (
          <div key={i} className="absolute"
            style={{
              top:`${10 + Math.random()*80}%`,
              left:`${5 + Math.random()*90}%`,
              width: i%3===0 ? 3 : 2,
              height: i%3===0 ? 3 : 2,
              borderRadius:"50%",
              background: i%4===0 ? "#fed7aa" : "#f97316",
              opacity: 0.4 + Math.random()*0.4,
              animation:`sparkle ${2.5+Math.random()*3}s ease-in-out infinite`,
              animationDelay:`${Math.random()*4}s`,
            }}/>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════
          MAIN CONTENT
      ════════════════════════════════════════════════════ */}
      <div className="relative z-10 flex flex-col items-center justify-start pt-20 pb-24 px-4 min-h-screen">

        {/* ── Badge ────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.8, ease:[0.22,1,0.36,1] }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full"
            style={{
              background:"rgba(255,255,255,0.08)",
              border:"1px solid rgba(249,115,22,0.35)",
              backdropFilter:"blur(12px)",
              boxShadow:"0 0 30px rgba(234,88,12,0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}>
            <span style={{color:"rgba(253,186,116,0.7)", fontSize:"0.55rem", letterSpacing:"0.3em"}}>✦✦✦</span>
            <span className="font-lora font-semibold uppercase tracking-[0.25em] text-orange-200"
              style={{fontSize:"0.65rem"}}>
              Est. 2019 · Lahore
            </span>
            <span style={{color:"rgba(253,186,116,0.7)", fontSize:"0.55rem", letterSpacing:"0.3em"}}>✦✦✦</span>
          </div>
        </motion.div>

        {/* ── Main Heading ─────────────────────────────────── */}
        <motion.div className="text-center mb-4"
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.9, delay:0.1 }}>
          <h1 className="font-playfair font-black text-white leading-none mb-2"
            style={{ fontSize:"clamp(2.2rem,6vw,5rem)", letterSpacing:"-0.01em",
                     textShadow:"0 4px 40px rgba(0,0,0,0.5)" }}>
            {text}
            <span style={{
              opacity: cursorVisible ? 1 : 0,
              color:"#f97316",
              transition:"opacity 0.1s",
              fontWeight:300,
            }}>|</span>
          </h1>

          <h2 className="font-playfair italic shimmer-text"
            style={{ fontSize:"clamp(1.1rem,3vw,2rem)", fontWeight:400 }}>
            Taste the Best Moments
          </h2>
        </motion.div>

        {/* ── Subtext ───────────────────────────────────────── */}
        <motion.p className="font-lora text-orange-100/70 text-sm md:text-base mb-10 max-w-md text-center leading-relaxed"
          style={{ letterSpacing:"0.04em" }}
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5, duration:0.8 }}>
          Premium dining experience with world-class taste & ambience
        </motion.p>

        {/* ── OPENING HOURS CARD ───────────────────────────── */}
        <motion.div
          initial={{ opacity:0, y:40, scale:0.95 }}
          whileInView={{ opacity:1, y:0, scale:1 }}
          transition={{ duration:0.7, ease:[0.22,1,0.36,1] }}
          className="w-full max-w-lg relative"
        >
          {/* Outer glow border */}
          <div className="absolute -inset-px rounded-3xl"
            style={{
              background:"linear-gradient(135deg, rgba(249,115,22,0.5), rgba(255,255,255,0.05) 50%, rgba(249,115,22,0.4))",
              borderRadius:28,
            }}/>

          <div className="relative rounded-3xl overflow-hidden"
            style={{
              background:"rgba(253,246,238,0.93)",
              backdropFilter:"blur(24px)",
              boxShadow:"0 40px 100px rgba(0,0,0,0.5), 0 0 0 1px rgba(249,115,22,0.08)",
              borderRadius:27,
            }}>

            {/* Card top accent */}
            <div className="h-1 w-full"
              style={{background:"linear-gradient(90deg, #c2410c, #f97316, #fed7aa, #f97316, #c2410c)"}}/>

            <div className="px-8 pt-8 pb-8">

              {/* Card heading */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 mb-3">
                  <div className="h-px w-8" style={{background:"linear-gradient(90deg,transparent,rgba(234,88,12,0.4))"}}/>
                  <span className="font-lora text-[0.6rem] tracking-[0.25em] uppercase text-orange-400 font-medium">
                    We are open
                  </span>
                  <div className="h-px w-8" style={{background:"linear-gradient(90deg,rgba(234,88,12,0.4),transparent)"}}/>
                </div>
                <h2 className="font-playfair font-black text-stone-800 leading-none"
                  style={{fontSize:"clamp(1.6rem,4vw,2.4rem)"}}>
                  Opening{" "}
                  <span className="shimmer-text" style={{fontStyle:"italic"}}>Hours</span>
                </h2>
              </div>

              {/* Schedule rows */}
              <div className="space-y-1 mb-6">
                {schedule.map((item, idx) => {
                  const isToday   = item.day === todayName;
                  const isClosed  = item.time === "Closed";
                  return (
                    <motion.div
                      key={idx}
                      className="schedule-row flex items-center justify-between py-2.5 px-3 cursor-default"
                      initial={{ opacity:0, x:30 }}
                      whileInView={{ opacity:1, x:0 }}
                      transition={{ delay: idx * 0.07, duration:0.4 }}
                      style={{
                        borderBottom: idx < schedule.length-1 ? "1px solid rgba(234,88,12,0.1)" : "none",
                        background: isToday ? "rgba(234,88,12,0.07)" : "transparent",
                        borderRadius: isToday ? 10 : 0,
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        {/* Today indicator dot */}
                        <div className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{
                            background: isToday ? "#f97316" : "rgba(234,88,12,0.15)",
                            boxShadow: isToday ? "0 0 6px rgba(249,115,22,0.7)" : "none",
                          }}/>
                        <span className="font-lora font-semibold text-stone-700"
                          style={{
                            fontSize:"0.9rem",
                            color: isToday ? "#c2410c" : "#44403c",
                            fontWeight: isToday ? 700 : 500,
                          }}>
                          {item.day}
                          {isToday && (
                            <span className="ml-2 text-[0.55rem] tracking-widest uppercase font-bold"
                              style={{color:"#f97316", letterSpacing:"0.2em"}}>Today</span>
                          )}
                        </span>
                      </div>
                      <span className="font-lora font-semibold tabular-nums"
                        style={{
                          fontSize:"0.85rem",
                          color: isClosed ? "#ef4444" : isToday ? "#c2410c" : "#7c6250",
                          fontWeight: isToday ? 700 : 500,
                        }}>
                        {isClosed ? "✕ Closed" : item.time}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px" style={{background:"linear-gradient(90deg,transparent,rgba(234,88,12,0.2))"}}/>
                <span style={{color:"rgba(234,88,12,0.35)", fontSize:"0.55rem", letterSpacing:"0.2em"}}>◆ ◆ ◆</span>
                <div className="flex-1 h-px" style={{background:"linear-gradient(90deg,rgba(234,88,12,0.2),transparent)"}}/>
              </div>

              {/* Contact section */}
              <motion.div
                initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }}
                transition={{ delay:0.5, duration:0.5 }}
                className="rounded-2xl p-5 relative overflow-hidden"
                style={{
                  background:"linear-gradient(135deg, rgba(234,88,12,0.07) 0%, rgba(255,237,213,0.5) 100%)",
                  border:"1px solid rgba(234,88,12,0.18)",
                }}>

                {/* Contact inner top line */}
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{background:"linear-gradient(90deg,transparent,rgba(234,88,12,0.35),transparent)"}}/>

                <div className="flex items-start gap-4">
                  {/* Phone column */}
                  <div className="flex-1">
                    <p className="font-lora text-[0.58rem] tracking-[0.2em] uppercase text-orange-400 mb-1 font-medium">
                      Reservations
                    </p>
                    <p className="font-playfair font-bold text-orange-700 leading-tight"
                      style={{fontSize:"clamp(1rem,2.5vw,1.3rem)"}}>
                      📞 +92 300 1234567
                    </p>
                  </div>
                  {/* Divider */}
                  <div className="w-px self-stretch" style={{background:"rgba(234,88,12,0.15)"}}/>
                  {/* Address column */}
                  <div className="flex-1">
                    <p className="font-lora text-[0.58rem] tracking-[0.2em] uppercase text-orange-400 mb-1 font-medium">
                      Location
                    </p>
                    <p className="font-lora font-semibold text-stone-700 leading-snug"
                      style={{fontSize:"0.85rem"}}>
                      🏠 123 Food Street<br/>
                      <span className="text-stone-500 font-normal">Lahore, Pakistan</span>
                    </p>
                  </div>
                </div>
              </motion.div>

            </div>

            {/* Card bottom accent */}
            <div className="h-0.5 w-full"
              style={{background:"linear-gradient(90deg,transparent,rgba(234,88,12,0.3),transparent)"}}/>
          </div>
        </motion.div>

      </div>

      {/* ════════════════════════════════════════════════════
          LEFT PRODUCT CARDS
      ════════════════════════════════════════════════════ */}
      <div className="absolute left-4 xl:left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 z-10">
        {leftProducts.map((prod, i) => (
          <motion.div
            key={i}
            className="product-card cursor-pointer"
            initial={{ opacity:0, x:-40 }}
            whileInView={{ opacity:1, x:0 }}
            transition={{ delay: i*0.12, duration:0.6, ease:[0.22,1,0.36,1] }}
          >
            <div className="relative overflow-hidden rounded-2xl"
              style={{
                background:"rgba(253,246,238,0.92)",
                backdropFilter:"blur(16px)",
                border:"1px solid rgba(234,88,12,0.2)",
                boxShadow:"0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)",
                padding:"14px 18px 14px 14px",
              }}>
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-0.5"
                style={{background:"linear-gradient(90deg,#ea580c,#f97316,transparent)"}}/>

              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  <img src={prod.img}
                    className="w-16 h-16 rounded-xl object-cover"
                    style={{
                      border:"2px solid rgba(234,88,12,0.25)",
                      boxShadow:"0 4px 16px rgba(234,88,12,0.2)",
                    }}/>
                  {/* Small orange dot */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-orange-500 border-2 border-orange-50"
                    style={{boxShadow:"0 0 6px rgba(249,115,22,0.6)"}}/>
                </div>
                <div>
                  <p className="font-playfair font-bold text-stone-800 leading-tight"
                    style={{fontSize:"0.88rem", maxWidth:100}}>
                    {prod.name}
                  </p>
                  <p className="font-lora font-semibold text-orange-600 mt-0.5"
                    style={{fontSize:"0.82rem"}}>
                    {prod.price}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════
          RIGHT PRODUCT CARDS
      ════════════════════════════════════════════════════ */}
      <div className="absolute right-4 xl:right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 z-10">
        {rightProducts.map((prod, i) => (
          <motion.div
            key={i}
            className="product-card cursor-pointer"
            initial={{ opacity:0, x:40 }}
            whileInView={{ opacity:1, x:0 }}
            transition={{ delay: i*0.12, duration:0.6, ease:[0.22,1,0.36,1] }}
          >
            <div className="relative overflow-hidden rounded-2xl"
              style={{
                background:"rgba(253,246,238,0.92)",
                backdropFilter:"blur(16px)",
                border:"1px solid rgba(234,88,12,0.2)",
                boxShadow:"0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)",
                padding:"14px 14px 14px 18px",
              }}>
              <div className="absolute top-0 left-0 right-0 h-0.5"
                style={{background:"linear-gradient(90deg,transparent,#f97316,#ea580c)"}}/>

              <div className="flex items-center gap-3">
                <div>
                  <p className="font-playfair font-bold text-stone-800 leading-tight text-right"
                    style={{fontSize:"0.88rem", maxWidth:100}}>
                    {prod.name}
                  </p>
                  <p className="font-lora font-semibold text-orange-600 mt-0.5 text-right"
                    style={{fontSize:"0.82rem"}}>
                    {prod.price}
                  </p>
                </div>
                <div className="relative flex-shrink-0">
                  <img src={prod.img}
                    className="w-16 h-16 rounded-xl object-cover"
                    style={{
                      border:"2px solid rgba(234,88,12,0.25)",
                      boxShadow:"0 4px 16px rgba(234,88,12,0.2)",
                    }}/>
                  <div className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-orange-500 border-2 border-orange-50"
                    style={{boxShadow:"0 0 6px rgba(249,115,22,0.6)"}}/>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </section>
  );
};

export default OpeningHours;