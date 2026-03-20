import express from "express";
import Review from "../models/Review.js";

const router = express.Router();

// ================= ADD REVIEW =================

router.post("/:productId", async (req, res) => {

  const { productId } = req.params;
  const { name, comment, rating } = req.body;

  if (!name || !comment || !rating) {
    return res.status(400).json({
      success: false,
      message: "All fields required"
    });
  }

  try {

    const review = await Review.create({
      productId,
      name,
      comment,
      rating,
    });

    res.status(201).json({
      success: true,
      review
    });

  } catch (error) {

    console.error("Review error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add review"
    });

  }

});


// ================= GET REVIEWS =================

router.get("/:productId", async (req, res) => {

  try {

    const reviews = await Review.find({
      productId: req.params.productId
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews"
    });

  }

});

export default router;