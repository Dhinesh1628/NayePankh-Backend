const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    relatedType: { type: String, enum: ['event', 'campaign'], required: true },
    relatedId: { type: mongoose.Schema.Types.ObjectId, required: true },
    fileUrl: { type: String, default: '' },
    issueDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certificate', certificateSchema);