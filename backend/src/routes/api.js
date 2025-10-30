import express from 'express';

// Import all route modules
import authRoutes from './auth.js';
import emailRoutes from './email.js';
import userRoutes from './users.js';
import adminRoutes from './admin.js';
import paymentRoutes from './payments.js';
import productRoutes from './products.js';
import freightRoutes from './freights.js';
import dashboardRoutes from './dashboard.js';
import userDashboardRoutes from './userDashboard.js';
import messagingRoutes from './messaging.js';
import notificationRoutes from './notifications.js';
import cryptoRoutes from './crypto.js';
import weatherRoutes from './weather.js';
import externalApiRoutes from './external-apis.js';
import mirrorApiRoutes from './mirror-apis.js';
import healthCheckRoutes from './health-check.js';
import validationRoutes from './validation.js';
import uploadRoutes from './upload.js';
import contactRoutes from './contact.js';
import newsRoutes from './news.js';
import plansRoutes from './plans.js';
import privacyRoutes from './privacy.js';
import partnersRoutes from './partners.js';
import transactionsRoutes from './transactions.js';
import nftsRoutes from './nfts.js';
import stakingRoutes from './staking.js';
import escrowRoutes from './escrow.js';
import gamificationRoutes from './gamification.js';
import analyticsRoutes from './analytics.js';
import auditLogsRoutes from './auditLogs.js';
import clientsRoutes from './clients.js';
import conversationsRoutes from './conversations.js';
import freightOrdersRoutes from './freightOrders.js';
import geolocationRoutes from './geolocation.js';
import marketplaceRoutes from './marketplace.js';
import messagesRoutes from './messages.js';
import partnershipMessagesRoutes from './partnership-messages.js';
import paymentVerificationRoutes from './payment-verification.js';
import registrationRoutes from './registration.js';
import secureURLsRoutes from './secureURLs.js';
import visibilityRoutes from './visibility.js';
import dataAccessRoutes from './data-access.js';
import addressValidationRoutes from './addressValidation.js';
import chatRoutes from './chat.js';
import aiRoutes from './ai.js';

const router = express.Router();

// Health check routes
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'AGROISYNC API',
    version: '2.3.1'
  });
});

// Health check detalhado
router.use('/health-check', healthCheckRoutes);

// Mount all route modules
router.use('/auth', authRoutes);
router.use('/email', emailRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/payments', paymentRoutes);
// Endpoint /products/my ANTES de /products para evitar conflito de rota
router.get('/products/my', auth, async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) return res.status(401).json({ success: false, error: 'Não autenticado' });
    
    const sql = `SELECT * FROM products WHERE seller_id = ? ORDER BY created_at DESC LIMIT 100`;
    const result = await req.env.DB.prepare(sql).bind(userId).all();
    res.json({ success: true, products: result.results || [], count: (result.results || []).length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint /freights/my ANTES de /freights
router.get('/freights/my', auth, async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id;
    if (!userId) return res.status(401).json({ success: false, error: 'Não autenticado' });
    
    const sql = `SELECT * FROM freights WHERE user_id = ? ORDER BY created_at DESC LIMIT 100`;
    const result = await req.env.DB.prepare(sql).bind(userId).all();
    res.json({ success: true, data: result.results || [], count: (result.results || []).length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.use('/products', productRoutes);
router.use('/freights', freightRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/user-dashboard', userDashboardRoutes);
router.use('/messaging', messagingRoutes);
router.use('/notifications', notificationRoutes);
router.use('/crypto', cryptoRoutes);
router.use('/weather', weatherRoutes);
router.use('/external', externalApiRoutes);
router.use('/mirror', mirrorApiRoutes);
router.use('/validation', validationRoutes);
router.use('/upload', uploadRoutes);
router.use('/contact', contactRoutes);
router.use('/news', newsRoutes);
router.use('/plans', plansRoutes);
router.use('/privacy', privacyRoutes);
router.use('/partners', partnersRoutes);
router.use('/transactions', transactionsRoutes);
router.use('/nfts', nftsRoutes);
router.use('/staking', stakingRoutes);
router.use('/escrow', escrowRoutes);
router.use('/gamification', gamificationRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/audit-logs', auditLogsRoutes);
router.use('/clients', clientsRoutes);
router.use('/conversations', conversationsRoutes);
router.use('/freight-orders', freightOrdersRoutes);
router.use('/geolocation', geolocationRoutes);
router.use('/marketplace', marketplaceRoutes);
router.use('/messages', messagesRoutes);
router.use('/partnership-messages', partnershipMessagesRoutes);
router.use('/payment-verification', paymentVerificationRoutes);
router.use('/registration', registrationRoutes);
router.use('/secure-urls', secureURLsRoutes);
router.use('/visibility', visibilityRoutes);
router.use('/data-access', dataAccessRoutes);
router.use('/address-validation', addressValidationRoutes);
router.use('/chat', chatRoutes);
router.use('/ai', aiRoutes);

// 404 handler for API routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

export default router;
