import express, { Router, Request, Response } from 'express';

const router: Router = express.Router();

// Analytics endpoint
router.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Analytics service',
    status: 'operational'
  });
});

export default router;
