const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: String,
  name: String,
  author: String,
  category: String,
  image: String,
  newPrice: String,
  oldPrice: String
});

module.exports = mongoose.model("Product", productSchema, "allProducts");