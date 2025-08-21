// API estática que funciona sem servidor
export default function handler(req, res) {
  // Para funcionar no AWS Amplify estático, retornamos dados mock
  const data = {
    message: '✅ Backend Online!',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    status: 'success',
    environment: 'AWS Amplify Static'
  }
  
  // Como é estático, simulamos a resposta
  if (typeof res !== 'undefined') {
    res.status(200).json(data)
  }
  
  return data
}
