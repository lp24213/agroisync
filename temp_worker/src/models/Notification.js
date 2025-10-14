import mongoose from 'mongoose';

import logger from '../utils/logger.js';
const notificationSchema = new mongoose.Schema(
  {
    // IdentificaÃ§Ã£o Ãºnica
    id: {
      type: String,
      required: true,
      unique: true,
      default: () => `NOTIF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    },

    // UsuÃ¡rio destinatÃ¡rio
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    // Tipo de notificaÃ§Ã£o
    type: {
      type: String,
      required: true,
      enum: [
        'NEW_TRANSACTION',
        'NEW_MESSAGE',
        'STATUS_CHANGED',
        'PAYMENT_RECEIVED',
        'PAYMENT_FAILED',
        'PLAN_EXPIRING',
        'PLAN_EXPIRED',
        'SYSTEM_ALERT',
        'SECURITY_ALERT',
        'WELCOME',
        'VERIFICATION_REQUIRED'
      ],
      index: true
    },

    // TÃ­tulo da notificaÃ§Ã£o
    title: {
      type: String,
      required: true,
      maxlength: [100, 'TÃ­tulo nÃ£o pode ter mais de 100 caracteres']
    },

    // Corpo da mensagem
    body: {
      type: String,
      required: true,
      maxlength: [500, 'Corpo da mensagem nÃ£o pode ter mais de 500 caracteres']
    },

    // Dados adicionais (JSON)
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    // Canais de entrega
    channels: [
      {
        type: String,
        enum: ['EMAIL', 'SMS', 'PUSH', 'IN_APP'],
        required: true
      }
    ],

    // Status de entrega por canal
    deliveryStatus: {
      email: {
        status: {
          type: String,
          enum: ['PENDING', 'SENT', 'DELIVERED', 'FAILED'],
          default: 'PENDING'
        },
        sentAt: Date,
        deliveredAt: Date,
        error: String
      },
      sms: {
        status: {
          type: String,
          enum: ['PENDING', 'SENT', 'DELIVERED', 'FAILED'],
          default: 'PENDING'
        },
        sentAt: Date,
        deliveredAt: Date,
        error: String
      },
      push: {
        status: {
          type: String,
          enum: ['PENDING', 'SENT', 'DELIVERED', 'FAILED'],
          default: 'PENDING'
        },
        sentAt: Date,
        deliveredAt: Date,
        error: String
      },
      inApp: {
        status: {
          type: String,
          enum: ['PENDING', 'SENT', 'DELIVERED', 'FAILED', 'READ'],
          default: 'PENDING'
        },
        sentAt: Date,
        deliveredAt: Date,
        readAt: Date,
        error: String
      }
    },

    // Prioridade da notificaÃ§Ã£o
    priority: {
      type: String,
      enum: ['LOW', 'NORMAL', 'HIGH', 'URGENT'],
      default: 'NORMAL',
      index: true
    },

    // Categoria da notificaÃ§Ã£o
    category: {
      type: String,
      enum: ['TRANSACTION', 'MESSAGE', 'PAYMENT', 'SYSTEM', 'SECURITY', 'MARKETING'],
      default: 'SYSTEM',
      index: true
    },

    // Se a notificaÃ§Ã£o Ã© persistente
    persistent: {
      type: Boolean,
      default: false
    },

    // Se a notificaÃ§Ã£o foi lida
    read: {
      type: Boolean,
      default: false,
      index: true
    },

    // Data de leitura
    readAt: Date,

    // Se a notificaÃ§Ã£o foi arquivada
    archived: {
      type: Boolean,
      default: false,
      index: true
    },

    // Data de arquivamento
    archivedAt: Date,

    // Tentativas de entrega
    deliveryAttempts: {
      email: { type: Number, default: 0 },
      sms: { type: Number, default: 0 },
      push: { type: Number, default: 0 }
    },

    // ConfiguraÃ§Ãµes de retry
    retryConfig: {
      maxAttempts: { type: Number, default: 3 },
      retryDelay: { type: Number, default: 300000 }, // 5 minutos
      backoffMultiplier: { type: Number, default: 2 }
    },

    // Metadados adicionais
    metadata: {
      source: String, // Sistema que gerou a notificaÃ§Ã£o
      trigger: String, // Evento que disparou a notificaÃ§Ã£o
      context: mongoose.Schema.Types.Mixed, // Contexto adicional
      tags: [String] // Tags para categorizaÃ§Ã£o
    },

    // ConfiguraÃ§Ãµes de expiraÃ§Ã£o
    expiresAt: {
      type: Date,
      index: true
    },

    // Se a notificaÃ§Ã£o foi processada
    processed: {
      type: Boolean,
      default: false,
      index: true
    },

    // Data de processamento
    processedAt: Date
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Ãndices para performance
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, read: 1, archived: 1 });
notificationSchema.index({ type: 1, createdAt: -1 });
notificationSchema.index({ priority: 1, createdAt: -1 });
notificationSchema.index({ 'deliveryStatus.inApp.status': 1, createdAt: -1 });

// Virtual para status geral de entrega
notificationSchema.virtual('overallDeliveryStatus').get(function () {
  const statuses = Object.values(this.deliveryStatus).map(channel => channel.status);

  if (statuses.every(status => status === 'DELIVERED' || status === 'READ')) {
    return 'COMPLETED';
  } else if (statuses.some(status => status === 'FAILED')) {
    return 'PARTIAL_FAILURE';
  } else if (statuses.some(status => status === 'PENDING')) {
    return 'PENDING';
  } else {
    return 'IN_PROGRESS';
  }
});

// Virtual para verificar se pode ser reenviada
notificationSchema.virtual('canRetry').get(function () {
  const now = new Date();
  const { retryDelay } = this.retryConfig;

  return Object.entries(this.deliveryStatus).some(([channel, status]) => {
    if (status.status === 'FAILED') {
      const lastAttempt = status.sentAt || this.createdAt;
      const timeSinceLastAttempt = now - lastAttempt;
      const currentAttempts = this.deliveryAttempts[channel] || 0;

      return timeSinceLastAttempt >= retryDelay && currentAttempts < this.retryConfig.maxAttempts;
    }
    return false;
  });
});

// MÃ©todos de instÃ¢ncia
notificationSchema.methods.markAsRead = function () {
  this.read = true;
  this.readAt = new Date();
  this.deliveryStatus.inApp.status = 'READ';
  this.deliveryStatus.inApp.deliveredAt = new Date();
  return this.save();
};

notificationSchema.methods.markAsDelivered = function (channel) {
  if (this.deliveryStatus[channel]) {
    this.deliveryStatus[channel].status = 'DELIVERED';
    this.deliveryStatus[channel].deliveredAt = new Date();
  }
  return this.save();
};

notificationSchema.methods.markAsFailed = function (channel, error) {
  if (this.deliveryStatus[channel]) {
    this.deliveryStatus[channel].status = 'FAILED';
    this.deliveryStatus[channel].error = error;
    this.deliveryAttempts[channel] = (this.deliveryAttempts[channel] || 0) + 1;
  }
  return this.save();
};

notificationSchema.methods.archive = function () {
  this.archived = true;
  this.archivedAt = new Date();
  return this.save();
};

// MÃ©todos estÃ¡ticos
notificationSchema.statics.findUnreadByUser = function (userId, limit = 50) {
  return this.find({
    userId,
    read: false,
    archived: false
  })
    .sort({ createdAt: -1 })
    .limit(limit);
};

notificationSchema.statics.findByType = function (type, limit = 100) {
  return this.find({ type }).sort({ createdAt: -1 }).limit(limit);
};

notificationSchema.statics.findPendingDelivery = function (channel) {
  return this.find({
    [`deliveryStatus.${channel}.status`]: 'PENDING',
    processed: false
  }).sort({ priority: -1, createdAt: 1 });
};

notificationSchema.statics.cleanupExpired = function () {
  const now = new Date();
  return this.deleteMany({
    expiresAt: { $lt: now },
    persistent: false
  });
};

// Middleware para limpeza automÃ¡tica
notificationSchema.pre('save', function (next) {
  // Definir data de expiraÃ§Ã£o se nÃ£o estiver definida
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 dias
  }

  // Marcar como processada se todos os canais foram processados
  const allProcessed = Object.values(this.deliveryStatus).every(
    channel => channel.status !== 'PENDING'
  );

  if (allProcessed && !this.processed) {
    this.processed = true;
    this.processedAt = new Date();
  }

  next();
});

// Middleware para limpeza de cache
notificationSchema.post('save', function () {
  // Em produÃ§Ã£o, invalidar cache aqui
  if (process.env.NODE_ENV !== 'production') {
    logger.info(`NotificaÃ§Ã£o ${this.id} salva para usuÃ¡rio ${this.userId}`);
  }
});

export default mongoose.model('Notification', notificationSchema);
