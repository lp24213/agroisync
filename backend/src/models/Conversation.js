import mongoose from 'mongoose';

// Conversation schema para gerenciar conversas entre usuários
const conversationSchema = new mongoose.Schema({
  // Participantes da conversa
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],

  // Tipo de serviço (produto ou frete)
  serviceType: {
    type: String,
    required: true,
    enum: ['product', 'freight'],
    index: true
  },

  // ID do serviço relacionado (Product ou Freight)
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'serviceModel'
  },

  // Referência dinâmica ao modelo do serviço
  serviceModel: {
    type: String,
    required: true,
    enum: ['Product', 'Freight']
  },

  // Metadados da conversa
  title: {
    type: String,
    trim: true,
    maxlength: 200
  },

  // Status da conversa
  status: {
    type: String,
    required: true,
    enum: ['active', 'archived', 'closed', 'blocked'],
    default: 'active',
    index: true
  },

  // Última mensagem
  lastMessage: {
    content: String,
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: Date
  },

  // Contadores
  messageCount: {
    type: Number,
    default: 0
  },

  unreadCount: {
    type: Number,
    default: 0
  },

  // Configurações
  isArchived: {
    type: Boolean,
    default: false
  },

  isBlocked: {
    type: Boolean,
    default: false
  },

  blockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  blockedAt: Date,

  blockReason: String,

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },

  updatedAt: {
    type: Date,
    default: Date.now
  },

  lastMessageAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Índices para performance
conversationSchema.index({ participants: 1, serviceType: 1 });
conversationSchema.index({ serviceId: 1, serviceType: 1 });
conversationSchema.index({ 'lastMessageAt': -1 });
conversationSchema.index({ status: 1, createdAt: -1 });

// Middleware para atualizar timestamps
conversationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Método para atualizar última mensagem
conversationSchema.methods.updateLastMessage = function(messageContent, senderId) {
  this.lastMessage = {
    content: messageContent,
    senderId: senderId,
    timestamp: new Date()
  };
  this.lastMessageAt = new Date();
  this.messageCount += 1;
  return this.save();
};

// Método para marcar como lida
conversationSchema.methods.markAsRead = function(userId) {
  // Reset unread count para este usuário
  this.unreadCount = Math.max(0, this.unreadCount - 1);
  return this.save();
};

// Método para arquivar conversa
conversationSchema.methods.archive = function() {
  this.status = 'archived';
  this.isArchived = true;
  return this.save();
};

// Método para bloquear conversa
conversationSchema.methods.block = function(reason, blockedBy) {
  this.status = 'blocked';
  this.isBlocked = true;
  this.blockReason = reason;
  this.blockedBy = blockedBy;
  this.blockedAt = new Date();
  return this.save();
};

// Método para desbloquear conversa
conversationSchema.methods.unblock = function() {
  this.status = 'active';
  this.isBlocked = false;
  this.blockReason = undefined;
  this.blockedBy = undefined;
  this.blockedAt = undefined;
  return this.save();
};

// Método estático para buscar conversas de um usuário
conversationSchema.statics.findByUser = function(userId, serviceType = null, options = {}) {
  const query = {
    participants: userId,
    status: { $ne: 'deleted' }
  };

  if (serviceType) {
    query.serviceType = serviceType;
  }

  return this.find(query)
    .sort({ lastMessageAt: -1 })
    .populate('participants', 'name email company.name')
    .populate('lastMessage.senderId', 'name email')
    .populate('serviceId', 'name title origin destination price')
    .limit(options.limit || 50)
    .skip(options.skip || 0);
};

// Método estático para buscar conversa entre dois usuários para um serviço
conversationSchema.statics.findBetweenUsers = function(user1Id, user2Id, serviceId, serviceType) {
  return this.findOne({
    participants: { $all: [user1Id, user2Id] },
    serviceId: serviceId,
    serviceType: serviceType,
    status: { $ne: 'deleted' }
  });
};

// Método estático para criar nova conversa
conversationSchema.statics.createConversation = function(participants, serviceId, serviceType, title = null) {
  return this.create({
    participants: participants,
    serviceId: serviceId,
    serviceType: serviceType,
    serviceModel: serviceType === 'product' ? 'Product' : 'Freight',
    title: title
  });
};

// Método estático para obter estatísticas
conversationSchema.statics.getStats = async function(userId) {
  const stats = await this.aggregate([
    {
      $match: {
        participants: mongoose.Types.ObjectId(userId),
        status: { $ne: 'deleted' }
      }
    },
    {
      $group: {
        _id: '$serviceType',
        total: { $sum: 1 },
        active: {
          $sum: {
            $cond: [{ $eq: ['$status', 'active'] }, 1, 0]
          }
        },
        unread: { $sum: '$unreadCount' }
      }
    }
  ]);

  return stats.reduce((acc, stat) => {
    acc[stat._id] = {
      total: stat.total,
      active: stat.active,
      unread: stat.unread
    };
    return acc;
  }, {});
};

// Create Conversation model
export const Conversation = mongoose.model('Conversation', conversationSchema);
