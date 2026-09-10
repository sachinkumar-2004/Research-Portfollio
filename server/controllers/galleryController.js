const mongoose = require('mongoose');
const { Gallery } = require('../models');

// @route   GET /api/gallery
// @desc    Get all gallery items sorted by date
// @access  Public
const getAllGallery = async (req, res, next) => {
  try {
    const galleryItems = await Gallery.find().sort({
      date: -1,
      createdAt: -1
    });

    res.status(200).json({
      success: true,
      data: galleryItems
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/gallery/:id
// @desc    Get single gallery item by ID
// @access  Public
const getGalleryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    const galleryItem = await Gallery.findById(id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: galleryItem
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/gallery
// @desc    Create new gallery item
// @access  Admin (Protected in future milestone)
const createGallery = async (req, res, next) => {
  try {
    const newGallery = await Gallery.create(req.body);

    res.status(201).json({
      success: true,
      data: newGallery,
      message: 'Gallery item created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/gallery/:id
// @desc    Update gallery item
// @access  Admin (Protected in future milestone)
const updateGallery = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    const updatedGallery = await Gallery.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedGallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedGallery,
      message: 'Gallery item updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/gallery/:id
// @desc    Delete gallery item
// @access  Admin (Protected in future milestone)
const deleteGallery = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    const deletedGallery = await Gallery.findByIdAndDelete(id);

    if (!deletedGallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: deletedGallery,
      message: 'Gallery item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllGallery,
  getGalleryById,
  createGallery,
  updateGallery,
  deleteGallery
};
