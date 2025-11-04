const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ✅ Ensure 'uploads/' directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Extract file extension
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);

    // ✅ Sanitize filename (no spaces, symbols, or weird chars)
    const safeBase = base
      .replace(/\s+/g, "_")      // replace spaces with underscores
      .replace(/[^\w.-]/g, "");  // keep only letters, numbers, underscore, dot, dash

    // ✅ Create unique, clean filename
    const uniqueName = `${Date.now()}-${safeBase}${ext}`;

    cb(null, uniqueName);
  },
});

// ✅ Initialize multer with this safe storage
const upload = multer({ storage });

module.exports = upload;
