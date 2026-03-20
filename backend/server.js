import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import cloudinary from "./config/cloudinary.js";

// ===== ROUTES =====
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

// ===== MIDDLEWARE =====
import authMiddleware from "./middleware/authMiddleware.js";
import adminAuth from "./middleware/adminAuth.js";

const app = express();
const port = process.env.PORT || 3200;

// ===== DATABASE =====
const startServer = async () => {
  try {
    await connectDB(); // Connect DB only once
    console.log("MongoDB connected ✅");

    // ===== CLOUDINARY =====
    console.log("Cloudinary connected ✅");

    // ===== MIDDLEWARE =====
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // ===== PUBLIC AUTH ROUTES =====
    app.use("/api/auth", authRoutes);

    // ===== PROTECTED USER ROUTES =====
    app.use("/api/user", authMiddleware, userRoutes);

    // ===== PRODUCT ROUTES =====
    app.use("/api/product", productRoutes);

    // ===== ORDERS =====
    app.use("/api/order", authMiddleware, orderRoutes);

    // ===== RESERVATIONS =====
    app.use("/api/reservations", reservationRoutes);

    // ===== REVIEWS =====
    app.use("/api/reviews", reviewRoutes);

    // ===== DELIVERY =====
    app.use("/api/delivery", deliveryRoutes);

    // ===== ADMIN =====
    app.use("/api/admin", adminRoutes);

    // ===== AI Chatbot =====
    app.use("/api/chat", chatRoutes);

    app.use("/api/contact", contactRoutes);

    // ===== ADMIN REVIEW ROUTE =====
    app.get("/api/admin/reviews", authMiddleware, adminAuth, async (req, res) => {
      try {
        const { default: Product } = await import("./models/Product.js");
        const products = await Product.find({}, { name: 1, reviews: 1 });
        const allReviews = products.flatMap((p) =>
          p.reviews.map((r) => ({
            ...r._doc,
            productId: p._id,
            productName: p.name,
          }))
        );
        res.json({ success: true, reviews: allReviews });
      } catch (err) {
        console.error("Admin reviews fetch error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch admin reviews" });
      }
    });

    // ===== HEALTH CHECK =====
    app.get("/", (req, res) => res.send("API is working!"));

    // ===== GLOBAL ERROR HANDLER =====
    app.use((err, req, res, next) => {
      console.error("Server error:", err.stack);
      res.status(500).json({ success: false, message: "Server error" });
    });

    // ===== START SERVER =====
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });

  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1); // exit if DB fails
  }
};

// Start the server
startServer();