const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      id: String,
      image: String,
      name: String,
      author: String,
      quantity: Number,
      price: Number,
      total: Number
    }
  ],
  status: { type: String, default: "PENDING" },
  subtotal: Number,
  discount: Number,
  tax: Number,
  grandTotal: Number,
  date: { type: String, default: () => new Date().toLocaleDateString() }
});

module.exports = mongoose.model("Order", OrderSchema);