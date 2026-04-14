// backend/routes/contactRoutes.js
import express from "express";
import { transporter } from "../utils/mailer.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, phone, message } = req.body;

  console.log("Incoming contact request:", req.body);

  if (!name || !email || !phone) {
    return res.status(400).json({
      success: false,
      message: "Name, email, and phone are required."
    });
  }

  const mailOptions = {
    from: email,
    to: process.env.ADMIN_EMAIL,
    subject: "New Contact Request",
    html: `
      <h3>New Contact Request</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong> ${message || "No message provided"}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Contact mail sent ✅");
    return res.json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error("Send Mail Error ❌:", err);
    return res.status(500).json({ success: false, message: "Failed to send email." });
  }
});

export default router;