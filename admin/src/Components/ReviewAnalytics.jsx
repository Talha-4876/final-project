import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip,
  LineChart, Line, CartesianGrid, ResponsiveContainer
} from "recharts";
import { backendUrl } from "../config";

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

const ReviewAnalytics = () => {
  const [reviews, setReviews] = useState([]);

  // ================= FETCH =================
  const fetchData = async () => {
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
    fetchData();
  }, []);

  // ================= PIE DATA =================
  const ratingData = [5, 4, 3, 2, 1].map((star) => ({
    name: `${star} Star`,
    value: reviews.filter(r => r.rating === star).length
  }));

  // ================= MONTHLY DATA =================
  const monthlyData = {};

  reviews.forEach(r => {
    const month = new Date(r.createdAt).toLocaleString("default", {
      month: "short"
    });

    monthlyData[month] = (monthlyData[month] || 0) + 1;
  });

  const lineData = Object.keys(monthlyData).map(month => ({
    month,
    reviews: monthlyData[month]
  }));

  return (
    <div className="space-y-6 mb-8">

      {/* ================= CARDS ================= */}
      <div className="grid md:grid-cols-3 gap-4">

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-gray-500">Total Reviews</h2>
          <p className="text-3xl font-bold">{reviews.length}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-gray-500">5 Star Reviews</h2>
          <p className="text-3xl font-bold text-green-500">
            {reviews.filter(r => r.rating === 5).length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-gray-500">1-2 Star Issues</h2>
          <p className="text-3xl font-bold text-red-500">
            {reviews.filter(r => r.rating <= 2).length}
          </p>
        </div>

      </div>

      {/* ================= PIE + BAR ================= */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* PIE CHART */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-bold mb-4">Rating Distribution</h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ratingData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
              >
                {ratingData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR CHART */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="font-bold mb-4">Rating Overview</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratingData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

      {/* ================= LINE CHART ================= */}
      <div className="bg-white p-5 rounded-xl shadow">
        <h2 className="font-bold mb-4">Monthly Reviews Growth</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="reviews"
              stroke="#3b82f6"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default ReviewAnalytics;