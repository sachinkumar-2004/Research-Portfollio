const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    title: {
      type: String,
      trim: true
    },
    designation: {
      type: String,
      trim: true
    },
    institution: {
      type: String,
      trim: true,
      default: 'National Institute of Science Education and Research (NISER)'
    },
    department: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    shortBio: {
      type: String,
      trim: true
    },
    biography: {
      type: String,
      trim: true
    },
    profileImage: {
      type: String,
      trim: true
    },
    researchInterests: [
      {
        type: String,
        trim: true
      }
    ],
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    googleScholarUrl: {
      type: String,
      trim: true
    },
    researchGateUrl: {
      type: String,
      trim: true
    },
    linkedinUrl: {
      type: String,
      trim: true
    },
    niserProfileUrl: {
      type: String,
      trim: true
    },
    cvUrl: {
      type: String,
      trim: true
    },
    orcid: {
      type: String,
      trim: true,
      default: ''
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Profile', profileSchema);
