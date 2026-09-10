const mongoose = require('mongoose');
const { Conference } = require('../models');

// @route   GET /api/conferences
// @desc    Get all conference participations sorted by date
// @access  Public
const getAllConferences = async (req, res, next) => {
  try {
    const conferences = await Conference.find().sort({
      date: -1,
      createdAt: -1
    });

    res.status(200).json({
      success: true,
      data: conferences
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/conferences/:id
// @desc    Get single conference by ID
// @access  Public
const getConferenceById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Conference not found'
      });
    }

    const conference = await Conference.findById(id);

    if (!conference) {
      return res.status(404).json({
        success: false,
        message: 'Conference not found'
      });
    }

    res.status(200).json({
      success: true,
      data: conference
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/conferences
// @desc    Create new conference entry
// @access  Admin (Protected in future milestone)
const createConference = async (req, res, next) => {
  try {
    const newConference = await Conference.create(req.body);

    res.status(201).json({
      success: true,
      data: newConference,
      message: 'Conference record created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/conferences/:id
// @desc    Update conference entry
// @access  Admin (Protected in future milestone)
const updateConference = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Conference not found'
      });
    }

    const updatedConference = await Conference.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedConference) {
      return res.status(404).json({
        success: false,
        message: 'Conference not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedConference,
      message: 'Conference record updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/conferences/:id
// @desc    Delete conference entry
// @access  Admin (Protected in future milestone)
const deleteConference = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Conference not found'
      });
    }

    const deletedConference = await Conference.findByIdAndDelete(id);

    if (!deletedConference) {
      return res.status(404).json({
        success: false,
        message: 'Conference not found'
      });
    }

    res.status(200).json({
      success: true,
      data: deletedConference,
      message: 'Conference record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllConferences,
  getConferenceById,
  createConference,
  updateConference,
  deleteConference
};
