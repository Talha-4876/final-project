import express from "express";
import {
  createReservation,
  getUserReservations,
  getAllReservations,
  deleteReservation,
  markAsPaid,
} from "../controllers/reservationController.js";

import Reservation from "../models/reservationModels.js"; // ✅ FIX: top import (NO dynamic import)

const router = express.Router();

// ================= CREATE =================
router.post("/create", createReservation);

// ================= USER RESERVATIONS =================
router.get("/user", getUserReservations);

// ================= ADMIN - GET ALL =================
router.get("/all", getAllReservations);

// ================= DELETE =================
router.delete("/delete/:id", deleteReservation);

// ================= MARK AS PAID =================
router.put("/paid/:id", markAsPaid);

// ================= AI ANALYTICS ROUTE (FIXED) =================
router.get("/analytics/ai", async (req, res) => {
  try {
    const reservations = await Reservation.find();

    let pending = 0;
    let paid = 0;

    const hourMap = {};
    const dayMap = {};

    reservations.forEach((r) => {
      if (r.isPaid) paid++;
      else pending++;

      // ✅ SAFE TIME HANDLING
      if (typeof r.time === "string" && r.time.includes(":")) {
        const hour = r.time.split(":")[0];
        hourMap[hour] = (hourMap[hour] || 0) + 1;
      }

      // ✅ SAFE DATE HANDLING
      if (r.date) {
        const day = new Date(r.date).toLocaleDateString("en-US", {
          weekday: "long",
        });

        dayMap[day] = (dayMap[day] || 0) + 1;
      }
    });

    const busiestHour =
      Object.keys(hourMap).sort((a, b) => hourMap[b] - hourMap[a])[0] || "N/A";

    const busiestDay =
      Object.keys(dayMap).sort((a, b) => dayMap[b] - dayMap[a])[0] || "N/A";

    const insight =
      pending > paid
        ? "⚠ More unpaid reservations detected"
        : paid > pending
        ? "🔥 Revenue flow is healthy"
        : "System Normal";

    return res.json({
      success: true,
      total: reservations.length,
      pending,
      paid,
      busiestHour,
      busiestDay,
      insight,
    });

  } catch (err) {
    console.error("AI Analytics Error:", err); // ✅ IMPORTANT DEBUG

    return res.status(500).json({
      success: false,
      message: "AI analytics failed",
    });
  }
});

export default router;