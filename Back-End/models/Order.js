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
  date: { type: Date, default: () => new Date() }, // timestamp for sorting & backend
  dateString: { type: String, default: () => new Date().toLocaleDateString("en-GB") } // DD/MM/YYYY for display
});

module.exports = mongoose.model("Order", OrderSchema);
