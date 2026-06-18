const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const getVolunteers = asyncHandler(async (req, res) => {
  const volunteers = await User.find({ role: 'volunteer' }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: volunteers.length, volunteers });
});

const getVolunteerById = asyncHandler(async (req, res) => {
  const volunteer = await User.findById(req.params.id);
  if (!volunteer) {
    res.status(404);
    throw new Error('Volunteer not found');
  }
  res.status(200).json({ success: true, volunteer });
});

const createVolunteer = asyncHandler(async (req, res) => {
  const { name, email, password, phone, college, skills } = req.body;
  const volunteer = await User.create({ name, email, password, phone, college, skills, role: 'volunteer' });
  res.status(201).json({ success: true, volunteer });
});

const updateVolunteer = asyncHandler(async (req, res) => {
  const target = await User.findById(req.params.id);
  if (!target) {
    res.status(404);
    throw new Error('Volunteer not found');
  }

  const isSelf = String(target._id) === String(req.user._id);
  if (!isSelf && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this profile');
  }

  const fields = ['name', 'phone', 'college', 'skills', 'bio', 'avatar'];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) target[field] = req.body[field];
  });

  if (req.user.role === 'admin' && req.body.role) target.role = req.body.role;
  if (req.user.role === 'admin' && req.body.isActive !== undefined) target.isActive = req.body.isActive;

  await target.save();
  res.status(200).json({ success: true, volunteer: target });
});

const deleteVolunteer = asyncHandler(async (req, res) => {
  const target = await User.findById(req.params.id);
  if (!target) {
    res.status(404);
    throw new Error('Volunteer not found');
  }
  await target.deleteOne();
  res.status(200).json({ success: true, message: 'Volunteer removed' });
});

module.exports = { getVolunteers, getVolunteerById, createVolunteer, updateVolunteer, deleteVolunteer };