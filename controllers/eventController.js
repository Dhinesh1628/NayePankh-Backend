const asyncHandler = require('express-async-handler');
const Event = require('../models/Event');
const Notification = require('../models/Notification');
const VolunteerActivity = require('../models/VolunteerActivity');

const getEvents = asyncHandler(async (req, res) => {
  const events = await Event.find().populate('createdBy', 'name email').sort({ date: 1 });
  res.status(200).json({ success: true, count: events.length, events });
});

const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate('registrations.volunteer', 'name email');
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  res.status(200).json({ success: true, event });
});

const createEvent = asyncHandler(async (req, res) => {
  const { title, description, category, date, location, capacity, bannerImage } = req.body;
  const event = await Event.create({
    title,
    description,
    category,
    date,
    location,
    capacity,
    bannerImage,
    createdBy: req.user._id,
  });
  res.status(201).json({ success: true, event });
});

const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  const fields = ['title', 'description', 'category', 'date', 'location', 'capacity', 'bannerImage', 'status'];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) event[field] = req.body[field];
  });
  await event.save();
  res.status(200).json({ success: true, event });
});

const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }
  await event.deleteOne();
  res.status(200).json({ success: true, message: 'Event removed' });
});

const registerForEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  const already = event.registrations.find((r) => String(r.volunteer) === String(req.user._id));
  if (already) {
    res.status(400);
    throw new Error('You have already registered for this event');
  }

  event.registrations.push({ volunteer: req.user._id, status: 'pending' });
  await event.save();

  await VolunteerActivity.create({ user: req.user._id, type: 'event', refId: event._id, status: 'pending' });

  res.status(201).json({ success: true, message: 'Registration submitted, awaiting approval' });
});

const updateRegistrationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const event = await Event.findById(req.params.id);
  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  const registration = event.registrations.find((r) => String(r.volunteer) === String(req.params.volunteerId));
  if (!registration) {
    res.status(404);
    throw new Error('Registration not found');
  }

  registration.status = status;
  await event.save();

  await Notification.create({
    user: req.params.volunteerId,
    title: `Event ${status}`,
    message: `Your registration for "${event.title}" was ${status}.`,
    type: 'event',
  });

  res.status(200).json({ success: true, message: `Registration ${status}` });
});

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  updateRegistrationStatus,
};