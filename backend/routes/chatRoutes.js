import express from "express";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();
const upload = multer();

const genAI = new GoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

router.post("/", upload.any(), async (req, res) => {
  try {
    const message = req.body.message || "";
    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    // This example uses a Gemini content generation method.
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const result = await model.generateContent({
      prompt: `User: ${message}\nAI:`,
    });

    const aiText = result.response.text();

    res.json({ success: true, message: aiText });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ success: false, message: "AI request failed" });
  }
});

export default router;