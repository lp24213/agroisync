export default function handler(req, res) {
  res.status(200).json({
    message: '✅ Backend funcionando!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  })
}
