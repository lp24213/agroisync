import logger from '../utils/logger.js';

/**
 * Middleware para validar a ID da Metamask nas requisiÃ§Ãµes
 * Este middleware verifica se o header 'x-metamask-id' estÃ¡ presente
 * e se corresponde ao ID autorizado
 */
const validateMetamaskId = (req, res, next) => {
  try {
    // Obter a ID da Metamask do header
    const metamaskId = req.headers['x-metamask-id'];

    // ID da Metamask autorizada (deve ser configurada via variÃ¡vel de ambiente)
    const authorizedMetamaskId =
      process.env.METAMASK_ID || '0x5Ea5C5970e8AE23A5336d631707CF31C5916E8b1';

    // Verificar se o header estÃ¡ presente
    if (!metamaskId) {
      logger.warn(`RequisiÃ§Ã£o sem Metamask ID: ${req.method} ${req.originalUrl} - IP: ${req.ip}`);

      return res.status(401).json({
        success: false,
        error: 'Metamask ID nÃ£o fornecido',
        message: 'Header x-metamask-id Ã© obrigatÃ³rio para autenticaÃ§Ã£o'
      });
    }

    // Verificar se a ID corresponde Ã  autorizada
    if (metamaskId !== authorizedMetamaskId) {
      logger.warn(
        `Tentativa de acesso com Metamask ID invÃ¡lido: ${metamaskId} - IP: ${req.ip} - URL: ${req.originalUrl}`
      );

      return res.status(403).json({
        success: false,
        error: 'Metamask ID invÃ¡lido',
        message: 'ID da Metamask nÃ£o autorizado para acessar este recurso'
      });
    }

    // ID vÃ¡lida, continuar
    logger.info(
      `RequisiÃ§Ã£o autenticada com Metamask ID: ${metamaskId} - ${req.method} ${req.originalUrl}`
    );

    // Adicionar informaÃ§Ãµes da Metamask ao request para uso posterior
    req.metamaskId = metamaskId;
    req.isAuthenticated = true;

    next();
  } catch (error) {
    logger.error('Erro no middleware de validaÃ§Ã£o da Metamask ID:', error);

    return res.status(500).json({
      success: false,
      error: 'Erro interno do servidor durante validaÃ§Ã£o da Metamask ID'
    });
  }
};

/**
 * Middleware opcional para validar a ID da Metamask
 * NÃ£o falha se a ID nÃ£o estiver presente, mas valida se estiver
 */
const optionalMetamaskAuth = (req, res, next) => {
  try {
    const metamaskId = req.headers['x-metamask-id'];
    const authorizedMetamaskId =
      process.env.METAMASK_ID || '0x5Ea5C5970e8AE23A5336d631707CF31C5916E8b1';

    if (metamaskId) {
      if (metamaskId !== authorizedMetamaskId) {
        logger.warn(
          `Metamask ID invÃ¡lido em requisiÃ§Ã£o opcional: ${metamaskId} - IP: ${req.ip}`
        );

        return res.status(403).json({
          success: false,
          error: 'Metamask ID invÃ¡lido',
          message: 'ID da Metamask nÃ£o autorizado'
        });
      }

      req.metamaskId = metamaskId;
      req.isAuthenticated = true;
      logger.info(`RequisiÃ§Ã£o opcional autenticada com Metamask ID: ${metamaskId}`);
    } else {
      req.isAuthenticated = false;
      logger.info('RequisiÃ§Ã£o sem autenticaÃ§Ã£o Metamask (opcional)');
    }

    next();
  } catch (error) {
    logger.error('Erro no middleware opcional de validaÃ§Ã£o da Metamask ID:', error);
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

export { validateMetamaskId, optionalMetamaskAuth, logMetamaskAccess };
export default {
  validateMetamaskId,
  optionalMetamaskAuth,
  logMetamaskAccess
};
