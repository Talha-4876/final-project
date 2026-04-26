import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import aboutVideo from "../assets/about.mp4";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');

  :root {
    --cream: #fdf6ee;
    --cream-mid: #f5e8d4;
    --cream-deep: #ecdcc4;
    --orange: #e8610a;
    --orange-light: #f97316;
    --orange-pale: #fde8d8;
    --orange-glow: rgba(232,97,10,0.18);
    --text-dark: #2a1a0e;
    --text-mid: #7a5230;
    --text-soft: #b07040;
  }

  @keyframes floatOrb {
    0%,100% { transform: translate(0,0) scale(1); }
    33% { transform: translate(25px,-18px) scale(1.04); }
    66% { transform: translate(-12px,22px) scale(0.97); }
  }
  @keyframes shimmerText {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes drawLine {
    from { width: 0; }
    to   { width: 100%; }
  }
  @keyframes pulseRing {
    0%,100% { box-shadow: 0 0 0 0 rgba(232,97,10,0.0), 0 0 0 8px rgba(232,97,10,0.08); }
    50%      { box-shadow: 0 0 0 8px rgba(232,97,10,0.12), 0 0 0 20px rgba(232,97,10,0.04); }
  }

  .shimmer-orange {
    background: linear-gradient(90deg, #e8610a 0%, #f97316 25%, #c2410c 50%, #f97316 75%, #e8610a 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmerText 5s linear infinite;
  }

  .tag-pill {
    transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
    cursor: default;
  }
  .tag-pill:hover {
    background: rgba(232,97,10,0.14) !important;
    border-color: rgba(232,97,10,0.45) !important;
    transform: translateY(-3px) scale(1.04);
    box-shadow: 0 6px 20px rgba(232,97,10,0.15);
  }

  .ctrl-btn {
    transition: all 0.2s ease;
    border-radius: 8px;
  }
  .ctrl-btn:hover {
    background: rgba(232,97,10,0.15);
    color: #e8610a !important;
  }

  .about-video-frame {
    transition: box-shadow 0.4s ease;
  }
  .about-video-frame:hover {
    box-shadow:
      0 0 0 1px rgba(232,97,10,0.2),
      0 40px 100px -16px rgba(232,97,10,0.22),
      0 8px 32px rgba(0,0,0,0.06) !important;
  }

  .progress-track {
    height: 3px;
    transition: height 0.2s ease;
  }
  .progress-track:hover { height: 5px; }
`;

/* ── Icons ─────────────────────────────────────────────── */
const PlayIcon  = () => <svg viewBox="0 0 24 24" fill="currentColor" style={{width:20,height:20}}><path d="M8 5v14l11-7z"/></svg>;
const PauseIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" style={{width:20,height:20}}><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>;
const RewIcon   = () => <svg viewBox="0 0 24 24" fill="currentColor" style={{width:18,height:18}}><path d="M11 18V6l-8.5 6 8.5 6zm.5-6 8.5 6V6l-8.5 6z"/></svg>;
const FwdIcon   = () => <svg viewBox="0 0 24 24" fill="currentColor" style={{width:18,height:18}}><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/></svg>;
const VolIcon   = ({m}) => m
  ? <svg viewBox="0 0 24 24" fill="currentColor" style={{width:18,height:18}}><path d="M16.5 12A4.5 4.5 0 0014 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-3-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0017.73 18l2 2L21 18.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z"/></svg>
  : <svg viewBox="0 0 24 24" fill="currentColor" style={{width:18,height:18}}><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>;
const FsIcon    = () => <svg viewBox="0 0 24 24" fill="currentColor" style={{width:18,height:18}}><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>;

/* ── Progress Bar ──────────────────────────────────────── */
const ProgressBar = ({ value, onChange, onHover, onLeave, tooltip, tooltipPos, videoSrc, formatTime }) => (
  <div className="relative group" onMouseMove={onHover} onMouseLeave={onLeave}>
    {tooltip != null && (
      <div className="absolute bottom-8 z-50 pointer-events-none"
        style={{ left: `${tooltipPos}%`, transform: "translateX(-50%)" }}>
        <div className="rounded-xl overflow-hidden w-32"
          style={{ border:"1px solid rgba(232,97,10,0.3)", boxShadow:"0 8px 32px rgba(232,97,10,0.15)" }}>
          <video src={videoSrc} muted autoPlay className="w-full" style={{ currentTime: tooltip }} />
        </div>
        <div className="mt-1.5 mx-auto w-fit px-2.5 py-0.5 rounded-full text-center"
          style={{ background:"rgba(232,97,10,0.12)", color:"#e8610a", fontSize:"0.65rem",
                   fontWeight:600, border:"1px solid rgba(232,97,10,0.25)", letterSpacing:"0.04em" }}>
          {formatTime(tooltip)}
        </div>
      </div>
    )}
    <div className="progress-track relative rounded-full cursor-pointer"
      style={{ background:"rgba(232,97,10,0.15)" }}>
      <div className="absolute left-0 top-0 h-full rounded-full"
        style={{ width:`${value}%`, background:"linear-gradient(90deg,#c2410c,#f97316)",
                 boxShadow:"0 0 8px rgba(232,97,10,0.5)" }} />
      <div className="absolute top-1/2 w-3.5 h-3.5 rounded-full opacity-0 group-hover:opacity-100"
        style={{ left:`${value}%`, transform:"translateX(-50%) translateY(-50%)",
                 background:"#e8610a", transition:"opacity 0.2s",
                 boxShadow:"0 0 0 3px rgba(232,97,10,0.25), 0 0 12px rgba(232,97,10,0.5)" }} />
      <input type="range" value={value} min="0" max="100" onChange={onChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
    </div>
  </div>
);

/* ── Main Component ────────────────────────────────────── */
const About = () => {
  const videoRef       = useRef(null);
  const containerRef   = useRef(null);
  const ctrlTimeout    = useRef(null);

  const [isPlaying,    setIsPlaying]    = useState(false);
  const [progress,     setProgress]     = useState(0);
  const [duration,     setDuration]     = useState(0);
  const [volume,       setVolume]       = useState(1);
  const [muted,        setMuted]        = useState(false);
  const [speed,        setSpeed]        = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [tooltip,      setTooltip]      = useState(null);
  const [tooltipPos,   setTooltipPos]   = useState(0);
  const [skipAnim,     setSkipAnim]     = useState(null);

  const togglePlay = () => {
    const v = videoRef.current;
    if (v.paused) { v.play(); setIsPlaying(true); }
    else          { v.pause(); setIsPlaying(false); }
  };

  useEffect(() => {
    const v = videoRef.current;
    const onTime   = () => setProgress((v.currentTime / v.duration) * 100);
    const onMeta   = () => setDuration(v.duration);
    const onEnded  = () => { setIsPlaying(false); setShowControls(true); };
    v.addEventListener("timeupdate",    onTime);
    v.addEventListener("loadedmetadata",onMeta);
    v.addEventListener("ended",         onEnded);
    return () => {
      v.removeEventListener("timeupdate",    onTime);
      v.removeEventListener("loadedmetadata",onMeta);
      v.removeEventListener("ended",         onEnded);
    };
  }, []);

  const changeProgress = (e) => {
    const p = e.target.value;
    videoRef.current.currentTime = (p / 100) * videoRef.current.duration;
    setProgress(p);
  };
  const changeVolume = (e) => {
    const vol = parseFloat(e.target.value);
    videoRef.current.volume = vol;
    setVolume(vol); setMuted(vol === 0);
  };
  const toggleMute = () => {
    videoRef.current.muted = !muted; setMuted(!muted);
  };
  const changeSpeed = (e) => {
    const sp = parseFloat(e.target.value);
    videoRef.current.playbackRate = sp; setSpeed(sp);
  };
  const skip = (sec) => { videoRef.current.currentTime += sec; };
  const handleDoubleClick = (e) => {
    const rect = videoRef.current.getBoundingClientRect();
    if (e.clientX - rect.left < rect.width / 2) { skip(-10); setSkipAnim("back"); }
    else                                          { skip(10);  setSkipAnim("forward"); }
    setTimeout(() => setSkipAnim(null), 700);
  };
  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!document.fullscreenElement) el.requestFullscreen();
    else document.exitFullscreen();
  };
  const formatTime = (sec) => {
    if (!sec || isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60), s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };
  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(ctrlTimeout.current);
    if (isPlaying) ctrlTimeout.current = setTimeout(() => setShowControls(false), 3000);
  };
  const progressHover = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct  = (e.clientX - rect.left) / rect.width;
    setTooltip(pct * (videoRef.current?.duration || 0));
    setTooltipPos(pct * 100);
  };

  const tags = ["Live Ordering", "Table Reservations", "Smart Menu", "Real-time Tracking"];

  return (
    <>
      <style>{STYLES}</style>

      <section className="relative overflow-hidden"
        style={{
          background: "linear-gradient(150deg, #fdf6ee 0%, #fef0e0 45%, #fdf6ee 100%)",
          padding: "6rem 1.5rem 7rem",
          fontFamily: "'Lora', Georgia, serif",
        }}>

        {/* ── Ambient orbs ─────────────────────────────── */}
        {[
          { w:560, h:560, top:-120, left:-160, op:0.55, dur:"20s" },
          { w:400, h:400, bottom:-100, right:-100, op:0.4, dur:"26s", rev:true },
          { w:280, h:280, top:"35%", right:"18%", op:0.3, dur:"16s" },
        ].map((o,i) => (
          <div key={i} className="absolute pointer-events-none rounded-full"
            style={{
              width:o.w, height:o.h,
              top:o.top, left:o.left, bottom:o.bottom, right:o.right,
              opacity:o.op,
              background:"radial-gradient(circle, rgba(232,97,10,0.22) 0%, rgba(249,115,22,0.06) 55%, transparent 75%)",
              filter:"blur(40px)",
              animation:`floatOrb ${o.dur} ease-in-out infinite ${o.rev?"reverse":""}`,
            }}/>
        ))}

        {/* Subtle dot grid texture */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage:"radial-gradient(circle, rgba(232,97,10,0.06) 1px, transparent 1px)",
          backgroundSize:"32px 32px", opacity:0.6,
        }}/>

        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0" style={{height:2,
          background:"linear-gradient(90deg, transparent 0%, rgba(232,97,10,0.5) 30%, rgba(249,115,22,0.8) 50%, rgba(232,97,10,0.5) 70%, transparent 100%)"
        }}/>

        {/* ── Section badge ─────────────────────────────── */}
        <motion.div className="flex justify-center mb-14"
          initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:0.8, ease:[0.22,1,0.36,1] }}>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:10,
            padding:"7px 22px", borderRadius:999,
            background:"linear-gradient(135deg, rgba(232,97,10,0.07), rgba(249,115,22,0.04))",
            border:"1px solid rgba(232,97,10,0.22)",
            boxShadow:"0 4px 20px rgba(232,97,10,0.08), inset 0 1px 0 rgba(255,255,255,0.7)",
          }}>
            <span style={{fontSize:"0.55rem", color:"rgba(232,97,10,0.5)", letterSpacing:"0.3em"}}>◆◆◆</span>
            <span style={{
              color:"#c2410c", fontSize:"0.62rem", letterSpacing:"0.28em",
              fontWeight:600, textTransform:"uppercase", fontFamily:"Lora,serif",
            }}>Our Story</span>
            <span style={{fontSize:"0.55rem", color:"rgba(232,97,10,0.5)", letterSpacing:"0.3em"}}>◆◆◆</span>
          </div>
        </motion.div>

        {/* ── Grid ─────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto" style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))",
          gap:"5rem",
          alignItems:"center",
        }}>

          {/* ── VIDEO ──────────────────────────────────── */}
          <motion.div initial={{ opacity:0, x:-40 }} animate={{ opacity:1, x:0 }}
            transition={{ duration:0.85, ease:[0.22,1,0.36,1] }}>

            {/* Decorative corner ornaments */}
            <div className="relative">
              {/* TL corner */}
              <div className="absolute -top-3 -left-3 w-8 h-8 pointer-events-none" style={{zIndex:2}}>
                <div style={{width:2,height:28,background:"linear-gradient(180deg,#e8610a,transparent)",position:"absolute",top:0,left:0}}/>
                <div style={{width:28,height:2,background:"linear-gradient(90deg,#e8610a,transparent)",position:"absolute",top:0,left:0}}/>
              </div>
              {/* BR corner */}
              <div className="absolute -bottom-3 -right-3 w-8 h-8 pointer-events-none" style={{zIndex:2}}>
                <div style={{width:2,height:28,background:"linear-gradient(0deg,#e8610a,transparent)",position:"absolute",bottom:0,right:0}}/>
                <div style={{width:28,height:2,background:"linear-gradient(270deg,#e8610a,transparent)",position:"absolute",bottom:0,right:0}}/>
              </div>

              {/* Video player */}
              <div ref={containerRef}
                className="about-video-frame relative w-full rounded-2xl overflow-hidden"
                style={{
                  aspectRatio:"16/10",
                  background:"#1a0a00",
                  boxShadow:"0 0 0 1px rgba(232,97,10,0.14), 0 32px 80px -12px rgba(232,97,10,0.18), 0 8px 24px rgba(0,0,0,0.08)",
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setTooltip(null)}>

                <video ref={videoRef} src={aboutVideo}
                  className="w-full h-full object-cover"
                  style={{ cursor:"pointer", opacity:0.97 }}
                  onClick={togglePlay} onDoubleClick={handleDoubleClick}/>

                {/* Soft vignette */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  background:"radial-gradient(ellipse at center, transparent 55%, rgba(42,10,2,0.35) 100%)",
                }}/>

                {/* Big play overlay */}
                <AnimatePresence>
                  {!isPlaying && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0,scale:0.9}}
                      transition={{duration:0.3}}
                      className="absolute inset-0 flex items-center justify-center cursor-pointer"
                      style={{background:"rgba(42,10,2,0.42)", backdropFilter:"blur(2px)"}}
                      onClick={togglePlay}>
                      <motion.div whileHover={{scale:1.1}} whileTap={{scale:0.93}}
                        style={{
                          width:76, height:76, borderRadius:"50%",
                          background:"linear-gradient(135deg, #f97316, #c2410c)",
                          boxShadow:"0 0 0 12px rgba(232,97,10,0.12), 0 0 0 28px rgba(232,97,10,0.05), 0 12px 40px rgba(194,65,12,0.45)",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          animation:"pulseRing 3s ease-in-out infinite",
                        }}>
                        <svg viewBox="0 0 24 24" fill="white" style={{width:30,height:30,marginLeft:4}}>
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Skip animation */}
                <AnimatePresence>
                  {skipAnim && (
                    <motion.div key={skipAnim}
                      initial={{opacity:0,scale:0.5}} animate={{opacity:1,scale:1}}
                      exit={{opacity:0,scale:1.3}} transition={{duration:0.28}}
                      className={`absolute top-1/2 -translate-y-1/2 ${skipAnim==="forward"?"right-8":"left-8"}`}>
                      <div style={{
                        display:"flex", flexDirection:"column", alignItems:"center", gap:6,
                        padding:"12px 20px", borderRadius:16,
                        background:"rgba(232,97,10,0.12)", backdropFilter:"blur(10px)",
                        border:"1px solid rgba(232,97,10,0.25)",
                      }}>
                        <span style={{fontSize:"1.4rem"}}>{skipAnim==="forward"?"⏩":"⏪"}</span>
                        <span style={{color:"#f97316",fontSize:"0.68rem",fontWeight:700,letterSpacing:"0.06em"}}>10 sec</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Controls */}
                <AnimatePresence>
                  {showControls && (
                    <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
                      exit={{opacity:0,y:6}} transition={{duration:0.22}}
                      className="absolute bottom-0 left-0 right-0"
                      style={{
                        padding:"40px 18px 14px",
                        background:"linear-gradient(to top, rgba(30,8,0,0.88) 0%, transparent 100%)",
                      }}>
                      <ProgressBar
                        value={progress} onChange={changeProgress}
                        onHover={progressHover} onLeave={() => setTooltip(null)}
                        tooltip={tooltip} tooltipPos={tooltipPos}
                        videoSrc={aboutVideo} formatTime={formatTime}
                      />

                      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:12,gap:8}}>
                        {/* Left */}
                        <div style={{display:"flex",alignItems:"center",gap:4}}>
                          <button className="ctrl-btn" onClick={() => skip(-10)}
                            style={{padding:"6px 8px",color:"rgba(255,255,255,0.55)",background:"none",border:"none",cursor:"pointer"}}>
                            <RewIcon/>
                          </button>
                          <button onClick={togglePlay}
                            style={{padding:"6px 8px",color:"#f97316",background:"none",border:"none",cursor:"pointer"}}>
                            {isPlaying ? <PauseIcon/> : <PlayIcon/>}
                          </button>
                          <button className="ctrl-btn" onClick={() => skip(10)}
                            style={{padding:"6px 8px",color:"rgba(255,255,255,0.55)",background:"none",border:"none",cursor:"pointer"}}>
                            <FwdIcon/>
                          </button>
                          <span style={{
                            marginLeft:8, color:"rgba(255,255,255,0.38)", fontSize:"0.7rem",
                            fontFamily:"monospace", letterSpacing:"0.03em",
                          }}>
                            {formatTime(videoRef.current?.currentTime||0)}
                            <span style={{color:"rgba(255,255,255,0.18)",margin:"0 4px"}}>/</span>
                            {formatTime(duration)}
                          </span>
                        </div>
                        {/* Right */}
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <button className="ctrl-btn" onClick={toggleMute}
                            style={{padding:"5px",color:"rgba(255,255,255,0.55)",background:"none",border:"none",cursor:"pointer"}}>
                            <VolIcon m={muted}/>
                          </button>
                          <div style={{position:"relative",width:64,height:3,borderRadius:999,
                            background:"rgba(232,97,10,0.2)",cursor:"pointer"}}>
                            <div style={{
                              position:"absolute",left:0,top:0,height:"100%",borderRadius:999,
                              width:`${muted?0:volume*100}%`,
                              background:"linear-gradient(90deg,#c2410c,#f97316)",
                            }}/>
                            <input type="range" min="0" max="1" step="0.05"
                              value={muted?0:volume} onChange={changeVolume}
                              style={{position:"absolute",inset:0,width:"100%",height:"100%",
                                opacity:0,cursor:"pointer"}}/>
                          </div>

                          <select value={speed} onChange={changeSpeed}
                            style={{
                              fontSize:"0.7rem", fontWeight:600, borderRadius:8,
                              padding:"4px 8px", border:"1px solid rgba(232,97,10,0.25)",
                              background:"rgba(232,97,10,0.1)", color:"#f97316",
                              outline:"none", cursor:"pointer", fontFamily:"Lora,serif",
                            }}>
                            {[0.25,0.5,0.75,1,1.25,1.5,2].map(s=>(
                              <option key={s} value={s} style={{background:"#2a1206"}}>{s}×</option>
                            ))}
                          </select>

                          <button className="ctrl-btn" onClick={toggleFullscreen}
                            style={{padding:"5px",color:"rgba(255,255,255,0.55)",background:"none",border:"none",cursor:"pointer"}}>
                            <FsIcon/>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* ── TEXT ───────────────────────────────────── */}
          <motion.div style={{display:"flex",flexDirection:"column",justifyContent:"center"}}
            initial={{opacity:0,x:40}} animate={{opacity:1,x:0}}
            transition={{duration:0.85,delay:0.2,ease:[0.22,1,0.36,1]}}>

            {/* Decorative rule */}
            <motion.div style={{display:"flex",alignItems:"center",gap:12,marginBottom:28}}
              initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4}}>
              <div style={{height:1,width:48,background:"linear-gradient(90deg,#e8610a,rgba(232,97,10,0.3))"}}/>
              <span style={{color:"rgba(232,97,10,0.4)",fontSize:"0.5rem",letterSpacing:"0.3em"}}>◆ ◆ ◆</span>
            </motion.div>

            {/* Heading */}
            <h2 style={{
              fontFamily:"'Playfair Display', Georgia, serif",
              fontSize:"clamp(2.8rem,5.5vw,4.8rem)",
              fontWeight:900,
              lineHeight:1.0,
              letterSpacing:"-0.01em",
              marginBottom:"1.6rem",
            }}>
              <span style={{color:"#2a1a0e",display:"block",marginBottom:"0.05em"}}>About</span>
              <span className="shimmer-orange" style={{display:"block"}}>Bite Boss</span>
            </h2>

            {/* Animated underline */}
            <motion.div style={{marginBottom:28,display:"flex",alignItems:"center",gap:10}}
              initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.55}}>
              <div style={{height:2,width:56,background:"linear-gradient(90deg,#e8610a,#f97316)",borderRadius:2}}/>
              <div style={{height:2,flex:1,background:"linear-gradient(90deg,rgba(232,97,10,0.18),transparent)",borderRadius:2}}/>
            </motion.div>

            {/* Body */}
            <motion.p style={{
              color:"#7a5230", fontSize:"1.12rem", lineHeight:1.85,
              fontFamily:"Lora, Georgia, serif", marginBottom:"1.1rem",
            }} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:0.5,duration:0.7}}>
              Bite Boss is a smart restaurant management platform that lets
              diners browse curated menus, place orders, and reserve tables —
              all in a few taps.
            </motion.p>

            <motion.p style={{
              color:"#b07040", fontSize:"0.98rem", lineHeight:1.9,
              fontFamily:"Lora, Georgia, serif", marginBottom:"2.2rem",
            }} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:0.62,duration:0.7}}>
              We marry modern interface design with powerful kitchen tools,
              so every dining experience — from discovery to dessert — feels
              effortless and delightful.
            </motion.p>

            {/* Tags */}
            <motion.div style={{display:"flex",flexWrap:"wrap",gap:10}}
              initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.72,duration:0.6}}>
              {tags.map((tag,i) => (
                <motion.span key={tag} className="tag-pill"
                  initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}}
                  transition={{delay:0.78+i*0.07,duration:0.4}}
                  style={{
                    display:"inline-block", padding:"8px 20px", borderRadius:999,
                    fontSize:"0.82rem", fontWeight:500, letterSpacing:"0.04em",
                    background:"rgba(232,97,10,0.07)",
                    color:"#c2410c",
                    border:"1px solid rgba(232,97,10,0.2)",
                    fontFamily:"Lora, serif",
                  }}>
                  {tag}
                </motion.span>
              ))}
            </motion.div>

            {/* Signature footer */}
            <motion.div style={{marginTop:44,paddingTop:28,borderTop:"1px solid rgba(232,97,10,0.1)"}}
              initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1,duration:0.8}}>
              <div style={{
                color:"rgba(194,65,12,0.38)", fontSize:"0.62rem",
                letterSpacing:"0.22em", textTransform:"uppercase",
                fontFamily:"Lora, serif",
              }}>
                ◆ &nbsp; Crafted with passion since 2019 &nbsp; ◆
              </div>
            </motion.div>

          </motion.div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0" style={{height:1,
          background:"linear-gradient(90deg, transparent, rgba(232,97,10,0.4), transparent)"}}/>
      </section>
    </>
  );
};

export default About;