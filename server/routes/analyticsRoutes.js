// server/routes/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const { getPlacementAnalytics } = require('../controllers/analyticsController');

router.get('/', getPlacementAnalytics);

module.exports = router;
