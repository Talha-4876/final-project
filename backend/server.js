// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import cloudinaryConfig from "./config/cloudinary.js";

// Load environment variables
dotenv.config();

// Import routes
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

// Middleware
import authMiddleware from "./middleware/authMiddleware.js";
import adminAuth from "./middleware/adminAuth.js";

const app = express();
const port = process.env.PORT || 3200;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug ENV (without revealing secrets)
console.log("ENV CHECK:");
console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL || "undefined");
console.log("ADMIN_PASSWORD:", process.env.ADMIN_PASSWORD ? "******" : "undefined");
console.log("MAIL EMAIL:", process.env.EMAIL || "undefined");
console.log("MAIL PASS:", process.env.PASS ? "******" : "undefined");
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "******" : "undefined");
console.log("SOURCE_LANG:", process.env.SOURCE_LANG || "EN");
console.log("TARGET_LANG:", process.env.TARGET_LANG || "IT");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", authMiddleware, userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", authMiddleware, orderRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chat", chatRoutes);       // Chatbot route
app.use("/api/contact", contactRoutes); // Mailer route

// Admin: fetch all reviews
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

// Health check
app.get("/", (req, res) => res.send("API is working!"));

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack || err);
  res.status(500).json({ success: false, message: "Server error" });
});

// Start server
const startServer = async () => {
  try {
    // Connect MongoDB
    await connectDB();
    console.log("MongoDB connected ✅");

    // Cloudinary setup
    cloudinaryConfig(); // ✅ ensures cloudinary.uploader is available
    console.log("Cloudinary connected ✅");

    // Start Express server
    app.listen(port, () => {
      console.log(`Server running on port ${port} 🚀`);
    });
  } catch (err) {
    console.error("Server start failed ❌:", err);
    process.exit(1);
  }
};

startServer();