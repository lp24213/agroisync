import express from 'express';

const router = express.Router();

// Marketplace endpoint
router.get('/', (_req, res) => {
  res.json({
    message: 'Marketplace service',
    status: 'operational'
  });
});

export default router;
