/**
 * AGROISYNC - Error Handler Utilities
 *
 * Utilitários para tratamento consistente de erros no frontend.
 * Integra com toast notifications, logging e analytics.
 */

import toast from 'react-hot-toast';
import { useState, useCallback } from 'react';
import { isDevelopment } from '../config/constants.js';

/**
 * Classe de erro customizada para o AgroSync
 */
export class AgroSyncError extends Error {
  constructor(message, code = 'UNKNOWN_ERROR', details = null) {
    super(message);
    this.name = 'AgroSyncError';
    this.code = code;
    this.details = details;
    this.timestamp = Date.now();
  }
}

/**
 * Tipos de erro conhecidos
 */
export const ErrorTypes = {
  NETWORK: 'NETWORK_ERROR',
  AUTH: 'AUTH_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  API: 'API_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  PERMISSION: 'PERMISSION_DENIED',
  TIMEOUT: 'TIMEOUT_ERROR',
  SERVER: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

/**
 * Mapeia erros HTTP para tipos conhecidos
 */
const HTTP_ERROR_MAP = {
  400: ErrorTypes.VALIDATION,
  401: ErrorTypes.AUTH,
  403: ErrorTypes.PERMISSION,
  404: ErrorTypes.NOT_FOUND,
  408: ErrorTypes.TIMEOUT,
  500: ErrorTypes.SERVER,
  502: ErrorTypes.SERVER,
  503: ErrorTypes.SERVER,
  504: ErrorTypes.TIMEOUT
};

/**
 * Mensagens amigáveis para usuários
 */
const USER_FRIENDLY_MESSAGES = {
  [ErrorTypes.NETWORK]: 'Erro de conexão. Verifique sua internet e tente novamente.',
  [ErrorTypes.AUTH]: 'Sessão expirada. Por favor, faça login novamente.',
  [ErrorTypes.VALIDATION]: 'Dados inválidos. Verifique as informações e tente novamente.',
  [ErrorTypes.API]: 'Erro ao processar sua solicitação. Tente novamente.',
  [ErrorTypes.NOT_FOUND]: 'Recurso não encontrado.',
  [ErrorTypes.PERMISSION]: 'Você não tem permissão para realizar esta ação.',
  [ErrorTypes.TIMEOUT]: 'A requisição demorou muito. Tente novamente.',
  [ErrorTypes.SERVER]: 'Erro no servidor. Tente novamente em instantes.',
  [ErrorTypes.UNKNOWN]: 'Ocorreu um erro inesperado. Tente novamente.'
};

/**
 * Extrai informações úteis de um erro
 *
 * @param {Error|Object} error - Erro a ser analisado
 * @returns {Object} Informações do erro
 */
export const parseError = error => {
  // Erro do Axios
  if (error.response) {
    return {
      type: HTTP_ERROR_MAP[error.response.status] || ErrorTypes.API,
      message: error.response.data?.message || error.message,
      statusCode: error.response.status,
      data: error.response.data,
      isAxiosError: true
    };
  }

  // Erro de rede
  if (error.request) {
    return {
      type: ErrorTypes.NETWORK,
      message: 'Erro de conexão com o servidor',
      statusCode: null,
      data: null,
      isNetworkError: true
    };
  }

  // Erro customizado do AgroSync
  if (error instanceof AgroSyncError) {
    return {
      type: error.code,
      message: error.message,
      statusCode: null,
      data: error.details,
      isAgroSyncError: true
    };
  }

  // Erro genérico
  return {
    type: ErrorTypes.UNKNOWN,
    message: error.message || 'Erro desconhecido',
    statusCode: null,
    data: null,
    isGenericError: true
  };
};

/**
 * Obtém mensagem amigável para o usuário
 *
 * @param {Object} parsedError - Erro parseado
 * @param {boolean} showTechnical - Mostrar detalhes técnicos
 * @returns {string} Mensagem amigável
 */
export const getUserFriendlyMessage = (parsedError, showTechnical = false) => {
  const baseMessage = USER_FRIENDLY_MESSAGES[parsedError.type] || USER_FRIENDLY_MESSAGES[ErrorTypes.UNKNOWN];

  // Em desenvolvimento, adicionar detalhes técnicos
  if (showTechnical && isDevelopment()) {
    return `${baseMessage}\n\n[Detalhes técnicos: ${parsedError.message}]`;
  }

  return baseMessage;
};

/**
 * Manipula erro e exibe notificação apropriada
 *
 * @param {Error|Object} error - Erro a ser tratado
 * @param {Object} options - Opções de tratamento
 * @returns {Object} Erro parseado
 */
export const handleError = (error, options = {}) => {
  const {
    showToast = true,
    toastDuration = 4000,
    logToConsole = isDevelopment(),
    redirectOnAuth = true,
    customMessage = null
  } = options;

  // Parsear erro
  const parsed = parseError(error);

  // Log no console (desenvolvimento)
  if (logToConsole) {
    console.error('🔴 Error Handler:', {
      type: parsed.type,
      message: parsed.message,
      statusCode: parsed.statusCode,
      data: parsed.data,
      originalError: error
    });
  }

  // Mensagem para o usuário
  const userMessage = customMessage || getUserFriendlyMessage(parsed, isDevelopment());

  // Exibir toast
  if (showToast) {
    toast.error(userMessage, {
      duration: toastDuration,
      icon: '⚠️'
    });
  }

  // Redirecionar se erro de autenticação
  if (redirectOnAuth && parsed.type === ErrorTypes.AUTH) {
    setTimeout(() => {
      // Usar helper seguro para limpar tokens
      const { removeAuthToken } = require('../config/constants.js');
      removeAuthToken();
      window.location.href = '/login';
    }, 2000);
  }

  return parsed;
};

/**
 * Wrapper para async functions com tratamento de erro
 *
 * @param {Function} fn - Função async a ser executada
 * @param {Object} errorOptions - Opções de tratamento de erro
 * @returns {Function} Função wrapped
 *
 * Exemplo:
 * const fetchData = withErrorHandling(async () => {
 *   const response = await api.get('/data');
 *   return response.data;
 * });
 */
export const withErrorHandling = (fn, errorOptions = {}) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      handleError(error, errorOptions);
      throw error; // Re-throw para que o caller possa tratar se necessário
    }
  };
};

/**
 * Hook React para tratamento de erros com estado
 *
 * Exemplo:
 * const { error, setError, clearError, handleError } = useErrorHandler();
 */
export const useErrorHandler = () => {
  const [error, setError] = useState(null);

  const handleErrorWithState = useCallback((err, options = {}) => {
    const parsed = handleError(err, options);
    setError(parsed);
    return parsed;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    setError: handleErrorWithState,
    clearError,
    hasError: !!error,
    errorType: error?.type || null,
    errorMessage: error?.message || null
  };
};

/**
 * Retry automático para funções que falham
 *
 * @param {Function} fn - Função a ser executada
 * @param {Object} options - Opções de retry
 * @returns {Promise} Resultado da função
 *
 * Exemplo:
 * const data = await retryOnError(
 *   () => api.get('/data'),
 *   { maxRetries: 3, delay: 1000 }
 * );
 */
export const retryOnError = async (fn, options = {}) => {
  const {
    maxRetries = 3,
    delay = 1000,
    backoff = true,
    retryOn = [ErrorTypes.NETWORK, ErrorTypes.TIMEOUT, ErrorTypes.SERVER]
  } = options;

  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const parsed = parseError(error);

      // Verificar se deve fazer retry
      const shouldRetry = retryOn.includes(parsed.type);

      if (attempt < maxRetries && shouldRetry) {
        // Calcular delay com backoff exponencial
        const retryDelay = backoff ? delay * Math.pow(2, attempt) : delay;

        if (isDevelopment()) {
          if (process.env.NODE_ENV !== 'production') {

            console.log(`🔄 Retry attempt ${attempt + 1}/${maxRetries} after ${retryDelay}ms`);

          }
        }

        await new Promise(resolve => setTimeout(resolve, retryDelay));
      } else {
        break;
      }
    }
  }

  // Se chegou aqui, todas as tentativas falharam
  throw lastError;
};

/**
 * Validador de resposta da API
 * Garante que a resposta está no formato esperado
 *
 * @param {Object} response - Resposta da API
 * @returns {Object} Resposta validada
 * @throws {AgroSyncError} Se resposta inválida
 */
export const validateApiResponse = response => {
  // Verificar formato básico
  if (!response || typeof response !== 'object') {
    throw new AgroSyncError('Resposta da API em formato inválido', ErrorTypes.API, { response });
  }

  // Verificar se tem campo success
  if (typeof response.success === 'undefined') {
    if (process.env.NODE_ENV !== 'production') {

      console.warn('⚠️ Resposta da API sem campo "success". Formato antigo?');

    }
  }

  // Se sucesso é false, lançar erro
  if (response.success === false) {
    throw new AgroSyncError(response.message || 'Erro na API', ErrorTypes.API, response.error || response.data);
  }

  return response;
};

/**
 * Logger de erros para analytics/monitoring
 * Pode ser integrado com Sentry, LogRocket, etc
 *
 * @param {Object} error - Erro parseado
 * @param {Object} context - Contexto adicional
 */
export const logErrorToMonitoring = (error, context = {}) => {
  // Em desenvolvimento, apenas log no console
  if (isDevelopment()) {
    if (process.env.NODE_ENV !== 'production') {

      console.log('📊 Error logged:', { error, context });

    }
    return;
  }

  // Em produção, enviar para serviço de monitoramento
  // Exemplo com Sentry (descomentar quando configurado):
  // if (window.Sentry) {
  //   window.Sentry.captureException(error, {
  //     contexts: { agroisync: context }
  //   });
  // }

  // Exemplo com Google Analytics (descomentar quando configurado):
  // if (window.gtag) {
  //   window.gtag('event', 'exception', {
  //     description: error.message,
  //     fatal: false,
  //     ...context
  //   });
  // }
};

// Exportar tudo como default também
export default {
  AgroSyncError,
  ErrorTypes,
  parseError,
  getUserFriendlyMessage,
  handleError,
  withErrorHandling,
  useErrorHandler,
  retryOnError,
  validateApiResponse,
  logErrorToMonitoring
};
