const multer = require('multer');

// Supported academic portfolio file MIME types
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
];

// Memory storage to hold file in buffer for direct upload to ImageKit
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type (${file.mimetype}). Allowed types: JPG, JPEG, PNG, WEBP, and PDF.`
      ),
      false
    );
  }
};

// 15 MB file size limit for academic portfolios (papers/posters/images)
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
});

module.exports = upload;
