// src/components/GetInTouch.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaPhoneAlt } from "react-icons/fa";

const GetInTouch = () => {
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });
    setLoading(true);

    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const message = form.message.value.trim();

    try {
      const res = await fetch("http://localhost:3200/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({ type: "success", message: data.message });
        form.reset();
      } else {
        setStatus({ type: "error", message: data.message || "Something went wrong" });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: "Server error. Try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-6 bg-white scroll-mt-24">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start">
        {/* Google Map */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="w-full h-96 shadow-lg rounded-xl overflow-hidden"
        >
          <iframe
            title="Bite Boss Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019694122176!2d-122.419415184681!3d37.77492977975986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808c7a2e5f3f%3A0xf7f5c2a3bbf8a04a!2sSan%20Francisco!5e0!3m2!1sen!2sus!4v1690000000000!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            className="rounded-xl"
          />
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="bg-gray-50 p-8 rounded-xl shadow-lg"
        >
          <h2 className="text-4xl font-bold text-orange-500 mb-6 text-center md:text-left">
            Get in Touch
          </h2>

          {status.type && (
            <div
              className={`mb-4 p-3 rounded-lg ${
                status.type === "success"
                  ? "text-green-800 bg-green-100"
                  : "text-red-800 bg-red-100"
              }`}
            >
              {status.type === "success" ? "Email Send Successfully! ✅" : "❌Error"} {status.message}
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="relative">
              <FaUser className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-400" />
              <input
                name="name"
                type="text"
                placeholder="Name"
                className="w-full border border-gray-300 rounded-lg px-8 py-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            <div className="relative">
              <FaEnvelope className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input
                name="email"
                type="email"
                placeholder="Email"
                className="w-full border border-gray-300 rounded-lg px-8 py-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            <div className="relative">
              <FaPhoneAlt className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                className="w-full border border-gray-300 rounded-lg px-8 py-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            <div className="relative">
              <textarea
                name="message"
                placeholder="Your Message (optional)"
                className="w-full border border-gray-300 rounded-lg px-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`text-white font-semibold px-4 py-3 rounded-lg transition w-full max-w-[250px] mx-auto block text-center ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-400 cursor-pointer"
              }`}
            >
              {loading ? "Sending..." : "Contact Now"}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default GetInTouch;