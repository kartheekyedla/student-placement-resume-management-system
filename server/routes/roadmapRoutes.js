// server/routes/roadmapRoutes.js
const express = require('express');
const router = express.Router();
const {
  getMyRoadmaps,
  selectTargetRole,
  updateItemStatus
} = require('../controllers/roadmapController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getMyRoadmaps);
router.post('/select-role', protect, selectTargetRole);
router.put('/:id/item-status', protect, updateItemStatus);

module.exports = router;
