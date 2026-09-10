const mongoose = require('mongoose');
const { Research } = require('../models');

// @route   GET /api/research
// @desc    Get all research areas/projects
// @access  Public
const getAllResearch = async (req, res, next) => {
  try {
    const researchList = await Research.find()
      .populate('relatedPublicationIds', 'title authors journal year doi')
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: researchList
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/research/:id
// @desc    Get single research item by ID
// @access  Public
const getResearchById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Research item not found'
      });
    }

    const research = await Research.findById(id).populate(
      'relatedPublicationIds',
      'title authors journal year doi'
    );

    if (!research) {
      return res.status(404).json({
        success: false,
        message: 'Research item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: research
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/research
// @desc    Create new research area/project
// @access  Admin (Protected in future milestone)
const createResearch = async (req, res, next) => {
  try {
    const newResearch = await Research.create(req.body);

    res.status(201).json({
      success: true,
      data: newResearch,
      message: 'Research project created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/research/:id
// @desc    Update research area/project
// @access  Admin (Protected in future milestone)
const updateResearch = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Research item not found'
      });
    }

    const updatedResearch = await Research.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedResearch) {
      return res.status(404).json({
        success: false,
        message: 'Research item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedResearch,
      message: 'Research project updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/research/:id
// @desc    Delete research area/project
// @access  Admin (Protected in future milestone)
const deleteResearch = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Research item not found'
      });
    }

    const deletedResearch = await Research.findByIdAndDelete(id);

    if (!deletedResearch) {
      return res.status(404).json({
        success: false,
        message: 'Research item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: deletedResearch,
      message: 'Research project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllResearch,
  getResearchById,
  createResearch,
  updateResearch,
  deleteResearch
};
