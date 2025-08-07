const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// Authentication middleware
const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.'
      });
    }

    // Extract token
    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Add user info to request
      req.user = decoded;
      
      logger.info(`User ${decoded.id} authenticated for ${req.method} ${req.originalUrl}`);
      
      next();
    } catch (error) {
      logger.warn(`Invalid token attempt: ${error.message}`);
      
      return res.status(401).json({
        success: false,
        error: 'Invalid token.'
      });
    }
  } catch (error) {
    logger.error('Auth middleware error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error.'
    });
  }
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        logger.info(`User ${decoded.id} authenticated (optional) for ${req.method} ${req.originalUrl}`);
      } catch (error) {
        logger.warn(`Invalid token in optional auth: ${error.message}`);
        // Don't fail, just continue without user
      }
    }
    
    next();
  } catch (error) {
    logger.error('Optional auth middleware error:', error);
    next();
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. Authentication required.'
      });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(`User ${req.user.id} attempted to access restricted resource with role ${req.user.role}`);
      
      return res.status(403).json({
        success: false,
        error: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

module.exports = {
  authMiddleware,
  optionalAuthMiddleware,
  authorize
};
