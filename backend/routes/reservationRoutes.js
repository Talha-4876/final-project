import express from "express";
import {
  createReservation,
  getUserReservations,
  getAllReservations,
  deleteReservation,
  markAsPaid,
} from "../controllers/reservationController.js";

const router = express.Router();

router.post("/create", createReservation);
router.get("/user", getUserReservations);
router.get("/get", getAllReservations);
router.delete("/delete/:id", deleteReservation);
router.put("/markPaid/:id", markAsPaid);

export default router;