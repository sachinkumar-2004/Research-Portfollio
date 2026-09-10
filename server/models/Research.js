const mongoose = require('mongoose');

const researchSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Research title is required'],
      trim: true
    },
    shortDescription: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Research description is required'],
      trim: true
    },
    researchInterests: [
      {
        type: String,
        trim: true
      }
    ],
    methods: [
      {
        type: String,
        trim: true
      }
    ],
    image: {
      type: String,
      trim: true
    },
    relatedPublicationIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Publication'
      }
    ],
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

module.exports = mongoose.model('Research', researchSchema);
