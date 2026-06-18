require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Event = require('../models/Event');
const Campaign = require('../models/Campaign');

const run = async () => {
  await connectDB();

  const adminExists = await User.findOne({ email: 'admin@nayepankh.org' });
  const admin =
    adminExists ||
    (await User.create({
      name: 'NayePankh Admin',
      email: 'admin@nayepankh.org',
      password: 'Admin@123',
      role: 'admin',
    }));

  await Event.create({
    title: 'Community Health Camp',
    description: 'A free health checkup camp for underserved communities.',
    category: 'health',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    location: 'Sector 21 Community Hall',
    capacity: 50,
    createdBy: admin._id,
  });

  await Campaign.create({
    title: 'Books for Every Child',
    description: 'Collecting and distributing school books to rural schools.',
    goal: 200000,
    startDate: new Date(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    createdBy: admin._id,
    status: 'active',
  });

  console.log('Seed complete. Admin login: admin@nayepankh.org / Admin@123');
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});