const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const verifyToken = require("../middlewares/verifyToken");
const upload = require("../middlewares/uploadImage");
const path = require("path");

// Serve uploaded images statically (optional but useful)
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// GET all products (public)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// POST new product (with multer and auth)
router.post("/", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const {
      id,
      name,
      newPrice,
      oldPrice,
      author,
      category,
    } = req.body;

    if (!id || !name || !newPrice || !category || !req.file) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Check for existing ID
    const exists = await Product.findOne({ id });
    if (exists) {
      return res.status(409).json({ error: "Product ID already exists." });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/api/products/uploads/${req.file.filename}`;

    const newProduct = new Product({
      id,
      name,
      newPrice,
      oldPrice: oldPrice || undefined,
      author: author || undefined,
      category,
      image: imageUrl,
    });

    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Product add error:", err.message);
    res.status(500).json({ error: "Failed to add product." });
  }
});

module.exports = router;