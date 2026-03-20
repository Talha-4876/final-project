import React, { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { motion } from "framer-motion";
import { backendUrl } from "../config";
import axios from "axios";
import { toast } from "react-hot-toast";

const TableBooking = () => {
  const { cartItems, clearCart } = useContext(CartContext); // ✅ use cartItems

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    street: "",
    tableSeats: 1,
    date: "",
    time: "",
    paymentMethod: "cash",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.firstName || !form.lastName || !form.phone || !form.date || !form.time) {
      return toast.error("Please fill all required fields!");
    }

    if (!cartItems || cartItems.length === 0) {
      return toast.error("Your cart is empty!");
    }

    const reservationData = {
      name: `${form.firstName} ${form.lastName}`,
      phone: form.phone,
      email: form.email,
      country: form.country,
      city: form.city,
      street: form.street,
      tableSeats: form.tableSeats,
      date: form.date,
      time: form.time,
      cartItems: cartItems.map((item) => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      paymentMethod: form.paymentMethod,
    };

    try {
      const res = await axios.post(`${backendUrl}/api/reservations/create`, reservationData);

      if (res.data.success) {
        clearCart();
        toast.success("🎉 Your booking has been confirmed!");
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          country: "",
          city: "",
          street: "",
          tableSeats: 1,
          date: "",
          time: "",
          paymentMethod: "cash",
        });
      } else {
        toast.error("Failed to create reservation.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while booking.");
    }
  };

  return (
    <section className="relative w-full flex justify-center items-center py-16">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-8 sm:p-12 border border-orange-200 relative z-50"
      >
        <h2 className="text-4xl font-extrabold text-center mb-10 text-orange-500">
          Book Your Table
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} />
            <Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input label="Email" name="email" value={form.email} onChange={handleChange} />
            <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Input label="Country" name="country" value={form.country} onChange={handleChange} />
            <Input label="City" name="city" value={form.city} onChange={handleChange} />
            <Input label="Street" name="street" value={form.street} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <Input label="Seats" type="number" name="tableSeats" value={form.tableSeats} onChange={handleChange} />
            <Input label="Date" type="date" name="date" value={form.date} onChange={handleChange} />
            <Input label="Time" type="time" name="time" value={form.time} onChange={handleChange} />
            <div>
              <label className="mb-2 text-gray-700 font-medium">Payment</label>
              <select
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-300 focus:outline-none shadow-sm transition-all"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="easypaisa">Easypaisa</option>
                <option value="jazzcash">JazzCash</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg sm:text-xl"
          >
            Confirm Booking
          </button>
        </form>
      </motion.div>
    </section>
  );
};

export default TableBooking;

const Input = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <label className="mb-2 text-gray-700 font-medium">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-300 focus:outline-none shadow-sm transition-all"
    />
  </div>
);