const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  author: String,
  category: String,
  image: { type: String, required: true },
  newPrice: String,
  oldPrice: String,
  user: String, // store user uid who created it
});

module.exports = mongoose.model("Product", productSchema, "allProducts");
