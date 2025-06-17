const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true, // ensures no duplicate product ids
  },
  name: String,
  author: String,
  category: String,
  image: String,
  newPrice: String,
  oldPrice: String,
});

module.exports = mongoose.model("Product", productSchema, "allProducts");