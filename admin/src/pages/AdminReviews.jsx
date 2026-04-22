import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import ReviewAnalytics from "../components/ReviewAnalytics";
import AIReviewInsights from "../components/AIReviewInsights";
import { backendUrl } from "../config";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");

  // ================= FETCH =================
  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/reviews`);
      if (res.data.success) {
        setReviews(res.data.reviews);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // ================= DELETE =================
  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      const res = await axios.delete(
        `${backendUrl}/api/reviews/${id}`
      );

      if (res.data.success) {
        setReviews(prev => prev.filter(r => r._id !== id));
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ================= FILTER =================
  const filtered = reviews.filter((r) => {
    const matchName = r.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchRating = ratingFilter
      ? r.rating === Number(ratingFilter)
      : true;

    return matchName && matchRating;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">

      {/* ⭐ ANALYTICS */}
      <ReviewAnalytics />
      <AIReviewInsights />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">

        <h1 className="text-3xl font-bold">
          ⭐ Customer Reviews
        </h1>

        <div className="flex gap-2 flex-wrap">

          <input
            type="text"
            placeholder="Search name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded-lg"
          />

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="border p-2 rounded-lg"
          >
            <option value="">All Ratings</option>
            <option value="5">5 ★</option>
            <option value="4">4 ★</option>
            <option value="3">3 ★</option>
            <option value="2">2 ★</option>
            <option value="1">1 ★</option>
          </select>

        </div>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 gap-4">

        {filtered.map((r) => (
          <div
            key={r._id}
            className="bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition"
          >

            {/* TOP */}
            <div className="flex justify-between items-start">

              <div>
                <h2 className="font-bold text-lg">{r.name}</h2>
                <p className="text-xs text-gray-500">
                  {dayjs(r.createdAt).format("DD MMM YYYY")}
                </p>
              </div>

              <button
                onClick={() => deleteReview(r._id)}
                className="text-red-500 text-sm hover:underline"
              >
                Delete
              </button>

            </div>

            {/* STARS */}
            <div className="text-yellow-400 text-lg mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>
                  {i < r.rating ? "★" : "☆"}
                </span>
              ))}
            </div>

            {/* COMMENT */}
            <p className="text-gray-700 mt-2">
              {r.comment}
            </p>

          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {filtered.length === 0 && (
        <div className="text-center mt-10 text-gray-500">
          No reviews found 😔
        </div>
      )}
    </div>
  );
};

export default AdminReviews;