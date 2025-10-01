// =============================================================
// AGROISYNC • Middleware de Validação D1 Database
// =============================================================

import logger from '../utils/logger.js';

/**
 * Middleware para validar conexão com D1 Database
 */
export const validateD1Connection = (req, res, next) => {
  try {
    // Verificar se req.db está disponível
    if (!req.db) {
      logger.error('D1 Database não disponível no request');
      return res.status(503).json({
        success: false,
        error: 'Database não disponível',
        code: 'DB_UNAVAILABLE'
      });
    }

    // Verificar se req.db tem métodos necessários
    const requiredMethods = ['prepare', 'batch', 'exec'];
    const missingMethods = requiredMethods.filter(method => typeof req.db[method] !== 'function');

    if (missingMethods.length > 0) {
      logger.error(`Métodos D1 ausentes: ${missingMethods.join(', ')}`);
      return res.status(503).json({
        success: false,
        error: 'Database interface incompleta',
        code: 'DB_INTERFACE_ERROR',
        missingMethods
      });
    }

    // Adicionar timestamp para debug
    req.dbTimestamp = Date.now();

    next();
  } catch (error) {
    logger.error('Erro na validação D1:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno na validação do database',
      code: 'DB_VALIDATION_ERROR'
    });
  }
};

/**
 * Middleware para testar conexão D1 com query simples
 */
export const testD1Connection = async (req, res, next) => {
  try {
    if (!req.db) {
      return res.status(503).json({
        success: false,
        error: 'Database não disponível',
        code: 'DB_UNAVAILABLE'
      });
    }

    // Executar query de teste simples
    const result = await req.db.prepare('SELECT 1 as test').first();

    if (!result || result.test !== 1) {
      logger.error('Teste D1 falhou - resultado inválido');
      return res.status(503).json({
        success: false,
        error: 'Database não responde corretamente',
        code: 'DB_TEST_FAILED'
      });
    }

    // Adicionar informações de performance
    req.dbInfo = {
      connected: true,
      timestamp: Date.now()
    };

    logger.info('D1 Database conectado');
    next();
  } catch (error) {
    logger.error('Erro no teste D1:', error);
    return res.status(503).json({
      success: false,
      error: 'Database não acessível',
      code: 'DB_CONNECTION_ERROR',
      details: error.message
    });
  }
};

/**
 * Health check específico para D1
 */
export const d1HealthCheck = async (req, res) => {
  try {
    if (!req.db) {
      return res.status(503).json({
        success: false,
        status: 'unhealthy',
        error: 'Database não disponível',
        timestamp: Date.now()
      });
    }

    // Teste básico de conectividade
    await req.db.prepare('SELECT 1').first();

    // Teste de tabelas críticas
    const tables = await req.db
      .prepare(
        `
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `
      )
      .all();

    const criticalTables = ['users', 'products', 'freights'];
    const availableTables = tables.map(t => t.name);
    const missingTables = criticalTables.filter(t => !availableTables.includes(t));

    const status = missingTables.length === 0 ? 'healthy' : 'degraded';

    return res.status(200).json({
      success: true,
      status,
      tables: {
        total: tables.length,
        available: availableTables,
        missing: missingTables
      },
      timestamp: Date.now()
    });
  } catch (error) {
    logger.error('Health check D1 falhou:', error);
    return res.status(503).json({
      success: false,
      status: 'unhealthy',
      error: error.message,
      timestamp: Date.now()
    });
  }
};

export default {
  validateD1Connection,
  testD1Connection,
  d1HealthCheck
};
