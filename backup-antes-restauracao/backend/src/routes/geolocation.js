import express from 'express';
import logger from '../utils/logger.js';

const router = express.Router();

// Proxy para geolocalizaÃ§Ã£o por IP (evita CORS)
router.get('/api/geolocation', async (req, res) => {
  try {
    logger.info('Solicitando geolocalizaÃ§Ã£o por IP');

    // Fazer requisiÃ§Ã£o do servidor (sem CORS)
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();

    logger.info(`GeolocalizaÃ§Ã£o obtida: ${data.city}, ${data.region}`);

    res.json(data);
  } catch (error) {
    logger.error('Erro ao obter geolocalizaÃ§Ã£o:', error);

    // Fallback para SÃ£o Paulo
    res.json({
      city: 'SÃ£o Paulo',
      region: 'SÃ£o Paulo',
      country_name: 'Brasil',
      country_code: 'BR',
      latitude: -23.5505,
      longitude: -46.6333,
      timezone: 'America/Sao_Paulo',
      currency: 'BRL'
    });
  }
});

export default router;
