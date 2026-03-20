import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import aboutVideo from "../assets/about.mp4";

const About = () => {
  const videoRef = useRef(null);
  const previewRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeout = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [tooltip, setTooltip] = useState(null);
  const [tooltipPos, setTooltipPos] = useState(0);
  const [skipAnim, setSkipAnim] = useState(null);

  // play pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // progress update
  useEffect(() => {
    const video = videoRef.current;
    const updateProgress = () => setProgress((video.currentTime / video.duration) * 100);
    const load = () => setDuration(video.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setShowControls(true);
    };
    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("loadedmetadata", load);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  // progress change
  const changeProgress = (e) => {
    const percent = e.target.value;
    videoRef.current.currentTime = (percent / 100) * videoRef.current.duration;
  };

  // volume
  const changeVolume = (e) => {
    const vol = parseFloat(e.target.value);
    videoRef.current.volume = vol;
    setVolume(vol);
  };

  // mute
  const toggleMute = () => {
    const video = videoRef.current;
    video.muted = !muted;
    setMuted(!muted);
  };

  // playback speed
  const changeSpeed = (e) => {
    const sp = parseFloat(e.target.value);
    videoRef.current.playbackRate = sp;
    setSpeed(sp);
  };

  // skip
  const skip = (sec) => {
    videoRef.current.currentTime += sec;
  };

  // double click skip
  const handleDoubleClick = (e) => {
    const rect = videoRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 2) {
      skip(-10);
      setSkipAnim("back");
    } else {
      skip(10);
      setSkipAnim("forward");
    }
    setTimeout(() => setSkipAnim(null), 600);
  };

  // fullscreen
  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!document.fullscreenElement) {
      el.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // format time
  const formatTime = (sec) => {
    const min = Math.floor(sec / 60);
    const secd = Math.floor(sec % 60);
    return `${min}:${secd < 10 ? "0" : ""}${secd}`;
  };

  // auto hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
  };

  // hover preview
  const progressHover = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const time = percent * videoRef.current.duration;
    setTooltip(time);
    setTooltipPos(percent * 100);
    if (previewRef.current) previewRef.current.currentTime = time;
  };

  const leaveProgress = () => setTooltip(null);

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-50 via-orange-100 to-orange-10 animate-[gradient_8s_ease-in-out_infinite] -z-10"></div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.2fr_1fr] gap-10 items-center">

        {/* VIDEO PLAYER */}
        <div
          ref={containerRef}
          className="relative w-full h-[260px] sm:h-[320px] md:h-[420px] lg:h-[480px] bg-black rounded-3xl overflow-hidden shadow-2xl"
          onMouseMove={handleMouseMove}
          style={{ transform: "translateX(20px)" }}
        >
          <video
            ref={videoRef}
            src={aboutVideo}
            className="w-full h-full object-cover"
            onClick={togglePlay}
            onDoubleClick={handleDoubleClick}
          />
          <video ref={previewRef} src={aboutVideo} className="hidden" muted />

          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40" onClick={togglePlay}>
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/90 rounded-full flex items-center justify-center text-orange-500 text-3xl md:text-4xl">
                ▶
              </div>
            </div>
          )}

          <AnimatePresence>
            {skipAnim && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={`absolute top-1/2 -translate-y-1/2 text-white text-3xl font-bold ${
                  skipAnim === "forward" ? "right-10" : "left-10"
                }`}
              >
                {skipAnim === "forward" ? "⏩ 10s" : "⏪ 10s"}
              </motion.div>
            )}
          </AnimatePresence>

          {showControls && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md px-4 py-3">
              <div className="relative" onMouseMove={progressHover} onMouseLeave={leaveProgress}>
                {tooltip && (
                  <div className="absolute bottom-8 w-40 rounded overflow-hidden border border-gray-700 shadow-lg" style={{ left: `${tooltipPos}%`, transform: "translateX(-50%)" }}>
                    <video src={aboutVideo} muted className="w-full" autoPlay />
                  </div>
                )}
                {tooltip && (
                  <div className="absolute -top-7 text-xs text-white bg-black px-2 py-1 rounded" style={{ left: `${tooltipPos}%`, transform: "translateX(-50%)" }}>
                    {formatTime(tooltip)}
                  </div>
                )}
                <input type="range" value={progress} min="0" max="100" onChange={changeProgress} className="w-full cursor-pointer accent-red-600" />
              </div>

              <div className="flex items-center justify-between mt-2 flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <button onClick={togglePlay} className="text-white text-xl">{isPlaying ? "❚❚" : "▶"}</button>
                  <button onClick={() => skip(-10)} className="text-white">⏪</button>
                  <button onClick={() => skip(10)} className="text-white">⏩</button>
                </div>

                <span className="text-white text-sm">{formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}</span>

                <div className="flex items-center gap-2">
                  <button onClick={toggleMute} className="text-white">{muted ? "🔇" : "🔊"}</button>
                  <input type="range" min="0" max="1" step="0.05" value={volume} onChange={changeVolume} className="w-16 md:w-24 accent-red-600" />
                </div>

                <select value={speed} onChange={changeSpeed} className="bg-black text-white text-sm">
                  <option value="0.5">0.5x</option>
                  <option value="1">1x</option>
                  <option value="1.5">1.5x</option>
                  <option value="2">2x</option>
                </select>

                <button onClick={toggleFullscreen} className="text-white text-lg">⛶</button>
              </div>
            </motion.div>
          )}
        </div>

        {/* TEXT */}
        <div className="text-center md:text-left ml-4 md:ml-10 translate-x-2 md:translate-x-6">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
            <span className="text-black">About </span>
            <span className="text-orange-500">Bite Boss</span>
          </h2>

          <p className="text-gray-700 text-lg mb-4">
            Bite Boss is a smart restaurant management platform that allows
            users to browse menus, place orders and reserve tables easily.
          </p>

          <p className="text-gray-700 text-lg mb-6">
            It combines modern UI with powerful restaurant tools to create
            a smooth dining experience.
          </p>

          <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold shadow-md cursor-pointer">
            Explore Menu
          </button>
        </div>
      </div>
    </section>
  );
};

export default About;