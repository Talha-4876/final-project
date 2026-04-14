import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../config";

const AdminTable = () => {
  const [reservation, setReservation] = useState([]);
  const [filter, setFilter] = useState("all");

  // Fetch all reservations
  const fetchReservation = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/reservations/get`);
      if (res.data.success) setReservation(res.data.reservations);
    } catch (err) {
      console.error("GET RESERVATIONS ERROR:", err);
      toast.error("Failed to fetch reservations");
    }
  };

  useEffect(() => {
    fetchReservation();
  }, []);

  // Filter reservations
  const filteredData = reservation.filter((r) => {
    if (filter === "paid") return r.isPaid;
    if (filter === "pending") return !r.isPaid;
    return true;
  });

  // Total earnings from paid reservations
  const totalEarnings = reservation
    .filter((r) => r.isPaid)
    .reduce((acc, r) => acc + (r.totalAmount || 0), 0);

  // ✅ Updated Mark reservation as paid
  const markAsPaid = async (id) => {
    try {
      const res = await axios.put(`${backendUrl}/api/reservations/markPaid/${id}`);
      if (res.data.success) {
        toast.success("Marked as Paid");
        fetchReservation(); // refresh table
      } else {
        toast.error(res.data.message || "Failed to mark as paid");
      }
    } catch (err) {
      console.error("MARK PAID ERROR:", err);
      toast.error("Failed to mark as paid");
    }
  };

  // ✅ Updated Delete reservation function
  const deleteRes = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this reservation?"
      );
      if (!confirmDelete) return;

      const res = await axios.delete(`${backendUrl}/api/reservations/delete/${id}`);
      if (res.data.success) {
        toast.success("Reservation deleted successfully");
        fetchReservation(); // refresh table
      } else {
        toast.error(res.data.message || "Failed to delete reservation");
      }
    } catch (err) {
      console.error("DELETE RESERVATION ERROR:", err);
      toast.error("Failed to delete reservation");
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
            {reservation.filter((r) => r.isPaid).length}
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
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-xl overflow-x-auto">
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
                      r.isPaid
                        ? "bg-orange-100 text-orange-600"
                        : "bg-orange-400 text-white"
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
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No reservations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;