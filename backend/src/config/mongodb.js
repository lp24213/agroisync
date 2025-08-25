import mongoose from 'mongoose';

// MongoDB connection configuration
const connectMongoDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agroisync';

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    });

    console.log('✅ MongoDB connected successfully');

    // Handle connection events
    mongoose.connection.on('error', err => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    return false;
  }
};

// Close MongoDB connection
const closeMongoDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
  }
};

// Test MongoDB connection
const testMongoDB = async () => {
  try {
    const isConnected = await connectMongoDB();
    if (isConnected) {
      console.log('✅ MongoDB connection test successful');
      return true;
    } else {
      console.log('❌ MongoDB connection test failed');
      return false;
    }
  } catch (error) {
    console.error('❌ MongoDB connection test error:', error);
    return false;
  }
};

export { connectMongoDB, closeMongoDB, testMongoDB };
