const express = require('express');
const { getCertificates, issueCertificate } = require('../controllers/certificateController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getCertificates);
router.post('/', protect, authorize('admin'), issueCertificate);

module.exports = router;