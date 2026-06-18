const asyncHandler = require('express-async-handler');
const Certificate = require('../models/Certificate');

const getCertificates = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
  const certificates = await Certificate.find(filter).populate('user', 'name email').sort({ issueDate: -1 });
  res.status(200).json({ success: true, count: certificates.length, certificates });
});

const issueCertificate = asyncHandler(async (req, res) => {
  const { user, title, relatedType, relatedId, fileUrl } = req.body;
  const certificate = await Certificate.create({ user, title, relatedType, relatedId, fileUrl });
  res.status(201).json({ success: true, certificate });
});

module.exports = { getCertificates, issueCertificate };