const mongoose = require('mongoose');
const { Expertise } = require('../models');

// @route   GET /api/expertise
// @desc    Get all expertise / instrumentation items
// @access  Public
const getAllExpertise = async (req, res, next) => {
  try {
    const expertiseList = await Expertise.find().sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: expertiseList
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/expertise/:id
// @desc    Get single expertise item by ID
// @access  Public
const getExpertiseById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Expertise item not found'
      });
    }

    const expertise = await Expertise.findById(id);

    if (!expertise) {
      return res.status(404).json({
        success: false,
        message: 'Expertise item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: expertise
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/expertise
// @desc    Create new expertise / instrumentation item
// @access  Admin (Protected)
const createExpertise = async (req, res, next) => {
  try {
    const newExpertise = await Expertise.create(req.body);

    res.status(201).json({
      success: true,
      data: newExpertise,
      message: 'Expertise item created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/expertise/:id
// @desc    Update expertise / instrumentation item
// @access  Admin (Protected)
const updateExpertise = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Expertise item not found'
      });
    }

    const updatedExpertise = await Expertise.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedExpertise) {
      return res.status(404).json({
        success: false,
        message: 'Expertise item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedExpertise,
      message: 'Expertise item updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/expertise/:id
// @desc    Delete expertise / instrumentation item
// @access  Admin (Protected)
const deleteExpertise = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Expertise item not found'
      });
    }

    const deletedExpertise = await Expertise.findByIdAndDelete(id);

    if (!deletedExpertise) {
      return res.status(404).json({
        success: false,
        message: 'Expertise item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: deletedExpertise,
      message: 'Expertise item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/expertise/reorder
// @desc    Reorder expertise / instrumentation items
// @access  Admin (Protected)
const reorderExpertise = async (req, res, next) => {
  try {
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'orderedIds array is required'
      });
    }

    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: index + 1 } }
      }
    }));

    await Expertise.bulkWrite(bulkOps);

    const updatedList = await Expertise.find().sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: updatedList,
      message: 'Expertise order saved successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllExpertise,
  getExpertiseById,
  createExpertise,
  updateExpertise,
  deleteExpertise,
  reorderExpertise
};
