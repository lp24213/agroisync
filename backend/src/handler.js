import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import serverless from 'aws-serverless-express';

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

// Routes
app.use('/health', healthRoutes);
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/', (_req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'AGROISYNC Backend',
    version: '2.3.1'
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

// AWS Lambda handler
export const handler = async (event, context) => {
  // Convert API Gateway event to Express request
  const server = serverless.createServer(app);
  
  return new Promise((resolve, reject) => {
    serverless.proxy(server, event, context, 'PROMISE').promise
      .then((response) => {
        resolve({
          statusCode: response.statusCode,
          headers: response.headers,
          body: response.body,
          isBase64Encoded: response.isBase64Encoded
        });
      })
      .catch(reject);
  });
};

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
