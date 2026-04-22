import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../config";

const AIReservationInsights = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAI = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/reservations/analytics/ai`
        );

        console.log("AI DATA:", res.data);

        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.log("AI ERROR:", err.response?.data || err.message);
      }
    };

    fetchAI();
  }, []);

  if (!data) return null;

  return (
    <div className="bg-gradient-to-r from-pink-500 to-orange-500 text-white p-6 rounded-2xl shadow mb-6">
      <h2 className="text-xl font-bold mb-4">🤖 Reservation AI Insights</h2>

      <p className="text-lg font-semibold mb-3">{data.insight}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <p>Total</p>
          <p className="text-2xl font-bold">{data.total}</p>
        </div>

        <div>
          <p>Pending</p>
          <p className="text-2xl font-bold">{data.pending}</p>
        </div>

        <div>
          <p>Paid</p>
          <p className="text-2xl font-bold">{data.paid}</p>
        </div>

        <div>
          <p>Peak Hour</p>
          <p className="text-2xl font-bold">{data.busiestHour}:00</p>
        </div>
      </div>

      <div className="mt-4 text-sm opacity-90">
        📅 Most Busy Day: {data.busiestDay}
      </div>
    </div>
  );
};

export default AIReservationInsights;