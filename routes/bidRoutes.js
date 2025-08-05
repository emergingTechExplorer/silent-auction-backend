const express = require('express');
const router = express.Router();
const { placeBid, getBidsByItem, getBidsByUser, getMyBids, getWonBids } = require('../controllers/bidController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/bids
// @desc    Place a bid on an item
// @access  Private
router.post('/', protect, placeBid);


router.get('/item/:id', protect, getBidsByItem);
router.get('/user/:id', protect, getBidsByUser);
router.get('/me', protect, getMyBids);  // ✅ ← New route
router.get('/won', protect, getWonBids);

module.exports = router;
