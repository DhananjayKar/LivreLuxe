const express = require("express");
const router = express.Router();
const admin = require("../config/firebase");
const User = require("../models/User");

router.post("/", async (req, res) => {
  const { token, username } = req.body;

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const { uid, email, name } = decoded;

    let user = await User.findOne({ uid });

    if (!user) {
      user = await User.create({
        uid,
        email,
        name: username || name || "User",
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        uid: user.uid,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    });
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ success: false, error: "Unauthorized" });
  }
});

module.exports = router;