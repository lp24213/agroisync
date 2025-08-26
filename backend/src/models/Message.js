const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // Conversa à qual a mensagem pertence
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
    index: true
  },

  // Remetente da mensagem
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Conteúdo da mensagem
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: [5000, 'Mensagem não pode ter mais de 5000 caracteres']
  },

  // Tipo de mensagem
  type: {
    type: String,
    enum: ['text', 'file', 'image', 'system'],
    default: 'text'
  },

  // Arquivo anexado (se aplicável)
  file: {
    name: String,
    size: Number,
    type: String,
    url: String,
    thumbnail: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },

  // Metadados da mensagem
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },

  // Status da mensagem
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'failed'],
    default: 'sent'
  },

  // Usuários que leram a mensagem
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // Timestamps
  deliveredAt: Date,
  readAt: Date,
  failedAt: Date,
  deletedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para performance
messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ type: 1, createdAt: -1 });
messageSchema.index({ status: 1, createdAt: -1 });
messageSchema.index({ 'readBy': 1 });

// Virtual para verificar se mensagem foi lida
messageSchema.virtual('isRead').get(function() {
  return this.readBy.length > 0;
});

// Virtual para verificar se mensagem foi entregue
messageSchema.virtual('isDelivered').get(function() {
  return this.status === 'delivered' || this.status === 'read';
});

// Virtual para verificar se mensagem falhou
messageSchema.virtual('isFailed').get(function() {
  return this.status === 'failed';
});

// Virtual para verificar se mensagem tem arquivo
messageSchema.virtual('hasFile').get(function() {
  return this.type === 'file' && this.file && this.file.url;
});

// Virtual para verificar se mensagem tem imagem
messageSchema.virtual('hasImage').get(function() {
  return this.type === 'image' && this.file && this.file.url;
});

// Virtual para verificar se mensagem é do sistema
messageSchema.virtual('isSystem').get(function() {
  return this.type === 'system';
});

// Middleware para atualizar timestamps baseado no status
messageSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    const now = new Date();
    
    switch (this.status) {
      case 'delivered':
        this.deliveredAt = now;
        break;
      case 'read':
        this.readAt = now;
        break;
      case 'failed':
        this.failedAt = now;
        break;
    }
  }
  next();
});

// Método para marcar como entregue
messageSchema.methods.markAsDelivered = function() {
  this.status = 'delivered';
  this.deliveredAt = new Date();
  return this.save();
};

// Método para marcar como lida por um usuário
messageSchema.methods.markAsRead = function(userId) {
  if (!this.readBy.includes(userId)) {
    this.readBy.push(userId);
    this.status = 'read';
    this.readAt = new Date();
  }
  return this.save();
};

// Método para marcar como falhou
messageSchema.methods.markAsFailed = function(reason) {
  this.status = 'failed';
  this.failedAt = new Date();
  if (reason) {
    this.metadata.set('failureReason', reason);
  }
  return this.save();
};

// Método para verificar se usuário leu a mensagem
messageSchema.methods.isReadBy = function(userId) {
  return this.readBy.some(id => id.toString() === userId.toString());
};

// Método para obter dados públicos da mensagem
messageSchema.methods.getPublicData = function() {
  return {
    id: this._id,
    content: this.content,
    type: this.type,
    status: this.status,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Método para obter dados completos da mensagem
messageSchema.methods.getFullData = function(userId) {
  const data = {
    ...this.getPublicData(),
    conversation: this.conversation,
    sender: this.sender,
    file: this.file,
    metadata: this.metadata,
    readBy: this.readBy,
    deliveredAt: this.deliveredAt,
    readAt: this.readAt,
    failedAt: this.failedAt
  };

  // Adicionar informações de leitura específicas do usuário
  data.isReadByUser = this.isReadBy(userId);
  
  return data;
};

// Método para obter dados da mensagem para exibição
messageSchema.methods.getDisplayData = function(currentUserId) {
  const data = {
    id: this._id,
    content: this.content,
    type: this.type,
    status: this.status,
    createdAt: this.createdAt,
    isRead: this.isRead,
    isDelivered: this.isDelivered,
    isFailed: this.isFailed,
    hasFile: this.hasFile,
    hasImage: this.hasImage,
    isSystem: this.isSystem
  };

  // Adicionar informações específicas do usuário
  if (currentUserId) {
    data.isReadByUser = this.isReadBy(currentUserId);
    data.isOwnMessage = this.sender.toString() === currentUserId.toString();
  }

  // Adicionar informações do arquivo se existir
  if (this.file) {
    data.file = {
      name: this.file.name,
      size: this.file.size,
      type: this.file.type,
      url: this.file.url,
      thumbnail: this.file.thumbnail
    };
  }

  return data;
};

// Método estático para buscar mensagens de uma conversa
messageSchema.statics.findByConversation = function(conversationId, options = {}) {
  const query = { conversation: conversationId };

  if (options.type) {
    query.type = options.type;
  }

  if (options.sender) {
    query.sender = options.sender;
  }

  if (options.status) {
    query.status = options.status;
  }

  const sort = options.sort || { createdAt: 1 }; // Ordem cronológica
  const limit = options.limit || 50;
  const skip = options.skip || 0;

  return this.find(query)
    .populate('sender', 'name email avatar')
    .populate('readBy', 'name email avatar')
    .sort(sort)
    .limit(limit)
    .skip(skip);
};

// Método estático para buscar mensagens não lidas de um usuário
messageSchema.statics.findUnreadByUser = function(userId, conversationId = null) {
  const query = {
    'readBy': { $ne: userId },
    sender: { $ne: userId } // Não incluir mensagens próprias
  };

  if (conversationId) {
    query.conversation = conversationId;
  }

  return this.find(query)
    .populate('sender', 'name email avatar')
    .populate('conversation', 'title type')
    .sort({ createdAt: -1 });
};

// Método estático para buscar mensagens de um usuário
messageSchema.statics.findByUser = function(userId, options = {}) {
  const query = { sender: userId };

  if (options.conversation) {
    query.conversation = options.conversation;
  }

  if (options.type) {
    query.type = options.type;
  }

  if (options.status) {
    query.status = options.status;
  }

  const sort = options.sort || { createdAt: -1 };
  const limit = options.limit || 50;
  const skip = options.skip || 0;

  return this.find(query)
    .populate('conversation', 'title type participants')
    .populate('readBy', 'name email avatar')
    .sort(sort)
    .limit(limit)
    .skip(skip);
};

// Método estático para estatísticas de mensagens
messageSchema.statics.getStats = async function(userId = null) {
  const match = {};
  if (userId) match.sender = userId;

  const stats = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalMessages: { $sum: 1 },
        textMessages: {
          $sum: { $cond: [{ $eq: ['$type', 'text'] }, 1, 0] }
        },
        fileMessages: {
          $sum: { $cond: [{ $eq: ['$type', 'file'] }, 1, 0] }
        },
        imageMessages: {
          $sum: { $cond: [{ $eq: ['$type', 'image'] }, 1, 0] }
        },
        systemMessages: {
          $sum: { $cond: [{ $eq: ['$type', 'system'] }, 1, 0] }
        },
        sentMessages: {
          $sum: { $cond: [{ $eq: ['$status', 'sent'] }, 1, 0] }
        },
        deliveredMessages: {
          $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
        },
        readMessages: {
          $sum: { $cond: [{ $eq: ['$status', 'read'] }, 1, 0] }
        },
        failedMessages: {
          $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
        }
      }
    }
  ]);

  return stats[0] || {
    totalMessages: 0,
    textMessages: 0,
    fileMessages: 0,
    imageMessages: 0,
    systemMessages: 0,
    sentMessages: 0,
    deliveredMessages: 0,
    readMessages: 0,
    failedMessages: 0
  };
};

// Método estático para buscar mensagens por período
messageSchema.statics.findByPeriod = function(startDate, endDate, userId = null) {
  const query = {
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  };

  if (userId) {
    query.sender = userId;
  }

  return this.find(query)
    .populate('sender', 'name email avatar')
    .populate('conversation', 'title type')
    .sort({ createdAt: -1 });
};

// Método estático para criar mensagem do sistema
messageSchema.statics.createSystemMessage = function(conversationId, content, metadata = {}) {
  return this.create({
    conversation: conversationId,
    sender: null, // Mensagem do sistema não tem remetente
    content: content,
    type: 'system',
    status: 'delivered',
    metadata: metadata
  });
};

module.exports = mongoose.model('Message', messageSchema);
