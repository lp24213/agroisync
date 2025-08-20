export default function handler(req, res) {
  res.status(200).json({ 
    status: 'OK',
    message: 'Backend funcionando!',
    timestamp: new Date().toISOString()
  })
}
