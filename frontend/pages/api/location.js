// API para obter localização baseada no IP
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Obter IP do usuário
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? forwarded.split(',')[0] : req.socket.remoteAddress;

    // IP de fallback para desenvolvimento local
    const userIP = ip || '8.8.8.8';

    // Fazer chamada para ipapi.co
    const response = await fetch(`https://ipapi.co/${userIP}/json/`);

    if (!response.ok) {
      throw new Error(`Erro na API de IP: ${response.status}`);
    }

    const data = await response.json();

    // Formatar resposta
    const locationData = {
      ip: userIP,
      city: data.city || 'Desconhecida',
      state: data.region || 'Desconhecido',
      country: data.country_name || 'Brasil',
      countryCode: data.country_code || 'BR',
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
      region: `${data.city || 'Desconhecida'}, ${data.region || 'Desconhecido'}`
    };

    res.status(200).json(locationData);
  } catch (error) {
    console.error('Erro ao obter localização:', error);

    // Dados de fallback em caso de erro
    const fallbackData = {
      ip: '127.0.0.1',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brasil',
      countryCode: 'BR',
      latitude: -23.5505,
      longitude: -46.6333,
      timezone: 'America/Sao_Paulo',
      region: 'São Paulo, SP'
    };

    res.status(200).json(fallbackData);
  }
}
