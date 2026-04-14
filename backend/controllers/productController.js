// controllers/productController.js
import Product from "../models/Product.js";
import mongoose from "mongoose";
import { cloudinary } from "../config/cloudinary.js"; // ✅ crash-free
import fs from "fs";

// List all products (PKR only)
export const listProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (err) {
    console.error("List products error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Add Product
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (!name || !price || !category)
      return res.status(400).json({ success: false, message: "Name, price and category required" });

    let imageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: "menu" });
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path); // remove temp file
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image: imageUrl,
    });

    res.json({ success: true, message: "Product added successfully", product });
  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid product ID" });

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: "menu" });
      product.image = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    await product.save();
    res.json({ success: true, message: "Product updated successfully", product });
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get Single Product
export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid product ID" });

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    res.json({ success: true, product });
  } catch (err) {
    console.error("Get product error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Add Product Review
export const addProductReview = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const user = req.user;

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    product.reviews.push({
      userId: user._id,
      name: user.name,
      comment,
      rating: Number(rating),
    });

    await product.save();
    res.json({ success: true, message: "Review added", reviews: product.reviews });
  } catch (err) {
    console.error("Add review error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get Product Reviews
export const getProductReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    res.json({ success: true, reviews: product.reviews || [] });
  } catch (err) {
    console.error("Get reviews error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};