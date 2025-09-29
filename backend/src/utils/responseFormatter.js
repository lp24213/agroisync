/**
 * AGROISYNC - Response Formatter
 *
 * Padroniza todas as respostas da API para manter consistência
 * entre frontend e backend.
 *
 * Formato padrão:
 * {
 *   success: boolean,
 *   message: string,
 *   data: object | array | null,
 *   error: string | object | null,
 *   timestamp: number,
 *   requestId: string (opcional)
 * }
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * Cria uma resposta de sucesso padronizada
 *
 * @param {*} data - Dados a serem retornados
 * @param {string} message - Mensagem de sucesso (opcional)
 * @param {number} statusCode - Código HTTP (opcional)
 * @returns {object} Resposta formatada
 */
export const successResponse = (data = null, message = 'Success', statusCode = 200) => {
  return {
    success: true,
    message,
    data,
    error: null,
    timestamp: Date.now(),
    statusCode
  };
};

/**
 * Cria uma resposta de erro padronizada
 *
 * @param {string} message - Mensagem de erro
 * @param {*} error - Objeto de erro detalhado (opcional)
 * @param {number} statusCode - Código HTTP (opcional)
 * @returns {object} Resposta formatada
 */
export const errorResponse = (message = 'Error', error = null, statusCode = 400) => {
  // Em produção, não expor detalhes do erro
  const errorDetails = process.env.NODE_ENV === 'production' ? null : error?.message || error;

  return {
    success: false,
    message,
    data: null,
    error: errorDetails,
    timestamp: Date.now(),
    statusCode
  };
};

/**
 * Cria uma resposta de validação com erros detalhados
 *
 * @param {array} errors - Array de erros de validação
 * @param {string} message - Mensagem geral (opcional)
 * @returns {object} Resposta formatada
 */
export const validationErrorResponse = (errors = [], message = 'Validation failed') => {
  return {
    success: false,
    message,
    data: null,
    error: {
      type: 'validation',
      errors: Array.isArray(errors) ? errors : [errors]
    },
    timestamp: Date.now(),
    statusCode: 422
  };
};

/**
 * Cria uma resposta de erro de autenticação
 *
 * @param {string} message - Mensagem de erro
 * @returns {object} Resposta formatada
 */
export const authErrorResponse = (message = 'Authentication failed') => {
  return {
    success: false,
    message,
    data: null,
    error: {
      type: 'authentication',
      message
    },
    timestamp: Date.now(),
    statusCode: 401
  };
};

/**
 * Cria uma resposta de erro de autorização
 *
 * @param {string} message - Mensagem de erro
 * @returns {object} Resposta formatada
 */
export const forbiddenResponse = (message = 'Access forbidden') => {
  return {
    success: false,
    message,
    data: null,
    error: {
      type: 'authorization',
      message
    },
    timestamp: Date.now(),
    statusCode: 403
  };
};

/**
 * Cria uma resposta de recurso não encontrado
 *
 * @param {string} resource - Nome do recurso
 * @returns {object} Resposta formatada
 */
export const notFoundResponse = (resource = 'Resource') => {
  return {
    success: false,
    message: `${resource} not found`,
    data: null,
    error: {
      type: 'not_found',
      resource
    },
    timestamp: Date.now(),
    statusCode: 404
  };
};

/**
 * Cria uma resposta de erro do servidor
 *
 * @param {string} message - Mensagem de erro
 * @param {*} error - Objeto de erro (opcional)
 * @returns {object} Resposta formatada
 */
export const serverErrorResponse = (message = 'Internal server error', error = null) => {
  // Log do erro para monitoramento
  if (error) {
    console.error('Server Error:', error);
  }

  return {
    success: false,
    message,
    data: null,
    error: process.env.NODE_ENV === 'production' ? null : error?.message || error?.stack || error,
    timestamp: Date.now(),
    statusCode: 500
  };
};

/**
 * Cria uma resposta de lista paginada
 *
 * @param {array} items - Array de itens
 * @param {number} page - Página atual
 * @param {number} limit - Itens por página
 * @param {number} total - Total de itens
 * @param {string} message - Mensagem (opcional)
 * @returns {object} Resposta formatada
 */
export const paginatedResponse = (
  items = [],
  page = 1,
  limit = 10,
  total = 0,
  message = 'Success'
) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    success: true,
    message,
    data: {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null
      }
    },
    error: null,
    timestamp: Date.now(),
    statusCode: 200
  };
};

/**
 * Cria uma resposta com metadados adicionais
 *
 * @param {*} data - Dados principais
 * @param {object} meta - Metadados adicionais
 * @param {string} message - Mensagem (opcional)
 * @returns {object} Resposta formatada
 */
export const responseWithMeta = (data = null, meta = {}, message = 'Success') => {
  return {
    success: true,
    message,
    data,
    meta,
    error: null,
    timestamp: Date.now(),
    statusCode: 200
  };
};

/**
 * Middleware para adicionar requestId a todas as requisições
 * Útil para rastreamento e debugging
 */
export const requestIdMiddleware = (req, res, next) => {
  req.id = uuidv4();
  res.setHeader('X-Request-Id', req.id);
  next();
};

/**
 * Wrapper para enviar resposta formatada via Express
 *
 * @param {object} res - Objeto response do Express
 * @param {object} responseData - Dados da resposta formatada
 */
export const sendResponse = (res, responseData) => {
  const statusCode = responseData.statusCode || 200;
  delete responseData.statusCode; // Remover antes de enviar

  return res.status(statusCode).json(responseData);
};

/**
 * Helper para converter erros do Express Validator
 *
 * @param {array} validationErrors - Erros do express-validator
 * @returns {array} Array formatado de erros
 */
export const formatValidationErrors = validationErrors => {
  return validationErrors.map(err => ({
    field: err.param || err.path,
    message: err.msg,
    value: err.value
  }));
};

/**
 * Middleware global de tratamento de erros
 * Deve ser o último middleware da aplicação
 */
export const globalErrorHandler = (err, req, res, next) => {
  // Log do erro
  console.error('Global Error Handler:', {
    requestId: req.id,
    error: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });

  // Determinar tipo de erro e responder apropriadamente
  let response;

  if (err.name === 'ValidationError') {
    // Erro de validação do Mongoose
    response = validationErrorResponse(
      Object.values(err.errors).map(e => e.message),
      'Validation failed'
    );
  } else if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    // Erro de autenticação JWT
    response = authErrorResponse('Invalid or expired token');
  } else if (err.name === 'CastError') {
    // Erro de cast do Mongoose (ID inválido, etc)
    response = errorResponse('Invalid data format', err.message, 400);
  } else if (err.statusCode) {
    // Erro customizado com statusCode
    response = errorResponse(err.message, err, err.statusCode);
  } else {
    // Erro genérico do servidor
    response = serverErrorResponse('Internal server error', err);
  }

  // Adicionar requestId se disponível
  if (req.id) {
    response.requestId = req.id;
  }

  return sendResponse(res, response);
};

// Exportar tudo como default também
export default {
  successResponse,
  errorResponse,
  validationErrorResponse,
  authErrorResponse,
  forbiddenResponse,
  notFoundResponse,
  serverErrorResponse,
  paginatedResponse,
  responseWithMeta,
  sendResponse,
  formatValidationErrors,
  requestIdMiddleware,
  globalErrorHandler
};
