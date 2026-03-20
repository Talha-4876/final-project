import express from "express";
import {
  createReservation,
  getAllReservation,
  deleteReservation,
  markAsPaid,
} from "../controllers/reservationController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// ================= USER =================

// Create reservation
router.post("/create", createReservation);

// ================= ADMIN =================

// Get all reservations
router.get("/get", adminAuth, getAllReservation);

// Delete reservation
router.delete("/delete/:id", adminAuth, deleteReservation);

// Mark reservation as paid
router.put("/pay/:id", adminAuth, markAsPaid);

export default router;

