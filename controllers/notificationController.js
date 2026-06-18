const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: notifications.length, notifications });
});

const createNotification = asyncHandler(async (req, res) => {
  const { user, title, message, type, link } = req.body;
  const notification = await Notification.create({ user, title, message, type, link });
  res.status(201).json({ success: true, notification });
});

const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({ _id: req.params.id, user: req.user._id });
  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }
  notification.read = true;
  await notification.save();
  res.status(200).json({ success: true, notification });
});

module.exports = { getNotifications, createNotification, markAsRead };