const Item = require('../models/Item');

// @desc    Get all unique categories from items collection
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
  try {
    const categories = await Item.distinct('category');
    res.status(200).json(categories);
  } catch (err) {
    console.error('Category fetch error:', err);
    res.status(500).json({ message: err.message });
  }
};
