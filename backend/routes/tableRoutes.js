import express from "express";
import {
  addTable,
  getAllTables,
  deleteTable,
  getTablesWithStatus,
} from "../controllers/tableController.js";

const router = express.Router();

router.post("/add", addTable);           // Admin: add table
router.get("/all", getAllTables);         // Admin: list all tables
router.delete("/delete/:id", deleteTable); // Admin: delete table
router.get("/status", getTablesWithStatus); // Customer: tables + booking status

export default router;