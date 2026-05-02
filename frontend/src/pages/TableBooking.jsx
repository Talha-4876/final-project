import React, { useState, useContext, useEffect, useRef } from "react";
import { CartContext } from "../context/CartContext";
import { BookingContext } from "../context/BookingContext";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import Confetti from "react-confetti";
import { tableside } from "../assets/assets";
import { ChevronLeft, ChevronRight, User, Mail, Phone, Clock } from "lucide-react";
import axios from "axios";
import { backendUrl } from "../config";

const TableBooking = () => {
  const { cartItems, clearCart, user } = useContext(CartContext);
  const { addBooking } = useContext(BookingContext);

  const [loading, setLoading] = useState(false);
  const [fetchingTables, setFetchingTables] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [errors, setErrors] = useState({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null); // ✅ full table object

  const seatsRef = useRef(null);

  const [form, setForm] = useState({
    firstName: user?.name || "",
    lastName: "",
    email: user?.email || "",
    phone: user?.phone || "",
    date: "",
    time: "",
  });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ FIX: date aur time directly pass karo — stale closure nahi hoga
  const fetchAvailableTables = async (date, time) => {
    if (!date || !time) return;
    setFetchingTables(true);
    setAvailableTables([]);
    setSelectedTable(null);
    try {
      const res = await axios.get(`${backendUrl}/api/tables/status`, {
        params: { date, time },
      });
      if (res.data.success) {
        setAvailableTables(res.data.tables);
      }
    } catch (err) {
      console.error("Table fetch error:", err);
      toast.error("Tables load nahi hue, dobara try karo");
    } finally {
      setFetchingTables(false);
    }
  };

  // ✅ handleChange — date/time change hone par fetch trigger
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);

    if (name === "date" && updated.time) {
      fetchAvailableTables(value, updated.time);
    }
    if (name === "time" && updated.date) {
      fetchAvailableTables(updated.date, value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "Required";
    if (!form.lastName.trim()) newErrors.lastName = "Required";
    if (!form.phone.trim()) newErrors.phone = "Required";
    if (!form.date) newErrors.date = "Required";
    if (!form.time) newErrors.time = "Required";
    if (!selectedTable) newErrors.table = "Table select karo";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return toast.error("Saari fields fill karo");
    if (!cartItems.length) return toast.error("Pehle cart mein items daalo");
    if (selectedTable.status === "Booked") return toast.error("Ye table already booked hai!");

    setLoading(true);

    const reservationData = {
      user: {
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        phone: form.phone,
      },
      table: {
        seats: selectedTable.seats,
        date: form.date,
        time: form.time,
        tableNumber: selectedTable.tableNumber,
        label: selectedTable.label || "",
      },
      totalAmount: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      cartItems,
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
        date: "",
        time: "",
      });
      setAvailableTables([]);
      setSelectedTable(null);
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
        {/* LEFT — FORM */}
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

            <div className="grid grid-cols-2 gap-3">
              <Input type="date" icon={<Clock size={16} />} label="Date" name="date" value={form.date} onChange={handleChange} error={errors.date} />
              <Input type="time" icon={<Clock size={16} />} label="Time" name="time" value={form.time} onChange={handleChange} error={errors.time} />
            </div>

            {/* TABLES SECTION */}
            <div className="mt-3">
              {/* Status message */}
              {!form.date || !form.time ? (
                <p className="text-sm text-gray-500 text-center py-3 border border-dashed border-yellow-700/30 rounded-xl">
                  📅 Pehle date aur time select karo — tables dikhenge
                </p>
              ) : fetchingTables ? (
                <p className="text-sm text-yellow-400 text-center py-3 animate-pulse">
                  ⏳ Tables load ho rahe hain...
                </p>
              ) : availableTables.length === 0 ? (
                <p className="text-sm text-red-400 text-center py-3">
                  Koi table available nahi is waqt
                </p>
              ) : (
                <>
                  <p className="text-sm text-gray-300 mb-2">
                    Table Select Karo{" "}
                    <span className="text-xs text-gray-500">
                      ({availableTables.filter(t => t.status === "Available").length} available)
                    </span>
                  </p>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => scrollRef(seatsRef, -1)}
                      className="absolute left-0 top-1/2 -translate-y-1/2 bg-black p-1.5 rounded-full border border-yellow-600 z-10"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    <div ref={seatsRef} className="flex overflow-x-auto gap-3 py-2 px-8 scrollbar-hide">
                      {availableTables.map((t) => {
                        const isBooked = t.status === "Booked";
                        const isSelected = selectedTable?._id === t._id;

                        return (
                          <button
                            type="button"
                            key={t._id}
                            disabled={isBooked}
                            onClick={() => !isBooked && setSelectedTable(t)}
                            className={`flex-shrink-0 w-24 px-2 py-3 text-sm rounded-xl border text-center transition-all
                              ${isBooked
                                ? "border-red-800/50 bg-red-900/20 text-red-500 cursor-not-allowed opacity-60"
                                : isSelected
                                ? "bg-yellow-500 text-black border-yellow-400 font-bold scale-105 shadow-lg shadow-yellow-500/20"
                                : "border-yellow-700/50 text-yellow-400 hover:bg-yellow-600/20 hover:border-yellow-500"
                              }`}
                          >
                            <p className="font-semibold text-xs">Table {t.tableNumber}</p>
                            <p className="text-xs mt-0.5 opacity-80">{t.seats} Seats</p>
                            {t.label && (
                              <p className="text-[9px] mt-0.5 opacity-60">{t.label}</p>
                            )}
                            <p className={`text-[10px] mt-1 font-semibold ${isBooked ? "text-red-400" : "text-green-400"}`}>
                              {isBooked ? "Booked" : "Available"}
                            </p>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => scrollRef(seatsRef, 1)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 bg-black p-1.5 rounded-full border border-yellow-600 z-10"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  {/* Selected table info */}
                  {selectedTable && (
                    <p className="text-xs text-yellow-400 text-center mt-2">
                      ✅ Table {selectedTable.tableNumber} selected — {selectedTable.seats} seats
                    </p>
                  )}
                </>
              )}

              {errors.table && (
                <p className="text-red-400 text-xs mt-1">{errors.table}</p>
              )}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || !selectedTable || selectedTable?.status === "Booked"}
            className="w-full py-3 mt-4 text-base font-semibold rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:scale-[1.02] transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? "Processing..." : "Reserve Now"}
          </button>
        </div>

        {/* RIGHT — VIDEO */}
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

// INPUT COMPONENT
const Input = ({ label, name, value, onChange, type = "text", error, icon }) => {
  const inputRef = useRef();

  const handleClick = () => {
    if (type === "date" || type === "time") {
      inputRef.current?.showPicker();
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