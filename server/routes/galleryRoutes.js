const express = require('express');
const router = express.Router();
const {
  getAllGallery,
  getGalleryById,
  createGallery,
  updateGallery,
  deleteGallery
} = require('../controllers/galleryController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllGallery);
router.get('/:id', getGalleryById);

// Admin-only write routes
router.post('/', protect, createGallery);
router.put('/:id', protect, updateGallery);
router.delete('/:id', protect, deleteGallery);

module.exports = router;
