const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const admin = require("../config/firebase");

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

// GET all orders for logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.uid }).sort({ date: -1 }); // sort by timestamp
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new order
router.post("/", verifyToken, async (req, res) => {
  try {
    const now = new Date();
    const newOrder = new Order({
      ...req.body,
      userId: req.user.uid,
      status: "PENDING",
      date: now,
      dateString: now.toLocaleDateString("en-GB")
    });

    const saved = await newOrder.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single order & auto-update status
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.userId !== req.user.uid) return res.status(403).json({ message: "Unauthorized" });

    const diffDays = Math.floor((new Date() - new Date(order.date)) / (1000 * 60 * 60 * 24));

    let updatedStatus = "PENDING";
    if (diffDays >= 5) updatedStatus = "DELIVERED";
    else if (diffDays >= 2) updatedStatus = "SHIPPED";

    if (order.status !== updatedStatus) {
      order.status = updatedStatus;
      await order.save();
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
