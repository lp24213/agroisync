import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  exportUserData,
  deleteUserData,
  getPrivacyStatus,
  updatePrivacyPreferences,
  recordGDPRConsent
} from '../middleware/privacyMiddleware.js';
import { auditDataExport, auditDataDeletion, auditUserAction } from '../middleware/auditMiddleware.js';

const router = express.Router();

// ===== ROTAS DE PRIVACIDADE LGPD =====

/**
 * @route   GET /api/privacy/status
 * @desc    Obter status de privacidade do usuário
 * @access  Private
 */
router.get('/status', authenticateToken, getPrivacyStatus);

/**
 * @route   POST /api/privacy/consent
 * @desc    Registrar consentimento LGPD
 * @access  Private
 */
router.post('/consent', authenticateToken, auditUserAction('GDPR_CONSENT', 'user_privacy'), recordGDPRConsent);

/**
 * @route   POST /api/privacy/preferences
 * @desc    Atualizar preferências de privacidade
 * @access  Private
 */
router.post('/preferences', authenticateToken, updatePrivacyPreferences);

/**
 * @route   GET /api/privacy/export
 * @desc    Exportar dados do usuário (Direito de Portabilidade)
 * @access  Private
 */
router.get('/export', authenticateToken, auditDataExport('user_data'), exportUserData);

/**
 * @route   DELETE /api/privacy/data
 * @desc    Excluir dados do usuário (Direito ao Esquecimento)
 * @access  Private
 */
router.delete('/data', authenticateToken, auditDataDeletion('user_data'), deleteUserData);

/**
 * @route   GET /api/privacy/terms
 * @desc    Obter termos de uso e política de privacidade
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
          description: 'Coletamos apenas os dados necessários para o funcionamento da plataforma',
          dataTypes: [
            'Informações de perfil (nome, email, telefone)',
            'Dados de localização para geolocalização',
            'Histórico de transações',
            'Dados de comunicação entre usuários'
          ]
        },
        dataUsage: {
          title: 'Uso dos Dados',
          description: 'Seus dados são utilizados exclusivamente para:',
          purposes: [
            'Fornecer serviços da plataforma',
            'Processar transações e pagamentos',
            'Enviar notificações importantes',
            'Melhorar a experiência do usuário'
          ]
        },
        dataSharing: {
          title: 'Compartilhamento de Dados',
          description: 'Não compartilhamos seus dados com terceiros, exceto:',
          exceptions: [
            'Quando exigido por lei',
            'Para processamento de pagamentos (Stripe)',
            'Com seu consentimento explícito'
          ]
        },
        userRights: {
          title: 'Seus Direitos',
          description: 'Você tem os seguintes direitos:',
          rights: [
            'Acesso aos seus dados',
            'Portabilidade dos dados',
            'Correção de dados incorretos',
            'Exclusão de dados',
            'Restrição do processamento',
            'Oposição ao processamento'
          ]
        },
        dataRetention: {
          title: 'Retenção de Dados',
          description: 'Mantemos seus dados por:',
          periods: [
            'Dados de perfil: enquanto a conta estiver ativa',
            'Dados de transação: 7 anos (requisito legal)',
            'Logs de segurança: 90 dias',
            'Dados de comunicação: até exclusão solicitada'
          ]
        },
        security: {
          title: 'Segurança dos Dados',
          description: 'Implementamos medidas de segurança:',
          measures: [
            'Criptografia em trânsito e em repouso',
            'Controle de acesso baseado em roles',
            'Monitoramento contínuo de segurança',
            'Backups regulares e seguros'
          ]
        }
      }
    }
  });
});

/**
 * @route   GET /api/privacy/cookies
 * @desc    Obter política de cookies
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
          description: 'Necessários para o funcionamento da plataforma',
          examples: [
            'Sessão de usuário',
            'Preferências de idioma',
            'Token de autenticação'
          ],
          duration: 'Sessão ou 1 ano'
        },
        analytics: {
          name: 'Cookies Analíticos',
          description: 'Ajudam a entender como a plataforma é utilizada',
          examples: [
            'Google Analytics',
            'Estatísticas de uso',
            'Métricas de performance'
          ],
          duration: '2 anos',
          optional: true
        },
        marketing: {
          name: 'Cookies de Marketing',
          description: 'Utilizados para publicidade personalizada',
          examples: [
            'Anúncios direcionados',
            'Redes sociais',
            'Parceiros de marketing'
          ],
          duration: '1 ano',
          optional: true
        }
      },
      management: {
        browser: 'Configure as preferências de cookies no seu navegador',
        platform: 'Utilize o painel de privacidade da plataforma',
        optOut: 'Entre em contato para solicitar exclusão'
      }
    }
  });
});

/**
 * @route   GET /api/privacy/contact
 * @desc    Obter informações de contato para questões de privacidade
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
        address: 'Rua da Privacidade, 123 - São Paulo, SP',
        responseTime: '72 horas úteis'
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
 * @desc    Solicitar ação relacionada à privacidade
 * @access  Private
 */
router.post('/request', authenticateToken, async (req, res) => {
  try {
    const { requestType, description, urgency } = req.body;
    
    if (!requestType || !description) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de solicitação e descrição são obrigatórios'
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
        message: 'Tipo de solicitação inválido'
      });
    }

    // Aqui você pode implementar a lógica para criar um ticket
    // ou enviar email para o DPO
    const request = {
      id: `PRIV-${Date.now()}`,
      userId: req.user.userId,
      type: requestType,
      description,
      urgency: urgency || 'normal',
      status: 'pending',
      createdAt: new Date(),
      estimatedResponse: '72 horas úteis'
    };

    // Log da solicitação
    await createAuditLog(
      'PRIVACY_REQUEST_CREATED',
      'user_privacy',
      req,
      req.user.userId,
      {
        requestType,
        description,
        urgency,
        requestId: request.id
      }
    );

    res.json({
      success: true,
      message: 'Solicitação de privacidade criada com sucesso',
      request
    });

  } catch (error) {
    console.error('Erro ao criar solicitação de privacidade:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao criar solicitação'
    });
  }
});

export default router;
