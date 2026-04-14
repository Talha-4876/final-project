// backend/utils/mailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const emailUser = process.env.EMAIL || process.env.ADMIN_EMAIL || "";
const emailPass = process.env.PASS || process.env.ADMIN_PASSWORD || "";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

// 🔹 Verify transporter safely
if (!emailUser || !emailPass) {
  console.warn(
    "Mailer credentials missing ❌. Email sending will not work."
  );
} else {
  transporter.verify()
    .then(() => console.log("Mailer verification successful ✅"))
    .catch((err) =>
      console.warn("Mailer verification error ❌:", err.message)
    );
}