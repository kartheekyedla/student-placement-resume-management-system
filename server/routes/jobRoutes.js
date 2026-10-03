// server/routes/jobRoutes.js
const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  getJobMatch,
  getRecommendedJobs,
  createJob,
  toggleSaveJob
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getJobs);
router.get('/recommendations', protect, getRecommendedJobs);
router.get('/:id', getJobById);
router.get('/:id/match', protect, getJobMatch);
router.post('/:id/save', protect, toggleSaveJob);
router.post('/', protect, authorize('recruiter', 'officer', 'admin'), createJob);

module.exports = router;
