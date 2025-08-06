const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, uploadUserProfileImage } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/:id', protect, getUserProfile);
router.put('/:id', protect, updateUserProfile);
router.post('/:id/upload-profile-image', protect, upload.single('profileImage'), uploadUserProfileImage);

module.exports = router;
