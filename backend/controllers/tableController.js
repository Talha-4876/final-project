import Table from "../models/tableModel.js";
import Reservation from "../models/reservationModels.js";

// ================= ADD TABLE (Admin) =================
export const addTable = async (req, res) => {
  try {
    const { tableNumber, seats, label } = req.body;

    if (!tableNumber || !seats) {
      return res.status(400).json({ success: false, message: "tableNumber and seats are required" });
    }

    const exists = await Table.findOne({ tableNumber });
    if (exists) {
      return res.status(400).json({ success: false, message: "Table number already exists" });
    }

    const table = await Table.create({ tableNumber, seats, label });
    res.status(201).json({ success: true, table });
  } catch (err) {
    console.error("ADD TABLE ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to add table" });
  }
};

// ================= GET ALL TABLES =================
export const getAllTables = async (req, res) => {
  try {
    const tables = await Table.find({ isActive: true }).sort({ tableNumber: 1 });
    res.json({ success: true, tables });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// ================= DELETE TABLE (Admin) =================
export const deleteTable = async (req, res) => {
  try {
    await Table.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Table deleted" });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

// ================= GET TABLES WITH BOOKING STATUS =================
export const getTablesWithStatus = async (req, res) => {
  try {
    const tables = await Table.find({ isActive: true }).sort({ tableNumber: 1 });

    // ✅ Sirf "active" reservations fetch karo — completed tables available ho jayen
    const reservations = await Reservation.find({ status: "active" });

    // ✅ tableNumber se match karo — seats se nahi
    const tablesWithStatus = tables.map((t) => {
      const isBooked = reservations.some(
        (r) => r.table.tableNumber === t.tableNumber
      );

      return {
        _id: t._id,
        tableNumber: t.tableNumber,
        seats: t.seats,
        label: t.label,
        status: isBooked ? "Booked" : "Available",
      };
    });

    res.json({ success: true, tables: tablesWithStatus });
  } catch (err) {
    console.error("STATUS ERROR:", err);
    res.status(500).json({ success: false });
  }
};