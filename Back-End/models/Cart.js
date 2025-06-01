const mongoose = require("mongoose");
const admin = require("../config/firebase");

const cartItemSchema = new mongoose.Schema({
  productId: String,
  quantity: Number
});

const cartSchema = new mongoose.Schema({
  userId: String, // Firebase UID
  items: [cartItemSchema]
});

module.exports = mongoose.model("Cart", cartSchema);