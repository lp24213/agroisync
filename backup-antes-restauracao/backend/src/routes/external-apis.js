import express from 'express';
import { externalAPIService } from '../services/externalAPIs.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { getClientIP } from '../utils/ipUtils.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Aplicar rate limiting
router.use(apiLimiter);

// ===== ROTAS DE CEP E ENDEREÃ‡O =====

// GET /api/external/cep/:cep - Consultar CEP
router.get('/cep/:cep', async (req, res) => {
  try {
    const { cep } = req.params;
    const result = await externalAPIService.consultarCEP(cep);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    logger.error('Erro ao consultar CEP:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/external/estados - Listar estados
router.get('/estados', async (req, res) => {
  try {
    const result = await externalAPIService.buscarEstados();
    res.json(result);
  } catch (error) {
    logger.error('Erro ao buscar estados:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/external/estados/:uf/municipios - Listar municÃ­pios por estado
router.get('/estados/:uf/municipios', async (req, res) => {
  try {
    const { uf } = req.params;
    const result = await externalAPIService.buscarMunicipiosPorEstado(uf);
    res.json(result);
  } catch (error) {
    logger.error('Erro ao buscar municÃ­pios:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/external/regioes - Listar regiÃµes
router.get('/regioes', async (req, res) => {
  try {
    const result = await externalAPIService.buscarRegioes();
    res.json(result);
  } catch (error) {
    logger.error('Erro ao buscar regiÃµes:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// ===== ROTAS DE CLIMA =====

// GET /api/external/clima/coordenadas - Obter clima por coordenadas
router.get('/clima/coordenadas', async (req, res) => {
  try {
    const { lat, lon, units = 'metric', lang = 'pt' } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        message: 'Latitude e longitude sÃ£o obrigatÃ³rios'
      });
    }

    const result = await externalAPIService.obterClimaPorCoordenadas(
      parseFloat(lat),
      parseFloat(lon),
      units,
      lang
    );

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    logger.error('Erro ao obter clima por coordenadas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/external/clima/ip - Obter clima por IP
router.get('/clima/ip', async (req, res) => {
  try {
    const { units = 'metric', lang = 'pt' } = req.query;
    const clientIP = getClientIP(req);

    const result = await externalAPIService.obterClimaPorIP(clientIP, units, lang);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    logger.error('Erro ao obter clima por IP:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/external/clima/ip/:ip - Obter clima por IP especÃ­fico
router.get('/clima/ip/:ip', async (req, res) => {
  try {
    const { ip } = req.params;
    const { units = 'metric', lang = 'pt' } = req.query;

    const result = await externalAPIService.obterClimaPorIP(ip, units, lang);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    logger.error('Erro ao obter clima por IP:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// ===== ROTAS DO BAIDU MAPS =====

// GET /api/external/baidu/geocode - Geocoding de endereÃ§o
router.get('/baidu/geocode', async (req, res) => {
  try {
    const { address, city, region } = req.query;

    if (!address) {
      return res.status(400).json({
        success: false,
        message: 'EndereÃ§o Ã© obrigatÃ³rio'
      });
    }

    const result = await externalAPIService.geocodeAddress(address, city, region);
    res.json(result);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro no geocoding:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/external/baidu/reverse-geocode - Reverse geocoding
router.get('/baidu/reverse-geocode', async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude e longitude sÃ£o obrigatÃ³rios'
      });
    }

    const result = await externalAPIService.reverseGeocode(parseFloat(lat), parseFloat(lng));
    res.json(result);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro no reverse geocoding:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/external/baidu/route - Calcular rota
router.get('/baidu/route', async (req, res) => {
  try {
    const { originLat, originLng, destLat, destLng, mode = 'driving' } = req.query;

    if (!originLat || !originLng || !destLat || !destLng) {
      return res.status(400).json({
        success: false,
        message: 'Coordenadas de origem e destino sÃ£o obrigatÃ³rias'
      });
    }

    const origin = { lat: parseFloat(originLat), lng: parseFloat(originLng) };
    const destination = { lat: parseFloat(destLat), lng: parseFloat(destLng) };

    const result = await externalAPIService.calculateRoute(origin, destination, mode);
    res.json(result);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao calcular rota:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// ===== ROTAS DA RECEITA FEDERAL =====

// GET /api/external/receita/cnpj/:cnpj - Consultar CNPJ
router.get('/receita/cnpj/:cnpj', async (req, res) => {
  try {
    const { cnpj } = req.params;
    const result = await externalAPIService.consultarCNPJ(cnpj);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao consultar CNPJ:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/external/receita/cpf/:cpf - Consultar CPF
router.get('/receita/cpf/:cpf', async (req, res) => {
  try {
    const { cpf } = req.params;
    const result = await externalAPIService.consultarCPF(cpf);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao consultar CPF:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// ===== ROTAS DE VALIDAÃ‡ÃƒO =====

// POST /api/external/validar/endereco - Validar endereÃ§o
router.post('/validar/endereco', async (req, res) => {
  try {
    const { endereco } = req.body;

    if (!endereco) {
      return res.status(400).json({
        success: false,
        message: 'Dados do endereÃ§o sÃ£o obrigatÃ³rios'
      });
    }

    const result = await externalAPIService.validarEndereco(endereco);
    res.json(result);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao validar endereÃ§o:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// ===== ROTAS DE GEOLOCALIZAÃ‡ÃƒO =====

// GET /api/external/geo/ip/:ip - Obter coordenadas por IP
router.get('/geo/ip/:ip', async (req, res) => {
  try {
    const { ip } = req.params;
    const result = await externalAPIService.obterCoordenadasPorIP(ip);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao obter coordenadas por IP:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/external/geo/ip - Obter coordenadas do IP do cliente
router.get('/geo/ip', async (req, res) => {
  try {
    const clientIP = getClientIP(req);
    const result = await externalAPIService.obterCoordenadasPorIP(clientIP);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao obter coordenadas do IP do cliente:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// ===== ROTAS DE COTAÇÕES AGRÍCOLAS =====

// GET /api/external/cotacoes - Obter cotações agrícolas
router.get('/cotacoes', async (req, res) => {
  try {
    const { produtos, regiao } = req.query;
    const produtosList = produtos ? produtos.split(',').map(p => p.trim()) : ['soja', 'milho', 'cafe'];

    const result = await externalAPIService.obterCotacoes(produtosList, regiao);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    logger.error('Erro ao obter cotações:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/external/cotacoes/:produto - Obter cotação específica
router.get('/cotacoes/:produto', async (req, res) => {
  try {
    const { produto } = req.params;
    const { regiao } = req.query;

    const result = await externalAPIService.obterCotacao(produto, regiao);

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    logger.error('Erro ao obter cotação específica:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/external/cotacoes/historico/:produto - Obter histórico de preços
router.get('/cotacoes/historico/:produto', async (req, res) => {
  try {
    const { produto } = req.params;
    const { dias = 30 } = req.query;

    const result = await externalAPIService.obterHistoricoCotacao(produto, parseInt(dias));

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    logger.error('Erro ao obter histórico de cotação:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// ===== ROTA DE STATUS DAS APIS =====

// GET /api/external/status - Status das APIs externas
router.get('/status', (req, res) => {
  try {
    const status = {
      success: true,
      data: {
        timestamp: new Date().toISOString(),
        apis: {
          viacep: {
            name: 'ViaCEP',
            status: 'online',
            description: 'Consulta de CEP'
          },
          ibge: {
            name: 'IBGE',
            status: 'online',
            description: 'Dados geogrÃ¡ficos'
          },
          openweather: {
            name: 'OpenWeather',
            status: process.env.OPENWEATHER_API_KEY ? 'online' : 'offline',
            description: 'Dados meteorolÃ³gicos'
          },
          receitaFederal: {
            name: 'Receita Federal',
            status: process.env.RECEITA_FEDERAL_API_KEY ? 'online' : 'offline',
            description: 'ValidaÃ§Ã£o de documentos'
          },
          baiduMaps: {
            name: 'Baidu Maps',
            status: process.env.BAIDU_MAPS_API_KEY ? 'online' : 'offline',
            description: 'Geocoding e rotas'
          },
          cotacoes: {
            name: 'Cotações Agrícolas',
            status: 'online',
            description: 'Cotações de commodities agrícolas'
          }
        }
      }
    };

    res.json(status);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      logger.error('Erro ao verificar status das APIs:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
