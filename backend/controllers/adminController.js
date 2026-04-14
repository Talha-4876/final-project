import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let admin = await Admin.findOne({ email });

    // ✅ Agar admin nahi hai → create kar do
    if (!admin) {
      const hashedPassword = await bcrypt.hash(password, 10);

      admin = await Admin.create({
        name: "Admin",
        email,
        password: hashedPassword,
      });

      console.log("New admin created:", email);
    } else {
      // ✅ Agar admin hai → password update kar do (NO ERROR)
      const hashedPassword = await bcrypt.hash(password, 10);
      admin.password = hashedPassword;
      await admin.save();

      console.log("Admin password updated:", email);
    }

    // ✅ Token generate
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ success: true, admin, token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};