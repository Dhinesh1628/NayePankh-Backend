const express = require('express');
const { getDonations, createDonation } = require('../controllers/donationController');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getDonations);
router.post('/', optionalAuth, createDonation);

module.exports = router;