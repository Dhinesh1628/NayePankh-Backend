const asyncHandler = require('express-async-handler');
const Event = require('../models/Event');
const Campaign = require('../models/Campaign');

const chat = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    res.status(400);
    throw new Error('Message is required');
  }

  const text = message.toLowerCase();
  let reply;

  if (text.includes('event')) {
    const events = await Event.find({ status: 'upcoming' }).sort({ date: 1 }).limit(3);
    reply = events.length
      ? `Here are some upcoming events you could join: ${events.map((e) => e.title).join(', ')}.`
      : 'There are no upcoming events right now, check back soon!';
  } else if (text.includes('campaign')) {
    const campaigns = await Campaign.find({ status: { $in: ['active', 'upcoming'] } }).limit(3);
    reply = campaigns.length
      ? `These campaigns are looking for volunteers: ${campaigns.map((c) => c.title).join(', ')}.`
      : 'No active campaigns at the moment, but new ones are added regularly.';
  } else if (text.includes('donat')) {
    reply = 'You can support our work from the Donate page - every contribution funds an active campaign.';
  } else if (text.includes('certificate')) {
    reply = 'Certificates are issued automatically once your event or campaign registration is approved and completed. Check the Certificates tab in your dashboard.';
  } else if (text.includes('hi') || text.includes('hello')) {
    reply = "Hi! I'm the NayePankh assistant. Ask me about events, campaigns, donations, or how to get started volunteering.";
  } else {
    reply = "I can help with questions about volunteering, events, campaigns, and donations at NayePankh. Could you tell me a bit more about what you're looking for?";
  }

  res.status(200).json({ success: true, reply });
});

module.exports = { chat };