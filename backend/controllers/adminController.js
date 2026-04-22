import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let admin = await Admin.findOne({ email });

    if (!admin) {
      // ✅ Pehli baar — email se name banao
      const emailName = email
        .split("@")[0]
        .replace(/[._-]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      const hashedPassword = await bcrypt.hash(password, 10);

      admin = await Admin.create({
        name: emailName,   // ← "Admin" ki jagah email se name
        email,
        password: hashedPassword,
      });

      console.log("New admin created:", email, "| name:", emailName);

    } else {
      // ✅ Existing admin — sirf password verify karo, update NAHI
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }
    }

    // ✅ Token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Sirf zaruri fields bhejo — name zaroori hai
    res.json({
      success: true,
      token,
      admin: {
        name:  admin.name,
        email: admin.email,
        role:  admin.role || "Admin",
      },
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Login failed" });
  }
};