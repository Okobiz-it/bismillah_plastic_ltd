import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

// Ensure .env is loaded whether run from root, backend, or backend/scripts
const envPathBackend = path.resolve(process.cwd(), '.env');
const envPathScripts = path.resolve(process.cwd(), '../.env');

if (fs.existsSync(envPathBackend)) {
  dotenv.config({ path: envPathBackend });
} else if (fs.existsSync(envPathScripts)) {
  dotenv.config({ path: envPathScripts });
} else {
  dotenv.config();
}

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${(error as Error).message}`);
    throw error;
  }
};
