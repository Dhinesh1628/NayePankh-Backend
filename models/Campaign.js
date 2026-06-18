const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    goal: { type: Number, default: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    bannerImage: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedVolunteers: [
      {
        volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        progress: { type: Number, default: 0, min: 0, max: 100 },
        status: { type: String, enum: ['active', 'completed', 'dropped'], default: 'active' },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
    status: { type: String, enum: ['active', 'completed', 'upcoming'], default: 'upcoming' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Campaign', campaignSchema);