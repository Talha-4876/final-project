import reservationModel from "../models/reservationModels.js";

// ================= CREATE RESERVATION =================
export const createReservation = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      country,
      city,
      street,
      tableSeats,
      date,
      time,
      cartItems,
      paymentMethod, // ✅ NEW
    } = req.body;

    if (!name || !phone || !tableSeats || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Name, Phone, Table Seats, Date & Time are required",
      });
    }

    // ✅ TOTAL AMOUNT CALCULATE
    const totalAmount = (cartItems || []).reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const reservation = new reservationModel({
      user: {
        name,
        phone,
        email,
        country,
        city,
        street,
      },
      table: {
        seats: tableSeats,
        date,
        time,
      },
      cartItems: cartItems || [],
      paymentMethod: paymentMethod || "cash", // ✅ NEW
      totalAmount, // ✅ NEW
    });

    await reservation.save();

    res.status(201).json({
      success: true,
      message: "Reservation created successfully",
      reservation,
    });
  } catch (error) {
    console.error("CREATE RESERVATION ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= GET ALL RESERVATIONS (ADMIN) =================
export const getAllReservation = async (req, res) => {
  try {
    const reservations = await reservationModel
      .find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reservations,
    });
  } catch (error) {
    console.error("GET RESERVATIONS ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= DELETE RESERVATION =================
export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await reservationModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    res.json({
      success: true,
      message: "Reservation deleted successfully",
    });
  } catch (error) {
    console.error("DELETE RESERVATION ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================= MARK AS PAID =================
export const markAsPaid = async (req, res) => {
  try {
    const updated = await reservationModel.findByIdAndUpdate(
      req.params.id,
      { isPaid: true },
      { new: true }
    );

    if (!updated) {
      return res.json({ success: false, message: "Not found" });
    }

    res.json({
      success: true,
      message: "Payment marked as paid",
      updated,
    });
  } catch (error) {
    console.error("PAYMENT ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};