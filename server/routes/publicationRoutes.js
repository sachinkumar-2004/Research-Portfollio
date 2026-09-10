const express = require('express');
const router = express.Router();
const {
  getAllPublications,
  getPublicationById,
  createPublication,
  updatePublication,
  deletePublication
} = require('../controllers/publicationController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllPublications);
router.get('/:id', getPublicationById);

// Admin-only write routes
router.post('/', protect, createPublication);
router.put('/:id', protect, updatePublication);
router.delete('/:id', protect, deletePublication);

module.exports = router;
