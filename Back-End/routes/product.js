const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const verifyToken = require("../middlewares/verifyToken");
const upload = require("../middlewares/uploadImage");
const path = require("path");

// Serve uploaded images statically
router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// DELETE a product by MongoDB _id
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// UPDATE a product by MongoDB _id
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          author: req.body.author,
          newPrice: req.body.newPrice,
          oldPrice: req.body.oldPrice,
        },
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

// POST new product (with multer and auth)
router.post("/", verifyToken, async (req, res) => {
  try {
    const {
      id,
      name,
      newPrice,
      oldPrice,
      author,
      category,
      imageUrl,
      imageFilename,
    } = req.body;

    if (!imageUrl || !imageFilename) {
      return res.status(400).json({ error: "Image URL or filename missing" });
    }

    const product = new Product({
      id,
      name,
      newPrice,
      oldPrice,
      author,
      category,
      image: imageUrl,
      user: req.user.uid,
    });

    await product.save();

    res.json({ id: product.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add product" });
  }
});

module.exports = router;