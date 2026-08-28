import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDatabase() {
  if (!env.mongoUri) {
    console.warn('MONGODB_URI is not configured; running without database persistence.');
    return false;
  }

  mongoose.connection.on('error', (error) => console.error('MongoDB connection error:', error.message));
  mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected.'));
  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 10000 });
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
  return true;
}
