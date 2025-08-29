import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  // Tipo de conversa
  type: {
    type: String,
    required: true,
    enum: ['product', 'freight', 'general'],
    default: 'general'
  },

  // Participantes da conversa
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  }],

  // Título da conversa
  title: {
    type: String,
    trim: true,
    maxlength: [200, 'Título não pode ter mais de 200 caracteres']
  },

  // Referência ao produto (se for conversa sobre produto)
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: function() {
      return this.type === 'product';
    }
  },

  // Referência ao frete (se for conversa sobre frete)
  freight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Freight',
    required: function() {
      return this.type === 'freight';
    }
  },

  // Mensagens da conversa
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }],

  // Status da conversa
  status: {
    type: String,
    enum: ['active', 'archived', 'closed', 'deleted'],
    default: 'active'
  },

  // Configurações da conversa
  settings: {
    allowFiles: {
      type: Boolean,
      default: true
    },
    maxFileSize: {
      type: Number,
      default: 10 * 1024 * 1024 // 10MB
    },
    allowedFileTypes: {
      type: [String],
      default: ['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    }
  },

  // Metadados
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },

  // Timestamps
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  archivedAt: Date,
  closedAt: Date,
  deletedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para performance
conversationSchema.index({ participants: 1 });
conversationSchema.index({ type: 1, status: 1 });
conversationSchema.index({ product: 1 });
conversationSchema.index({ freight: 1 });
conversationSchema.index({ lastMessageAt: -1 });
conversationSchema.index({ status: 1, updatedAt: -1 });

// Virtual para número de mensagens
conversationSchema.virtual('messageCount').get(function() {
  return this.messages.length;
});

// Virtual para última mensagem
conversationSchema.virtual('lastMessage').get(function() {
  if (this.messages.length === 0) return null;
  return this.messages[this.messages.length - 1];
});

// Virtual para verificar se conversa está ativa
conversationSchema.virtual('isActive').get(function() {
  return this.status === 'active';
});

// Virtual para verificar se conversa está arquivada
conversationSchema.virtual('isArchived').get(function() {
  return this.status === 'archived';
});

// Virtual para verificar se conversa está fechada
conversationSchema.virtual('isClosed').get(function() {
  return this.status === 'closed';
});

// Middleware para atualizar lastMessageAt quando mensagem é adicionada
conversationSchema.pre('save', function(next) {
  if (this.isModified('messages') && this.messages.length > 0) {
    this.lastMessageAt = new Date();
  }
  next();
});

// Método para adicionar mensagem
conversationSchema.methods.addMessage = function(messageId) {
  this.messages.push(messageId);
  this.lastMessageAt = new Date();
  this.updatedAt = new Date();
  return this.save();
};

// Método para remover mensagem
conversationSchema.methods.removeMessage = function(messageId) {
  this.messages = this.messages.filter(id => id.toString() !== messageId.toString());
  return this.save();
};

// Método para arquivar conversa
conversationSchema.methods.archive = function() {
  this.status = 'archived';
  this.archivedAt = new Date();
  return this.save();
};

// Método para reativar conversa arquivada
conversationSchema.methods.unarchive = function() {
  this.status = 'active';
  this.archivedAt = undefined;
  return this.save();
};

// Método para fechar conversa
conversationSchema.methods.close = function() {
  this.status = 'closed';
  this.closedAt = new Date();
  return this.save();
};

// Método para reabrir conversa fechada
conversationSchema.methods.reopen = function() {
  this.status = 'active';
  this.closedAt = undefined;
  return this.save();
};

// Método para verificar se usuário é participante
conversationSchema.methods.isParticipant = function(userId) {
  return this.participants.some(participant => 
    participant.toString() === userId.toString()
  );
};

// Método para obter outro participante (excluindo o usuário atual)
conversationSchema.methods.getOtherParticipant = function(userId) {
  return this.participants.find(participant => 
    participant.toString() !== userId.toString()
  );
};

// Método para obter dados públicos da conversa
conversationSchema.methods.getPublicData = function() {
  return {
    id: this._id,
    type: this.type,
    title: this.title,
    status: this.status,
    messageCount: this.messageCount,
    lastMessageAt: this.lastMessageAt,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Método para obter dados completos da conversa
conversationSchema.methods.getFullData = function(userId) {
  if (!this.isParticipant(userId)) {
    throw new Error('Acesso negado: usuário não é participante da conversa');
  }

  return {
    ...this.getPublicData(),
    participants: this.participants,
    product: this.product,
    freight: this.freight,
    messages: this.messages,
    settings: this.settings,
    metadata: this.metadata
  };
};

// Método estático para buscar conversas de um usuário
conversationSchema.statics.findByUser = function(userId, options = {}) {
  const query = {
    participants: { $in: [userId] },
    deletedAt: { $exists: false }
  };

  if (options.type) {
    query.type = options.type;
  }

  if (options.status) {
    query.status = options.status;
  }

  if (options.product) {
    query.product = options.product;
  }

  if (options.freight) {
    query.freight = options.freight;
  }

  const sort = options.sort || { lastMessageAt: -1 };
  const limit = options.limit || 50;
  const skip = options.skip || 0;

  return this.find(query)
    .populate('participants', 'name email avatar')
    .populate('product', 'name price category')
    .populate('freight', 'origin destination value vehicle')
    .sort(sort)
    .limit(limit)
    .skip(skip);
};

// Método estático para buscar conversa entre dois usuários
conversationSchema.statics.findBetweenUsers = function(userId1, userId2, type = null) {
  const query = {
    participants: { $all: [userId1, userId2] },
    deletedAt: { $exists: false }
  };

  if (type) {
    query.type = type;
  }

  return this.findOne(query)
    .populate('participants', 'name email avatar')
    .populate('product', 'name price category')
    .populate('freight', 'origin destination value vehicle');
};

// Método estático para criar conversa entre usuários
conversationSchema.statics.createBetweenUsers = function(userId1, userId2, type, options = {}) {
  const conversationData = {
    type: type,
    participants: [userId1, userId2],
    title: options.title || `Conversa ${type}`,
    settings: options.settings || {},
    metadata: options.metadata || {}
  };

  if (options.product) {
    conversationData.product = options.product;
  }

  if (options.freight) {
    conversationData.freight = options.freight;
  }

  return this.create(conversationData);
};

// Método estático para estatísticas de conversas
conversationSchema.statics.getStats = async function(userId = null) {
  const match = { deletedAt: { $exists: false } };
  if (userId) match.participants = { $in: [userId] };

  const stats = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalConversations: { $sum: 1 },
        activeConversations: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        archivedConversations: {
          $sum: { $cond: [{ $eq: ['$status', 'archived'] }, 1, 0] }
        },
        closedConversations: {
          $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] }
        },
        productConversations: {
          $sum: { $cond: [{ $eq: ['$type', 'product'] }, 1, 0] }
        },
        freightConversations: {
          $sum: { $cond: [{ $eq: ['$type', 'freight'] }, 1, 0] }
        },
        generalConversations: {
          $sum: { $cond: [{ $eq: ['$type', 'general'] }, 1, 0] }
        }
      }
    }
  ]);

  return stats[0] || {
    totalConversations: 0,
    activeConversations: 0,
    archivedConversations: 0,
    closedConversations: 0,
    productConversations: 0,
    freightConversations: 0,
    generalConversations: 0
  };
};

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
