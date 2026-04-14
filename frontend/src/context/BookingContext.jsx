import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { backendUrl } from "../config";

export const BookingContext = createContext();

const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);

  // Fetch all reservations (for customer/admin)
  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/reservations/user`);
      if (res.data.success) {
        setBookings(res.data.reservations || []);
      }
    } catch (err) {
      console.error("FETCH BOOKINGS ERROR:", err);
      toast.error("Failed to fetch reservations");
    }
  };

  // Add booking (customer side)
  const addBooking = async (booking, clearCartCallback) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/reservations/create`,
        booking
      );
      if (res.data.success) {
        toast.success("Booking Confirmed 🎉");

        // instant update (no reload)
        setBookings((prev) => [res.data.reservation, ...prev]);

        if (clearCartCallback) clearCartCallback();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <BookingContext.Provider value={{ bookings, addBooking, fetchBookings }}>
      {children}
    </BookingContext.Provider>
  );
};

export default BookingProvider;