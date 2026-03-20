import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js"; // <-- your admin collection

const authMiddleware = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch admin from Admin collection
      req.user = await Admin.findById(decoded.id).select("-password");

      if (!req.user)
        return res.status(401).json({ success: false, message: "Admin not found" });

      next();
    } catch (err) {
      console.error(err.message);
      return res
        .status(401)
        .json({ success: false, message: "Not authorized or token expired" });
    }
  } else {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }
};

export default authMiddleware;