export default function handler(req, res) {
  const dados = {
    usuarios: 150,
    fazendas: 45,
    cultivos: 230,
    relatorios: 89
  }
  
  res.status(200).json({
    success: true,
    dados,
    timestamp: new Date().toISOString()
  })
}
