
// src/components/AdminTable.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { backendUrl } from "../config"; // UPDATED import

// ...rest of the code stays the same

const AdminTable = () => {
  const [reservation, setReservation] = useState([]);
  const [filter, setFilter] = useState("all");

  // Fetch reservations
  const fetchReservation = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/reservations/get`);
      if (res.data.success) setReservation(res.data.reservations);
    } catch (err) {
      console.error("GET RESERVATIONS ERROR:", err);
    }
  };

  useEffect(() => {
    fetchReservation();
  }, []);

  // Filtered reservations
  const filteredData = reservation.filter((r) => {
    if (filter === "paid") return r.isPaid;
    if (filter === "pending") return !r.isPaid;
    return true;
  });

  const totalEarnings = reservation
    .filter((r) => r.isPaid)
    .reduce((acc, r) => acc + (r.totalAmount || 0), 0);

  const markAsPaid = async (id) => {
    try {
      await axios.put(`${backendUrl}/api/reservations/pay/${id}`);
      toast.success("Marked Paid");
      fetchReservation();
    } catch (err) {
      console.error("MARK PAID ERROR:", err);
    }
  };

  const deleteRes = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/reservations/delete/${id}`);
      fetchReservation();
    } catch (err) {
      console.error("DELETE RESERVATION ERROR:", err);
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* HEADER CARDS */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="text-gray-500">Total Reservations</h3>
          <p className="text-2xl font-bold">{reservation.length}</p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="text-gray-500">Paid Orders</h3>
          <p className="text-2xl font-bold text-orange-600">
            {reservation.filter(r => r.isPaid).length}
          </p>
        </div>
        <div className="bg-white shadow rounded-xl p-4">
          <h3 className="text-gray-500">Total Earnings</h3>
          <p className="text-2xl font-bold text-orange-500">
            Rs. {totalEarnings}
          </p>
        </div>
      </div>

      {/* FILTER */}
      <div className="flex gap-3">
        {["all", "paid", "pending"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1 rounded ${
              filter === f ? "bg-orange-500 text-white" : "bg-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">User</th>
              <th className="p-3">Booking</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((r) => (
              <tr key={r._id} className="border-t">
                <td className="p-3">
                  <p className="font-semibold">{r.user?.name}</p>
                  <p className="text-gray-500 text-xs">{r.user?.email}</p>
                  <p className="text-gray-400 text-xs">{r.user?.phone}</p>
                </td>
                <td className="p-3 text-sm">
                  <p>{r.table?.date}</p>
                  <p className="text-gray-500">{r.table?.time}</p>
                  <p className="text-gray-400">{r.table?.seats} seats</p>
                </td>
                <td className="p-3 capitalize">{r.paymentMethod}</td>
                <td className="p-3 font-semibold">Rs. {r.totalAmount}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      r.isPaid ? "bg-orange-100 text-orange-600" : "bg-orange-400 text-white"
                    }`}
                  >
                    {r.isPaid ? "Paid" : "Pending"}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  {!r.isPaid && (
                    <button
                      onClick={() => markAsPaid(r._id)}
                      className="bg-orange-100 text-orange-600 px-2 py-1 rounded"
                    >
                      Paid
                    </button>
                  )}
                  <button
                    onClick={() => deleteRes(r._id)}
                    className="bg-orange-400 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;