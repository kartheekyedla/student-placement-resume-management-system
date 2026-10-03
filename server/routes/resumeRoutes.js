// server/routes/resumeRoutes.js
const express = require('express');
const router = express.Router();
const {
  getMyResumes,
  getResumeById,
  saveResume,
  uploadAndAnalyzePdf,
  atsCheckAgainstJob
} = require('../controllers/resumeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/my', protect, getMyResumes);
router.get('/:id', protect, getResumeById);
router.post('/', protect, saveResume);
router.post('/upload-pdf', protect, upload.single('resumePdf'), uploadAndAnalyzePdf);
router.post('/ats-check', protect, atsCheckAgainstJob);

module.exports = router;
