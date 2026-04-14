import React, { useState, useContext, useEffect, useRef } from "react";
import { CartContext } from "../context/CartContext";
import { BookingContext } from "../context/BookingContext";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import Confetti from "react-confetti";
import { tableside } from "../assets/assets";
import { ChevronLeft, ChevronRight, User, Mail, Phone, Clock } from "lucide-react";

const TableBooking = () => {
  const { cartItems, clearCart, user } = useContext(CartContext);
  const { addBooking, bookings } = useContext(BookingContext);

  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [errors, setErrors] = useState({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const seatsRef = useRef(null);

  const [form, setForm] = useState({
    firstName: user?.name || "",
    lastName: "",
    email: user?.email || "",
    phone: user?.phone || "",
    tableSeats: 0,
    date: "",
    time: "",
  });

  const seatsOptions = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const isTableBooked = () =>
    bookings.some(
      (b) =>
        b.table?.date === form.date &&
        b.table?.time === form.time &&
        b.table?.seats === Number(form.tableSeats)
    );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "Required";
    if (!form.lastName.trim()) newErrors.lastName = "Required";
    if (!form.phone.trim()) newErrors.phone = "Required";
    if (!form.date) newErrors.date = "Required";
    if (!form.time) newErrors.time = "Required";
    if (Number(form.tableSeats) <= 0) newErrors.tableSeats = "Select seats";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return toast.error("Fix errors");
    if (!cartItems.length) return toast.error("Cart empty");
    if (isTableBooked()) return toast.error("Already booked!");

    setLoading(true);

    const reservationData = {
      user: {
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        phone: form.phone,
      },
      table: {
        seats: Number(form.tableSeats),
        date: form.date,
        time: form.time,
      },
      totalAmount: cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
      cartItems: cartItems,
    };

    try {
      await addBooking(reservationData, clearCart);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);

      setForm({
        firstName: user?.name || "",
        lastName: "",
        email: user?.email || "",
        phone: user?.phone || "",
        tableSeats: 0,
        date: "",
        time: "",
      });

      setErrors({});
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const scrollRef = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({ left: direction * 120, behavior: "smooth" });
    }
  };

  return (
    <section className="h-screen flex items-center justify-center bg-black overflow-hidden">

      {showConfetti && <Confetti width={windowWidth} />}

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col lg:flex-row w-full max-w-6xl h-[85vh] max-h-[700px] bg-[#0b0b0b] border border-yellow-600/30 shadow-[0_15px_60px_rgba(255,215,0,0.15)] rounded-3xl overflow-hidden"
      >

        {/* LEFT */}
        <div className="lg:w-1/2 p-6 flex flex-col justify-between overflow-y-auto text-white">

          <div>
            <h2 className="text-2xl font-semibold text-center text-yellow-500 mb-4 tracking-wide">
              Reserve Your Experience ✨
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <Input icon={<User size={16} />} label="First Name" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} />
              <Input icon={<User size={16} />} label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input icon={<Mail size={16} />} label="Email" name="email" value={form.email} onChange={handleChange} />
              <Input icon={<Phone size={16} />} label="Phone" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} />
            </div>

            {/* SEATS */}
            <div className="mt-3">
              <p className="text-sm text-gray-300 mb-2">Select Seats</p>

              <div className="relative">
                <button onClick={() => scrollRef(seatsRef, -1)} className="absolute left-0 top-1/2 -translate-y-1/2 bg-black p-2 rounded-full border border-yellow-600">
                  <ChevronLeft size={18} />
                </button>

                <div ref={seatsRef} className="flex overflow-x-auto gap-3 py-2 px-8">
                  {seatsOptions.map((s) => (
                    <button
                      key={s}
                      onClick={() => setForm({ ...form, tableSeats: s })}
                      className={`px-3 py-2 text-sm rounded-full border ${
                        form.tableSeats === s
                          ? "bg-yellow-500 text-black"
                          : "border-yellow-600 text-yellow-400 hover:bg-yellow-600/20"
                      }`}
                    >
                      {s} Seats
                    </button>
                  ))}
                </div>

                <button onClick={() => scrollRef(seatsRef, 1)} className="absolute right-0 top-1/2 -translate-y-1/2 bg-black p-2 rounded-full border border-yellow-600">
                  <ChevronRight size={18} />
                </button>
              </div>

              {errors.tableSeats && <p className="text-red-400 text-sm">{errors.tableSeats}</p>}
            </div>

            <Input type="date" icon={<Clock size={16} />} label="Date" name="date" value={form.date} onChange={handleChange} error={errors.date} />
            <Input type="time" icon={<Clock size={16} />} label="Time" name="time" value={form.time} onChange={handleChange} error={errors.time} />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || isTableBooked()}
            className="w-full py-3 mt-4 text-base font-semibold rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:scale-[1.03] transition"
          >
            {loading ? "Processing..." : "Reserve Now"}
          </button>
        </div>

        {/* RIGHT */}
        <div className="lg:w-1/2 hidden lg:block relative">
          <video autoPlay loop muted className="w-full h-full object-cover" src={tableside.video} />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex items-center justify-center">
            <h1 className="text-yellow-400 text-3xl font-semibold tracking-widest text-center px-6">
              Fine Dining Experience
            </h1>
          </div>
        </div>

      </motion.div>
    </section>
  );
};

export default TableBooking;

// INPUT
const Input = ({ label, name, value, onChange, type="text", error, icon }) => {
  const inputRef = useRef();

  const handleClick = () => {
    if (type === "date" || type === "time") {
      inputRef.current.showPicker(); // 🔥 important
    }
  };

  return (
    <div className="mb-2">
      <label className="text-xs text-gray-400">{label}</label>

      <div
        onClick={handleClick}
        className="flex items-center border border-yellow-700/40 bg-black/40 rounded-lg px-3 py-2 cursor-pointer hover:border-yellow-500 transition"
      >
        {icon && <span className="mr-2 text-yellow-500">{icon}</span>}

        <input
          ref={inputRef}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full text-sm bg-transparent outline-none text-white cursor-pointer"
        />
      </div>

      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
};