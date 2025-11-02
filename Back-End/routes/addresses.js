const express = require("express");
const router = express.Router();
const Address = require("../models/Address");
const verifyToken = require("../middlewares/verifyToken");

// GET all addresses for the logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user.uid });
    res.status(200).json(addresses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch addresses" });
  }
});

// POST new address for the logged-in user
router.post("/", verifyToken, async (req, res) => {
  try {
    const newAddress = new Address({ ...req.body, userId: req.user.uid });
    const saved = await newAddress.save();
    res.status(201).json(saved);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to add address" });
  }
});

// UPDATE an existing address
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) return res.status(404).json({ error: "Address not found" });
    if (address.userId !== req.user.uid)
      return res.status(403).json({ error: "Unauthorized" });

    const updatedAddress = await Address.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedAddress);
  } catch (err) {
    res.status(500).json({ error: "Failed to update address" });
  }
});

// DELETE an address
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) return res.status(404).json({ error: "Address not found" });
    if (address.userId !== req.user.uid)
      return res.status(403).json({ error: "Unauthorized" });

    await Address.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete address" });
  }
});


module.exports = router;
