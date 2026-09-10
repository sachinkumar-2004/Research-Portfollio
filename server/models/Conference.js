const mongoose = require('mongoose');

const conferenceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Presentation/Paper title is required'],
      trim: true
    },
    conferenceName: {
      type: String,
      required: [true, 'Conference name is required'],
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    date: {
      type: Date
    },
    presentationType: {
      type: String,
      enum: ['Oral Presentation', 'Poster', 'Invited Presentation', 'Other'],
      default: 'Oral Presentation'
    },
    description: {
      type: String,
      trim: true
    },
    posterUrl: {
      type: String,
      trim: true
    },
    slidesUrl: {
      type: String,
      trim: true
    },
    conferenceUrl: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Conference', conferenceSchema);
