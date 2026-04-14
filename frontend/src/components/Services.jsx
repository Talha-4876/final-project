import React, { useState, useEffect, useRef } from "react";
import {
  FaUtensils,
  FaTruck,
  FaTable,
  FaConciergeBell,
  FaStar,
  FaTools,
} from "react-icons/fa";
import { motion } from "framer-motion";

const services = [
  { id: 1, title: "Delicious Food", desc: "Freshly prepared meals with premium ingredients.", icon: <FaUtensils /> },
  { id: 2, title: "Fast Delivery", desc: "Lightning fast delivery at your doorstep.", icon: <FaTruck /> },
  { id: 3, title: "Table Booking", desc: "Reserve your table instantly anytime.", icon: <FaTable /> },
  { id: 4, title: "24/7 Service", desc: "We are always ready to serve you.", icon: <FaConciergeBell /> },
  { id: 5, title: "Top Quality", desc: "Premium quality with best ratings.", icon: <FaStar /> },
  { id: 6, title: "Maintenance & Support", desc: "Keep your services running smoothly.", icon: <FaTools /> },
];

export default function Services() {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  /* Auto slide */
  useEffect(() => {
    startAuto();
    return () => clearInterval(intervalRef.current);
  }, [index]);

  const startAuto = () => {
    intervalRef.current = setInterval(() => {
      if (index < services.length - 1) setIndex((prev) => prev + 1);
    }, 3500);
  };

  const stopAuto = () => clearInterval(intervalRef.current);

  /* Navigation */
  const prev = () => {
    if (index > 0) setIndex((prev) => prev - 1);
  };

  const next = () => {
    if (index < services.length - 1) setIndex((prev) => prev + 1);
  };

  /* Magnetic Button */
  const magneticMove = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  };
  const magneticLeave = (e) => (e.currentTarget.style.transform = "translate(0px,0px)");

  return (
    <section className="relative py-24 flex flex-col items-center px-6 overflow-hidden">

      {/* Animated background particles */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute w-72 h-72 bg-orange-400 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
        <div className="absolute w-72 h-72 bg-pink-400 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>
      </div>

      {/* Heading */}
      <h1 className="text-5xl font-bold text-center mb-3  cursor-pointer">
        Our <span className="text-orange-500">Services</span>
      </h1>

      <div className="h-1 w-24 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500 rounded-full mb-12"></div>

      {/* Carousel */}
      <div
        className="relative w-full max-w-6xl"
        onMouseEnter={stopAuto}
        onMouseLeave={startAuto}
      >
        <div className="flex items-center justify-center gap-8">
          {services.map((service, i) => {
            const position = i - index;
            let scale = position === 0 ? 1 : 0.8;
            let opacity = position === 0 ? 1 : 0.4;

            return (
              <motion.div
                key={service.id}
                className="w-72 h-80 backdrop-blur-xl bg-white/30 border border-white/40 rounded-3xl p-8 flex flex-col items-center text-center shadow-xl cursor-pointer relative overflow-hidden"
                animate={{ scale, opacity }}
                transition={{ duration: 0.5 }}
                whileHover={{
                  rotateX: 8,
                  rotateY: -8,
                  scale: 1.05,
                }}
              >
                <div className="absolute inset-0 rounded-3xl opacity-0 hover:opacity-100 transition bg-gradient-to-tr from-orange-400/40 to-pink-400/40 blur-xl"></div>
                <div className="text-5xl text-orange-500 mb-5 relative z-10">{service.icon}</div>
                <h2 className="text-xl font-bold text-orange-500 mb-3 relative z-10">{service.title}</h2>
                <p className="text-gray-700 relative z-10">{service.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Buttons */}
        <button
          onMouseMove={magneticMove}
          onMouseLeave={magneticLeave}
          onClick={prev}
          disabled={index === 0}
          className={`absolute  cursor-pointer left-0 top-1/2 -translate-y-1/2 px-4 py-3 md:px-6 md:py-4 rounded-full shadow-lg transition
            ${index === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-orange-500 text-white hover:bg-orange-600"}`}
        >
          ←
        </button>

        <button
          onMouseMove={magneticMove}
          onMouseLeave={magneticLeave}
          onClick={next}
          disabled={index === services.length - 1}
          className={`absolute  cursor-pointer right-0 top-1/2 -translate-y-1/2 px-4 py-3 md:px-6 md:py-4 rounded-full shadow-lg transition
            ${index === services.length - 1 ? "bg-gray-300 cursor-not-allowed" : "bg-orange-500 text-white hover:bg-orange-600"}`}
        >
          →
        </button>
      </div>

      {/* Dots */}
      <div className="flex gap-3 mt-10 flex-wrap justify-center">
        {services.map((_, i) => (
          <span
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 md:w-4 md:h-4 rounded-full cursor-pointer transition ${
              index === i ? "bg-orange-500 scale-125" : "bg-gray-300"
            }`}
          ></span>
        ))}
      </div>

    </section>
  );
}