import express from "express";
import Review from "../models/Review.js";

const router = express.Router();


// =====================================
// ADD REVIEW (PRODUCT WISE)
// =====================================
router.post("/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, comment, rating } = req.body;

    if (!name || !comment || !rating) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const review = await Review.create({
      productId,
      name,
      comment,
      rating,
    });

    res.status(201).json({
      success: true,
      review,
    });
  } catch (error) {
    console.log("Review error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add review",
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Review deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete review"
    });
  }
});


router.get("/analytics/summary", async (req, res) => {
  try {
    const reviews = await Review.find();

    const totalReviews = reviews.length;

    const avgRating =
      totalReviews === 0
        ? 0
        : (
            reviews.reduce((acc, r) => acc + r.rating, 0) /
            totalReviews
          ).toFixed(1);

    const ratingDistribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    };

    res.json({
      success: true,
      totalReviews,
      avgRating,
      ratingDistribution,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Analytics error",
    });
  }
});

router.get("/analytics/ai", async (req, res) => {
  try {
    const reviews = await Review.find();

    let positive = 0;
    let negative = 0;
    let neutral = 0;

    let lowRatingWords = 0;

    reviews.forEach(r => {
      if (r.rating >= 4) positive++;
      else if (r.rating === 3) neutral++;
      else negative++;

      // simple "AI logic"
      if (r.comment?.length < 10 && r.rating <= 2) {
        lowRatingWords++;
      }
    });

    const avgRating =
      reviews.length === 0
        ? 0
        : (
            reviews.reduce((a, b) => a + b.rating, 0) /
            reviews.length
          ).toFixed(1);

    let insight = "System Normal";

    if (negative > positive) {
      insight = "⚠ High negative feedback detected";
    } else if (positive > negative) {
      insight = "🔥 Customers are satisfied";
    }

    if (avgRating < 3) {
      insight = "🚨 Product/service quality issue detected";
    }

    res.json({
      success: true,
      totalReviews: reviews.length,
      avgRating,
      sentiment: {
        positive,
        negative,
        neutral,
      },
      lowQualitySignals: lowRatingWords,
      insight,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "AI analytics failed",
    });
  }
});

// =====================================
// GET REVIEWS (PRODUCT WISE)
// =====================================
router.get("/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({
      productId: req.params.productId,
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
});



// =====================================
// ⭐ NEW: ADMIN GET ALL REVIEWS (FIX FOR ERROR)
// =====================================
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch all reviews",
    });
  }
});

export default router;