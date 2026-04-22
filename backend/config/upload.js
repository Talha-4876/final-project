import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

// Memory storage — file disk pe save nahi hogi, seedha Cloudinary jayegi
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  allowed.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Sirf JPG, PNG, WEBP allowed hain"), false);
};

// Chef images Cloudinary pe upload karne ka function
export const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: "restaurant-chefs",
        transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });
};

export const uploadChef = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Purana default export — baaki routes ke liye
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
  }),
});

export default upload;