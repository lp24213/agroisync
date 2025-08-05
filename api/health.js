module.exports = (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'AGROTM Backend API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
}; 