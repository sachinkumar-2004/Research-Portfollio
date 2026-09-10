const mongoose = require('mongoose');
const { Education } = require('../models');

// @route   GET /api/education
// @desc    Get all education history
// @access  Public
const getAllEducation = async (req, res, next) => {
  try {
    const educationList = await Education.find().sort({
      startYear: -1,
      createdAt: -1
    });

    res.status(200).json({
      success: true,
      data: educationList
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/education/:id
// @desc    Get single education entry by ID
// @access  Public
const getEducationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Education record not found'
      });
    }

    const education = await Education.findById(id);

    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: education
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/education
// @desc    Create new education record
// @access  Admin (Protected in future milestone)
const createEducation = async (req, res, next) => {
  try {
    const newEducation = await Education.create(req.body);

    res.status(201).json({
      success: true,
      data: newEducation,
      message: 'Education record created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/education/:id
// @desc    Update education record
// @access  Admin (Protected in future milestone)
const updateEducation = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Education record not found'
      });
    }

    const updatedEducation = await Education.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedEducation) {
      return res.status(404).json({
        success: false,
        message: 'Education record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedEducation,
      message: 'Education record updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/education/:id
// @desc    Delete education record
// @access  Admin (Protected in future milestone)
const deleteEducation = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Education record not found'
      });
    }

    const deletedEducation = await Education.findByIdAndDelete(id);

    if (!deletedEducation) {
      return res.status(404).json({
        success: false,
        message: 'Education record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: deletedEducation,
      message: 'Education record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllEducation,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation
};
