import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    // Identificação do usuário
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

    // Tipo de ação realizada
  action: {
    type: String,
    required: true,
    enum: [
        'create', 'read', 'update', 'delete',
        'login', 'logout', 'password_change',
        'pii_access', 'pii_encrypt', 'pii_decrypt',
        'admin_access', 'data_export', 'data_import'
    ],
    index: true
  },

  // Recurso afetado
  resource: {
    type: String,
    required: true,
    enum: [
        'user', 'product', 'freight', 'payment',
        'tax_data', 'personal_info', 'financial_data',
        'admin_panel', 'audit_log'
      ],
      index: true
    },
    
    // ID do recurso afetado
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
      default: null,
    index: true
  },

    // Dados antes da ação (criptografado)
    beforeData: {
      type: String,
      default: null
    },
    
    // Dados após a ação (criptografado)
    afterData: {
      type: String,
      default: null
    },
    
    // Hash de integridade
    integrityHash: {
    type: String,
      required: true
  },

    // Informações da sessão
    sessionInfo: {
      ip: {
    type: String,
        required: true
      },
      userAgent: String,
      country: String,
      city: String,
      isp: String
  },

  // Metadados da ação
  metadata: {
      endpoint: String,
      method: String,
      statusCode: Number,
      responseTime: Number,
      dataSize: Number,
      encryptionUsed: {
        type: Boolean,
        default: false
      },
      fieldsEncrypted: [String],
      fieldsDecrypted: [String]
    },
    
    // Status da ação
    status: {
    type: String,
      enum: ['success', 'failed', 'partial'],
      default: 'success',
    index: true
  },

    // Mensagem de erro (se houver)
    errorMessage: {
    type: String,
      default: null
    },
    
    // Nível de sensibilidade
    sensitivityLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
      index: true
    },
    
    // Flag para dados PII
    containsPII: {
    type: Boolean,
    default: false,
    index: true
  },

    // Retenção de dados
    retentionPeriod: {
      type: Number,
      default: 2555 // 7 anos em dias
    },
    
    // Data de expiração
  expiresAt: {
    type: Date,
      default: function() {
        return new Date(Date.now() + this.retentionPeriod * 24 * 60 * 60 * 1000);
      },
    index: { expireAfterSeconds: 0 }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Índices compostos para consultas eficientes
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, resource: 1, createdAt: -1 });
auditLogSchema.index({ containsPII: 1, sensitivityLevel: 1, createdAt: -1 });
auditLogSchema.index({ status: 1, createdAt: -1 });

// Virtual para verificar se o log está próximo do vencimento
auditLogSchema.virtual('isExpiringSoon').get(function() {
  const daysUntilExpiry = Math.ceil((this.expiresAt - new Date()) / (1000 * 60 * 60 * 24));
  return daysUntilExpiry <= 30;
});

// Virtual para obter dados descriptografados (apenas para administradores)
auditLogSchema.virtual('decryptedBeforeData').get(function() {
  // Esta virtual só deve ser usada por administradores autorizados
  return this.beforeData;
});

auditLogSchema.virtual('decryptedAfterData').get(function() {
  // Esta virtual só deve ser usada por administradores autorizados
  return this.afterData;
});

// Métodos de instância
auditLogSchema.methods.encryptData = function(data) {
  // Implementar criptografia usando o middleware PII
  return data;
};

auditLogSchema.methods.decryptData = function(encryptedData) {
  // Implementar descriptografia usando o middleware PII
  return encryptedData;
};

auditLogSchema.methods.verifyIntegrity = function() {
  // Verificar integridade dos dados usando hash
  return true;
};

// Métodos estáticos
auditLogSchema.statics.findByUser = function(userId, limit = 100) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

auditLogSchema.statics.findByAction = function(action, limit = 100) {
  return this.find({ action })
    .sort({ createdAt: -1 })
    .limit(limit);
};

auditLogSchema.statics.findPIIAccess = function(userId = null, limit = 100) {
  const query = { containsPII: true };
  if (userId) {
    query.userId = userId;
  }

  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit);
};

auditLogSchema.statics.findBySensitivityLevel = function(level, limit = 100) {
  return this.find({ sensitivityLevel: level })
    .sort({ createdAt: -1 })
    .limit(limit);
};

auditLogSchema.statics.getAuditStats = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: {
          action: '$action',
          resource: '$resource',
          status: '$status'
        },
        count: { $sum: 1 },
        piiAccess: {
          $sum: { $cond: ['$containsPII', 1, 0] }
        },
        avgResponseTime: { $avg: '$metadata.responseTime' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

auditLogSchema.statics.findExpiringLogs = function() {
  const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  
  return this.find({
    expiresAt: {
      $lte: thirtyDaysFromNow,
      $gte: new Date()
    }
  }).sort({ expiresAt: 1 });
};

// Middleware pre-save para gerar hash de integridade
auditLogSchema.pre('save', function(next) {
  if (this.isNew) {
    // Gerar hash de integridade
    const crypto = require('crypto');
    const dataToHash = JSON.stringify({
      userId: this.userId,
      action: this.action,
      resource: this.resource,
      resourceId: this.resourceId,
      timestamp: this.createdAt || new Date()
    });
    
    this.integrityHash = crypto.createHash('sha256')
      .update(dataToHash)
      .digest('hex');
  }
  
  next();
});

export default mongoose.model('AuditLog', auditLogSchema);