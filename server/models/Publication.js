const mongoose = require('mongoose');

const publicationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Publication title is required'],
      trim: true
    },
    authors: [
      {
        type: String,
        trim: true
      }
    ],
    journal: {
      type: String,
      trim: true
    },
    publicationType: {
      type: String,
      enum: ['Journal Article', 'Conference Paper', 'Preprint', 'Book Chapter', 'Other'],
      default: 'Journal Article'
    },
    year: {
      type: Number,
      required: [true, 'Publication year is required'],
      index: true
    },
    volume: {
      type: String,
      trim: true
    },
    issue: {
      type: String,
      trim: true
    },
    pages: {
      type: String,
      trim: true
    },
    doi: {
      type: String,
      trim: true
    },
    abstract: {
      type: String,
      trim: true
    },
    publisherUrl: {
      type: String,
      trim: true
    },
    pdfUrl: {
      type: String,
      trim: true
    },
    googleScholarUrl: {
      type: String,
      trim: true
    },
    researchArea: {
      type: String,
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

module.exports = mongoose.model('Publication', publicationSchema);
