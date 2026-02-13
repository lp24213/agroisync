import express from 'express';

const router = express.Router();

// Analytics endpoint
router.get('/', (_req, res) => {
  res.json({
    message: 'Analytics service',
    status: 'operational'
  });
});

export default router;
