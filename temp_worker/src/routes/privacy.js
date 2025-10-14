import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  exportUserData,
  deleteUserData,
  getPrivacyStatus,
  updatePrivacyPreferences,
  recordGDPRConsent
} from '../middleware/privacyMiddleware.js';
import {
  auditDataExport,
  auditDataDeletion,
  auditUserAction
} from '../middleware/auditMiddleware.js';
import { createAuditLog } from '../utils/securityLogger.js';
import logger from '../utils/logger.js';

const router = express.Router();

// ===== ROTAS DE PRIVACIDADE LGPD =====

/**
 * @route   GET /api/privacy/status
 * @desc    Obter status de privacidade do usuÃ¡rio
 * @access  Private
 */
router.get('/status', authenticateToken, getPrivacyStatus);

/**
 * @route   POST /api/privacy/consent
 * @desc    Registrar consentimento LGPD
 * @access  Private
 */
router.post(
  '/consent',
  authenticateToken,
  auditUserAction('GDPR_CONSENT', 'user_privacy'),
  recordGDPRConsent
);

/**
 * @route   POST /api/privacy/preferences
 * @desc    Atualizar preferÃªncias de privacidade
 * @access  Private
 */
router.post('/preferences', authenticateToken, updatePrivacyPreferences);

/**
 * @route   GET /api/privacy/export
 * @desc    Exportar dados do usuÃ¡rio (Direito de Portabilidade)
 * @access  Private
 */
router.get('/export', authenticateToken, auditDataExport('user_data'), exportUserData);

/**
 * @route   DELETE /api/privacy/data
 * @desc    Excluir dados do usuÃ¡rio (Direito ao Esquecimento)
 * @access  Private
 */
router.delete('/data', authenticateToken, auditDataDeletion('user_data'), deleteUserData);

/**
 * @route   GET /api/privacy/terms
 * @desc    Obter termos de uso e polÃ­tica de privacidade
 * @access  Public
 */
router.get('/terms', (req, res) => {
  res.json({
    success: true,
    terms: {
      lastUpdated: '2024-12-19',
      version: '2.0',
      sections: {
        dataCollection: {
          title: 'Coleta de Dados',
          description: 'Coletamos apenas os dados necessÃ¡rios para o funcionamento da plataforma',
          dataTypes: [
            'InformaÃ§Ãµes de perfil (nome, email, telefone)',
            'Dados de localizaÃ§Ã£o para geolocalizaÃ§Ã£o',
            'HistÃ³rico de transaÃ§Ãµes',
            'Dados de comunicaÃ§Ã£o entre usuÃ¡rios'
          ]
        },
        dataUsage: {
          title: 'Uso dos Dados',
          description: 'Seus dados sÃ£o utilizados exclusivamente para:',
          purposes: [
            'Fornecer serviÃ§os da plataforma',
            'Processar transaÃ§Ãµes e pagamentos',
            'Enviar notificaÃ§Ãµes importantes',
            'Melhorar a experiÃªncia do usuÃ¡rio'
          ]
        },
        dataSharing: {
          title: 'Compartilhamento de Dados',
          description: 'NÃ£o compartilhamos seus dados com terceiros, exceto:',
          exceptions: [
            'Quando exigido por lei',
            'Para processamento de pagamentos (Stripe)',
            'Com seu consentimento explÃ­cito'
          ]
        },
        userRights: {
          title: 'Seus Direitos',
          description: 'VocÃª tem os seguintes direitos:',
          rights: [
            'Acesso aos seus dados',
            'Portabilidade dos dados',
            'CorreÃ§Ã£o de dados incorretos',
            'ExclusÃ£o de dados',
            'RestriÃ§Ã£o do processamento',
            'OposiÃ§Ã£o ao processamento'
          ]
        },
        dataRetention: {
          title: 'RetenÃ§Ã£o de Dados',
          description: 'Mantemos seus dados por:',
          periods: [
            'Dados de perfil: enquanto a conta estiver ativa',
            'Dados de transaÃ§Ã£o: 7 anos (requisito legal)',
            'Logs de seguranÃ§a: 90 dias',
            'Dados de comunicaÃ§Ã£o: atÃ© exclusÃ£o solicitada'
          ]
        },
        security: {
          title: 'SeguranÃ§a dos Dados',
          description: 'Implementamos medidas de seguranÃ§a:',
          measures: [
            'Criptografia em trÃ¢nsito e em repouso',
            'Controle de acesso baseado em roles',
            'Monitoramento contÃ­nuo de seguranÃ§a',
            'Backups regulares e seguros'
          ]
        }
      }
    }
  });
});

/**
 * @route   GET /api/privacy/cookies
 * @desc    Obter polÃ­tica de cookies
 * @access  Public
 */
router.get('/cookies', (req, res) => {
  res.json({
    success: true,
    cookies: {
      lastUpdated: '2024-12-19',
      types: {
        essential: {
          name: 'Cookies Essenciais',
          description: 'NecessÃ¡rios para o funcionamento da plataforma',
          examples: ['SessÃ£o de usuÃ¡rio', 'PreferÃªncias de idioma', 'Token de autenticaÃ§Ã£o'],
          duration: 'SessÃ£o ou 1 ano'
        },
        analytics: {
          name: 'Cookies AnalÃ­ticos',
          description: 'Ajudam a entender como a plataforma Ã© utilizada',
          examples: ['Google Analytics', 'EstatÃ­sticas de uso', 'MÃ©tricas de performance'],
          duration: '2 anos',
          optional: true
        },
        marketing: {
          name: 'Cookies de Marketing',
          description: 'Utilizados para publicidade personalizada',
          examples: ['AnÃºncios direcionados', 'Redes sociais', 'Parceiros de marketing'],
          duration: '1 ano',
          optional: true
        }
      },
      management: {
        browser: 'Configure as preferÃªncias de cookies no seu navegador',
        platform: 'Utilize o painel de privacidade da plataforma',
        optOut: 'Entre em contato para solicitar exclusÃ£o'
      }
    }
  });
});

/**
 * @route   GET /api/privacy/contact
 * @desc    Obter informaÃ§Ãµes de contato para questÃµes de privacidade
 * @access  Public
 */
router.get('/contact', (req, res) => {
  res.json({
    success: true,
    contact: {
      dpo: {
        name: 'Data Protection Officer',
        email: 'dpo@agroisync.com',
        phone: '+55 11 99999-9999'
      },
      privacy: {
        email: 'privacy@agroisync.com',
        address: 'Rua da Privacidade, 123 - SÃ£o Paulo, SP',
        responseTime: '72 horas Ãºteis'
      },
      legal: {
        email: 'legal@agroisync.com',
        phone: '+55 11 88888-8888'
      }
    }
  });
});

/**
 * @route   POST /api/privacy/request
 * @desc    Solicitar aÃ§Ã£o relacionada Ã  privacidade
 * @access  Private
 */
router.post('/request', authenticateToken, async (req, res) => {
  try {
    const { requestType, description, urgency } = req.body;

    if (!requestType || !description) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de solicitaÃ§Ã£o e descriÃ§Ã£o sÃ£o obrigatÃ³rios'
      });
    }

    const validRequestTypes = [
      'data_access',
      'data_correction',
      'data_deletion',
      'processing_restriction',
      'data_portability',
      'consent_withdrawal',
      'complaint'
    ];

    if (!validRequestTypes.includes(requestType)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de solicitaÃ§Ã£o invÃ¡lido'
      });
    }

    // Aqui vocÃª pode implementar a lÃ³gica para criar um ticket
    // ou enviar email para o DPO
    const request = {
      id: `PRIV-${Date.now()}`,
      userId: req.user.userId,
      type: requestType,
      description,
      urgency: urgency || 'normal',
      status: 'pending',
      createdAt: new Date(),
      estimatedResponse: '72 horas Ãºteis'
    };

    // Log da solicitaÃ§Ã£o
    await createAuditLog('PRIVACY_REQUEST_CREATED', 'user_privacy', req, req.user.userId, {
      requestType,
      description,
      urgency,
      requestId: request.id
    });

    res.json({
      success: true,
      message: 'SolicitaÃ§Ã£o de privacidade criada com sucesso',
      request
    });
  } catch (error) {
    logger.error('Erro ao criar solicitaÃ§Ã£o de privacidade:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao criar solicitaÃ§Ã£o'
    });
  }
});

export default router;
