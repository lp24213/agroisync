// API estática que funciona sem servidor
export default function handler(req, res) {
  const dados = {
    usuarios: 150,
    fazendas: 45,
    cultivos: 230,
    relatorios: 89,
    ultimaAtualizacao: new Date().toISOString(),
    environment: 'AWS Amplify Static',
  };

  const response = {
    success: true,
    dados,
    message: 'Dados carregados com sucesso',
  };

  // Como é estático, simulamos a resposta
  if (typeof res !== 'undefined') {
    res.status(200).json(response);
  }

  return response;
}
