import mongoose from 'mongoose';
import { createClient } from 'redis';
import { logger } from '../utils/logger';

// MongoDB Configuration
export const connectMongoDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agrotm';
    
    // Skip connection if no MongoDB URI is provided (allow server to run without DB in non-critical envs)
    if (!process.env.MONGODB_URI) {
      logger.warn('⚠️ No MONGODB_URI provided, skipping database connection');
      return;
    }
    
    await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info('✅ MongoDB connected successfully');
  } catch (error) {
    logger.warn('⚠️ MongoDB connection failed, continuing without database:', error);
    // Don't throw error to allow server to start without database
  }
};

// Redis Configuration
export const createRedisClient = () => {
  const client = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
      reconnectStrategy: (retries: number) => {
        if (retries > 10) {
          logger.error('Redis max reconnection attempts reached');
          return new Error('Redis max reconnection attempts reached');
        }
        return Math.min(retries * 100, 3000);
      },
    },
  });

  client.on('error', (err: Error) => {
    logger.warn('⚠️ Redis Client Error:', err);
  });

  client.on('connect', () => {
    logger.info('✅ Redis connected successfully');
  });

  return client;
};

// Graceful shutdown
export const gracefulShutdown = async (): Promise<void> => {
  try {
    logger.info('🔄 Starting graceful shutdown...');
    
    // Close MongoDB connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      logger.info('✅ MongoDB connection closed');
    }
    
    logger.info('✅ Graceful shutdown completed');
  } catch (error) {
    logger.error('❌ Error during graceful shutdown:', error);
  }
};
