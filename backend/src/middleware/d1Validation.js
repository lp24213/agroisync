// =============================================================
// AGROISYNC â€¢ Middleware de ValidaÃ§Ã£o D1 Database
// =============================================================

import logger from '../utils/logger.js';

/**
 * Middleware para validar conexÃ£o com D1 Database
 */
export const validateD1Connection = (req, res, next) => {
  try {
    // Verificar se req.db estÃ¡ disponÃ­vel
    if (!req.db) {
      logger.error('D1 Database nÃ£o disponÃ­vel no request');
      return res.status(503).json({
        success: false,
        error: 'Database nÃ£o disponÃ­vel',
        code: 'DB_UNAVAILABLE'
      });
    }

    // Verificar se req.db tem mÃ©todos necessÃ¡rios
    const requiredMethods = ['prepare', 'batch', 'exec'];
    const missingMethods = requiredMethods.filter(method => typeof req.db[method] !== 'function');

    if (missingMethods.length > 0) {
      logger.error(`MÃ©todos D1 ausentes: ${missingMethods.join(', ')}`);
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
    logger.error('Erro na validaÃ§Ã£o D1:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno na validaÃ§Ã£o do database',
      code: 'DB_VALIDATION_ERROR'
    });
  }
};

/**
 * Middleware para testar conexÃ£o D1 com query simples
 */
export const testD1Connection = async (req, res, next) => {
  try {
    if (!req.db) {
      return res.status(503).json({
        success: false,
        error: 'Database nÃ£o disponÃ­vel',
        code: 'DB_UNAVAILABLE'
      });
    }

    // Executar query de teste simples
    const result = await req.db.prepare('SELECT 1 as test').first();

    if (!result || result.test !== 1) {
      logger.error('Teste D1 falhou - resultado invÃ¡lido');
      return res.status(503).json({
        success: false,
        error: 'Database nÃ£o responde corretamente',
        code: 'DB_TEST_FAILED'
      });
    }

    // Adicionar informaÃ§Ãµes de performance
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
      error: 'Database nÃ£o acessÃ­vel',
      code: 'DB_CONNECTION_ERROR',
      details: error.message
    });
  }
};

/**
 * Health check especÃ­fico para D1
 */
export const d1HealthCheck = async (req, res) => {
  try {
    if (!req.db) {
      return res.status(503).json({
        success: false,
        status: 'unhealthy',
        error: 'Database nÃ£o disponÃ­vel',
        timestamp: Date.now()
      });
    }

    // Teste bÃ¡sico de conectividade
    await req.db.prepare('SELECT 1').first();

    // Teste de tabelas crÃ­ticas
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
