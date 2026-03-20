import React from "react";
import { chefs } from "../assets/assets";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { motion } from "framer-motion";

const ChefSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
            Meet Our <span className="text-orange-500">Chefs</span>
          </h2>

          {/* Animated gradient line */}
          <motion.div
            className="h-1 w-24 rounded-full mx-auto my-4 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", type: "spring", stiffness: 120 }}
            style={{ transformOrigin: "center" }}
          ></motion.div>

          <p className="text-gray-500 mt-2">
            Our professional chefs bring passion & flavor to every dish
          </p>
        </div>

        {/* Chef Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {chefs.map((chef) => (
            <motion.div
              key={chef.id}
              className="bg-white rounded-b-full shadow-lg p-6 flex flex-col items-center text-center relative overflow-hidden group border border-gray-200 transition-all duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -10, backgroundColor: "#FFF7ED" }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              {/* Chef Image */}
              <img
                src={chef.img}
                alt={chef.name}
                className="w-28 h-28 md:w-32 md:h-32 object-cover rounded-full border-4 border-orange-400 mb-4"
              />

              {/* Name */}
              <h3 className="text-xl font-semibold text-gray-800">{chef.name}</h3>

              {/* Specialty */}
              <p className="text-orange-500 font-medium mt-1">{chef.specialty}</p>

              {/* Social Links */}
              <div className="flex gap-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">

                <a
                  href={chef.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-500 text-white hover:scale-110 transition-transform"
                >
                  <FaFacebookF />
                </a>

                <a
                  href={chef.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-500 text-white hover:scale-110 transition-transform"
                >
                  <FaInstagram />
                </a>

                <a
                  href={chef.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-500 text-white hover:scale-110 transition-transform"
                >
                  <FaTwitter />
                </a>

              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChefSection;