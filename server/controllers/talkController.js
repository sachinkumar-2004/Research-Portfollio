const mongoose = require('mongoose');
const { Talk } = require('../models');

// @route   GET /api/talks
// @desc    Get all talks sorted by date/newest first
// @access  Public
const getAllTalks = async (req, res, next) => {
  try {
    const talks = await Talk.find().sort({ date: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: talks
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/talks/:id
// @desc    Get single talk by ID
// @access  Public
const getTalkById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Talk not found'
      });
    }

    const talk = await Talk.findById(id);

    if (!talk) {
      return res.status(404).json({
        success: false,
        message: 'Talk not found'
      });
    }

    res.status(200).json({
      success: true,
      data: talk
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/talks
// @desc    Create new talk
// @access  Admin (Protected in future milestone)
const createTalk = async (req, res, next) => {
  try {
    const newTalk = await Talk.create(req.body);

    res.status(201).json({
      success: true,
      data: newTalk,
      message: 'Talk created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/talks/:id
// @desc    Update talk
// @access  Admin (Protected in future milestone)
const updateTalk = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Talk not found'
      });
    }

    const updatedTalk = await Talk.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedTalk) {
      return res.status(404).json({
        success: false,
        message: 'Talk not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedTalk,
      message: 'Talk updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/talks/:id
// @desc    Delete talk
// @access  Admin (Protected in future milestone)
const deleteTalk = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Talk not found'
      });
    }

    const deletedTalk = await Talk.findByIdAndDelete(id);

    if (!deletedTalk) {
      return res.status(404).json({
        success: false,
        message: 'Talk not found'
      });
    }

    res.status(200).json({
      success: true,
      data: deletedTalk,
      message: 'Talk deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTalks,
  getTalkById,
  createTalk,
  updateTalk,
  deleteTalk
};
