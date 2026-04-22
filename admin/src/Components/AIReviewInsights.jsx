import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../config";

const AIReviewInsights = () => {
  const [data, setData] = useState(null);

  const fetchAI = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/reviews/analytics/ai`
      );

      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAI();
  }, []);

  if (!data) return null;

  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-2xl shadow mb-6">

      <h2 className="text-xl font-bold mb-4">
        🤖 AI Insights
      </h2>

      <p className="text-lg font-semibold mb-2">
        {data.insight}
      </p>

      <div className="grid grid-cols-3 gap-4 text-center">

        <div>
          <p className="text-sm">Positive</p>
          <p className="text-2xl font-bold">{data.sentiment.positive}</p>
        </div>

        <div>
          <p className="text-sm">Neutral</p>
          <p className="text-2xl font-bold">{data.sentiment.neutral}</p>
        </div>

        <div>
          <p className="text-sm">Negative</p>
          <p className="text-2xl font-bold">{data.sentiment.negative}</p>
        </div>

      </div>

      <div className="mt-4 text-sm opacity-90">
        Avg Rating: ⭐ {data.avgRating} | Total: {data.totalReviews}
      </div>

    </div>
  );
};

export default AIReviewInsights;