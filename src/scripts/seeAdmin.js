import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';

const run = async () => {
  await connectDB();

  const email = process.env.ADMIN_EMAIL;
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('ℹ️  Admin already exists:', email);
  } else {
    await User.create({ username, email, password, role: 'admin' });
    console.log('✅ Admin created:', email);
  }

  await mongoose.disconnect();
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});