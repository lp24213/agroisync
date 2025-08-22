import express, { Router, Request, Response } from 'express';

const router: Router = express.Router();

// Marketplace endpoint
router.get('/', (_req: Request, res: Response) => {
    res.json({
    message: 'Marketplace service',
    status: 'operational'
  });
});

export default router;
