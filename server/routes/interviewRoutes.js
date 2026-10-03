// server/routes/interviewRoutes.js
const express = require('express');
const router = express.Router();
const {
  getQuestionsByCategory,
  evaluateSingleAnswer,
  submitInterviewSession,
  getInterviewHistory,
  getPlacementReadiness
} = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/questions/:category', protect, getQuestionsByCategory);
router.post('/evaluate-single', protect, evaluateSingleAnswer);
router.post('/submit-session', protect, submitInterviewSession);
router.get('/history', protect, getInterviewHistory);
router.get('/placement-readiness', protect, getPlacementReadiness);

module.exports = router;
