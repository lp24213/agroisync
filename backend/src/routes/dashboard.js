import express from 'express';
// const { body, param } = require('express-validator');
// const { logger } = require('../utils/logger');
// const { authMiddleware } = require('../middleware/auth');
// const { checkValidation } = require('../middleware/validation');

const router = express.Router();

// Dashboard endpoint
router.get('/', (_req, res) => {
  res.json({
    message: 'Dashboard service',
    status: 'operational'
  });
});

export default router;
