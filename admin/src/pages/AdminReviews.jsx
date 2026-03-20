import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { backendUrl } from "../config"; // same as your App.js backendUrl

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${backendUrl}/admin/reviews`);
        if (res.data.success) setReviews(res.data.reviews);
      } catch (err) {
        console.error("Failed to fetch admin reviews", err);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Customer Reviews</h1>
      {reviews.length === 0 && <p className="text-gray-500">No reviews yet</p>}
      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r._id} className="bg-white p-4 rounded shadow">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-semibold">{r.name}</span> on <span className="font-semibold">{r.productName}</span>
              </div>
              <div className="text-yellow-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>{i < r.rating ? "★" : "☆"}</span>
                ))}
              </div>
            </div>
            <p className="text-gray-700">{r.comment}</p>
            <p className="text-gray-400 text-xs mt-1">{dayjs(r.createdAt).format("DD MMM YYYY")}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReviews;