const logger = require('../utils/logger');

/**
 * Middleware para validar a ID da Metamask nas requisições
 * Este middleware verifica se o header 'x-metamask-id' está presente
 * e se corresponde ao ID autorizado
 */
const validateMetamaskId = (req, res, next) => {
  try {
    // Obter a ID da Metamask do header
    const metamaskId = req.headers['x-metamask-id'];

    // ID da Metamask autorizada (deve ser configurada via variável de ambiente)
    const authorizedMetamaskId =
      process.env.METAMASK_ID || '0x5Ea5C5970e8AE23A5336d631707CF31C5916E8b1';

    // Verificar se o header está presente
    if (!metamaskId) {
      logger.warn(`Requisição sem Metamask ID: ${req.method} ${req.originalUrl} - IP: ${req.ip}`);

      return res.status(401).json({
        success: false,
        error: 'Metamask ID não fornecido',
        message: 'Header x-metamask-id é obrigatório para autenticação'
      });
    }

    // Verificar se a ID corresponde à autorizada
    if (metamaskId !== authorizedMetamaskId) {
      logger.warn(
        `Tentativa de acesso com Metamask ID inválido: ${metamaskId} - IP: ${req.ip} - URL: ${req.originalUrl}`
      );

      return res.status(403).json({
        success: false,
        error: 'Metamask ID inválido',
        message: 'ID da Metamask não autorizado para acessar este recurso'
      });
    }

    // ID válida, continuar
    logger.info(
      `Requisição autenticada com Metamask ID: ${metamaskId} - ${req.method} ${req.originalUrl}`
    );

    // Adicionar informações da Metamask ao request para uso posterior
    req.metamaskId = metamaskId;
    req.isAuthenticated = true;

    next();
  } catch (error) {
    logger.error('Erro no middleware de validação da Metamask ID:', error);

    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor durante validação da Metamask ID'
    });
  }
};

/**
 * Middleware opcional para validar a ID da Metamask
 * Não falha se a ID não estiver presente, mas valida se estiver
 */
const optionalMetamaskAuth = (req, res, next) => {
  try {
    const metamaskId = req.headers['x-metamask-id'];
    const authorizedMetamaskId =
      process.env.METAMASK_ID || '0x5Ea5C5970e8AE23A5336d631707CF31C5916E8b1';

    if (metamaskId) {
      if (metamaskId !== authorizedMetamaskId) {
        logger.warn(`Metamask ID inválido em requisição opcional: ${metamaskId} - IP: ${req.ip}`);

        return res.status(403).json({
          success: false,
          error: 'Metamask ID inválido',
          message: 'ID da Metamask não autorizado'
        });
      }

      req.metamaskId = metamaskId;
      req.isAuthenticated = true;
      logger.info(`Requisição opcional autenticada com Metamask ID: ${metamaskId}`);
    } else {
      req.isAuthenticated = false;
      logger.info('Requisição sem autenticação Metamask (opcional)');
    }

    next();
  } catch (error) {
    logger.error('Erro no middleware opcional de validação da Metamask ID:', error);
    next();
  }
};

/**
 * Middleware para registrar tentativas de acesso
 */
const logMetamaskAccess = (req, res, next) => {
  const metamaskId = req.headers['x-metamask-id'];
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('User-Agent');
  const timestamp = new Date().toISOString();

  logger.info(
    `Tentativa de acesso - Metamask ID: ${metamaskId || 'N/A'} - IP: ${ip} - User-Agent: ${userAgent} - Timestamp: ${timestamp}`
  );

  next();
};

module.exports = {
  validateMetamaskId,
  optionalMetamaskAuth,
  logMetamaskAccess
};
