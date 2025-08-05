const express = require('express');
const router = express.Router();
const { uploadItem, getAllItems, getItemById, updateItem, deleteItem, getMyItems } = require('../controllers/itemController');const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// @route   POST /api/items
// @desc    Upload a new auction item
// @access  Private (seller)
router.post('/', protect, uploadItem);
// router.post('/items', protect, upload.single('image'), uploadItem);

// @route   PUT /api/items/:id
// @desc    Edit an auction item (only if no bids yet)
router.put('/:id', protect, updateItem);

// @route   GET /api/items/my
// @desc    Get items uploaded by the current user
// @access  Private
router.get('/my', protect, getMyItems);

// @route   GET /api/items/:id
// @desc    Get a single item by ID
// @access  Public
router.get('/:id', getItemById);

// @route   GET /api/items
// @desc    Get all auction items
// @access  Public
router.get('/', getAllItems);

// @route   DELETE /api/items/:id
// @desc    Delete an auction item (only if no bids yet)
router.delete('/:id', protect, deleteItem);




module.exports = router;
