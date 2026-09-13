const express = require('express');
const router = express.Router();
const {
  getAllExpertise,
  getExpertiseById,
  createExpertise,
  updateExpertise,
  deleteExpertise,
  reorderExpertise
} = require('../controllers/expertiseController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllExpertise);
router.get('/:id', getExpertiseById);

// Admin-only write routes
router.post('/', protect, createExpertise);
router.put('/reorder', protect, reorderExpertise);
router.put('/:id', protect, updateExpertise);
router.delete('/:id', protect, deleteExpertise);

module.exports = router;
