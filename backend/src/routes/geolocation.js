import express from 'express';
import logger from '../utils/logger.js';

const router = express.Router();

// Proxy para geolocalização por IP (evita CORS)
router.get('/api/geolocation', async (req, res) => {
  try {
    logger.info('Solicitando geolocalização por IP');
    
    // Fazer requisição do servidor (sem CORS)
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    logger.info(`Geolocalização obtida: ${data.city}, ${data.region}`);
    
    res.json(data);
  } catch (error) {
    logger.error('Erro ao obter geolocalização:', error);
    
    // Fallback para São Paulo
    res.json({
      city: 'São Paulo',
      region: 'São Paulo',
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
