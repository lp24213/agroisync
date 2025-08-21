export default function handler(req, res) {
  res.status(200).json({
    message: '✅ Backend Online!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    status: 'success'
  })
}
