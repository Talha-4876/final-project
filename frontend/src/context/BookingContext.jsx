// src/context/BookingContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../config";

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);

  // ✅ Safe auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("userToken");
    return token
      ? { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      : null;
  };

  const fetchBookings = async () => {
    const headers = getAuthHeaders();
    if (!headers) return; // skip if not logged in
    try {
      const res = await axios.get(`${backendUrl}/api/reservations/get`, headers);
      if (res.data.success) setBookings(res.data.reservations || []);
    } catch (err) {
      console.warn("Bookings fetch skipped:", err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const addBooking = async (booking) => {
    const headers = getAuthHeaders();
    if (!headers) return toast.error("You must login first!");
    try {
      const res = await axios.post(`${backendUrl}/api/reservations/create`, booking, headers);
      if (res.data.success) {
        setBookings((prev) => [...prev, res.data.reservation]);
        toast.success("Booking added!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add booking");
    }
  };

  return (
    <BookingContext.Provider value={{ bookings, fetchBookings, addBooking }}>
      {children}
    </BookingContext.Provider>
  );
};