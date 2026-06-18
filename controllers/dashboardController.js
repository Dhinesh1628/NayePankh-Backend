const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Event = require('../models/Event');
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');
const Certificate = require('../models/Certificate');
const VolunteerActivity = require('../models/VolunteerActivity');

const getVolunteerStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [eventsJoined, certificatesEarned, donationsMade, activities] = await Promise.all([
    Event.countDocuments({ 'registrations.volunteer': userId, 'registrations.status': 'approved' }),
    Certificate.countDocuments({ user: userId }),
    Donation.countDocuments({ donor: userId }),
    VolunteerActivity.find({ user: userId }).sort({ date: -1 }).limit(10),
  ]);

  res.status(200).json({
    success: true,
    stats: {
      eventsJoined,
      certificatesEarned,
      donationsMade,
      volunteerHours: req.user.volunteerHours || 0,
    },
    recentActivity: activities,
  });
});

const getAdminStats = asyncHandler(async (req, res) => {
  const [totalVolunteers, totalEvents, activeCampaigns, donationAgg, recentVolunteers, recentDonations] =
    await Promise.all([
      User.countDocuments({ role: 'volunteer' }),
      Event.countDocuments(),
      Campaign.countDocuments({ status: 'active' }),
      Donation.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
      User.find({ role: 'volunteer' }).sort({ createdAt: -1 }).limit(5).select('name email createdAt'),
      Donation.find().sort({ createdAt: -1 }).limit(5),
    ]);

  res.status(200).json({
    success: true,
    stats: {
      totalVolunteers,
      totalEvents,
      activeCampaigns,
      totalDonations: donationAgg[0]?.total || 0,
    },
    recentVolunteers,
    recentDonations,
  });
});

module.exports = { getVolunteerStats, getAdminStats };