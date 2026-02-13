import express from 'express';
import { body, validationResult } from 'express-validator';
import secureURLService from '../services/secureURLService.js';
import { authenticateToken } from '../middleware/auth.js';
import logger from '../utils/logger.js';

const router = express.Router();

/**
 * @swagger
 * /api/secure-urls/generate:
 *   post:
 *     summary: Gerar URL segura para cadastro
 *     tags: [Secure URLs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [signup-store, signup-freight, signup-product]
 *               metadata:
 *                 type: object
 *                 description: Dados adicionais para o cadastro
 *     responses:
 *       200:
 *         description: URL segura gerada com sucesso
 *       401:
 *         description: NÃ£o autorizado
 */
router.post('/generate', authenticateToken, (req, res) => {
  try {
    const { type, metadata = {} } = req.body;

    if (!type || !['signup-store', 'signup-freight', 'signup-product'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de cadastro invÃ¡lido'
      });
    }

    const secureURL = secureURLService.generateSecureURL(type, {
      ...metadata,
      generatedBy: req.user.userId,
      generatedAt: new Date().toISOString()
    });

    logger.info(`URL segura gerada por ${req.user.email} para ${type}`);

    res.status(200).json({
      success: true,
      message: 'URL segura gerada com sucesso',
      data: {
        url: secureURL,
        type,
        expiresIn: '24h'
      }
    });
  } catch (error) {
    logger.error('Erro ao gerar URL segura:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/secure-urls/invite:
 *   post:
 *     summary: Gerar URL de convite
 *     tags: [Secure URLs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [signup-store, signup-freight, signup-product]
 *     responses:
 *       200:
 *         description: URL de convite gerada com sucesso
 *       401:
 *         description: NÃ£o autorizado
 */
router.post('/invite', authenticateToken, (req, res) => {
  try {
    const { type } = req.body;

    if (!type || !['signup-store', 'signup-freight', 'signup-product'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de cadastro invÃ¡lido'
      });
    }

    const inviteURL = secureURLService.generateInviteURL(req.user.userId, type);

    logger.info(`URL de convite gerada por ${req.user.email} para ${type}`);

    res.status(200).json({
      success: true,
      message: 'URL de convite gerada com sucesso',
      data: {
        url: inviteURL,
        type,
        expiresIn: '7d'
      }
    });
  } catch (error) {
    logger.error('Erro ao gerar URL de convite:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

/**
 * @swagger
 * /api/secure-urls/verify/{token}:
 *   get:
 *     summary: Verificar token de URL segura
 *     tags: [Secure URLs]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token da URL segura
 *     responses:
 *       200:
 *         description: Token vÃ¡lido
 *       400:
 *         description: Token invÃ¡lido ou expirado
 */
router.get('/verify/:token', (req, res) => {
  try {
    const { token } = req.params;

    const decoded = secureURLService.verifySecureToken(token);

    res.status(200).json({
      success: true,
      message: 'Token vÃ¡lido',
      data: {
        type: decoded.type,
        metadata: decoded.metadata,
        expiresAt: new Date(decoded.exp * 1000).toISOString()
      }
    });
  } catch (error) {
    logger.error('Erro ao verificar token:', error);
    res.status(400).json({
      success: false,
      message: 'Token invÃ¡lido ou expirado'
    });
  }
});

/**
 * @swagger
 * /api/secure-urls/verify-invite/{inviteCode}:
 *   get:
 *     summary: Verificar cÃ³digo de convite
 *     tags: [Secure URLs]
 *     parameters:
 *       - in: path
 *         name: inviteCode
 *         required: true
 *         schema:
 *           type: string
 *         description: CÃ³digo de convite
 *     responses:
 *       200:
 *         description: CÃ³digo de convite vÃ¡lido
 *       400:
 *         description: CÃ³digo de convite invÃ¡lido ou expirado
 */
router.get('/verify-invite/:inviteCode', (req, res) => {
  try {
    const { inviteCode } = req.params;

    const decoded = secureURLService.verifyInviteCode(inviteCode);

    res.status(200).json({
      success: true,
      message: 'CÃ³digo de convite vÃ¡lido',
      data: {
        referrerId: decoded.referrerId,
        type: decoded.type,
        expiresAt: new Date(decoded.exp * 1000).toISOString()
      }
    });
  } catch (error) {
    logger.error('Erro ao verificar cÃ³digo de convite:', error);
    res.status(400).json({
      success: false,
      message: 'CÃ³digo de convite invÃ¡lido ou expirado'
    });
  }
});

/**
 * @swagger
 * /api/secure-urls/validate:
 *   post:
 *     summary: Valida uma URL segura e extrai os dados
 *     tags: [Secure URLs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token da URL segura
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: URL segura validada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "URL segura validada com sucesso" }
 *                 data: { type: object, description: "Dados extraÃ­dos da URL" }
 *       400:
 *         description: Token invÃ¡lido ou expirado
 *       500:
 *         description: Erro interno do servidor
 */
router.post(
  '/validate',
  [body('token').isString().withMessage('Token Ã© obrigatÃ³rio')],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, message: 'Token invÃ¡lido', errors: errors.array() });
    }

    const { token } = req.body;

    try {
      const data = secureURLService.validateSecureURL(
        `${process.env.FRONTEND_URL}/signup/${token}`
      );
      logger.info(`URL segura validada: ${token.substring(0, 20)}...`);
      res.status(200).json({ success: true, message: 'URL segura validada com sucesso', data });
    } catch (error) {
      logger.error('Erro ao validar URL segura:', error);
      res.status(400).json({ success: false, message: 'Token invÃ¡lido ou expirado.' });
    }
  }
);

export default router;
