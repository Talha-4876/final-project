import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import cloudinaryConfig from "./config/cloudinary.js";

// Load env
dotenv.config();

// Routes
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
import analyticsRoutes from "./routes/analyticsRoutes.js";
import chefRoutes from "./routes/chefRoutes.js";
import adminStatsRoutes from "./routes/adminStatsRoutes.js";

// Middleware
import authMiddleware from "./middleware/authMiddleware.js";
import adminAuth from "./middleware/adminAuth.js";

// Models
import Contact from "./models/Contact.js";
import Reservation from "./models/reservationModels.js";
import Delivery from "./models/Delivery.js";

const app = express();
const port = process.env.PORT || 3200;

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   ENV DEBUG
========================= */
console.log("SERVER STARTING...");
console.log("EMAIL:", process.env.EMAIL ? "OK" : "MISSING");
console.log("ADMIN EMAIL:", process.env.ADMIN_EMAIL ? "OK" : "MISSING");
console.log("MONGO URI:", process.env.MONGODB_URI ? "OK" : "MISSING"); // ✅ FIX ADDED

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/user", authMiddleware, userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", authMiddleware, orderRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/chefs", chefRoutes);
app.use("/api/admin", adminStatsRoutes);

/* =========================
   ADMIN NOTIFICATIONS API
========================= */
app.get("/admin/notifications", async (req, res) => {
  try {
    const messages = await Contact.countDocuments({ isRead: false });
    const reservations = await Reservation.countDocuments({ isPaid: false });
    const deliveries = await Delivery.countDocuments({ status: "Pending" });

    res.json({
      messages,
      reservations,
      deliveries,
    });
  } catch (err) {
    console.log("Notification API Error:", err.message);
    res.status(500).json({ success: false });
  }
});

/* =========================
   ADMIN REVIEWS
========================= */
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
    console.error("Admin reviews error:", err);
    res.status(500).json({ success: false });
  }
});

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("API is working 🚀");
});

/* =========================
   ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ success: false, message: "Server error" });
});

/* =========================
   SAFE SERVER START
========================= */
const startServer = async () => {
  try {
    // ✅ SAFE DB CONNECTION
    await connectDB();

    console.log("MongoDB connected ✅");

    cloudinaryConfig();
    console.log("Cloudinary connected ✅");

    app.listen(port, () => {
      console.log(`Server running on port ${port} 🚀`);
    });

  } catch (err) {
    console.error("Server start failed ❌:", err.message);

    // ❗ IMPORTANT: stop app properly
    process.exit(1);
  }
};

startServer();