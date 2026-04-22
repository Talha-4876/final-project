import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../config";

const Deliveries = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  // =========================
  // FETCH
  // =========================
  const fetchDeliveries = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/delivery/all`);
      if (res.data.success) {
        setData(res.data.deliveries);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  // =========================
  // DELETE (DB)
  // =========================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;

    try {
      const res = await axios.delete(
        `${backendUrl}/api/delivery/delete/${id}`
      );

      if (res.data.success) {
        setData(prev => prev.filter(item => item._id !== id));
      }
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // STATUS UPDATE (DB)
  // =========================
  const toggleStatus = async (id, currentStatus) => {
    const newStatus =
      currentStatus === "Pending" ? "Delivered" : "Pending";

    try {
      const res = await axios.put(
        `${backendUrl}/api/delivery/status/${id}`,
        { status: newStatus }
      );

      if (res.data.success) {
        setData(prev =>
          prev.map(item =>
            item._id === id
              ? { ...item, status: newStatus }
              : item
          )
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // FILTER
  // =========================
  const filteredData = data.filter(item =>
    item.name?.toLowerCase().includes(search.toLowerCase()) &&
    (cityFilter ? item.city === cityFilter : true)
  );

  const cities = [...new Set(data.map(item => item.city))];

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">
          🚚 Delivery Orders
        </h1>

        <div className="flex gap-2 flex-wrap">
          <input
            className="border p-2 rounded"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border p-2 rounded"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="">All Cities</option>
            {cities.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-orange-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">City</th>
              <th className="p-3">Address</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Total (PKR)</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map(item => (
              <tr key={item._id} className="border-t hover:bg-gray-50">

                <td className="p-3 font-semibold">{item.name}</td>
                <td className="p-3">{item.phone}</td>
                <td className="p-3">{item.city}</td>
                <td className="p-3">{item.street}</td>
                <td className="p-3 capitalize">{item.paymentMethod}</td>

                {/* PKR FIX */}
                <td className="p-3 font-bold text-orange-600">
                  Rs {(item.totalAmount / 0.0057).toFixed(0)}
                </td>

                {/* STATUS */}
                <td className="p-3">
                  <button
                    onClick={() => toggleStatus(item._id, item.status)}
                    className={`px-3 py-1 rounded text-white text-xs ${
                      item.status === "Pending"
                        ? "bg-yellow-500"
                        : "bg-green-600"
                    }`}
                  >
                    {item.status}
                  </button>
                </td>

                {/* DELETE */}
                <td className="p-3">
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EMPTY */}
      {filteredData.length === 0 && (
        <p className="text-center mt-10 text-gray-500">
          No orders found
        </p>
      )}
    </div>
  );
};

export default Deliveries;