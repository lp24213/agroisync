import auditSystem, { auditMiddleware } from '../services/auditService.js';
import logger from '../utils/logger.js';

// Shim simples para preservar a interface esperada pelas rotas de privacidade.
// Importante: não realiza operações bloqueantes no import, apenas retorna
// middlewares que delegam para o auditService. Em caso de erro, cai em noop
// para não interromper o fluxo da aplicação em desenvolvimento.

const safeWrapper = (fnName, fn) => {
  return (...args) => {
    try {
      return fn(...args);
    } catch (err) {
      // Se algo falhar ao criar o middleware, logar e retornar um noop middleware
      logger.warn(`auditMiddleware shim: falha ao criar ${fnName}, usando noop middleware`, err);
      return (req, res, next) => next();
    }
  };
};

export const auditUserAction = safeWrapper('auditUserAction', auditMiddleware);
export const auditDataExport = safeWrapper('auditDataExport', auditMiddleware);
export const auditDataDeletion = safeWrapper('auditDataDeletion', auditMiddleware);

// Exportar acesso direto ao sistema de auditoria caso outras partes do app
// queiram gravar logs programaticamente.
export const auditServiceInstance = auditSystem;

export default {
  auditUserAction,
  auditDataExport,
  auditDataDeletion,
  auditServiceInstance
};
