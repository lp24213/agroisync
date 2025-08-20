import express, { Router, Request, Response } from 'express';

const router: Router = express.Router();

// Contact endpoint
router.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Contact service',
    status: 'operational'
  });
});

export default router;
