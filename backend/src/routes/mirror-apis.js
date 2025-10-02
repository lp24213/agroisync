import express from 'express';
import { externalAPIService } from '../services/externalAPIs.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { getClientIP } from '../utils/ipUtils.js';

const router = express.Router();

// Aplicar rate limiting específico para mirrors
router.use(apiLimiter);

// ===== MIRROR API - BAIDU MAPS =====

// GET /api/mirror/baidu?query=... - Geocoding e busca de endereços
router.get('/baidu', async (req, res) => {
  try {
    const { query, lat, lng, type = 'geocoding' } = req.query;

    if (!query && !lat && !lng) {
      return res.status(400).json({
        success: false,
        message: 'Query de busca ou coordenadas (lat/lng) são obrigatórios'
      });
    }

    let result;
    if (type === 'geocoding' && query) {
      // Buscar coordenadas por endereço
      result = await externalAPIService.buscarCoordenadasBaidu(query);
    } else if (type === 'reverse' && lat && lng) {
      // Buscar endereço por coordenadas
      result = await externalAPIService.buscarEnderecoBaidu(lat, lng);
    } else if (type === 'search' && query) {
      // Busca geral de lugares
      result = await externalAPIService.buscarLugaresBaidu(query);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Tipo de busca inválido ou parâmetros insuficientes'
      });
    }

    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        source: 'baidu-maps',
        cached: result.cached || false,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro no mirror Baidu Maps:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ===== MIRROR API - RECEITA FEDERAL =====

// GET /api/mirror/receita/validate?cnpj=... - Validar CNPJ
router.get('/receita/validate', async (req, res) => {
  try {
    const { cnpj, cpf, ie } = req.query;

    if (!cnpj && !cpf && !ie) {
      return res.status(400).json({
        success: false,
        message: 'CNPJ, CPF ou IE deve ser fornecido'
      });
    }

    let result;
    if (cnpj) {
      result = await externalAPIService.validarCNPJ(cnpj);
    } else if (cpf) {
      result = await externalAPIService.validarCPF(cpf);
    } else if (ie) {
      result = await externalAPIService.validarIE(ie);
    }

    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        source: 'receita-federal',
        cached: result.cached || false,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro no mirror Receita Federal:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/mirror/receita/company/:cnpj - Obter dados da empresa
router.get('/receita/company/:cnpj', async (req, res) => {
  try {
    const { cnpj } = req.params;

    if (!cnpj) {
      return res.status(400).json({
        success: false,
        message: 'CNPJ é obrigatório'
      });
    }

    const result = await externalAPIService.obterDadosEmpresa(cnpj);

    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        source: 'receita-federal',
        cached: result.cached || false,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao obter dados da empresa:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ===== MIRROR API - IBGE =====

// GET /api/mirror/ibge?cep=... - Buscar dados por CEP
router.get('/ibge', async (req, res) => {
  try {
    const { cep, uf, municipio } = req.query;

    if (!cep && !uf && !municipio) {
      return res.status(400).json({
        success: false,
        message: 'CEP, UF ou município deve ser fornecido'
      });
    }

    let result;
    if (cep) {
      result = await externalAPIService.consultarCEP(cep);
    } else if (uf && municipio) {
      result = await externalAPIService.buscarMunicipioPorNome(uf, municipio);
    } else if (uf) {
      result = await externalAPIService.buscarMunicipiosPorEstado(uf);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Parâmetros insuficientes para busca'
      });
    }

    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        source: 'ibge',
        cached: result.cached || false,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro no mirror IBGE:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/mirror/ibge/estados - Listar todos os estados
router.get('/ibge/estados', async (req, res) => {
  try {
    const result = await externalAPIService.buscarEstados();

    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        source: 'ibge',
        cached: result.cached || false,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao buscar estados:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/mirror/ibge/estados/:uf/municipios - Listar municípios por estado
router.get('/ibge/estados/:uf/municipios', async (req, res) => {
  try {
    const { uf } = req.params;

    if (!uf) {
      return res.status(400).json({
        success: false,
        message: 'UF é obrigatória'
      });
    }

    const result = await externalAPIService.buscarMunicipiosPorEstado(uf);

    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        source: 'ibge',
        cached: result.cached || false,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao buscar municípios:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ===== MIRROR API - STATUS E SAÚDE =====

// GET /api/mirror/status - Status das APIs mirror
router.get('/status', async (req, res) => {
  try {
    const status = {
      baidu: {
        status: 'operational',
        lastCheck: new Date().toISOString(),
        endpoints: ['/api/mirror/baidu']
      },
      receita: {
        status: 'operational',
        lastCheck: new Date().toISOString(),
        endpoints: ['/api/mirror/receita/validate', '/api/mirror/receita/company/:cnpj']
      },
      ibge: {
        status: 'operational',
        lastCheck: new Date().toISOString(),
        endpoints: [
          '/api/mirror/ibge',
          '/api/mirror/ibge/estados',
          '/api/mirror/ibge/estados/:uf/municipios'
        ]
      }
    };

    res.json({
      success: true,
      data: status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro ao verificar status dos mirrors:', error);
    }
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

export default router;
