const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema(
  {
    degree: {
      type: String,
      required: [true, 'Degree is required'],
      trim: true
    },
    field: {
      type: String,
      trim: true
    },
    institution: {
      type: String,
      required: [true, 'Institution is required'],
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    startYear: {
      type: String,
      trim: true
    },
    endYear: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Education', educationSchema);
