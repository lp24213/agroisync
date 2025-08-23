import express, { Router, Request, Response } from 'express';
// const { body, param } = require('express-validator');
// const { logger } = require('../utils/logger');
// const { authMiddleware } = require('../middleware/auth');
// const { checkValidation } = require('../middleware/validation');

const router: Router = express.Router();

// Dashboard endpoint
router.get('/', (_req: Request, res: Response) => {
    res.json({
    message: 'Dashboard service',
    status: 'operational'
  });
});

export default router;
