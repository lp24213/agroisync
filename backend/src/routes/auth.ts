import express, { Router, Request, Response } from 'express';

const router: Router = express.Router();

// Auth endpoint
router.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Authentication service',
    status: 'operational'
  });
});

export default router;
