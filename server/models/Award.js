const mongoose = require('mongoose');

const awardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Award title is required'],
      trim: true
    },
    organization: {
      type: String,
      required: [true, 'Organization is required'],
      trim: true
    },
    year: {
      type: Number
    },
    description: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      enum: ['Award', 'Fellowship', 'Grant', 'Scholarship', 'Recognition', 'Other'],
      default: 'Award'
    },
    url: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Award', awardSchema);
