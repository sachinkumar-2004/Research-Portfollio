const express = require('express');
const router = express.Router();
const {
  getAllTalks,
  getTalkById,
  createTalk,
  updateTalk,
  deleteTalk
} = require('../controllers/talkController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllTalks);
router.get('/:id', getTalkById);

// Admin-only write routes
router.post('/', protect, createTalk);
router.put('/:id', protect, updateTalk);
router.delete('/:id', protect, deleteTalk);

module.exports = router;
