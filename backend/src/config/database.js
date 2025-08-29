import mongoose from 'mongoose';

// MongoDB connection configuration
const connectDB = async () => {
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

    // Create indexes for performance
    await createIndexes();

    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    return false;
  }
};

// Function to create indexes
const createIndexes = async () => {
  try {
    // Indexes for User
    if (mongoose.models.User) {
      await mongoose.model('User').createIndexes();
    }
    
    // Indexes for Payment
    if (mongoose.models.Payment) {
      await mongoose.model('Payment').createIndexes();
    }
    
    // Indexes for Conversation
    if (mongoose.models.Conversation) {
      await mongoose.model('Conversation').createIndexes();
    }
    
    // Indexes for Message
    if (mongoose.models.Message) {
      await mongoose.model('Message').createIndexes();
    }

    // Indexes for Product
    if (mongoose.models.Product) {
      await mongoose.model('Product').createIndexes();
    }

    // Indexes for Freight
    if (mongoose.models.Freight) {
      await mongoose.model('Freight').createIndexes();
    }

    // Indexes for Transaction
    if (mongoose.models.Transaction) {
      await mongoose.model('Transaction').createIndexes();
    }
    
    console.log('✅ Database indexes created successfully');
  } catch (error) {
    console.error('❌ Error creating database indexes:', error);
  }
};

// Close MongoDB connection
const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
  }
};

// Test MongoDB connection
const testDB = async () => {
  try {
    const isConnected = await connectDB();
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

export { connectDB, closeDB, testDB };
