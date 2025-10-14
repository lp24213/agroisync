import express from 'express';

const router = express.Router();

//  endpoint
router.get('/', (_req, res) => {
  res.json({
    message: ' service',
    status: 'operational'
  });
});

export default router;
