import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    user: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },

    table: {
      seats: { type: Number, required: true },
      date: { type: String, required: true },
      time: { type: String, required: true },
      country: String,
      city: String,
      street: String,
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
  },
  { timestamps: true }
);

export default mongoose.model("Reservation", reservationSchema);