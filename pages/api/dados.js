export default function handler(req, res) {
  const dados = {
    usuarios: 150,
    fazendas: 45,
    cultivos: 230,
    relatorios: 89,
    ultimaAtualizacao: new Date().toISOString()
  }
  
  res.status(200).json({
    success: true,
    dados,
    message: 'Dados carregados com sucesso'
  })
}
