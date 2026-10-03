// server/routes/applicationRoutes.js
const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
  scheduleInterview,
  getInterviewCalendar
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/apply', protect, applyForJob);
router.get('/my', protect, getMyApplications);
router.get('/calendar', protect, getInterviewCalendar);
router.get('/job/:jobId', protect, authorize('recruiter', 'officer', 'admin'), getApplicantsForJob);
router.put('/:id/status', protect, authorize('recruiter', 'officer', 'admin'), updateApplicationStatus);
router.put('/:id/schedule-interview', protect, authorize('recruiter', 'officer', 'admin'), scheduleInterview);

module.exports = router;
