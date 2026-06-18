const mongoose = require('mongoose');

const volunteerActivitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['event', 'campaign'], required: true },
    refId: { type: mongoose.Schema.Types.ObjectId, required: true },
    hours: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('VolunteerActivity', volunteerActivitySchema);