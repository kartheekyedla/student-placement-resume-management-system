// server/routes/driveRoutes.js
const express = require('express');
const router = express.Router();
const {
  getDrives,
  getDriveById,
  createDrive,
  registerForDrive
} = require('../controllers/driveController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getDrives);
router.get('/:id', getDriveById);
router.post('/', protect, authorize('officer', 'admin'), createDrive);
router.post('/:id/register', protect, registerForDrive);

module.exports = router;
