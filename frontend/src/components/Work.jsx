import React from "react";
import { motion } from "framer-motion";
import { works } from "../assets/assets";

const steps = [
  {
    id: 1,
    title: "Explore Menu",
    desc: "Browse our menu and find your favorite dishes.",
    icon: "📋",
  },
  {
    id: 2,
    title: "Choose a Dish",
    desc: "Pick meals that match your taste.",
    icon: "🍔",
  },
  {
    id: 3,
    title: "Place Order",
    desc: "Order easily and get fast delivery.",
    icon: "🚚",
  },
];

const Work = () => {
  const workVideo = works[0].video;

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">

        {/* Heading */}
        <div className="text-center mb-14">
         

        <motion.div className="text-center mb-14">
  <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
    How We <span className="text-orange-500">Work?</span>
  </h2>

  <motion.div   className="h-1 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500"
        initial={{ width: 0 }}
        whileInView={{ width: "6rem", scaleX: [1, 1.2, 1] }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }} />

  {/* 👇 YAHAN ADD KARNA HAI */}
  <p className="text-center text-gray-600 mt-3 mb-10 max-w-2xl mx-auto">
    We make ordering your favorite food simple,<br /> fast, and enjoyable — from selection to delivery.
  </p>
</motion.div>
        </div>

        {/* Main Section */}
        <div className="relative flex flex-col md:flex-row items-center">

          {/* 🔥 CURVED / WAVE BACKGROUND */}
          <div className="absolute left-0 top-0 w-full md:w-[65%] h-full z-0">
            <svg
              viewBox="0 0 800 600"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0 H650 Q800,300 650,600 H0 Z"
                fill="#f97316"
              />
            </svg>
          </div>

          {/* LEFT CONTENT */}
          <div className="relative z-10 md:w-1/2 text-white p-8 md:p-12 space-y-8">

            <p className="uppercase text-sm tracking-widest opacity-80">
              Easy Order in 3 Steps
            </p>

            <h3 className="text-3xl font-bold">How We Work...?</h3>

            {steps.map((step, i) => (
              <div key={step.id} className="flex items-start gap-5">

                {/* Yellow Icon Circle */}
                <div className="w-12 h-12 flex items-center justify-center bg-yellow-400 text-black rounded-full text-xl font-bold shadow-md">
                  {step.icon}
                </div>

                <div>
                  <h4 className="font-semibold text-lg">{step.title}</h4>
                  <p className="text-sm opacity-80">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

     {/* RIGHT VIDEO (OVERLAP EFFECT) */}
<motion.div
  className="relative z-10 md:w-1/2 flex justify-center mt-10 md:mt-0 md:-ml-28"
  initial={{ opacity: 0, scale: 0.8 }}
  whileInView={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.6 }}
>
  <video
    src={workVideo}
    autoPlay
    loop
    muted
    className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-full border-8 border-white shadow-2xl"
  />
</motion.div>

        </div>
      </div>
    </section>
  );
};

export default Work;