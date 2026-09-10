const { getImageKit, isImageKitConfigured } = require('../config/imagekit');

// @route   POST /api/upload
// @desc    Upload file to ImageKit
// @access  Admin (Protected)
const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided for upload. Please select a valid file.',
      });
    }

    if (!isImageKitConfigured()) {
      return res.status(503).json({
        success: false,
        message:
          'ImageKit is not configured. Please set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT in the server .env file.',
      });
    }

    const imagekit = getImageKit();
    if (!imagekit) {
      return res.status(503).json({
        success: false,
        message: 'Failed to initialize ImageKit SDK. Please check server credentials.',
      });
    }

    // Determine and sanitize folder path
    const requestedFolder = req.body.folder || req.query.folder || '/academic-portfolio/general';
    const folder = requestedFolder.startsWith('/') ? requestedFolder : `/${requestedFolder}`;

    // Generate safe file name
    const timestamp = Date.now();
    const originalCleanName = req.file.originalname
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .toLowerCase();
    const fileName = `${timestamp}_${originalCleanName}`;

    // Upload buffer to ImageKit
    const uploadResponse = await imagekit.upload({
      file: req.file.buffer,
      fileName,
      folder,
      useUniqueFileName: true,
      tags: ['academic-portfolio', folder.split('/').filter(Boolean).pop() || 'general'],
    });

    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: uploadResponse.url,
        fileId: uploadResponse.fileId,
        name: uploadResponse.name,
        size: uploadResponse.size,
        fileType: uploadResponse.fileType,
        thumbnailUrl: uploadResponse.thumbnailUrl || uploadResponse.url,
        folder: uploadResponse.folder || folder,
      },
    });
  } catch (error) {
    console.error('ImageKit upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error occurred while uploading file to ImageKit.',
    });
  }
};

// @route   GET /api/upload/status
// @desc    Check whether ImageKit is properly configured on server
// @access  Admin (Protected)
const getUploadStatus = async (req, res) => {
  const configured = isImageKitConfigured();
  res.status(200).json({
    success: true,
    data: {
      configured,
      supportedTypes: ['JPG', 'JPEG', 'PNG', 'WEBP', 'PDF'],
      maxSizeMB: 15,
    },
  });
};

module.exports = {
  uploadFile,
  getUploadStatus,
};
