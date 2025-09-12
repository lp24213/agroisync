import mongoose from 'mongoose';

const partnershipMessageSchema = new mongoose.Schema({
  // Informações do Parceiro
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner',
    required: true
  },

  // Informações da Mensagem
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

  // Tipo e Categoria
  messageType: {
    type: String,
    required: true,
    enum: [
      'partnership_request',
      'business_proposal',
      'collaboration',
      'support',
      'general',
      'urgent'
    ],
    default: 'general'
  },

  category: {
    type: String,
    required: true,
    enum: ['agriculture', 'technology', 'finance', 'logistics', 'marketing', 'research', 'other'],
    default: 'other'
  },

  // Status e Prioridade
  status: {
    type: String,
    required: true,
    enum: ['new', 'read', 'in_progress', 'replied', 'closed', 'archived'],
    default: 'new'
  },

  priority: {
    type: String,
    required: true,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },

  // Rastreamento de Leitura e Resposta
  isRead: {
    type: Boolean,
    default: false
  },

  readAt: Date,

  readBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  repliedAt: Date,

  repliedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Resposta da Administração
  adminReply: {
    content: {
      type: String,
      trim: true,
      maxlength: 5000
    },

    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    repliedAt: Date
  },

  // Atribuição e Notas
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  assignedAt: Date,

  adminNotes: {
    type: String,
    trim: true,
    maxlength: 1000
  },

  // Anexos
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

  // Tags e Metadados
  tags: [
    {
      type: String,
      trim: true,
      maxlength: 50
    }
  ],

  // Sinalização e Moderação
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
partnershipMessageSchema.index({ partnerId: 1, status: 1 });
partnershipMessageSchema.index({ status: 1, priority: 1 });
partnershipMessageSchema.index({ createdAt: -1 });
partnershipMessageSchema.index({ messageType: 1, category: 1 });
partnershipMessageSchema.index({ assignedTo: 1 });
partnershipMessageSchema.index({ isRead: 1 });
partnershipMessageSchema.index({ isFlagged: 1 });

// Middleware para atualizar timestamp
partnershipMessageSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Middleware para validar tamanho dos anexos
partnershipMessageSchema.pre('save', function (next) {
  if (this.attachments && this.attachments.length > 10) {
    return next(new Error('Máximo de 10 anexos permitidos'));
  }

  const totalSize = this.attachments.reduce((sum, att) => sum + att.size, 0);
  if (totalSize > 50 * 1024 * 1024) {
    // 50MB
    return next(new Error('Tamanho total dos anexos excede 50MB'));
  }

  next();
});

// Método para marcar mensagem como lida
partnershipMessageSchema.methods.markAsRead = function (adminId) {
  this.isRead = true;
  this.status = 'read';
  this.readAt = new Date();
  this.readBy = adminId;
  return this.save();
};

// Método para marcar mensagem como em progresso
partnershipMessageSchema.methods.markInProgress = function (adminId) {
  this.status = 'in_progress';
  this.assignedTo = adminId;
  this.assignedAt = new Date();
  return this.save();
};

// Método para responder mensagem
partnershipMessageSchema.methods.reply = function (content, adminId) {
  this.status = 'replied';
  this.repliedAt = new Date();
  this.repliedBy = adminId;
  this.adminReply = {
    content,
    adminId,
    repliedAt: new Date()
  };
  return this.save();
};

// Método para fechar mensagem
partnershipMessageSchema.methods.close = function (adminId) {
  this.status = 'closed';
  this.assignedTo = adminId;
  this.assignedAt = new Date();
  return this.save();
};

// Método para arquivar mensagem
partnershipMessageSchema.methods.archive = function (adminId) {
  this.status = 'archived';
  this.assignedTo = adminId;
  this.assignedAt = new Date();
  return this.save();
};

// Método para marcar mensagem como sinalizada
partnershipMessageSchema.methods.flag = function (reason, flaggedBy) {
  this.isFlagged = true;
  this.flagReason = reason;
  this.flaggedBy = flaggedBy;
  this.flaggedAt = new Date();
  return this.save();
};

// Método para remover sinalização
partnershipMessageSchema.methods.unflag = function () {
  this.isFlagged = false;
  this.flagReason = undefined;
  this.flaggedBy = undefined;
  this.flaggedAt = undefined;
  return this.save();
};

// Método estático para obter mensagens por parceiro
partnershipMessageSchema.statics.getMessagesByPartner = function (partnerId, limit = 50, skip = 0) {
  return this.find({
    partnerId,
    status: { $ne: 'archived' }
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('partnerId', 'name company category')
    .populate('assignedTo', 'name email')
    .populate('readBy', 'name email')
    .populate('repliedBy', 'name email');
};

// Método estático para obter mensagens não lidas
partnershipMessageSchema.statics.getUnreadMessages = function (limit = 100) {
  return this.find({
    isRead: false,
    status: { $nin: ['closed', 'archived'] }
  })
    .sort({ priority: -1, createdAt: -1 })
    .limit(limit)
    .populate('partnerId', 'name company category')
    .populate('assignedTo', 'name email');
};

// Método estático para obter mensagens por status
partnershipMessageSchema.statics.getMessagesByStatus = function (status, limit = 100) {
  return this.find({ status })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('partnerId', 'name company category')
    .populate('assignedTo', 'name email');
};

// Método estático para obter mensagens por prioridade
partnershipMessageSchema.statics.getMessagesByPriority = function (priority, limit = 100) {
  return this.find({
    priority,
    status: { $nin: ['closed', 'archived'] }
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('partnerId', 'name company category')
    .populate('assignedTo', 'name email');
};

// Método estático para obter estatísticas de mensagens
partnershipMessageSchema.statics.getMessageStats = async function () {
  const stats = await this.aggregate([
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

// Método estático para obter mensagens sinalizadas
partnershipMessageSchema.statics.getFlaggedMessages = function (limit = 100) {
  return this.find({
    isFlagged: true
  })
    .sort({ flaggedAt: -1 })
    .limit(limit)
    .populate('partnerId', 'name company category')
    .populate('flaggedBy', 'name email');
};

// Método estático para buscar mensagens por texto
partnershipMessageSchema.statics.searchMessages = function (searchTerm, limit = 50) {
  return this.find({
    $or: [
      { subject: { $regex: searchTerm, $options: 'i' } },
      { content: { $regex: searchTerm, $options: 'i' } },
      { adminNotes: { $regex: searchTerm, $options: 'i' } }
    ],
    status: { $ne: 'archived' }
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('partnerId', 'name company category')
    .populate('assignedTo', 'name email');
};

// Create PartnershipMessage model
const PartnershipMessage = mongoose.model('PartnershipMessage', partnershipMessageSchema);

export default PartnershipMessage;
