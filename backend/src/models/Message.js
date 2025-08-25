import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  // Usuários da conversa
  remetente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  destinatario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Conteúdo da mensagem
  conteudo: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  },
  
  // Tipo de serviço (product ou freight)
  tipo: {
    type: String,
    enum: ['product', 'freight'],
    required: true,
    index: true
  },
  
  // ID do produto ou frete relacionado
  servico_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  
  // Status da mensagem
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'deleted'],
    default: 'sent',
    index: true
  },
  
  // Timestamps
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  
  // Metadados adicionais
  metadata: {
    // Para mensagens de produto
    productTitle: String,
    productPrice: Number,
    
    // Para mensagens de frete
    freightOrigin: String,
    freightDestination: String,
    freightPrice: Number
  },
  
  // Sistema de segurança
  isReported: {
    type: Boolean,
    default: false
  },
  
  reportReason: String,
  
  // Para auditoria
  ipAddress: String,
  userAgent: String,
  
  // Soft delete
  deletedAt: Date,
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para performance
messageSchema.index({ remetente: 1, destinatario: 1, timestamp: -1 });
messageSchema.index({ tipo: 1, servico_id: 1, timestamp: -1 });
messageSchema.index({ status: 1, timestamp: -1 });
messageSchema.index({ createdAt: -1 });

// Virtual para verificar se a mensagem é recente (últimas 24h)
messageSchema.virtual('isRecent').get(function() {
  const now = new Date();
  const messageTime = new Date(this.timestamp);
  const diffHours = (now - messageTime) / (1000 * 60 * 60);
  return diffHours <= 24;
});

// Virtual para obter o nome do serviço
messageSchema.virtual('servicoNome').get(function() {
  if (this.tipo === 'product') {
    return this.metadata?.productTitle || 'Produto';
  } else if (this.tipo === 'freight') {
    return `${this.metadata?.freightOrigin || 'Origem'} → ${this.metadata?.freightDestination || 'Destino'}`;
  }
  return 'Serviço';
});

// Middleware para limpar dados sensíveis antes de salvar
messageSchema.pre('save', function(next) {
  // Sanitizar conteúdo da mensagem
  if (this.conteudo) {
    this.conteudo = this.conteudo.trim();
  }
  
  // Validar tamanho da mensagem
  if (this.conteudo && this.conteudo.length > 2000) {
    return next(new Error('Mensagem muito longa. Máximo 2000 caracteres.'));
  }
  
  next();
});

// Método para marcar mensagem como lida
messageSchema.methods.markAsRead = function() {
  this.status = 'read';
  return this.save();
};

// Método para marcar mensagem como entregue
messageSchema.methods.markAsDelivered = function() {
  this.status = 'delivered';
  return this.save();
};

// Método para deletar mensagem (soft delete)
messageSchema.methods.softDelete = function(userId) {
  this.deletedAt = new Date();
  this.deletedBy = userId;
  this.status = 'deleted';
  return this.save();
};

// Método para reportar mensagem
messageSchema.methods.report = function(reason) {
  this.isReported = true;
  this.reportReason = reason;
  return this.save();
};

// Métodos estáticos para consultas comuns
messageSchema.statics.findConversation = function(user1Id, user2Id, tipo, servicoId) {
  return this.find({
    $or: [
      { remetente: user1Id, destinatario: user2Id },
      { remetente: user2Id, destinatario: user1Id }
    ],
    tipo: tipo,
    servico_id: servicoId,
    deletedAt: { $exists: false }
  }).sort({ timestamp: 1 });
};

messageSchema.statics.findUserMessages = function(userId, tipo = null) {
  const query = {
    $or: [
      { remetente: userId },
      { destinatario: userId }
    ],
    deletedAt: { $exists: false }
  };
  
  if (tipo) {
    query.tipo = tipo;
  }
  
  return this.find(query).sort({ timestamp: -1 });
};

messageSchema.statics.findUnreadMessages = function(userId) {
  return this.find({
    destinatario: userId,
    status: { $in: ['sent', 'delivered'] },
    deletedAt: { $exists: false }
  });
};

messageSchema.statics.getMessageStats = function(userId) {
  return this.aggregate([
    {
      $match: {
        $or: [
          { remetente: userId },
          { destinatario: userId }
        ],
        deletedAt: { $exists: false }
      }
    },
    {
      $group: {
        _id: '$tipo',
        total: { $sum: 1 },
        unread: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$destinatario', userId] },
                  { $in: ['$status', ['sent', 'delivered']] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    }
  ]);
};

// Método para buscar mensagens por serviço
messageSchema.statics.findByService = function(tipo, servicoId) {
  return this.find({
    tipo: tipo,
    servico_id: servicoId,
    deletedAt: { $exists: false }
  }).sort({ timestamp: 1 });
};

// Método para limpar mensagens antigas (mais de 30 dias)
messageSchema.statics.cleanOldMessages = function() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  return this.updateMany(
    {
      timestamp: { $lt: thirtyDaysAgo },
      status: { $in: ['read', 'deleted'] }
    },
    {
      $set: { deletedAt: new Date() }
    }
  );
};

// Método para buscar mensagens reportadas
messageSchema.statics.findReportedMessages = function() {
  return this.find({
    isReported: true,
    deletedAt: { $exists: false }
  }).populate('remetente', 'email name')
    .populate('destinatario', 'email name')
    .sort({ createdAt: -1 });
};

// Método para estatísticas gerais
messageSchema.statics.getGeneralStats = function() {
  return this.aggregate([
    {
      $match: {
        deletedAt: { $exists: false }
      }
    },
    {
      $group: {
        _id: null,
        totalMessages: { $sum: 1 },
        totalProducts: {
          $sum: {
            $cond: [{ $eq: ['$tipo', 'product'] }, 1, 0]
          }
        },
        totalFreights: {
          $sum: {
            $cond: [{ $eq: ['$tipo', 'freight'] }, 1, 0]
          }
        },
        unreadMessages: {
          $sum: {
            $cond: [
              { $in: ['$status', ['sent', 'delivered']] },
              1,
              0
            ]
          }
        },
        reportedMessages: {
          $sum: {
            $cond: ['$isReported', 1, 0]
          }
        }
      }
    }
  ]);
};

// Configurar TTL para mensagens antigas (opcional)
// messageSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 }); // 30 dias

const Message = mongoose.model('Message', messageSchema);

export default Message;
