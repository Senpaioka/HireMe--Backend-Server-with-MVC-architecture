import mongoose from 'mongoose';
import config from '../config/env';

const MONGODB_URI = config.database_url;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
};