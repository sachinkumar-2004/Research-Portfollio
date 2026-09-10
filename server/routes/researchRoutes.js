const express = require('express');
const router = express.Router();
const {
  getAllResearch,
  getResearchById,
  createResearch,
  updateResearch,
  deleteResearch
} = require('../controllers/researchController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllResearch);
router.get('/:id', getResearchById);

// Admin-only write routes
router.post('/', protect, createResearch);
router.put('/:id', protect, updateResearch);
router.delete('/:id', protect, deleteResearch);

module.exports = router;
