import multer from "multer";
import path from "path";
import process from "process";
import fs from "fs";

/**
 * Ensure the uploads directory exists, create if not.
 * @returns {string} Absolute path to the uploads directory.
 */
const getUploadPath = () => {
  const uploadPath = path.resolve(process.cwd(), "uploads");
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }
  return uploadPath;
};

/**
 * Multer storage configuration for saving uploaded files.
 */
const storage = multer.diskStorage({
  // Set destination folder for uploads
  destination: (req, file, cb) => {
    cb(null, getUploadPath());
  },
  // Set filename format: originalname-timestamp.ext
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

/**
 * Multer middleware for handling file uploads.
 * @type {import("multer").Multer}
 */
export const upload = multer({ storage });
