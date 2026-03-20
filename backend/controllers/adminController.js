import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let admin = await Admin.findOne({ email });

    if (!admin) {
      // Auto-create admin if not exists
      const hashedPassword = await bcrypt.hash(password, 10);
      admin = await Admin.create({ name: "Admin", email, password: hashedPassword });
      console.log("New admin created:", email);
    } else {
      // If admin exists, check password
      const isMatch = await admin.matchPassword(password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ success: true, admin, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};