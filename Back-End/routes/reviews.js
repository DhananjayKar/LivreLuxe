const express = require('express');
const Review = require('../models/Review').default;

const router = express.Router();

router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ date: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

router.post('/:productId', async (req, res) => {
  const { userId, username, rating, comment } = req.body;

  if (!userId || !username || !rating || !comment) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const existing = await Review.findOne({ productId: req.params.productId, userId });
    if (existing) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }

    const newReview = new Review({
      productId: req.params.productId,
      userId,
      username,
      rating,
      comment,
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add review' });
  }
});

module.exports = router;