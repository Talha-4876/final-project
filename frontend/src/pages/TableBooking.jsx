import React, { useState, useContext, useEffect, useRef } from "react";
import { CartContext } from "../context/CartContext";
import { BookingContext } from "../context/BookingContext";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import Confetti from "react-confetti";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import { backendUrl } from "../config";

const TIME_SLOTS = [
  "12:00 PM","12:30 PM","01:00 PM","01:30 PM","02:00 PM","02:30 PM",
  "03:00 PM","03:30 PM","07:00 PM","07:30 PM","08:00 PM","08:30 PM",
  "09:00 PM","09:30 PM","10:00 PM","10:30 PM","11:00 PM",
];
const GUEST_OPTIONS = ["1 Guest","2 Guests","3 Guests","4 Guests","5 Guests","6 Guests","7 Guests","8+ Guests"];
const OCCASIONS = ["Birthday","Anniversary","Business Dinner","Date Night","Family Gathering","Celebration","Other"];

const todayStr = () => new Date().toISOString().split("T")[0];

const TableBooking = () => {
  const { cartItems, clearCart, user } = useContext(CartContext);
  const { addBooking } = useContext(BookingContext);

  const [loading, setLoading] = useState(false);
  const [fetchingTables, setFetchingTables] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [errors, setErrors] = useState({});
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const seatsRef = useRef(null);

  const [form, setForm] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ").slice(1).join(" ") || "",
    email: user?.email || "",
    phone: user?.phone || "",
    date: "",
    time: "",
    guests: "",
    occasion: "",
    specialRequests: "",
  });

  useEffect(() => {
    const fn = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  const fetchAvailableTables = async (date, time) => {
    if (!date || !time) return;
    setFetchingTables(true);
    setAvailableTables([]);
    setSelectedTable(null);
    try {
      const res = await axios.get(`${backendUrl}/api/tables/status`, { params: { date, time } });
      if (res.data.success) setAvailableTables(res.data.tables);
    } catch {
      toast.error("Could not load tables, please try again");
    } finally {
      setFetchingTables(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
    if (name === "date" && updated.time) fetchAvailableTables(value, updated.time);
    if (name === "time" && updated.date) fetchAvailableTables(updated.date, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "Required";
    if (!form.lastName.trim()) newErrors.lastName = "Required";
    if (!form.phone.trim()) newErrors.phone = "Required";
    if (!form.date) newErrors.date = "Required";
    if (!form.time) newErrors.time = "Required";
    if (!selectedTable) newErrors.table = "Please select a table";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return toast.error("Please fill all required fields");
    if (!cartItems.length) return toast.error("Add items to your cart first");
    if (selectedTable.status === "Booked") return toast.error("This table is already booked!");

    setLoading(true);
    const reservationData = {
      user: { name: `${form.firstName} ${form.lastName}`, email: form.email, phone: form.phone },
      table: {
        seats: selectedTable.seats, date: form.date, time: form.time,
        tableNumber: selectedTable.tableNumber, label: selectedTable.label || "",
        guests: form.guests, occasion: form.occasion, specialRequests: form.specialRequests,
      },
      totalAmount: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
      cartItems,
    };

    try {
      await addBooking(reservationData, clearCart);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      setForm({
        firstName: user?.name?.split(" ")[0] || "", lastName: "",
        email: user?.email || "", phone: user?.phone || "",
        date: "", time: "", guests: "", occasion: "", specialRequests: "",
      });
      setAvailableTables([]); setSelectedTable(null); setErrors({});
    } catch (err) { console.log(err); }
    finally { setLoading(false); }
  };

  const scrollSeats = (dir) => seatsRef.current?.scrollBy({ left: dir * 130, behavior: "smooth" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Jost:wght@300;400;500;600&display=swap');

        .tb2-page {
          min-height: 100vh;
          background: #f2ede6;
          display: flex;
          font-family: 'Jost', sans-serif;
        }

        .tb2-left {
          width: 340px; flex-shrink: 0;
          background: #1c1a17;
          display: flex; flex-direction: column; justify-content: space-between;
          padding: 56px 40px;
          position: sticky; top: 0; height: 100vh;
        }
        @media (max-width: 860px) { .tb2-left { display: none; } }

        .tb2-left-tag {
          font-size: 9px; letter-spacing: 0.35em; text-transform: uppercase;
          color: #b08d57; font-weight: 600; margin-bottom: 20px;
        }
        .tb2-left-title {
          font-family: 'Libre Baskerville', serif;
          font-size: 2.6rem; font-weight: 400; color: #f2ede6;
          line-height: 1.15; margin: 0 0 24px;
        }
        .tb2-left-title em { font-style: italic; color: #b08d57; }
        .tb2-left-rule { width: 40px; height: 1px; background: #b08d57; margin-bottom: 24px; }
        .tb2-left-desc { font-size: 13px; color: #7a6f60; line-height: 1.8; font-weight: 300; }
        .tb2-left-hours-label {
          font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase;
          color: #b08d57; font-weight: 600; margin-bottom: 12px;
        }
        .tb2-left-hours-item {
          font-size: 12px; color: #7a6f60;
          display: flex; justify-content: space-between; margin-bottom: 6px; font-weight: 300;
        }
        .tb2-left-hours-item span:last-child { color: #a89070; }

        .tb2-right {
          flex: 1; overflow-y: auto;
          padding: 56px 48px 80px; max-width: 680px;
        }
        @media (max-width: 860px) { .tb2-right { padding: 40px 20px 60px; } }

        .tb2-section-title {
          font-family: 'Libre Baskerville', serif;
          font-size: 1rem; font-weight: 400; color: #1c1a17;
          margin: 0 0 20px; padding-bottom: 12px;
          border-bottom: 1px solid #d9d1c4;
          display: flex; align-items: center; gap: 12px;
        }
        .tb2-section-num {
          width: 24px; height: 24px; border-radius: 50%;
          background: #1c1a17; color: #f2ede6;
          font-family: 'Jost', sans-serif; font-size: 10px; font-weight: 600;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .tb2-section { margin-bottom: 40px; }

        .tb2-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
        @media (max-width: 520px) { .tb2-grid-2 { grid-template-columns: 1fr; } }

        .tb2-field { display: flex; flex-direction: column; gap: 7px; margin-bottom: 16px; }
        .tb2-label { font-size: 9px; font-weight: 600; letter-spacing: 0.28em; text-transform: uppercase; color: #9a8e7e; }

        .tb2-input {
          background: #fff; border: 1px solid #d9d1c4; border-radius: 3px;
          padding: 12px 14px; color: #1c1a17;
          font-family: 'Jost', sans-serif; font-size: 14px; font-weight: 400;
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%; box-sizing: border-box;
          appearance: none; -webkit-appearance: none;
        }
        .tb2-input:focus { border-color: #b08d57; box-shadow: 0 0 0 3px rgba(176,141,87,0.1); }
        .tb2-input::placeholder { color: #bbb; }
        .tb2-input.err { border-color: #c0785a; }
        .tb2-input::-webkit-calendar-picker-indicator { opacity: 0.5; cursor: pointer; }

        .tb2-sel-wrap { position: relative; }
        .tb2-sel-wrap::after {
          content: '▾'; position: absolute; right: 13px; top: 50%;
          transform: translateY(-50%); color: #b08d57; pointer-events: none; font-size: 11px;
        }
        .tb2-select {
          background: #fff; border: 1px solid #d9d1c4; border-radius: 3px;
          padding: 12px 36px 12px 14px; color: #1c1a17;
          font-family: 'Jost', sans-serif; font-size: 14px; font-weight: 400;
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%; appearance: none; -webkit-appearance: none; cursor: pointer;
        }
        .tb2-select:focus { border-color: #b08d57; box-shadow: 0 0 0 3px rgba(176,141,87,0.1); }
        .tb2-select option { background: #fff; color: #1c1a17; }

        .tb2-textarea {
          background: #fff; border: 1px solid #d9d1c4; border-radius: 3px;
          padding: 12px 14px; color: #1c1a17;
          font-family: 'Jost', sans-serif; font-size: 14px;
          resize: vertical; min-height: 90px; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%; box-sizing: border-box;
        }
        .tb2-textarea:focus { border-color: #b08d57; box-shadow: 0 0 0 3px rgba(176,141,87,0.1); }
        .tb2-textarea::placeholder { color: #bbb; }
        .tb2-err { font-size: 10px; color: #b05a3a; margin-top: 3px; }

        .tb2-tables-hint {
          font-size: 12px; color: #a89a88; text-align: center;
          padding: 20px; background: #ece6de; border-radius: 3px;
          border: 1px dashed #d0c4b3;
        }
        .tb2-scroll-outer { position: relative; }
        .tb2-scroll {
          display: flex; gap: 10px; overflow-x: auto;
          padding: 4px 36px; scrollbar-width: none;
        }
        .tb2-scroll::-webkit-scrollbar { display: none; }
        .tb2-scroll-btn {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 28px; height: 28px; border-radius: 50%;
          background: #fff; border: 1px solid #d9d1c4;
          color: #b08d57; display: flex; align-items: center; justify-content: center;
          cursor: pointer; z-index: 5; transition: all 0.2s;
        }
        .tb2-scroll-btn:hover { border-color: #b08d57; }
        .tb2-scroll-btn.l { left: 0; }
        .tb2-scroll-btn.r { right: 0; }

        .tb2-card {
          flex-shrink: 0; width: 100px; padding: 14px 10px;
          border-radius: 3px; border: 1px solid #d9d1c4; background: #fff;
          text-align: center; cursor: pointer; transition: all 0.18s;
        }
        .tb2-card:hover:not(.bk) { border-color: #b08d57; background: #faf7f2; }
        .tb2-card.sel { border-color: #b08d57; background: #faf7f2; box-shadow: 0 0 0 3px rgba(176,141,87,0.15); }
        .tb2-card.bk { opacity: 0.45; cursor: not-allowed; }

        .tb2-card-n { font-family: 'Libre Baskerville', serif; font-size: 22px; font-weight: 400; color: #1c1a17; line-height: 1; margin-bottom: 4px; }
        .tb2-card.sel .tb2-card-n { color: #b08d57; }
        .tb2-card-s { font-size: 10px; color: #9a8e7e; letter-spacing: 0.1em; margin-bottom: 4px; }
        .tb2-card-l { font-size: 9px; color: #b08d57; letter-spacing: 0.1em; margin-bottom: 6px; text-transform: uppercase; }
        .tb2-card-st { font-size: 9px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; }
        .tb2-card-st.av { color: #5a8a6a; }
        .tb2-card-st.bk { color: #a06050; }

        .tb2-sel-info { text-align: center; font-size: 11px; color: #b08d57; margin-top: 10px; letter-spacing: 0.1em; }

        .tb2-btn {
          width: 100%; padding: 16px;
          background: #1c1a17; color: #f2ede6; border: none; border-radius: 3px;
          font-family: 'Jost', sans-serif; font-size: 11px; font-weight: 600;
          letter-spacing: 0.3em; text-transform: uppercase;
          cursor: pointer; transition: all 0.25s; margin-top: 8px;
        }
        .tb2-btn:hover:not(:disabled) { background: #b08d57; }
        .tb2-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .tb2-note { text-align: center; font-size: 11px; color: #a89a88; margin-top: 16px; line-height: 1.8; }
      `}</style>

      {showConfetti && <Confetti width={windowWidth} numberOfPieces={180} colors={["#b08d57","#f2ede6","#1c1a17","#d9c9a8"]} />}

      <div className="tb2-page">
        {/* LEFT */}
        <div className="tb2-left">
          <div>
            <p className="tb2-left-tag">Fine Dining</p>
            <h1 className="tb2-left-title">Reserve<br /><em>Your Table</em></h1>
            <div className="tb2-left-rule" />
            <p className="tb2-left-desc">Experience an unforgettable evening of exquisite cuisine, impeccable service, and timeless ambiance. For parties of 8 or more, please contact us directly.</p>
          </div>
          <div>
            <p className="tb2-left-hours-label">Hours</p>
            {[["Lunch", "12:00 – 15:00"],["Dinner", "19:00 – 23:00"],["Closed", "Mondays"]].map(([d,t]) => (
              <div className="tb2-left-hours-item" key={d}><span>{d}</span><span>{t}</span></div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="tb2-right">

          <motion.div className="tb2-section" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="tb2-section-title"><span className="tb2-section-num">1</span> Your Details</h2>
            <div className="tb2-grid-2">
              <F label="First Name" err={errors.firstName}><input className={`tb2-input${errors.firstName?" err":""}`} name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" /></F>
              <F label="Last Name" err={errors.lastName}><input className={`tb2-input${errors.lastName?" err":""}`} name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" /></F>
            </div>
            <div className="tb2-grid-2">
              <F label="Email"><input className="tb2-input" type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" /></F>
              <F label="Phone" err={errors.phone}><input className={`tb2-input${errors.phone?" err":""}`} name="phone" value={form.phone} onChange={handleChange} placeholder="+92 300 0000000" /></F>
            </div>
          </motion.div>

          <motion.div className="tb2-section" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <h2 className="tb2-section-title"><span className="tb2-section-num">2</span> Booking Preferences</h2>
            <div className="tb2-grid-2">
              <F label="Date" err={errors.date}><input className={`tb2-input${errors.date?" err":""}`} type="date" name="date" value={form.date} min={todayStr()} onChange={handleChange} /></F>
              <F label="Time" err={errors.time}>
                <div className="tb2-sel-wrap">
                  <select className="tb2-select" name="time" value={form.time} onChange={handleChange}>
                    <option value="">Select time</option>
                    {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </F>
            </div>
            <div className="tb2-grid-2">
              <F label="Guests">
                <div className="tb2-sel-wrap">
                  <select className="tb2-select" name="guests" value={form.guests} onChange={handleChange}>
                    <option value="">Number of guests</option>
                    {GUEST_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </F>
              <F label="Occasion">
                <div className="tb2-sel-wrap">
                  <select className="tb2-select" name="occasion" value={form.occasion} onChange={handleChange}>
                    <option value="">Select occasion</option>
                    {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </F>
            </div>
            <F label="Special Requests">
              <textarea className="tb2-textarea" name="specialRequests" value={form.specialRequests} onChange={handleChange} placeholder="Dietary requirements, allergies, special arrangements..." />
            </F>
          </motion.div>

          <motion.div className="tb2-section" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <h2 className="tb2-section-title"><span className="tb2-section-num">3</span> Select Table</h2>
            {!form.date || !form.time ? (
              <p className="tb2-tables-hint">Choose a date and time above to see available tables</p>
            ) : fetchingTables ? (
              <p className="tb2-tables-hint" style={{ color: "#b08d57" }}>Loading available tables…</p>
            ) : availableTables.length === 0 ? (
              <p className="tb2-tables-hint" style={{ color: "#a06050" }}>No tables available at this time</p>
            ) : (
              <div className="tb2-scroll-outer">
                <button type="button" className="tb2-scroll-btn l" onClick={() => scrollSeats(-1)}><ChevronLeft size={14} /></button>
                <div ref={seatsRef} className="tb2-scroll">
                  {availableTables.map((t) => {
                    const isBooked = t.status === "Booked";
                    const isSel = selectedTable?._id === t._id;
                    return (
                      <div key={t._id} className={`tb2-card${isBooked?" bk":""}${isSel?" sel":""}`} onClick={() => !isBooked && setSelectedTable(t)}>
                        <div className="tb2-card-n">{t.tableNumber}</div>
                        <div className="tb2-card-s">{t.seats} seats</div>
                        {t.label && <div className="tb2-card-l">{t.label}</div>}
                        <div className={`tb2-card-st ${isBooked?"bk":"av"}`}>{isBooked?"Reserved":"Available"}</div>
                      </div>
                    );
                  })}
                </div>
                <button type="button" className="tb2-scroll-btn r" onClick={() => scrollSeats(1)}><ChevronRight size={14} /></button>
              </div>
            )}
            {selectedTable && <p className="tb2-sel-info">Table {selectedTable.tableNumber} · {selectedTable.seats} Seats{selectedTable.label ? ` · ${selectedTable.label}` : ""}</p>}
            {errors.table && <p className="tb2-err" style={{ textAlign:"center", marginTop:8 }}>{errors.table}</p>}
          </motion.div>

          <button className="tb2-btn" onClick={handleSubmit} disabled={loading || !selectedTable || selectedTable?.status === "Booked"}>
            {loading ? "Processing…" : "Confirm Reservation"}
          </button>
          <p className="tb2-note">Cancellations accepted up to 2 hours prior · For private events call us directly</p>
        </div>
      </div>
    </>
  );
};

export default TableBooking;

const F = ({ label, err, children }) => (
  <div className="tb2-field">
    <label className="tb2-label">{label}</label>
    {children}
    {err && <p className="tb2-err">{err}</p>}
  </div>
);
