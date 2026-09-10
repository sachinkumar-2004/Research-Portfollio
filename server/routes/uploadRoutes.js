const express = require('express');
const router = express.Router();
const { uploadFile, getUploadStatus } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Protected admin upload route
router.post('/', protect, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload error',
      });
    }
    next();
  });
}, uploadFile);

// Check upload status
router.get('/status', protect, getUploadStatus);

module.exports = router;
