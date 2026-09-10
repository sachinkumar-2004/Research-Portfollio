const express = require('express');
const router = express.Router();
const {
  getAllAwards,
  getAwardById,
  createAward,
  updateAward,
  deleteAward
} = require('../controllers/awardController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllAwards);
router.get('/:id', getAwardById);

// Admin-only write routes
router.post('/', protect, createAward);
router.put('/:id', protect, updateAward);
router.delete('/:id', protect, deleteAward);

module.exports = router;
