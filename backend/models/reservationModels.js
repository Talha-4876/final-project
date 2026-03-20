import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  user: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    country: String,
    city: String,
    street: String,
  },

  table: {
    seats: { type: Number, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
  },

  cartItems: {
    type: Array,
    default: [],
  },

  // ✅ NEW (PAYMENT SYSTEM)
  paymentMethod: {
    type: String,
    enum: ["cash", "card", "jazzcash", "easypaisa"],
    default: "cash",
  },

  isPaid: {
    type: Boolean,
    default: false,
  },

  totalAmount: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const reservationModel =
  mongoose.models.Reservation ||
  mongoose.model("Reservation", reservationSchema);

export default reservationModel;
