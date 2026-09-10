const express = require('express');
const router = express.Router();

const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');
const profileRoutes = require('./profileRoutes');
const researchRoutes = require('./researchRoutes');
const publicationRoutes = require('./publicationRoutes');
const talkRoutes = require('./talkRoutes');
const conferenceRoutes = require('./conferenceRoutes');
const awardRoutes = require('./awardRoutes');
const educationRoutes = require('./educationRoutes');
const experienceRoutes = require('./experienceRoutes');
const galleryRoutes = require('./galleryRoutes');
const uploadRoutes = require('./uploadRoutes');

// Mount routes under /api
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/research', researchRoutes);
router.use('/publications', publicationRoutes);
router.use('/talks', talkRoutes);
router.use('/conferences', conferenceRoutes);
router.use('/awards', awardRoutes);
router.use('/education', educationRoutes);
router.use('/experience', experienceRoutes);
router.use('/gallery', galleryRoutes);
router.use('/upload', uploadRoutes);

module.exports = router;
