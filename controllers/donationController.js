const asyncHandler = require('express-async-handler');
const Donation = require('../models/Donation');

const getDonations = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { donor: req.user._id };
  const donations = await Donation.find(filter).populate('campaign', 'title').sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: donations.length, donations });
});

const createDonation = asyncHandler(async (req, res) => {
  const { donorName, donorEmail, amount, campaign, message, paymentMethod } = req.body;

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error('Donation amount must be greater than zero');
  }

  const donation = await Donation.create({
    donor: req.user ? req.user._id : null,
    donorName: donorName || (req.user ? req.user.name : 'Anonymous'),
    donorEmail: donorEmail || (req.user ? req.user.email : ''),
    amount,
    campaign: campaign || null,
    message,
    paymentMethod,
  });

  res.status(201).json({ success: true, donation });
});

module.exports = { getDonations, createDonation };