import React, { useEffect, useState } from "react";
import heroImg from '../assets/hiro.jpg';
import { motion, useAnimation } from "framer-motion";

// Food emojis
const foodParticles = ["🍔", "🍕", "🍟", "🌭", "🥪", "🥤"];

// Lighter gradient palettes for better text contrast
const gradientPalettes = [
  { from: "#FFE69C", via: "#FFD9A6", to: "#FFB77C" },
  { from: "#FFF1A8", via: "#FFE0A4", to: "#FFD1A1" },
  { from: "#FFEFAC", via: "#FFE6B1", to: "#FFD8A7" },
];

const Hero = () => {
  const [offsetY, setOffsetY] = useState(0);
  const [currentPalette, setCurrentPalette] = useState(0);
  const controls = useAnimation();

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY * 0.12);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cycle gradient palette every 25s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPalette((prev) => (prev + 1) % gradientPalettes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Animate gradient background smoothly
  useEffect(() => {
    const { from, via, to } = gradientPalettes[currentPalette];
    controls.start({
      background: [`linear-gradient(to right, ${from}, ${via}, ${to})`, 
                   `linear-gradient(to right, ${to}, ${from}, ${via})`, 
                   `linear-gradient(to right, ${from}, ${via}, ${to})`],
      transition: { duration: 40, repeat: Infinity, ease: "linear" },
    });
  }, [currentPalette, controls]);

  const handleViewMenu = () => {
    const menuSection = document.getElementById('menu');
    if (menuSection) menuSection.scrollIntoView({ behavior: 'smooth' });
  };

  const isMobile = window.innerWidth < 768;

  return (
    <section
      id="hero"
      className="relative overflow-hidden h-[85vh] flex items-center scroll-mt-24"
    >
      {/* Animated Gradient Background */}
      <motion.div
        animate={controls}
        className="absolute inset-0 w-full h-full z-0"
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* Floating Food Particles */}
      {foodParticles.map((icon, idx) => (
        <motion.div
          key={idx}
          animate={{
            y: ["0%", "85%", "0%"], 
            rotate: [0, 10, -10, 0],
            x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`]
          }}
          transition={{
            duration: isMobile ? 30 : 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
          whileHover={{ scale: 1.2 }}
          className={`absolute cursor-default z-10 ${isMobile ? "text-2xl" : "text-3xl md:text-5xl"}`}
          style={{
            top: `${Math.random() * 70}%`,
            left: `${Math.random() * 90}%`,
            color: gradientPalettes[currentPalette].to,
            y: offsetY * 0.05
          }}
        >
          {icon}
        </motion.div>
      ))}

      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10 w-full z-20">

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{ y: offsetY * 0.12 }}
          className="flex-1 text-center md:text-left z-20"
        >
          <motion.h2
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className={`font-extrabold mb-5 leading-tight ${isMobile ? "text-3xl" : "text-5xl md:text-6xl"}`}
            style={{
              textShadow: "2px 2px 15px rgba(255, 215, 0, 0.6)"
            }}
          >
            <span className="text-yellow-500">Fast Food ka asli Boss</span> <br /> Bite Boss!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className={`mb-6 max-w-xl mx-auto md:mx-0 ${isMobile ? "text-base text-gray-800" : "text-lg md:text-2xl text-gray-800"}`}
            style={{ textShadow: "1px 1px 10px rgba(255, 200, 150, 0.5)" }}
          >
            At Bite Boss, we serve fresh and delicious fast food made with love.
            Burgers, pizzas, fries, and more — hot, fast, and tasty!
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleViewMenu}
            className={`px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold shadow-lg transition-all duration-300 z-20 text-white cursor-pointer ${isMobile ? "text-sm bg-orange-400 hover:bg-orange-500" : "text-lg bg-orange-400 hover:bg-orange-500"}`}
          >
            View Menu
          </motion.button>
        </motion.div>

        {/* Image with scroll-based rotate + subtle zoom */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          style={{ y: offsetY * 0.18 }}
          className="flex-1 flex justify-center md:justify-end relative z-20"
        >
          {/* Dynamic glow behind hero image */}
          <div className={`absolute rounded-full blur-3xl animate-pulse z-10 ${isMobile ? "w-72 h-72" : "w-96 h-96 md:w-[28rem] md:h-[28rem]"}`}
               style={{ background: gradientPalettes[currentPalette].to }}
          ></div>

          <motion.div
            animate={{ 
              rotate: offsetY * 0.03, 
              scale: 1 + offsetY * 0.0008 // subtle zoom on scroll
            }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
            className={`rounded-full overflow-hidden shadow-2xl relative z-20 ${isMobile ? "w-72 h-72" : "w-80 h-80 md:w-[30rem] md:h-[30rem]"}`}
          >
            <img
              src={heroImg}
              alt="Delicious Food"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;