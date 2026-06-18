const express = require('express');
const {
  getVolunteers,
  getVolunteerById,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer,
} = require('../controllers/volunteerController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, authorize('admin'), getVolunteers);
router.post('/', protect, authorize('admin'), createVolunteer);
router.get('/:id', protect, getVolunteerById);
router.put('/:id', protect, updateVolunteer);
router.delete('/:id', protect, authorize('admin'), deleteVolunteer);

module.exports = router;