const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile
} = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

// Public route
router.get('/', getProfile);

// Admin-only protected route
router.put('/', protect, updateProfile);

module.exports = router;
