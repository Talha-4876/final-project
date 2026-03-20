import React from "react";
import { products } from "../assets/assets";
import { motion } from "framer-motion";

const OpeningHours = () => {
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
  const topProduct = products[6];

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <span key={i} className={i < rating ? "text-orange-400" : "text-gray-300"}>
        ★
      </span>
    ));

  const ProductCard = ({ prod, delay, reverse }) => (
    <motion.div
      className={`relative flex items-center w-72 md:w-80 lg:w-96 gap-5 ${reverse ? "flex-row-reverse" : ""}`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="absolute inset-0 bg-orange-300 rounded-full blur-2xl opacity-60 scale-105"></div>
      <div className="relative flex items-center bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-5 w-full gap-5 border border-orange-200 transition duration-300 hover:bg-orange-50">
        <img
          src={prod.img}
          alt={prod.name}
          className="w-24 h-10 md:w-28 md:h-28 object-cover rounded-full border-4 border-orange-200"
        />
        <div className={`flex flex-col justify-center ${reverse ? "text-right items-end" : ""}`}>
          <h4 className="font-bold text-gray-800 text-lg md:text-xl">{prod.name}</h4>
          <p className="text-orange-600 font-extrabold text-lg md:text-xl">{prod.price}</p>
          <div className="flex">{renderStars(prod.rating)}</div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <section className="relative py-32 bg-gradient-to-b from-white to-orange-50 flex justify-center items-center overflow-hidden">

      {/* CENTER TABLE (Compact & slightly wider) */}
      <motion.div
        className="relative z-10 w-96 md:w-[480px] bg-white rounded-3xl shadow-2xl p-5 border-t-4 border-orange-500 text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        {/* Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Opening <span className="text-orange-500">Hours</span>
        </h2>

        {/* Multishade line under heading */}
        <div className="h-1 w-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-400 via-orange-300 to-orange-500"></div>

        {/* Schedule */}
        <div className="space-y-1 text-left">
          {schedule.map((item, index) => (
            <motion.div
              key={index}
              className="flex justify-between items-center border-b pb-1 px-2 rounded-lg hover:bg-orange-50 transition font-bold text-lg md:text-xl"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className="text-gray-800">{item.day}</span>
              <span className={`${item.time === "Closed" ? "text-red-500" : "text-orange-600"}`}>
                {item.time}
              </span>
            </motion.div>
          ))}
        </div>

        {/* PHONE & ADDRESS */}
        <motion.div
          className="mt-4 bg-orange-50 border border-orange-300 rounded-2xl shadow-xl p-5 text-left font-bold"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <p className="text-orange-700 text-2xl md:text-3xl font-extrabold">📞 Phone: +92 300 1234567</p>
          <div className="h-1 w-full my-2 rounded-full bg-gradient-to-r from-orange-400 via-orange-300 to-orange-500"></div>
          <div className="mt-2 text-gray-800 text-xl md:text-2xl space-y-1">
            <p>🏠 Address:</p>
            <p>123 Food Street,</p>
            <p>Giddar Kotha, Lahore,</p>
            <p>Pakistan 54000</p>
          </div>
        </motion.div>
      </motion.div>

      {/* TOP CARD */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[20%]">
        <ProductCard prod={topProduct} delay={0.2} />
      </div>

      {/* LEFT CARDS */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 flex flex-col gap-10 pl-8 hidden sm:flex lg:flex-col">
        {leftProducts.map((prod, i) => (
          <ProductCard key={i} prod={prod} delay={0.3 + i * 0.2} />
        ))}
      </div>

      {/* RIGHT CARDS */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex flex-col gap-10 pr-8 hidden sm:flex lg:flex-col">
        {rightProducts.map((prod, i) => (
          <ProductCard key={i} prod={prod} delay={0.3 + i * 0.2} reverse />
        ))}
      </div>

      {/* STACKED CARDS ON MOBILE */}
      <div className="sm:hidden flex flex-col items-center gap-6 mt-6">
        {leftProducts.concat(rightProducts).map((prod, i) => (
          <ProductCard key={i} prod={prod} delay={0.3 + i * 0.2} />
        ))}
      </div>
    </section>
  );
};

export default OpeningHours;