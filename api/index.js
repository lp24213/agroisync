const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'AGROTM Backend API',
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'AGROTM Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      status: '/api/status'
    }
  });
});

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'operational',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

module.exports = app; 