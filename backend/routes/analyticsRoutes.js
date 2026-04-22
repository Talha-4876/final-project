import express from "express";
import Delivery from "../models/Delivery.js";

const router = express.Router();

// ======================
// DASHBOARD STATS
// ======================
router.get("/stats", async (req, res) => {
  try {
    const orders = await Delivery.find();

    const totalOrders = orders.length;

    const totalRevenue = orders.reduce(
      (acc, item) => acc + item.totalAmount,
      0
    );

    const pendingOrders = orders.filter(
      (o) => o.status === "Pending"
    ).length;

    const deliveredOrders = orders.filter(
      (o) => o.status === "Delivered"
    ).length;

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue,
        pendingOrders,
        deliveredOrders,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

export default router;