const asyncHandler = require('express-async-handler');
const Campaign = require('../models/Campaign');
const Notification = require('../models/Notification');

const getCampaigns = asyncHandler(async (req, res) => {
  const campaigns = await Campaign.find().populate('createdBy', 'name email').sort({ startDate: -1 });
  res.status(200).json({ success: true, count: campaigns.length, campaigns });
});

const getCampaignById = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id).populate('assignedVolunteers.volunteer', 'name email');
  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }
  res.status(200).json({ success: true, campaign });
});

const createCampaign = asyncHandler(async (req, res) => {
  const { title, description, goal, startDate, endDate, bannerImage } = req.body;
  const campaign = await Campaign.create({
    title,
    description,
    goal,
    startDate,
    endDate,
    bannerImage,
    createdBy: req.user._id,
  });
  res.status(201).json({ success: true, campaign });
});

const updateCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }
  const fields = ['title', 'description', 'goal', 'startDate', 'endDate', 'bannerImage', 'status'];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) campaign[field] = req.body[field];
  });
  await campaign.save();
  res.status(200).json({ success: true, campaign });
});

const deleteCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }
  await campaign.deleteOne();
  res.status(200).json({ success: true, message: 'Campaign removed' });
});

const joinCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }

  const already = campaign.assignedVolunteers.find((v) => String(v.volunteer) === String(req.user._id));
  if (already) {
    res.status(400);
    throw new Error('You already joined this campaign');
  }

  campaign.assignedVolunteers.push({ volunteer: req.user._id });
  await campaign.save();

  await Notification.create({
    user: req.user._id,
    title: 'Campaign joined',
    message: `You joined "${campaign.title}".`,
    type: 'campaign',
  });

  res.status(201).json({ success: true, message: 'Joined campaign' });
});

const updateProgress = asyncHandler(async (req, res) => {
  const { progress } = req.body;
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) {
    res.status(404);
    throw new Error('Campaign not found');
  }

  const assignment = campaign.assignedVolunteers.find((v) => String(v.volunteer) === String(req.user._id));
  if (!assignment) {
    res.status(404);
    throw new Error('You are not part of this campaign');
  }

  assignment.progress = Math.max(0, Math.min(100, progress));
  if (assignment.progress === 100) assignment.status = 'completed';
  await campaign.save();

  res.status(200).json({ success: true, message: 'Progress updated' });
});

module.exports = {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  joinCampaign,
  updateProgress,
};