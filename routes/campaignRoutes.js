const express = require('express');
const {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  joinCampaign,
  updateProgress,
} = require('../controllers/campaignController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getCampaigns);
router.get('/:id', protect, getCampaignById);
router.post('/', protect, authorize('admin'), createCampaign);
router.put('/:id', protect, authorize('admin'), updateCampaign);
router.delete('/:id', protect, authorize('admin'), deleteCampaign);
router.post('/:id/join', protect, joinCampaign);
router.put('/:id/progress', protect, updateProgress);

module.exports = router;