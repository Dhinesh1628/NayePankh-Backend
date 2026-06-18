const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['education', 'health', 'environment', 'women-empowerment', 'other'],
      default: 'other',
    },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true, min: 1 },
    bannerImage: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    registrations: [
      {
        volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
        registeredAt: { type: Date, default: Date.now },
      },
    ],
    status: { type: String, enum: ['upcoming', 'completed', 'cancelled'], default: 'upcoming' },
  },
  { timestamps: true }
);

eventSchema.virtual('seatsLeft').get(function () {
  const approved = this.registrations.filter((r) => r.status === 'approved').length;
  return Math.max(this.capacity - approved, 0);
});

eventSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);