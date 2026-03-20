import express from "express";
import Delivery from "../models/Delivery.js";

const router = express.Router();

// Convert PKR to USD
const PKR_TO_USD = 0.0057; // 1 PKR = 0.0057 USD (adjust as needed)

// Create a new delivery order
router.post("/create", async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      country,
      city,
      address,
      apartment,
      postalCode,
      deliveryInstructions,
      paymentMethod,
      cartItems,
      deliveryCharge
    } = req.body;

    // Validate required fields
    if (!name || !phone || !city || !address || !cartItems || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Required fields missing" });
    }

    // Convert prices to USD
    const cartUSD = cartItems.map(item => ({
      ...item,
      price: parseFloat((item.price * PKR_TO_USD).toFixed(2))
    }));
    const deliveryUSD = parseFloat((deliveryCharge * PKR_TO_USD).toFixed(2));
    const totalUSD = parseFloat((cartUSD.reduce((acc, i) => acc + i.price * i.quantity, 0) + deliveryUSD).toFixed(2));

    const newDelivery = new Delivery({
      name,
      phone,
      email,
      country,
      city,
      street: address,
      apartment,
      postalCode,
      deliveryInstructions,
      paymentMethod,
      cartItems: cartUSD,
      deliveryCharge: deliveryUSD,
      totalAmount: totalUSD,
    });

    await newDelivery.save();

    res.status(201).json({ success: true, message: "Delivery info saved successfully!", order: newDelivery });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;