// server/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const { getMyProfile, updateMyProfile, getCandidateProfile } = require('../controllers/profileController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/me', protect, getMyProfile);
router.put('/me', protect, updateMyProfile);
router.get('/candidate/:id', protect, authorize('recruiter', 'officer', 'admin'), getCandidateProfile);

module.exports = router;
