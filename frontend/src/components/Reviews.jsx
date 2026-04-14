import React, { useState } from "react";
import { reviews as defaultReviews } from "../assets/assets";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { motion } from "framer-motion";

const Reviews = () => {
  const [reviews, setReviews] = useState(defaultReviews);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i)
        stars.push(<FaStar key={i} className="text-orange-400" />);
      else if (rating >= i - 0.5)
        stars.push(<FaStarHalfAlt key={i} className="text-orange-400" />);
      else stars.push(<FaRegStar key={i} className="text-gray-400" />);
    }
    return stars;
  };

  return (
    <section
      id="reviews"
      className="py-16 bg-gradient-to-b from-orange-50 to-white scroll-mt-24  cursor-pointer"
    >
      {/* Heading */}
      <motion.h2
        className="text-4xl md:text-4xl font-bold text-center text-gray-700 mb-2 "
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        What Our <span className="text-orange-500">Customers</span> Say...💬
      </motion.h2>

      {/* Animated line */}
      <motion.div
        className="h-1 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500"
        initial={{ width: 0 }}
        whileInView={{ width: "6rem", scaleX: [1, 1.2, 1] }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      ></motion.div>

      {/* Subtext */}
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Hear directly from our happy customers about their experiences with our services.
      </p>

      {/* Reviews Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-2xl shadow-xl p-6 text-center 
                       hover:scale-105 hover:bg-orange-50 
                       hover:shadow-orange-200/60 
                       transition-all duration-300"
          >
            <img
              src={review.img}
              alt={review.name}
              className="w-20 h-20 mx-auto rounded-full object-cover border-4 border-orange-400 mb-4"
            />
            <h3 className="font-bold text-lg text-gray-800">
              {review.name}
            </h3>
            <div className="flex justify-center gap-1 my-2">
              {renderStars(review.rating)}
            </div>
            <p className="text-gray-600 text-sm">{review.comment}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default Reviews;
