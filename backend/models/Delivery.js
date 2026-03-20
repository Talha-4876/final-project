import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    country: { type: String, default: "Pakistan" },
    city: { type: String, required: true },
    street: { type: String, required: true }, // store address here
    apartment: { type: String },
    postalCode: { type: String },
    deliveryInstructions: { type: String },
    paymentMethod: { type: String, default: "cash" },
    cartItems: [
      {
        _id: String,
        name: String,
        quantity: Number,
        price: Number, // USD
        image: String
      },
    ],
    deliveryCharge: { type: Number, default: 0 }, // USD
    totalAmount: { type: Number, required: true }, // USD
    status: { type: String, default: "pending" }, // pending, delivered, canceled
  },
  { timestamps: true }
);

export default mongoose.model("Delivery", deliverySchema);