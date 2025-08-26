const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // Remetente e destinatário
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Usuário remetente é obrigatório']
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Usuário destinatário é obrigatório']
  },

  // Conteúdo da mensagem
  subject: {
    type: String,
    required: [true, 'Assunto é obrigatório'],
    trim: true,
    maxlength: [200, 'Assunto não pode ter mais de 200 caracteres']
  },
  message: {
    type: String,
    required: [true, 'Mensagem é obrigatória'],
    trim: true,
    maxlength: [2000, 'Mensagem não pode ter mais de 2000 caracteres']
  },

  // Contexto da mensagem (produto ou frete)
  context: {
    type: {
      type: String,
      enum: ['product', 'freight', 'general', 'payment'],
      default: 'general'
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    freightId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Freight'
    }
  },

  // Status da mensagem
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'archived', 'deleted'],
    default: 'sent'
  },

  // Metadados
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  isArchived: {
    type: Boolean,
    default: false
  },
  archivedAt: Date,

  // Anexos
  attachments: [{
    filename: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    size: Number,
    mimeType: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Respostas (thread de mensagens)
  parentMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],

  // Notificações
  notifications: {
    emailSent: {
      type: Boolean,
      default: false
    },
    pushSent: {
      type: Boolean,
      default: false
    },
    smsSent: {
      type: Boolean,
      default: false
    }
  },

  // Timestamps
  sentAt: {
    type: Date,
    default: Date.now
  },
  deliveredAt: Date
}, {
  timestamps: true
});

// Índices para performance
messageSchema.index({ fromUser: 1, createdAt: -1 });
messageSchema.index({ toUser: 1, createdAt: -1 });
messageSchema.index({ 'context.productId': 1 });
messageSchema.index({ 'context.freightId': 1 });
messageSchema.index({ status: 1 });
messageSchema.index({ isRead: 1 });
messageSchema.index({ parentMessage: 1 });
messageSchema.index({ createdAt: -1 });

// Middleware para marcar como entregue
messageSchema.pre('save', function(next) {
  if (this.isNew && !this.deliveredAt) {
    this.deliveredAt = new Date();
  }
  next();
});

// Método para marcar como lida
messageSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.status = 'read';
  this.readAt = new Date();
  return this.save();
};

// Método para arquivar mensagem
messageSchema.methods.archive = function() {
  this.isArchived = true;
  this.status = 'archived';
  this.archivedAt = new Date();
  return this.save();
};

// Método para obter dados da mensagem para exibição
messageSchema.methods.getDisplayData = function(userId) {
  const isSender = this.fromUser.toString() === userId.toString();
  
  return {
    _id: this._id,
    subject: this.subject,
    message: this.message,
    context: this.context,
    status: this.status,
    isRead: this.isRead,
    isArchived: this.isArchived,
    sentAt: this.sentAt,
    deliveredAt: this.deliveredAt,
    attachments: this.attachments,
    isSender,
    direction: isSender ? 'outgoing' : 'incoming'
  };
};

// Método para obter thread de mensagens
messageSchema.methods.getThread = function() {
  return this.model('Message').find({
    $or: [
      { _id: this._id },
      { parentMessage: this._id },
      { _id: { $in: this.replies } }
    ]
  }).sort({ createdAt: 1 }).populate('fromUser', 'name').populate('toUser', 'name');
};

// Método estático para buscar conversas de um usuário
messageSchema.statics.getUserConversations = function(userId, limit = 20, skip = 0) {
  return this.aggregate([
    {
      $match: {
        $or: [
          { fromUser: mongoose.Types.ObjectId(userId) },
          { toUser: mongoose.Types.ObjectId(userId) }
        ],
        status: { $ne: 'deleted' }
      }
    },
    {
      $addFields: {
        otherUser: {
          $cond: {
            if: { $eq: ['$fromUser', mongoose.Types.ObjectId(userId)] },
            then: '$toUser',
            else: '$fromUser'
          }
        },
        isOutgoing: {
          $eq: ['$fromUser', mongoose.Types.ObjectId(userId)]
        }
      }
    },
    {
      $group: {
        _id: '$otherUser',
        lastMessage: { $first: '$$ROOT' },
        messageCount: { $sum: 1 },
        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$toUser', mongoose.Types.ObjectId(userId)] },
                  { $eq: ['$isRead', false] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $sort: { 'lastMessage.createdAt': -1 }
    },
    {
      $skip: skip
    },
    {
      $limit: limit
    }
  ]);
};

// Método estático para buscar mensagens entre dois usuários
messageSchema.statics.getConversation = function(user1Id, user2Id, limit = 50, skip = 0) {
  return this.find({
    $or: [
      { fromUser: user1Id, toUser: user2Id },
      { fromUser: user2Id, toUser: user1Id }
    ],
    status: { $ne: 'deleted' }
  })
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit)
  .populate('fromUser', 'name')
  .populate('toUser', 'name')
  .populate('context.productId', 'publicData.title publicData.price')
  .populate('context.freightId', 'publicData.title publicData.freightValue');
};

// Método estático para buscar mensagens não lidas
messageSchema.statics.getUnreadMessages = function(userId) {
  return this.find({
    toUser: userId,
    isRead: false,
    status: { $ne: 'deleted' }
  })
  .sort({ createdAt: -1 })
  .populate('fromUser', 'name')
  .populate('context.productId', 'publicData.title')
  .populate('context.freightId', 'publicData.title');
};

// Método estático para contar mensagens não lidas
messageSchema.statics.countUnreadMessages = function(userId) {
  return this.countDocuments({
    toUser: userId,
    isRead: false,
    status: { $ne: 'deleted' }
  });
};

module.exports = mongoose.model('Message', messageSchema);
