const express = require('express');
const Category = require('../models/Category');

const router = express.Router();

// GET all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

// POST new category
router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  try {
    const existing = await Category.findOne({ name });
    if (existing) return res.status(400).json({ error: 'Category already exists' });

    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ error: 'Could not add category' });
  }
});

module.exports = router;