const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

// Validation middleware
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    logger.warn(`Validation failed for ${req.method} ${req.originalUrl}:`, errors.array());
    
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

module.exports = { checkValidation };
