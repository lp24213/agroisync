import express, { Router, Request, Response } from 'express';

const router: Router = express.Router();

//  endpoint
router.get('/', (_req: Request, res: Response) => {
  res.json({
    message: ' service',
    status: 'operational'
  });
});

export default router;
