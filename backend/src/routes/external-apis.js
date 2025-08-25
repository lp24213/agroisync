import express from 'express';
import { externalAPIService } from '../services/externalAPIs.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { getClientIP } from '../utils/ipUtils.js';

const router = express.Router();

// Aplicar rate limiting
router.use(apiLimiter);

// ===== ROTAS DE CEP E ENDEREÇO =====

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
    console.error('Erro ao consultar CEP:', error);
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
    console.error('Erro ao buscar estados:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/external/estados/:uf/municipios - Listar municípios por estado
router.get('/estados/:uf/municipios', async (req, res) => {
  try {
    const { uf } = req.params;
    const result = await externalAPIService.buscarMunicipiosPorEstado(uf);
    res.json(result);
  } catch (error) {
    console.error('Erro ao buscar municípios:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/external/regioes - Listar regiões
router.get('/regioes', async (req, res) => {
  try {
    const result = await externalAPIService.buscarRegioes();
    res.json(result);
  } catch (error) {
    console.error('Erro ao buscar regiões:', error);
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
        message: 'Latitude e longitude são obrigatórios'
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
    console.error('Erro ao obter clima por coordenadas:', error);
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
    console.error('Erro ao obter clima por IP:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// GET /api/external/clima/ip/:ip - Obter clima por IP específico
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
    console.error('Erro ao obter clima por IP:', error);
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
    console.error('Erro ao consultar CNPJ:', error);
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
    console.error('Erro ao consultar CPF:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// ===== ROTAS DE VALIDAÇÃO =====

// POST /api/external/validar/endereco - Validar endereço
router.post('/validar/endereco', async (req, res) => {
  try {
    const { endereco } = req.body;
    
    if (!endereco) {
      return res.status(400).json({
        success: false,
        message: 'Dados do endereço são obrigatórios'
      });
    }
    
    const result = await externalAPIService.validarEndereco(endereco);
    res.json(result);
  } catch (error) {
    console.error('Erro ao validar endereço:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// ===== ROTAS DE GEOLOCALIZAÇÃO =====

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
    console.error('Erro ao obter coordenadas por IP:', error);
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
    console.error('Erro ao obter coordenadas do IP do cliente:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// ===== ROTA DE STATUS DAS APIS =====

// GET /api/external/status - Status das APIs externas
router.get('/status', async (req, res) => {
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
            description: 'Dados geográficos'
          },
          openweather: {
            name: 'OpenWeather',
            status: API_CONFIG.openweather.apiKey ? 'online' : 'offline',
            description: 'Dados meteorológicos'
          },
          receitaFederal: {
            name: 'Receita Federal',
            status: API_CONFIG.receitaFederal.apiKey ? 'online' : 'offline',
            description: 'Validação de documentos'
          }
        }
      }
    };
    
    res.json(status);
  } catch (error) {
    console.error('Erro ao verificar status das APIs:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
