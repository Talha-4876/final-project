import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../config";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        `${backendUrl}/api/analytics/stats`
      );
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const Card = ({ title, value, color }) => (
    <div className={`p-6 rounded-xl shadow text-white ${color}`}>
      <h2 className="text-lg">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">
        📊 Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <Card
          title="Total Orders"
          value={stats.totalOrders || 0}
          color="bg-blue-500"
        />

        <Card
          title="Revenue (PKR)"
          value={`Rs ${(stats.totalRevenue / 0.0057).toFixed(0)}`}
          color="bg-green-500"
        />

        <Card
          title="Pending"
          value={stats.pendingOrders || 0}
          color="bg-yellow-500"
        />

        <Card
          title="Delivered"
          value={stats.deliveredOrders || 0}
          color="bg-purple-500"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;