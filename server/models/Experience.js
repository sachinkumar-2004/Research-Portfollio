const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true
    },
    organization: {
      type: String,
      required: [true, 'Organization is required'],
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    startDate: {
      type: String,
      trim: true
    },
    endDate: {
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

module.exports = mongoose.model('Experience', experienceSchema);
