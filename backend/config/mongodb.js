import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    });

    console.log("MongoDB connected ✅");
  } catch (error) {
    console.log("MongoDB connection error ❌", error.message);
    process.exit(1);
  }
};

export default connectDB;



