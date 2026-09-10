const { Profile } = require('../models');

// @route   GET /api/profile
// @desc    Get researcher profile
// @access  Public
const getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne();

    if (!profile) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No profile created yet'
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/profile
// @desc    Update or create (upsert) the single researcher profile
// @access  Admin (Protected in future milestone)
const updateProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne();

    if (profile) {
      profile = await Profile.findByIdAndUpdate(profile._id, req.body, {
        new: true,
        runValidators: true
      });
    } else {
      profile = await Profile.create(req.body);
    }

    res.status(200).json({
      success: true,
      data: profile,
      message: 'Profile saved successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile
};
