const mongoose = require('mongoose');
const { Experience } = require('../models');

// @route   GET /api/experience
// @desc    Get all experience history
// @access  Public
const getAllExperience = async (req, res, next) => {
  try {
    const experienceList = await Experience.find().sort({
      startDate: -1,
      createdAt: -1
    });

    res.status(200).json({
      success: true,
      data: experienceList
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/experience/:id
// @desc    Get single experience entry by ID
// @access  Public
const getExperienceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Experience record not found'
      });
    }

    const experience = await Experience.findById(id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: experience
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/experience
// @desc    Create new experience entry
// @access  Admin (Protected in future milestone)
const createExperience = async (req, res, next) => {
  try {
    const newExperience = await Experience.create(req.body);

    res.status(201).json({
      success: true,
      data: newExperience,
      message: 'Experience record created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/experience/:id
// @desc    Update experience entry
// @access  Admin (Protected in future milestone)
const updateExperience = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Experience record not found'
      });
    }

    const updatedExperience = await Experience.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedExperience) {
      return res.status(404).json({
        success: false,
        message: 'Experience record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedExperience,
      message: 'Experience record updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/experience/:id
// @desc    Delete experience entry
// @access  Admin (Protected in future milestone)
const deleteExperience = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Experience record not found'
      });
    }

    const deletedExperience = await Experience.findByIdAndDelete(id);

    if (!deletedExperience) {
      return res.status(404).json({
        success: false,
        message: 'Experience record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: deletedExperience,
      message: 'Experience record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllExperience,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience
};
