import Reservation from "../models/reservationModels.js";

// ================= CREATE =================
export const createReservation = async (req, res) => {
  try {
    const { user, table, cartItems, paymentMethod, totalAmount } = req.body;

    if (
      !user?.name ||
      !user?.phone ||
      !table?.tableNumber ||
      !table?.seats ||
      !table?.date ||
      !table?.time
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // sirf active reservation check karo
    const existing = await Reservation.findOne({
      "table.tableNumber": table.tableNumber,
      status: "active",
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Table already booked",
      });
    }

    const reservation = await Reservation.create({
      user,
      table,
      cartItems,
      paymentMethod,
      totalAmount,
    });

    res.status(201).json({ success: true, reservation });
  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ success: false, message: "Reservation failed" });
  }
};

// ================= GET USER =================
export const getUserReservations = async (req, res) => {
  try {
    const { email } = req.query;
    let query = {};
    if (email) query["user.email"] = email;

    const reservations = await Reservation.find(query).sort({ createdAt: -1 });
    res.json({ success: true, reservations });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// ================= GET ALL =================
export const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json({ success: true, reservations });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// ================= DELETE =================
export const deleteReservation = async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// ================= MARK PAID =================
export const markAsPaid = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) return res.json({ success: false, message: "Not found" });

    reservation.isPaid = true;
    await reservation.save();

    res.json({ success: true, reservation });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// ================= MARK COMPLETED =================
export const markAsCompleted = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: "completed" },
      { new: true }
    );
    if (!reservation) return res.json({ success: false, message: "Not found" });

    res.json({ success: true, reservation });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};