const express = require('express');
const router = express.Router();
const {
  getAllEducation,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation
} = require('../controllers/educationController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllEducation);
router.get('/:id', getEducationById);

// Admin-only write routes
router.post('/', protect, createEducation);
router.put('/:id', protect, updateEducation);
router.delete('/:id', deleteEducation);

module.exports = router;
