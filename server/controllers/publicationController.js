const mongoose = require('mongoose');
const { Publication } = require('../models');

// @route   GET /api/publications
// @desc    Get all publications with optional query filters
// @access  Public
const getAllPublications = async (req, res, next) => {
  try {
    const { year, type, featured } = req.query;
    const filter = {};

    if (year) {
      filter.year = Number(year);
    }

    if (type) {
      filter.publicationType = type;
    }

    if (featured !== undefined) {
      filter.featured = featured === 'true';
    }

    const publications = await Publication.find(filter).sort({
      year: -1,
      order: 1
    });

    res.status(200).json({
      success: true,
      data: publications
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/publications/:id
// @desc    Get single publication by ID
// @access  Public
const getPublicationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Publication not found'
      });
    }

    const publication = await Publication.findById(id);

    if (!publication) {
      return res.status(404).json({
        success: false,
        message: 'Publication not found'
      });
    }

    res.status(200).json({
      success: true,
      data: publication
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/publications
// @desc    Create new publication
// @access  Admin (Protected in future milestone)
const createPublication = async (req, res, next) => {
  try {
    const newPublication = await Publication.create(req.body);

    res.status(201).json({
      success: true,
      data: newPublication,
      message: 'Publication created successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/publications/:id
// @desc    Update publication
// @access  Admin (Protected in future milestone)
const updatePublication = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Publication not found'
      });
    }

    const updatedPublication = await Publication.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedPublication) {
      return res.status(404).json({
        success: false,
        message: 'Publication not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedPublication,
      message: 'Publication updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/publications/:id
// @desc    Delete publication
// @access  Admin (Protected in future milestone)
const deletePublication = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Publication not found'
      });
    }

    const deletedPublication = await Publication.findByIdAndDelete(id);

    if (!deletedPublication) {
      return res.status(404).json({
        success: false,
        message: 'Publication not found'
      });
    }

    res.status(200).json({
      success: true,
      data: deletedPublication,
      message: 'Publication deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPublications,
  getPublicationById,
  createPublication,
  updatePublication,
  deletePublication
};
