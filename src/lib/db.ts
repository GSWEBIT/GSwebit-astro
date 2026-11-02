import 'dotenv/config';
import mongoose from 'mongoose';

// Connection cache across requests in Node / SSR
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global._mongoose || { conn: null, promise: null };
if (!global._mongoose) {
  global._mongoose = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not configured');
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log('✅ MongoDB connected successfully to cluster');
  } catch (err: any) {
    cached.promise = null;
    console.error('❌ MongoDB connection failed:', err.message);
    throw err;
  }

  return cached.conn;
}
