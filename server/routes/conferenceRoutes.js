const express = require('express');
const router = express.Router();
const {
  getAllConferences,
  getConferenceById,
  createConference,
  updateConference,
  deleteConference
} = require('../controllers/conferenceController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllConferences);
router.get('/:id', getConferenceById);

// Admin-only write routes
router.post('/', protect, createConference);
router.put('/:id', protect, updateConference);
router.delete('/:id', protect, deleteConference);

module.exports = router;
