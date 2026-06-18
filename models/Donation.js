const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    donorName: { type: String, required: true },
    donorEmail: { type: String, required: true },
    amount: { type: Number, required: true, min: 1 },
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', default: null },
    message: { type: String, default: '' },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
    paymentMethod: { type: String, default: 'card' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);