import mongoose from 'mongoose';

// AuditLog schema para registrar todas as ações dos usuários
const auditLogSchema = new mongoose.Schema({
  // Usuário que executou a ação
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Email do usuário (para facilitar busca)
  userEmail: {
    type: String,
    required: true,
    index: true
  },

  // Tipo de ação
  action: {
    type: String,
    required: true,
    enum: [
      // Ações de autenticação
      'login', 'logout', 'register', 'password_change', 'password_reset',
      
      // Ações de mensageria
      'message_sent', 'message_read', 'conversation_created', 'conversation_archived',
      
      // Ações de produtos
      'product_created', 'product_updated', 'product_deleted', 'product_viewed',
      
      // Ações de fretes
      'freight_created', 'freight_updated', 'freight_deleted', 'freight_viewed',
      
      // Ações de pagamento
      'payment_initiated', 'payment_completed', 'payment_failed', 'subscription_activated',
      
      // Ações administrativas
      'admin_login', 'admin_action', 'user_banned', 'user_unbanned', 'content_moderated',
      
      // Ações de segurança
      'failed_login', 'suspicious_activity', 'rate_limit_exceeded', 'ip_blocked',
      
      // Ações gerais
      'profile_updated', 'settings_changed', 'data_exported', 'data_deleted'
    ],
    index: true
  },

  // Recurso afetado
  resource: {
    type: String,
    required: true,
    enum: [
      'user', 'message', 'conversation', 'product', 'freight', 
      'payment', 'subscription', 'admin', 'system', 'security'
    ]
  },

  // ID do recurso (se aplicável)
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true
  },

  // Tipo do recurso
  resourceType: {
    type: String,
    enum: ['User', 'Message', 'Conversation', 'Product', 'Freight', 'Payment', 'Subscription']
  },

  // Detalhes da ação
  details: {
    type: String,
    trim: true,
    maxlength: 1000
  },

  // Metadados da ação
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  // Informações de localização
  ip: {
    type: String,
    required: true,
    index: true
  },

  userAgent: {
    type: String,
    trim: true
  },

  country: String,
  city: String,
  region: String,

  // Informações de segurança
  isSuspicious: {
    type: Boolean,
    default: false,
    index: true
  },

  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },

  // Status da ação
  status: {
    type: String,
    enum: ['success', 'failed', 'pending', 'blocked'],
    default: 'success'
  },

  // Código de erro (se aplicável)
  errorCode: String,
  errorMessage: String,

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },

  // Expiração automática (opcional)
  expiresAt: {
    type: Date,
    index: { expireAfterSeconds: 0 }
  }
});

// Índices para performance e consultas
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ resource: 1, createdAt: -1 });
auditLogSchema.index({ ip: 1, createdAt: -1 });
auditLogSchema.index({ isSuspicious: 1, createdAt: -1 });

// Middleware para definir expiração (opcional - 1 ano)
auditLogSchema.pre('save', function(next) {
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 ano
  }
  next();
});

// Método estático para criar log de auditoria
auditLogSchema.statics.log = function(data) {
  return this.create({
    userId: data.userId,
    userEmail: data.userEmail,
    action: data.action,
    resource: data.resource,
    resourceId: data.resourceId,
    resourceType: data.resourceType,
    details: data.details,
    metadata: data.metadata || {},
    ip: data.ip,
    userAgent: data.userAgent,
    country: data.country,
    city: data.city,
    region: data.region,
    isSuspicious: data.isSuspicious || false,
    riskLevel: data.riskLevel || 'low',
    status: data.status || 'success',
    errorCode: data.errorCode,
    errorMessage: data.errorMessage
  });
};

// Método estático para buscar logs de um usuário
auditLogSchema.statics.findByUser = function(userId, options = {}) {
  const query = { userId: userId };
  
  if (options.action) query.action = options.action;
  if (options.resource) query.resource = options.resource;
  if (options.startDate) query.createdAt = { $gte: options.startDate };
  if (options.endDate) query.createdAt = { $lte: options.endDate };

  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(options.limit || 100)
    .skip(options.skip || 0);
};

// Método estático para buscar logs suspeitos
auditLogSchema.statics.findSuspicious = function(options = {}) {
  const query = { isSuspicious: true };
  
  if (options.riskLevel) query.riskLevel = options.riskLevel;
  if (options.startDate) query.createdAt = { $gte: options.startDate };
  if (options.endDate) query.createdAt = { $lte: options.endDate };

  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(options.limit || 100)
    .skip(options.skip || 0);
};

// Método estático para buscar logs por IP
auditLogSchema.statics.findByIP = function(ip, options = {}) {
  const query = { ip: ip };
  
  if (options.startDate) query.createdAt = { $gte: options.startDate };
  if (options.endDate) query.createdAt = { $lte: options.endDate };

  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(options.limit || 100)
    .skip(options.skip || 0);
};

// Método estático para obter estatísticas
auditLogSchema.statics.getStats = async function(options = {}) {
  const matchStage = {};
  
  if (options.userId) matchStage.userId = mongoose.Types.ObjectId(options.userId);
  if (options.startDate) matchStage.createdAt = { $gte: options.startDate };
  if (options.endDate) matchStage.createdAt = { $lte: options.endDate };

  const stats = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          action: '$action',
          resource: '$resource',
          status: '$status'
        },
        count: { $sum: 1 },
        suspiciousCount: {
          $sum: { $cond: ['$isSuspicious', 1, 0] }
        }
      }
    },
    {
      $group: {
        _id: '$_id.action',
        resources: {
          $push: {
            resource: '$_id.resource',
            status: '$_id.status',
            count: '$count',
            suspiciousCount: '$suspiciousCount'
          }
        },
        totalCount: { $sum: '$count' },
        totalSuspicious: { $sum: '$suspiciousCount' }
      }
    }
  ]);

  return stats;
};

// Método estático para limpar logs antigos
auditLogSchema.statics.cleanOldLogs = async function(daysToKeep = 365) {
  const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
  
  const result = await this.deleteMany({
    createdAt: { $lt: cutoffDate }
  });

  return result;
};

// Create AuditLog model
export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
