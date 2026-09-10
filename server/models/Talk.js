const mongoose = require('mongoose');

const talkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Talk title is required'],
      trim: true
    },
    eventName: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true
    },
    institution: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    date: {
      type: Date
    },
    type: {
      type: String,
      enum: ['Invited Talk', 'Seminar', 'Lecture', 'Workshop'],
      default: 'Invited Talk'
    },
    description: {
      type: String,
      trim: true
    },
    slidesUrl: {
      type: String,
      trim: true
    },
    videoUrl: {
      type: String,
      trim: true
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Talk', talkSchema);
