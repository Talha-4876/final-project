import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "../assets/assets";

// ─────────────────────────────────────────────
// Build carousel slides from assets.js products
// ─────────────────────────────────────────────
const CATEGORY_ORDER = [
  "fast food", "breakfast", "lunch",
  "dinner", "coffee", "cold-drinks", "juices",
];

function buildSlides(products) {
  const seen = new Set();
  const slides = [];
  for (const cat of CATEGORY_ORDER) {
    const item = products.find((p) => p.category === cat && !seen.has(p.id));
    if (item) { seen.add(item.id); slides.push(item); }
  }
  for (const p of products) {
    if (slides.length >= 8) break;
    if (!seen.has(p.id)) { seen.add(p.id); slides.push(p); }
  }
  return slides;
}

const MARQUEE_ITEMS = [
  "🍔 Burgers","🍕 Pizza","🌮 Wraps","🍟 Fries",
  "☕ Coffee","🧃 Juices","🍜 Noodles","🍱 Karahi",
  "🥤 Cold Drinks","🍰 Desserts",
];

const FLOAT_CARDS = [
  { emoji: "🍔", name: "Creamy Burger", price: "PKR 650" },
  { emoji: "🍕", name: "Pizza Slice",   price: "PKR 380" },
  { emoji: "☕", name: "Cold Brew",      price: "PKR 420" },
];

// ─────────────────────────────────────────────
// Styles injected as <style> tag
// ─────────────────────────────────────────────
const HERO_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,500;0,600;1,300&display=swap');

  .bb-root * { box-sizing: border-box; margin: 0; padding: 0; }

  .bb-hero {
    min-height: 100vh;
    background: #060401;
    font-family: 'DM Sans', sans-serif;
    display: grid;
    grid-template-columns: 1fr 1fr;
    position: relative;
    overflow: hidden;
  }

  @media (max-width: 820px) {
    .bb-hero { grid-template-columns: 1fr; padding-bottom: 56px; }
    .bb-right { order: -1; padding: 3rem 1.5rem 1rem; }
    .bb-ring-system { width: 260px !important; height: 260px !important; }
    .bb-fcards { display: none; }
    .bb-left { padding: 2rem 1.5rem 4rem; }
  }

  /* Diagonal geo lines */
  .bb-geo {
    position: absolute; inset: 0; z-index: 0;
    opacity: .04; pointer-events: none; overflow: hidden;
  }

  /* Corner glows */
  .bb-glow-tr {
    position: absolute; top: 0; right: 0;
    width: 340px; height: 340px; z-index: 0; pointer-events: none;
    background: radial-gradient(circle at top right, rgba(255,80,0,.15) 0%, transparent 65%);
  }
  .bb-glow-bl {
    position: absolute; bottom: 40px; left: 0;
    width: 280px; height: 280px; z-index: 0; pointer-events: none;
    background: radial-gradient(circle at bottom left, rgba(255,120,0,.09) 0%, transparent 70%);
  }

  /* ── LEFT ─────────────────────────────────── */
  .bb-left {
    padding: 3.5rem 3rem 5.5rem;
    display: flex; flex-direction: column; gap: 1.6rem;
    z-index: 10; position: relative;
  }

  .bb-eyebrow {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 10px; font-weight: 600; letter-spacing: .22em;
    text-transform: uppercase; color: #ff9340;
  }
  .bb-eyebrow-dash { width: 28px; height: 1px; background: #ff9340; }

  .bb-headline {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(3.8rem, 6.5vw, 6.4rem);
    line-height: .93; letter-spacing: -.01em;
  }
  .bb-h-white  { color: #f5ede0; display: block; }
  .bb-h-stroke { -webkit-text-stroke: 2px #ff5500; color: transparent; display: block; }
  .bb-h-fill   { color: #ff5500; display: block; }

  .bb-desc {
    font-size: .9rem; color: #8a6e5a;
    line-height: 1.8; max-width: 350px; font-weight: 300;
  }

  .bb-pills { display: flex; gap: 8px; flex-wrap: wrap; }
  .bb-pill {
    font-size: 10px; font-weight: 600; letter-spacing: .1em;
    text-transform: uppercase; padding: 5px 12px; border-radius: 3px;
  }
  .bb-p-red   { background: #ff3d00; color: #fff; }
  .bb-p-amber { background: rgba(255,140,0,.12); color: #ffaa40; border: 1px solid rgba(255,140,0,.22); }
  .bb-p-ghost { background: rgba(255,255,255,.05); color: #c8b09a; border: 1px solid rgba(255,255,255,.1); }

  .bb-cta-row { display: flex; gap: 12px; align-items: center; }

  .bb-btn-primary {
    padding: 13px 30px; background: #ff4000; color: #fff;
    font-family: 'DM Sans', sans-serif; font-size: .85rem; font-weight: 600;
    border: none; border-radius: 3px; cursor: pointer; letter-spacing: .04em;
    transition: transform .15s, box-shadow .15s;
  }
  .bb-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(255,64,0,.42);
  }

  .bb-btn-outline {
    padding: 13px 24px; background: transparent; color: #ffaa40;
    font-family: 'DM Sans', sans-serif; font-size: .85rem; font-weight: 600;
    border: 1px solid rgba(255,170,64,.28); border-radius: 3px; cursor: pointer;
    letter-spacing: .04em; transition: border-color .2s, background .2s;
  }
  .bb-btn-outline:hover { border-color: #ffaa40; background: rgba(255,170,64,.07); }

  .bb-stats {
    display: flex; gap: 2.2rem;
    padding-top: 1.2rem; border-top: 1px solid rgba(255,255,255,.06);
  }
  .bb-stat-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.4rem; color: #f5ede0; line-height: 1; letter-spacing: .02em;
  }
  .bb-stat-suf   { color: #ff5500; font-size: 1.5rem; }
  .bb-stat-suf-s { color: #ff5500; font-size: 1.1rem; }
  .bb-stat-lbl {
    font-size: 10px; color: #5a4438;
    text-transform: uppercase; letter-spacing: .14em; margin-top: 4px;
  }

  /* ── RIGHT ────────────────────────────────── */
  .bb-right {
    z-index: 10; position: relative;
    display: flex; align-items: center; justify-content: center;
    padding: 2rem 3rem 5.5rem;
  }

  .bb-ring-wrap {
    display: flex; flex-direction: column; align-items: center; gap: 0;
  }

  .bb-ring-system {
    position: relative; width: 360px; height: 360px;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }

  /* Individual rings */
  .bb-ring { position: absolute; border-radius: 50%; }

  .bb-r1 {
    inset: -24px;
    border: 1px dashed rgba(255,120,0,.15);
    animation: bbCW 24s linear infinite;
  }
  .bb-r2 {
    inset: -10px;
    background: conic-gradient(
      #ff4000 0deg,#ff4000 28deg,transparent 28deg,transparent 62deg,
      #ff8c00 62deg,#ff8c00 88deg,transparent 88deg,transparent 145deg,
      #ffaa40 145deg,#ffaa40 162deg,transparent 162deg,transparent 218deg,
      #ff4000 218deg,#ff4000 252deg,transparent 252deg,transparent 308deg,
      #ff8c00 308deg,#ff8c00 335deg,transparent 335deg,transparent 360deg
    );
    animation: bbCW 8s linear infinite;
  }
  .bb-r2::after {
    content:''; position:absolute; inset:5px;
    border-radius:50%; background:#060401;
  }
  .bb-r3 {
    inset: 0;
    border: 1.5px solid rgba(255,90,0,.22);
    box-shadow: inset 0 0 50px rgba(255,60,0,.1), 0 0 50px rgba(255,60,0,.08);
  }
  .bb-r4 {
    inset: 10px;
    background: conic-gradient(
      rgba(255,64,0,.55) 0deg,rgba(255,64,0,.55) 14deg,transparent 14deg,transparent 48deg,
      rgba(255,140,0,.45) 48deg,rgba(255,140,0,.45) 58deg,transparent 58deg,transparent 108deg,
      rgba(255,64,0,.4) 108deg,rgba(255,64,0,.4) 120deg,transparent 120deg,transparent 204deg,
      rgba(255,140,0,.55) 204deg,rgba(255,140,0,.55) 228deg,transparent 228deg,transparent 290deg,
      rgba(255,64,0,.5) 290deg,rgba(255,64,0,.5) 308deg,transparent 308deg,transparent 360deg
    );
    animation: bbCCW 5.5s linear infinite;
  }
  .bb-r4::after {
    content:''; position:absolute; inset:5px;
    border-radius:50%; background:#060401;
  }

  /* Image inside rings */
  .bb-img-circle {
    position: absolute; inset: 20px; border-radius: 50%;
    overflow: hidden; z-index: 5;
    box-shadow: 0 0 0 1px rgba(255,100,0,.15), 0 0 90px rgba(255,60,0,.2);
  }
  .bb-img-circle img {
    width: 100%; height: 100%; object-fit: cover;
    border-radius: 50%; display: block;
  }

  /* Floating cards */
  .bb-fcards { pointer-events: none; }
  .bb-fc {
    position: absolute; z-index: 20;
    background: rgba(6,3,0,.86);
    backdrop-filter: blur(14px);
    border: 1px solid rgba(255,140,0,.17);
    border-radius: 6px; padding: 9px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px; font-weight: 600; color: #f0e0cc;
    white-space: nowrap;
  }
  .bb-fc-price {
    display: block; font-size: 10px; font-weight: 400;
    color: #ff8c40; margin-top: 2px; letter-spacing: .05em;
  }
  .bb-fc-0 { top: 10px;   left: -55px; }
  .bb-fc-1 { bottom: 25px; left: -45px; }
  .bb-fc-2 { top: 45px;   right: -55px; }

  /* Food name */
  .bb-food-name {
    margin-top: 1.4rem; text-align: center;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1rem; letter-spacing: .14em; color: #ff8c40;
    min-height: 1.4rem; min-width: 200px;
  }

  /* Dots */
  .bb-dots { display: flex; gap: 7px; justify-content: center; margin-top: .8rem; }
  .bb-dot {
    height: 3px; border-radius: 2px;
    border: none; padding: 0; cursor: pointer;
    transition: width .3s, background .3s;
  }

  /* Marquee */
  .bb-marquee {
    position: absolute; bottom: 0; left: 0; right: 0;
    border-top: 1px solid rgba(255,100,0,.1);
    background: rgba(255,60,0,.04);
    padding: 9px 0; overflow: hidden; z-index: 30;
  }
  .bb-marquee-track { display: flex; width: max-content; will-change: transform; }
  .bb-mi  { font-size: 10px; font-weight: 600; letter-spacing: .18em; text-transform: uppercase; color: #8a5030; padding: 0 28px; white-space: nowrap; }
  .bb-sep { color: rgba(255,100,0,.25); padding: 0 4px; font-size: 10px; }

  /* Animations */
  @keyframes bbCW  { from { transform: rotate(0deg);   } to { transform: rotate(360deg);  } }
  @keyframes bbCCW { from { transform: rotate(0deg);   } to { transform: rotate(-360deg); } }
`;

// ─────────────────────────────────────────────
// Framer-motion variants
// ─────────────────────────────────────────────
const vLeft  = { hidden: { opacity: 0, x: -32 }, show: { opacity: 1, x: 0 } };
const vRight = { hidden: { opacity: 0, x:  32 }, show: { opacity: 1, x: 0 } };
const vDown  = { hidden: { opacity: 0, y: -18 }, show: { opacity: 1, y: 0 } };
const vUp    = { hidden: { opacity: 0, y:  18 }, show: { opacity: 1, y: 0 } };

// ─────────────────────────────────────────────
// Hero Component
// ─────────────────────────────────────────────
export default function Hero() {
  const slides    = buildSlides(products);
  const [cur, setCur] = useState(0);
  const trackRef  = useRef(null);
  const rafRef    = useRef(null);
  const lastTsRef = useRef(null);
  const xRef      = useRef(0);

  // Auto-advance carousel
  useEffect(() => {
    const t = setInterval(() => setCur((c) => (c + 1) % slides.length), 3200);
    return () => clearInterval(t);
  }, [slides.length]);

  // Marquee rAF loop
  useEffect(() => {
    const loop = (ts) => {
      if (lastTsRef.current != null && trackRef.current) {
        xRef.current -= (ts - lastTsRef.current) * 0.028;
        const third = trackRef.current.scrollWidth / 3;
        if (xRef.current <= -third) xRef.current += third;
        trackRef.current.style.transform = `translateX(${xRef.current}px)`;
      }
      lastTsRef.current = ts;
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleViewMenu = useCallback(() => {
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const marqueeContent = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="bb-root">
      <style>{HERO_CSS}</style>

      <section id="hero" className="bb-hero">

        {/* Geo lines */}
        <svg className="bb-geo" viewBox="0 0 900 700" preserveAspectRatio="none">
          {[0, 100, 200, 300, 400].map((x) => (
            <line key={x} x1={x} y1="700" x2={x + 500} y2="0" stroke="#ff8c00" strokeWidth=".4" />
          ))}
          <line x1="0" y1="0" x2="900" y2="700" stroke="#ff8c00" strokeWidth=".4" />
          <line x1="0" y1="350" x2="900" y2="350" stroke="#ff8c00" strokeWidth=".4" />
          <line x1="0" y1="175" x2="900" y2="175" stroke="#ff8c00" strokeWidth=".4" />
          <line x1="0" y1="525" x2="900" y2="525" stroke="#ff8c00" strokeWidth=".4" />
        </svg>
        <div className="bb-glow-tr" />
        <div className="bb-glow-bl" />

        {/* ── LEFT TEXT ────────────────────────────── */}
        <div className="bb-left">

          <motion.div
            className="bb-eyebrow"
            variants={vDown} initial="hidden" animate="show"
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="bb-eyebrow-dash" />
            🔥 Now Open · Giddar Kotha, Lahore
          </motion.div>

          <motion.h1
            className="bb-headline"
            variants={vLeft} initial="hidden" animate="show"
            transition={{ duration: 0.75, delay: 0.25 }}
          >
            <span className="bb-h-white">Fast Food</span>
            <span className="bb-h-stroke">Ka Asli</span>
            <span className="bb-h-fill">Boss</span>
          </motion.h1>

          <motion.p
            className="bb-desc"
            variants={vLeft} initial="hidden" animate="show"
            transition={{ duration: 0.7, delay: 0.42 }}
          >
            Fresh, hot aur pyaar se bana — desi karahi se lekar cold brews tak,
            sab ek jagah milega Bite Boss pe.
          </motion.p>

          <motion.div
            className="bb-pills"
            variants={vUp} initial="hidden" animate="show"
            transition={{ duration: 0.6, delay: 0.56 }}
          >
            <span className="bb-pill bb-p-red">🌶 Spicy</span>
            <span className="bb-pill bb-p-amber">🍔 Burgers</span>
            <span className="bb-pill bb-p-ghost">☕ Coffee</span>
            <span className="bb-pill bb-p-ghost">✨ New Menu</span>
          </motion.div>

          <motion.div
            className="bb-cta-row"
            variants={vUp} initial="hidden" animate="show"
            transition={{ duration: 0.6, delay: 0.68 }}
          >
            <motion.button
              className="bb-btn-primary"
              whileHover={{ scale: 1.04, boxShadow: "0 14px 30px rgba(255,64,0,.45)" }}
              whileTap={{ scale: 0.97 }}
              onClick={handleViewMenu}
            >
              View Menu →
            </motion.button>
            <motion.button
              className="bb-btn-outline"
              whileHover={{ borderColor: "#ffaa40", backgroundColor: "rgba(255,170,64,.07)" }}
            >
              Reserve Table
            </motion.button>
          </motion.div>

          <motion.div
            className="bb-stats"
            variants={vUp} initial="hidden" animate="show"
            transition={{ duration: 0.6, delay: 0.82 }}
          >
            <div>
              <div className="bb-stat-num">200<span className="bb-stat-suf">+</span></div>
              <div className="bb-stat-lbl">Menu Items</div>
            </div>
            <div>
              <div className="bb-stat-num">4.9<span className="bb-stat-suf">★</span></div>
              <div className="bb-stat-lbl">Rating</div>
            </div>
            <div>
              <div className="bb-stat-num">30<span className="bb-stat-suf-s">min</span></div>
              <div className="bb-stat-lbl">Delivery</div>
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT IMAGE CAROUSEL ─────────────────── */}
        <motion.div
          className="bb-right"
          variants={vRight} initial="hidden" animate="show"
          transition={{ duration: 0.85, delay: 0.35 }}
        >
          <div className="bb-ring-wrap">
            <div className="bb-ring-system">

              {/* Spinning rings */}
              <div className="bb-ring bb-r1" />
              <div className="bb-ring bb-r2" />
              <div className="bb-ring bb-r3" />
              <div className="bb-ring bb-r4" />

              {/* Carousel image */}
              <div className="bb-img-circle">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={cur}
                    src={slides[cur].img}
                    alt={slides[cur].name}
                    initial={{ opacity: 0, scale: 1.08, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1,    rotate: 0  }}
                    exit={{    opacity: 0, scale: 0.94,  rotate: 4  }}
                    transition={{ duration: 0.62, ease: "easeInOut" }}
                  />
                </AnimatePresence>
              </div>

              {/* Floating info cards */}
              <div className="bb-fcards">
                {FLOAT_CARDS.map((fc, i) => (
                  <motion.div
                    key={i}
                    className={`bb-fc bb-fc-${i}`}
                    animate={{ y: [0, i % 2 === 0 ? -9 : 8, 0] }}
                    transition={{
                      duration: 3.5 + i * 0.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 1.1,
                    }}
                  >
                    {fc.emoji} {fc.name}
                    <span className="bb-fc-price">{fc.price}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Animated food name */}
            <AnimatePresence mode="wait">
              <motion.p
                key={cur + "_label"}
                className="bb-food-name"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{    opacity: 0, y: -8 }}
                transition={{ duration: 0.32 }}
              >
                {slides[cur].name}
              </motion.p>
            </AnimatePresence>

            {/* Dot indicators */}
            <div className="bb-dots">
              {slides.map((_, i) => (
                <motion.button
                  key={i}
                  className="bb-dot"
                  style={{
                    width: i === cur ? 20 : 8,
                    background: i === cur ? "#ff5500" : "rgba(255,255,255,.14)",
                  }}
                  onClick={() => setCur(i)}
                  whileHover={{ scale: 1.4 }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Scrolling marquee ─────────────────────── */}
        <div className="bb-marquee">
          <div className="bb-marquee-track" ref={trackRef}>
            {marqueeContent.map((item, i) => (
              <React.Fragment key={i}>
                <span className="bb-mi">{item}</span>
                <span className="bb-sep">·</span>
              </React.Fragment>
            ))}
          </div>
        </div>

      </section>
    </div>
  );
}