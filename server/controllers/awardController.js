const mongoose = require('mongoose');
const { Award } = require('../models');

// @route   GET /api/awards
// @desc    Get all awards and recognitions sorted by year
// @access  Public
const getAllAwards = async (req, res, next) => {
  try {
    const awards = await Award.find().sort({ year: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: awards
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/awards/:id
// @desc    Get single award by ID
// @access  Public
const getAwardById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Award not found'
      });
    }

    const award = await Award.findById(id);

    if (!award) {
      return res.status(404).json({
        success: false,
        message: 'Award not found'
      });
    }

    res.status(200).json({
      success: true,
      data: award
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/awards
// @desc    Create new award record
// @access  Admin (Protected in future milestone)
const createAward = async (req, res, next) => {
  try {
    const newAward = await Award.create(req.body);

    res.status(201).json({
      success: true,
      data: newAward,
      message: 'Award created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/awards/:id
// @desc    Update award record
// @access  Admin (Protected in future milestone)
const updateAward = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Award not found'
      });
    }

    const updatedAward = await Award.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedAward) {
      return res.status(404).json({
        success: false,
        message: 'Award not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedAward,
      message: 'Award updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/awards/:id
// @desc    Delete award record
// @access  Admin (Protected in future milestone)
const deleteAward = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Award not found'
      });
    }

    const deletedAward = await Award.findByIdAndDelete(id);

    if (!deletedAward) {
      return res.status(404).json({
        success: false,
        message: 'Award not found'
      });
    }

    res.status(200).json({
      success: true,
      data: deletedAward,
      message: 'Award deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAwards,
  getAwardById,
  createAward,
  updateAward,
  deleteAward
};
