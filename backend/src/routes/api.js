import express from 'express';
import { apiLimiter } from '../middleware/rateLimiter.js';

// Import route modules
import authRoutes from './auth.js';
import adminRoutes from './admin.js';
import clientRoutes from './clients.js';
import productRoutes from './products.js';
import freightRoutes from './freights.js';
import transactionRoutes from './transactions.js';
import externalAPIRoutes from './external-apis.js';
import messagingRoutes from './messaging.js';
import messageRoutes from './messages.js';
import newsRoutes from './news.js';
import paymentRoutes from './payments.js';
import partnerRoutes from './partners.js';
import partnershipMessageRoutes from './partnership-messages.js';
import contactRoutes from './contact.js';
import userRoutes from './users.js';
import notificationRoutes from './notifications.js';
import escrowRoutes from './escrow.js';

const router = express.Router();

// Apply rate limiting to all API routes
router.use(apiLimiter);

// ===== API VERSIONING =====
// All routes are prefixed with /v1 for future versioning

// ===== AUTHENTICATION ROUTES =====
router.use('/v1/auth', authRoutes);

// ===== ADMIN ROUTES =====
router.use('/v1/admin', adminRoutes);

// ===== CLIENT ROUTES =====
router.use('/v1/clients', clientRoutes);

// ===== PRODUCT ROUTES =====
router.use('/v1/products', productRoutes);

// ===== EXTERNAL API ROUTES =====
router.use('/v1/external', externalAPIRoutes);

// ===== FREIGHT ROUTES =====
router.use('/v1/freights', freightRoutes);

// ===== TRANSACTION ROUTES =====
router.use('/v1/transactions', transactionRoutes);

// ===== MESSAGING ROUTES =====
router.use('/v1/messaging', messagingRoutes);

// ===== MESSAGE ROUTES =====
router.use('/v1/messages', messageRoutes);

// ===== NEWS ROUTES =====
router.use('/v1/news', newsRoutes);

// ===== PAYMENT ROUTES =====
router.use('/v1/payments', paymentRoutes);

// ===== PARTNER ROUTES =====
router.use('/v1/partners', partnerRoutes);

// ===== PARTNERSHIP MESSAGE ROUTES =====
router.use('/v1/partnership-messages', partnershipMessageRoutes);

// ===== CONTACT ROUTES =====
router.use('/v1/contact', contactRoutes);

// ===== USER ROUTES =====
router.use('/v1/users', userRoutes);

// ===== NOTIFICATION ROUTES =====
router.use('/v1/notifications', notificationRoutes);

// ===== ESCROW ROUTES =====
router.use('/v1/escrow', escrowRoutes);

// ===== API INFO ENDPOINT =====
router.get('/v1', (req, res) => {
  res.json({
    success: true,
    message: 'AGROTM API v1.0.0',
    version: '1.0.0',
    endpoints: {
      auth: {
        base: '/v1/auth',
        routes: [
          'POST /register - User registration',
          'POST /login - User login',
          'POST /logout - User logout',
          'POST /forgot-password - Password reset request',
          'POST /reset-password - Password reset',
          'GET /me - Get current user info',
          'POST /change-password - Change password'
        ]
      },
      admin: {
        base: '/v1/admin',
        routes: [
          'GET /dashboard - Admin dashboard statistics',
          'GET /users - List all users',
          'GET /users/:id - Get user details',
          'PUT /users/:id - Update user',
          'DELETE /users/:id - Delete user',
          'GET /contact-messages - Get contact messages',
          'GET /partnership-messages - Get partnership messages',
          'GET /private-messages - Get all private messages',
          'POST /partners - Create new partner'
        ]
      },
      products: {
        base: '/v1/products',
        routes: [
          'GET / - List products with filters',
          'GET /featured - Get featured products',
          'GET /categories - Get product categories',
          'GET /:id - Get product by ID',
          'POST / - Create new product (auth required)',
          'PUT /:id - Update product (auth required)',
          'DELETE /:id - Delete product (auth required)',
          'POST /:id/favorite - Add to favorites',
          'DELETE /:id/favorite - Remove from favorites',
          'GET /user/favorites - Get user favorites',
          'GET /user/own - Get user own products'
        ]
      },
      freights: {
        base: '/v1/freights',
        routes: [
          'GET / - List freights with filters',
          'GET /routes - Find freights by route',
          'GET /cargo-types - Get cargo types',
          'GET /:id - Get freight by ID',
          'POST / - Create new freight (auth required)',
          'PUT /:id - Update freight (auth required)',
          'DELETE /:id - Delete freight (auth required)',
          'POST /:id/inquiry - Send freight inquiry',
          'PUT /:id/inquiry/:inquiryId - Respond to inquiry',
          'GET /user/own - Get user own freights'
        ]
      },
      transactions: {
        base: '/v1/transactions',
        routes: [
          'POST / - Create new transaction (auth required)',
          'GET / - List user transactions',
          'GET /:id - Get transaction by ID',
          'PATCH /:id/status - Update transaction status',
          'GET /:id/messages - Get transaction messages',
          'POST /:id/messages - Send message to transaction',
          'GET /stats - Get transaction statistics',
          'GET /admin/all - List all transactions (admin only)',
          'PATCH /admin/:id/status - Update status as admin'
        ]
      },
      messaging: {
        base: '/v1/messaging',
        routes: [
          'GET /conversations - Get user conversations',
          'GET /conversations/:userId - Get conversation with user',
          'POST /messages - Send private message',
          'GET /messages/:id - Get message details',
          'PUT /messages/:id/read - Mark message as read',
          'PUT /messages/:id/reply - Reply to message',
          'DELETE /messages/:id - Delete message',
          'GET /unread - Get unread messages count'
        ]
      },
      messages: {
        base: '/v1/messages',
        routes: [
          'GET / - List user conversations',
          'GET /:id - Get conversation with specific user',
          'POST / - Send private message',
          'PUT /:id/read - Mark message as read',
          'PUT /:id/reply - Reply to message',
          'DELETE /:id - Delete message',
          'GET /unread/count - Get unread messages count',
          'GET /search - Search messages by content'
        ]
      },
      news: {
        base: '/v1/news',
        routes: [
          'GET / - Get latest news',
          'GET /categories - Get news categories',
          'GET /:id - Get news article by ID',
          'GET /rss/agribusiness - Get agribusiness RSS feed'
        ]
      },
      payments: {
        base: '/v1/payments',
        routes: [
          'GET /plans - Get subscription plans',
          'POST /stripe/create-payment-intent - Create Stripe payment',
          'POST /stripe/confirm - Confirm Stripe payment',
          'POST /metamask/process - Process Metamask payment',
          'GET /history - Get payment history',
          'GET /subscriptions - Get user subscriptions'
        ]
      },
      partners: {
        base: '/v1/partners',
        routes: [
          'GET / - List all partners',
          'GET /featured - Get featured partners',
          'GET /categories - Get partner categories',
          'GET /:id - Get partner details',
          'POST / - Create partner (admin only)',
          'PUT /:id - Update partner (admin only)',
          'DELETE /:id - Delete partner (admin only)'
        ]
      },
      contact: {
        base: '/v1/contact',
        routes: ['POST / - Send contact message', 'POST /partnership - Send partnership inquiry']
      },
      users: {
        base: '/v1/users',
        routes: [
          'GET /profile - Get user profile',
          'PUT /profile - Update user profile',
          'GET /subscriptions - Get user subscriptions',
          'PUT /subscriptions - Update subscription preferences'
        ]
      },
      notifications: {
        base: '/v1/notifications',
        routes: [
          'GET / - List user notifications',
          'GET /unread/count - Get unread count',
          'GET /:id - Get notification by ID',
          'PATCH /:id/read - Mark as read',
          'PATCH /:id/archive - Archive notification',
          'PATCH /read-all - Mark all as read',
          'DELETE /:id - Delete notification',
          'DELETE /clear-read - Clear read notifications',
          'GET /stats/overview - Get notification stats',
          'GET /admin/all - List all notifications (admin)',
          'POST /admin/send - Send manual notification (admin)',
          'GET /admin/stats - Get general stats (admin)',
          'POST /admin/cleanup - Manual cleanup (admin)'
        ]
      },
      escrow: {
        base: '/v1/escrow',
        routes: [
          'GET / - List user escrow transactions',
          'GET /:id - Get escrow transaction by ID',
          'POST / - Create new escrow transaction',
          'PATCH /:id/fund - Mark as funded',
          'PATCH /:id/deliver - Mark as delivered',
          'PATCH /:id/confirm - Confirm receipt',
          'PATCH /:id/release - Release funds to seller',
          'PATCH /:id/refund - Request refund',
          'POST /:id/dispute - Create dispute',
          'PATCH /:id/dispute/:disputeId/resolve - Resolve dispute (admin)',
          'GET /stats/overview - Get escrow stats',
          'GET /admin/all - List all escrow transactions (admin)',
          'POST /admin/auto-release - Process auto-releases (admin)',
          'GET /admin/stats - Get general escrow stats (admin)'
        ]
      }
    },
    documentation: 'API documentation available at /docs (when implemented)',
    support: 'For support, contact: luispaulodeoliveira@agrotm.com.br'
  });
});

// ===== 404 FOR API ROUTES =====
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint não encontrado',
    requestedUrl: req.originalUrl,
    availableVersions: ['v1'],
    suggestion: 'Use /v1 to access the current API version'
  });
});

export default router;
