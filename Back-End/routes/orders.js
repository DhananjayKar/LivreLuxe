const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const admin = require("../config/firebase");

// ✅ Middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send("No token provided");

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).send("Invalid or expired token");
  }
};

// ✅ GET /api/orders — get orders for logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.uid }).sort({ _id: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ POST /api/orders — place a new order
router.post("/", verifyToken, async (req, res) => {
  try {
    const newOrder = new Order({
      ...req.body,
      userId: req.user.uid,
      status: "PENDING",
      date: new Date().toLocaleDateString()
    });

    const saved = await newOrder.save();
    res.status(201).json(saved);
    console.log("Request by UID:", req.user.uid);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET /api/orders/:id — get a specific order by ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    if (order.userId !== req.user.uid) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;