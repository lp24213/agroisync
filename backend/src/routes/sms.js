import express from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import logger from '../utils/logger.js';
import notificationService from '../services/notificationService.js';

const router = express.Router();

// Rate limiting para SMS
const smsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 3, // máximo 3 tentativas por IP
  message: {
    success: false,
    message: 'Muitas tentativas de SMS. Tente novamente em 15 minutos.'
  }
});

/**
 * @swagger
 * /api/sms/send-code:
 *   post:
 *     summary: Enviar código de verificação SMS
 *     tags: [SMS]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                 type: string
 *                 description: Número de telefone com código do país
 *                 example: "+5511999999999"
 *     responses:
 *       200:
 *         description: Código enviado com sucesso
 *       400:
 *         description: Dados inválidos
 *       429:
 *         description: Muitas tentativas
 *       500:
 *         description: Erro interno do servidor
 */
router.post(
  '/send-code',
  smsLimiter,
  [
    body('phone')
      .isMobilePhone('any')
      .withMessage('Número de telefone inválido')
      .custom(value => {
        if (!value.startsWith('+')) {
          throw new Error('Número deve incluir código do país (ex: +55)');
        }
        return true;
      })
  ],
  async (req, res) => {
    try {
      // Validar dados
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
      }

      const { phone } = req.body;

      // Gerar código de 6 dígitos
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Enviar SMS via notificationService
      const smsResult = await notificationService.sendOTPSMS(phone, verificationCode, 'Usuário');

      if (!smsResult.success) {
        logger.error(`Erro ao enviar SMS para ${phone}:`, smsResult.error);
        return res.status(500).json({
          success: false,
          message: 'Erro ao enviar SMS',
          error: smsResult.error
        });
      }

      logger.info(`SMS enviado para ${phone}. MessageId: ${smsResult.messageId}`);

      // Salvar código no banco para validação posterior
      // Aqui você pode salvar o código em uma tabela temporária ou no usuário

      res.status(200).json({
        success: true,
        message: 'Código de verificação enviado com sucesso',
        data: {
          phone,
          expiresIn: 300, // 5 minutos
          messageId: smsResult.messageId
        }
      });
    } catch (error) {
      logger.error('Erro ao enviar SMS:', error);

      // Tratar erros específicos do Twilio
      if (error.code === 21211) {
        return res.status(400).json({
          success: false,
          message: 'Número de telefone inválido'
        });
      }

      if (error.code === 21614) {
        return res.status(400).json({
          success: false,
          message: 'Número de telefone não suporta SMS'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

/**
 * @swagger
 * /api/sms/verify-code:
 *   post:
 *     summary: Verificar código SMS
 *     tags: [SMS]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - code
 *             properties:
 *               phone:
 *                 type: string
 *                 description: Número de telefone
 *               code:
 *                 type: string
 *                 description: Código de verificação
 *     responses:
 *       200:
 *         description: Código verificado com sucesso
 *       400:
 *         description: Código inválido ou expirado
 */
router.post(
  '/verify-code',
  [
    body('phone').isMobilePhone('any').withMessage('Número de telefone inválido'),
    body('code').isLength({ min: 6, max: 6 }).withMessage('Código deve ter 6 dígitos')
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
      }

      const { phone, code } = req.body;

      // Aqui você implementaria a lógica de verificação do código
      // Por enquanto, vamos simular uma verificação básica
      // Em produção, você salvaria o código no banco e verificaria aqui

      // Simulação: aceitar qualquer código de 6 dígitos para teste
      if (code.length === 6 && /^\d+$/.test(code)) {
        logger.info(`Código verificado para ${phone}: ${code}`);

        res.status(200).json({
          success: true,
          message: 'Código verificado com sucesso',
          data: {
            phone,
            verified: true
          }
        });
      } else {
        res.status(400).json({
          success: false,
          message: 'Código inválido'
        });
      }
    } catch (error) {
      logger.error('Erro ao verificar código SMS:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
);

/**
 * @swagger
 * /api/sms/test:
 *   post:
 *     summary: Testar integração Twilio
 *     tags: [SMS]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "+18777804236"
 *     responses:
 *       200:
 *         description: SMS de teste enviado
 */
router.post('/test', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Número de telefone é obrigatório'
      });
    }

    // Enviar SMS de teste via notificationService
    const smsResult = await notificationService.sendSMS(
      phone,
      'Teste de integração AgroSync funcionando! 🚀'
    );

    if (!smsResult.success) {
      logger.error(`Erro ao enviar SMS de teste para ${phone}:`, smsResult.error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao enviar SMS de teste',
        error: smsResult.error
      });
    }

    logger.info(`SMS de teste enviado para ${phone}. MessageId: ${smsResult.messageId}`);

    res.status(200).json({
      success: true,
      message: 'SMS de teste enviado com sucesso',
      data: {
        phone,
        messageId: smsResult.messageId
      }
    });
  } catch (error) {
    logger.error('Erro no teste SMS:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao enviar SMS de teste',
      error: error.message
    });
  }
});

export default router;
