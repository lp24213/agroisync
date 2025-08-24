import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Import MongoDB connection
import { connectMongoDB } from './config/mongodb.js';

// Import routes
import healthRoutes from './routes/health.js';
import apiRoutes from './routes/api.js';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://your-domain.amplifyapp.com',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize MongoDB connection
const initializeMongoDB = async () => {
  try {
    const isConnected = await connectMongoDB();
    if (isConnected) {
      console.log('✅ MongoDB initialized successfully');
    } else {
      console.log('⚠️ MongoDB initialization failed, running in offline mode');
    }
  } catch (error) {
    console.error('❌ MongoDB initialization error:', error);
  }
};

// Routes
app.use('/health', healthRoutes);
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'AGROISYNC Backend',
    version: '2.3.1',
    database: 'MongoDB'
  });
});

// 404 handler
app.use('*', (_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, _req, res, _next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  
  // Initialize MongoDB after server starts
  await initializeMongoDB();
});

export default app;
