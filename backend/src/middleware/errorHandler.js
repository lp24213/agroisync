const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log do erro
  logger.error('Erro capturado:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Erro de validação do Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = {
      message,
      statusCode: 400
    };
  }

  // Erro de cast do Mongoose (ID inválido)
  if (err.name === 'CastError') {
    const message = 'Recurso não encontrado';
    error = {
      message,
      statusCode: 404
    };
  }

  // Erro de duplicação do Mongoose
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} já existe`;
    error = {
      message,
      statusCode: 400
    };
  }

  // Erro JWT
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token inválido';
    error = {
      message,
      statusCode: 401
    };
  }

  // Erro JWT expirado
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expirado';
    error = {
      message,
      statusCode: 401
    };
  }

  // Erro de limite de taxa
  if (err.statusCode === 429) {
    const message = 'Muitas tentativas. Tente novamente mais tarde.';
    error = {
      message,
      statusCode: 429
    };
  }

  // Erro de upload de arquivo
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'Arquivo muito grande';
    error = {
      message,
      statusCode: 400
    };
  }

  // Erro de tipo de arquivo
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    const message = 'Tipo de arquivo não permitido';
    error = {
      message,
      statusCode: 400
    };
  }

  // Erro de conexão com banco de dados
  if (err.name === 'MongoNetworkError') {
    const message = 'Erro de conexão com o banco de dados';
    error = {
      message,
      statusCode: 503
    };
  }

  // Erro de timeout
  if (err.name === 'MongoTimeoutError') {
    const message = 'Timeout na operação do banco de dados';
    error = {
      message,
      statusCode: 504
    };
  }

  // Erro de Stripe
  if (err.type && err.type.startsWith('Stripe')) {
    const message = 'Erro no processamento do pagamento';
    error = {
      message,
      statusCode: 400
    };
  }

  // Erro de Web3/Ethereum
  if (err.code && err.code.startsWith('UNPREDICTABLE_GAS_LIMIT')) {
    const message = 'Erro na transação blockchain';
    error = {
      message,
      statusCode: 400
    };
  }

  // Status code padrão
  const statusCode = error.statusCode || 500;

  // Resposta de erro
  res.status(statusCode).json({
    success: false,
    message: error.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err
    })
  });
};

module.exports = errorHandler;