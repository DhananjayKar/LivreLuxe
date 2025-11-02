const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // comes from auth token
    homeNo: { type: String, required: true },
    roadNo: { type: String, required: true },
    locality: { type: String, required: true },
    pinCode: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    email: { type: String }, // optional
    mobile: { type: String, required: true },
    category: {
      type: String,
      enum: ["home", "shop", "office", "other"],
      default: "home",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", AddressSchema);
