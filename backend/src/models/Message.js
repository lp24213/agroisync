import mongoose from 'mongoose';

// Message schema for private user-to-user communication
const messageSchema = new mongoose.Schema({
  // ID da conversa (obrigatório)
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
    index: true
  },

  // Sender and Receiver
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Message Content
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },

  // Message Type and Context - SUPORTE PARA DUAS MENSAGERIAS
  messageType: {
    type: String,
    required: true,
    enum: [
      // Mensageria de Produtos (Loja)
      'product_inquiry', 'product_offer', 'product_negotiation', 'product_support',
      // Mensageria de Fretes (AgroConecta)
      'freight_request', 'freight_offer', 'freight_negotiation', 'freight_support',
      // Tipos gerais
      'general', 'support', 'admin'
    ],
    default: 'general'
  },

  // Categoria da mensageria (PRODUTOS ou FRETES)
  messagingCategory: {
    type: String,
    required: true,
    enum: ['products', 'freights'],
    default: 'products'
  },

  // Related Items (optional)
  relatedProduct: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  relatedFreight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Freight'
  },

  // Status and Read Tracking
  status: {
    type: String,
    required: true,
    enum: ['sent', 'delivered', 'read', 'replied', 'archived', 'deleted'],
    default: 'sent'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,

  // Reply Chain
  parentMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  replies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    }
  ],

  // Attachments
  attachments: [
    {
      filename: {
        type: String,
        required: true,
        trim: true
      },
      originalName: {
        type: String,
        required: true,
        trim: true
      },
      mimeType: {
        type: String,
        required: true
      },
      size: {
        type: Number,
        required: true,
        min: 0
      },
      url: {
        type: String,
        required: true
      },
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],

  // Metadata
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  tags: [
    {
      type: String,
      trim: true,
      maxlength: 50
    }
  ],

  // Security and Moderation
  isFlagged: {
    type: Boolean,
    default: false
  },
  flagReason: {
    type: String,
    trim: true
  },
  flaggedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  flaggedAt: Date,

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
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1, receiverId: 1 });
messageSchema.index({ receiverId: 1, status: 1 });
messageSchema.index({ createdAt: -1 });
messageSchema.index({ messageType: 1 });
messageSchema.index({ messagingCategory: 1 });
messageSchema.index({ parentMessage: 1 });
messageSchema.index({ isRead: 1 });
messageSchema.index({ isFlagged: 1 });

// Middleware para atualizar timestamp
messageSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Middleware para validar tamanho dos anexos
messageSchema.pre('save', function (next) {
  if (this.attachments && this.attachments.length > 10) {
    return next(new Error('Máximo de 10 anexos permitidos'));
  }
  
  const totalSize = this.attachments.reduce((sum, att) => sum + att.size, 0);
  if (totalSize > 50 * 1024 * 1024) { // 50MB
    return next(new Error('Tamanho total dos anexos excede 50MB'));
  }
  
  next();
});

// Método para marcar mensagem como lida
messageSchema.methods.markAsRead = function () {
  this.isRead = true;
  this.status = 'read';
  this.readAt = new Date();
  return this.save();
};

// Método para marcar mensagem como respondida
messageSchema.methods.markAsReplied = function () {
  this.status = 'replied';
  return this.save();
};

// Método para arquivar mensagem
messageSchema.methods.archive = function () {
  this.status = 'archived';
  return this.save();
};

// Método para marcar mensagem como sinalizada
messageSchema.methods.flag = function (reason, flaggedBy) {
  this.isFlagged = true;
  this.flagReason = reason;
  this.flaggedBy = flaggedBy;
  this.flaggedAt = new Date();
  return this.save();
};

// Método para remover sinalização
messageSchema.methods.unflag = function () {
  this.isFlagged = false;
  this.flagReason = undefined;
  this.flaggedBy = undefined;
  this.flaggedAt = undefined;
  return this.save();
};

// Método para obter conversa entre dois usuários
messageSchema.statics.getConversation = function (user1Id, user2Id, limit = 50, skip = 0) {
  return this.find({
    $or: [
      { senderId: user1Id, receiverId: user2Id },
      { senderId: user2Id, receiverId: user1Id }
    ],
    status: { $ne: 'deleted' }
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('senderId', 'name company.name email')
    .populate('receiverId', 'name company.name email')
    .populate('relatedProduct', 'name price images')
    .populate('relatedFreight', 'origin destination price')
    .populate('parentMessage', 'subject content');
};

// Método para obter mensagens não lidas de um usuário
messageSchema.statics.getUnreadMessages = function (userId, limit = 100) {
  return this.find({
    receiverId: userId,
    isRead: false,
    status: { $nin: ['deleted', 'archived'] }
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('senderId', 'name company.name email')
    .populate('relatedProduct', 'name price images')
    .populate('relatedFreight', 'origin destination price');
};

// Método para obter estatísticas de mensagens
messageSchema.statics.getMessageStats = async function (userId) {
  const stats = await this.aggregate([
    {
      $match: {
        $or: [
          { senderId: mongoose.Types.ObjectId(userId) },
          { receiverId: mongoose.Types.ObjectId(userId) }
        ],
        status: { $ne: 'deleted' }
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  return stats.reduce((acc, stat) => {
    acc[stat._id] = stat.count;
    return acc;
  }, {});
};

// Método para obter mensagens sinalizadas
messageSchema.statics.getFlaggedMessages = function (limit = 100) {
  return this.find({
    isFlagged: true
  })
    .sort({ flaggedAt: -1 })
    .limit(limit)
    .populate('senderId', 'name email')
    .populate('receiverId', 'name email')
    .populate('flaggedBy', 'name email');
};

// Método para buscar mensagens por texto
messageSchema.statics.searchMessages = function (userId, searchTerm, limit = 50) {
  return this.find({
    $or: [
      { senderId: userId },
      { receiverId: userId }
    ],
    $or: [
      { subject: { $regex: searchTerm, $options: 'i' } },
      { content: { $regex: searchTerm, $options: 'i' } }
    ],
    status: { $ne: 'deleted' }
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('senderId', 'name company.name email')
    .populate('receiverId', 'name company.name email');
};

// Create Message model
export const Message = mongoose.model('Message', messageSchema);
