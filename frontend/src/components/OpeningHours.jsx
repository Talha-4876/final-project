import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { products, assets } from "../assets/assets";

const OpeningHours = () => {
  const [text, setText] = useState("");
  const fullText = "Experience Luxury Dining";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const schedule = [
    { day: "Monday", time: "9:00 AM - 11:00 PM" },
    { day: "Tuesday", time: "9:00 AM - 11:00 PM" },
    { day: "Wednesday", time: "9:00 AM - 11:00 PM" },
    { day: "Thursday", time: "9:00 AM - 11:00 PM" },
    { day: "Friday", time: "9:00 AM - 11:00 PM" },
    { day: "Saturday", time: "10:00 AM - 12:00 AM" },
    { day: "Sunday", time: "Closed" },
  ];

  const leftProducts = [products[0], products[1], products[2]];
  const rightProducts = [products[3], products[4], products[5]];

  return (
    <section className="relative w-full min-h-screen overflow-hidden">

      {/* 🎬 VIDEO BACKGROUND */}
      <video
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover"
      >
        <source src={assets.restaurant} type="video/mp4" />
      </video>

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* PARTICLES */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <span
            key={i}
            className="absolute w-1.5 h-1.5 bg-orange-400 rounded-full animate-ping"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex flex-col items-center pt-24 pb-20 px-4 text-center  cursor-pointer">

        {/* HEADING */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
          {text}<span className="animate-pulse">|</span>
        </h1>

        <h2 className="text-xl md:text-3xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-orange-300 bg-[length:200%_200%] animate-[gradientMove_4s_linear_infinite] bg-clip-text text-transparent mb-4">
          Taste the Best Moments
        </h2>

        <p className="text-gray-200 mb-10 max-w-xl ">
          Premium Dining Experience with World-Class Taste & Ambience
        </p>

        {/* OPENING HOURS CARD */}
        <motion.div
          className="w-96 md:w-[600px] bg-white/90 backdrop-blur-3xl rounded-3xl shadow-[0_0_80px_rgba(255,140,0,0.35)] p-10 border border-orange-200 text-center"
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3">
            Opening <span className="text-orange-500">Hours</span>
          </h2>

          <div className="h-1 w-32 mx-auto mb-6 bg-gradient-to-r from-orange-400 via-orange-300 to-orange-500 rounded-full"></div>

          {/* TIMETABLE */}
          <div className="space-y-3 text-left  cursor-pointer" >
            {schedule.map((item, index) => (
              <motion.div
                key={index}
                className="flex justify-between border-b pb-2 text-lg font-semibold hover:text-orange-500 transition"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <span>{item.day}</span>
                <span className={item.time === "Closed" ? "text-red-500" : ""}>
                  {item.time}
                </span>
              </motion.div>
            ))}
          </div>

          {/* CONTACT */}
          <div className="mt-8 bg-gradient-to-r from-orange-100 via-white to-orange-50 border border-orange-300 rounded-2xl p-6 text-left shadow-xl">
            <p className="text-orange-700 text-2xl md:text-3xl font-extrabold mb-2">
              📞 +92 300 1234567
            </p>

            <div className="h-[2px] w-full my-3 bg-gradient-to-r from-orange-400 via-red-400 to-orange-500"></div>

            <div className="text-gray-800 text-lg md:text-xl space-y-1 font-semibold">
              <p>🏠 123 Food Street</p>
              <p>Lahore, Pakistan</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* LEFT PRODUCTS */}
      <div className="absolute cursor-pointer left-5 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-10 z-10">
        {leftProducts.map((prod, i) => (
          <motion.div
            key={i}
            whileHover={{ rotate: -5, scale: 1.1 }}
            className="flex items-center gap-5 bg-white/90 p-5 rounded-2xl shadow-xl"
          >
            <img src={prod.img} className="w-28 h-28 rounded-full border-4 border-orange-300" />
            <div>
              <h4 className="font-bold text-gray-800">{prod.name}</h4>
              <p className="text-orange-500">{prod.price}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* RIGHT PRODUCTS */}
      <div className="absolute  cursor-pointer right-5 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-10 z-10">
        {rightProducts.map((prod, i) => (
          <motion.div
            key={i}
            whileHover={{ rotate: 5, scale: 1.1 }}
            className="flex items-center gap-5 bg-white/90 p-5 rounded-2xl shadow-xl"
          >
            <img src={prod.img} className="w-28 h-28 rounded-full border-4 border-orange-300" />
            <div>
              <h4 className="font-bold text-gray-800">{prod.name}</h4>
              <p className="text-orange-500">{prod.price}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* GRADIENT ANIMATION */}
      <style>
        {`
        @keyframes gradientMove {
          0% {background-position: 0%}
          100% {background-position: 200%}
        }
        `}
      </style>
    </section>
  );
};

export default OpeningHours;