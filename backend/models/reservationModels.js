import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    user: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },

    table: {
      tableNumber: { type: Number, required: true },
      seats: { type: Number, required: true },
      date: { type: String, required: true },
      time: { type: String, required: true },
      label: { type: String, default: "" },
    },

    cartItems: [
      {
        _id: String,
        name: String,
        price: Number,
        quantity: Number,
      },
    ],

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

    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Reservation", reservationSchema);