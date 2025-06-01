const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const admin = require("firebase-admin");

// Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded = await admin.auth().verifyIdToken(token);
    req.uid = decoded.uid;
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    res.status(401).json({ error: "Unauthorized" });
  }
};

// GET cart for current user
router.get("/", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.uid });
    res.json(cart || { userId: req.uid, items: [] });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// POST to create or update cart
router.post("/", verifyToken, async (req, res) => {
  console.log("Received items from frontend:", req.body.items);
  try {
    const { items } = req.body;
    const updated = await Cart.findOneAndUpdate(
      { userId: req.uid },
      { items },
      { upsert: true, new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to save cart" });
  }
});

// DELETE a specific item from cart
router.delete("/:productId", verifyToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ userId: req.uid });

    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(item => item.productId !== productId);
    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete item" });
  }
});

module.exports = router;