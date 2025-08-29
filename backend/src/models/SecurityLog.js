import mongoose from 'mongoose';

// Security Log schema for tracking security events and attacks
const securityLogSchema = new mongoose.Schema({
  // Event Information
  eventType: {
    type: String,
    required: true,
    enum: [
      'login_attempt',
      'login_success',
      'login_failure',
      'logout',
      'password_change',
      'password_reset',
      'account_lock',
      'account_unlock',
      'admin_action',
      'api_request',
      'file_upload',
      'file_download',
      'data_access',
      'data_modification',
      'payment_attempt',
      'payment_success',
      'payment_failure',
      'suspicious_activity',
      'ddos_attack',
      'brute_force',
      'sql_injection',
      'xss_attempt',
      'csrf_attempt',
      'rate_limit_exceeded',
      'unauthorized_access',
      'system_error',
      'backup_created',
      'backup_restored'
    ]
  },

  // Severity Level
  severity: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },

  // User Information (if applicable)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true
  },

  // Session Information
  sessionId: String,
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: String,
  geolocation: {
    country: String,
    region: String,
    city: String,
    coordinates: {
      lat: Number,
      lon: Number
    }
  },

  // Request Details
  requestMethod: String,
  requestUrl: String,
  requestHeaders: Map,
  requestBody: String,
  responseStatus: Number,
  responseTime: Number,

  // Event Details
  description: {
    type: String,
    required: true,
    trim: true
  },

  details: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },

  // Error Information (if applicable)
  error: {
    message: String,
    stack: String,
    code: String
  },

  // Threat Intelligence
  threatLevel: {
    type: String,
    enum: ['none', 'low', 'medium', 'high', 'critical'],
    default: 'none'
  },

  threatType: [
    {
      type: String,
      enum: [
        'bot',
        'scanner',
        'malware',
        'phishing',
        'social_engineering',
        'data_exfiltration',
        'privilege_escalation',
        'persistence',
        'lateral_movement',
        'command_control'
      ]
    }
  ],

  ioc: [
    {
      type: String,
      enum: ['ip', 'domain', 'url', 'hash', 'email', 'username'],
      value: String,
      confidence: Number
    }
  ],

  // Cloudflare Integration
  cloudflare: {
    rayId: String,
    country: String,
    threatScore: Number,
    botScore: Number,
    challengePassed: Boolean,
    captchaPassed: Boolean,
    jsChallengePassed: Boolean,
    managedChallengePassed: Boolean,
    verifiedBot: Boolean
  },

  // AWS Integration
  aws: {
    requestId: String,
    region: String,
    service: String,
    operation: String,
    errorCode: String,
    errorMessage: String
  },

  // Resolution
  status: {
    type: String,
    required: true,
    enum: ['open', 'investigating', 'resolved', 'false_positive', 'ignored'],
    default: 'open'
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  resolution: {
    action: String,
    notes: String,
    resolvedAt: Date,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Índices para melhor performance
securityLogSchema.index({ eventType: 1 });
securityLogSchema.index({ severity: 1 });
securityLogSchema.index({ userId: 1 });
securityLogSchema.index({ ipAddress: 1 });
securityLogSchema.index({ createdAt: -1 });
securityLogSchema.index({ status: 1 });
securityLogSchema.index({ threatLevel: 1 });
securityLogSchema.index({ 'cloudflare.rayId': 1 });

// Middleware para atualizar timestamp
securityLogSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Método para marcar como resolvido
securityLogSchema.methods.resolve = function (action, notes, resolvedBy) {
  this.status = 'resolved';
  this.resolution = {
    action,
    notes,
    resolvedAt: new Date(),
    resolvedBy
  };
  return this.save();
};

// Método para marcar como falso positivo
securityLogSchema.methods.markAsFalsePositive = function (notes, resolvedBy) {
  this.status = 'false_positive';
  this.resolution = {
    action: 'false_positive',
    notes,
    resolvedAt: new Date(),
    resolvedBy
  };
  return this.save();
};

// Método para obter logs por severidade
securityLogSchema.statics.findBySeverity = function (severity, limit = 100) {
  return this.find({ severity })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'name email')
    .populate('assignedTo', 'name email');
};

// Método para obter logs por tipo de evento
securityLogSchema.statics.findByEventType = function (eventType, limit = 100) {
  return this.find({ eventType })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'name email')
    .populate('assignedTo', 'name email');
};

// Método para obter logs por IP
securityLogSchema.statics.findByIP = function (ipAddress, limit = 100) {
  return this.find({ ipAddress })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'name email')
    .populate('assignedTo', 'name email');
};

// Método para obter estatísticas de segurança
securityLogSchema.statics.getSecurityStats = async function (timeRange = '24h') {
  const now = new Date();
  let startDate;

  switch (timeRange) {
    case '1h':
      startDate = new Date(now.getTime() - 60 * 60 * 1000);
      break;
    case '24h':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  }

  const stats = await this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          eventType: '$eventType',
          severity: '$severity',
          status: '$status'
        },
        count: { $sum: 1 }
      }
    }
  ]);

  return stats.reduce((acc, stat) => {
    const key = `${stat._id.eventType}_${stat._id.severity}_${stat._id.status}`;
    acc[key] = stat.count;
    return acc;
  }, {});
};

// Método para obter ameaças ativas
securityLogSchema.statics.getActiveThreats = function (limit = 50) {
  return this.find({
    threatLevel: { $in: ['high', 'critical'] },
    status: { $in: ['open', 'investigating'] }
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('userId', 'name email')
    .populate('assignedTo', 'name email');
};

// Método para obter logs de um usuário específico
securityLogSchema.statics.getUserLogs = function (userId, limit = 100) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('assignedTo', 'name email');
};

// Create SecurityLog model
const SecurityLog = mongoose.model('SecurityLog', securityLogSchema);

export default SecurityLog;
