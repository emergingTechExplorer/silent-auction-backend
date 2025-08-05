const express = require('express');
const router = express.Router();
const { getCategories } = require('../controllers/categoryController');

// Public Route
router.get('/', getCategories);

module.exports = router;
