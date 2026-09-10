const express = require('express');
const router = express.Router();
const {
  getAllExperience,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience
} = require('../controllers/experienceController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllExperience);
router.get('/:id', getExperienceById);

// Admin-only write routes
router.post('/', protect, createExperience);
router.put('/:id', protect, updateExperience);
router.delete('/:id', deleteExperience);

module.exports = router;
