export default function handler(req, res) {
  const dados = {
    fazendas: 25,
    cultivos: 150,
    usuarios: 45,
    relatorios: 78
  };

  res.status(200).json({
    success: true,
    dados,
    timestamp: new Date().toISOString()
  });
}
