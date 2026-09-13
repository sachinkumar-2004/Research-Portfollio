const mongoose = require('mongoose');

const expertiseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Expertise title is required'],
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    imageUrl: {
      type: String,
      default: '',
      trim: true
    },
    icon: {
      type: String,
      default: '',
      trim: true
    },
    category: {
      type: String,
      default: '',
      trim: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Expertise', expertiseSchema);
