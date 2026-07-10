import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Role } from '../types'; // Assuming Role is in your types
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'supersecretpassword';

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in your .env file');
  process.exit(1);
}

const seedAdmin = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('Database connected.');

    const adminExists = await User.findOne({ role: Role.ADMIN });

    if (adminExists) {
      console.log('Admin user already exists. No action taken.');
      return;
    }

    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    await User.create({
      name: 'Admin User',
      email: ADMIN_EMAIL,
      passwordHash: hashedPassword,
      role: Role.ADMIN,
      isEmailVerified: true, // Manually verified
    });

    console.log('✅ Admin user created successfully!');
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database disconnected.');
  }
};

seedAdmin();