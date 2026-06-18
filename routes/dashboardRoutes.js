const express = require('express');
const { getVolunteerStats, getAdminStats } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/volunteer', protect, getVolunteerStats);
router.get('/admin', protect, authorize('admin'), getAdminStats);

module.exports = router;