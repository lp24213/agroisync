import mongoose from 'mongoose';

const transactionMessageSchema = new mongoose.Schema(
  {
    // ID da transaÃ§Ã£o relacionada
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
      required: true,
      index: true
    },

    // UsuÃ¡rio que enviou a mensagem
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    // UsuÃ¡rio que recebeu a mensagem
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },

    // ConteÃºdo da mensagem
    body: {
      type: String,
      required: true,
      trim: true,
      maxlength: [2000, 'Mensagem nÃ£o pode ter mais de 2000 caracteres']
    },

    // Tipo da mensagem
    type: {
      type: String,
      enum: ['text', 'image', 'file', 'location', 'system'],
      default: 'text'
    },

    // Anexos (opcional)
    attachments: [
      {
        name: String,
        type: String,
        size: Number,
        url: String,
        thumbnail: String
      }
    ],

    // Status da mensagem
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read', 'failed'],
      default: 'sent',
      index: true
    },

    // Metadados
    metadata: {
      // Coordenadas se for mensagem de localizaÃ§Ã£o
      coordinates: {
        lat: Number,
        lng: Number,
        address: String
      },
      // InformaÃ§Ãµes do arquivo se for anexo
      fileInfo: {
        originalName: String,
        mimeType: String,
        size: Number
      }
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
      index: true
    },

    // Quando foi entregue
    deliveredAt: Date,

    // Quando foi lida
    readAt: Date,

    // UsuÃ¡rios que leram a mensagem
    readBy: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        readAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    // Mensagem pai (para respostas)
    parentMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TransactionMessage'
    },

    // Mensagens filhas (respostas)
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TransactionMessage'
      }
    ],

    // Flags e moderaÃ§Ã£o
    isFlagged: {
      type: Boolean,
      default: false
    },

    flaggedReason: String,

    flaggedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    flaggedAt: Date,

    // Soft delete
    isDeleted: {
      type: Boolean,
      default: false
    },

    deletedAt: Date,

    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Ãndices para performance
transactionMessageSchema.index({ transactionId: 1, createdAt: -1 });
transactionMessageSchema.index({ from: 1, createdAt: -1 });
transactionMessageSchema.index({ to: 1, createdAt: -1 });
transactionMessageSchema.index({ status: 1, createdAt: -1 });
transactionMessageSchema.index({ 'readBy.userId': 1 });
transactionMessageSchema.index({ isDeleted: 1 });

// Middleware para atualizar timestamps
transactionMessageSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    if (this.status === 'delivered' && !this.deliveredAt) {
      this.deliveredAt = new Date();
    }
    if (this.status === 'read' && !this.readAt) {
      this.readAt = new Date();
    }
  }
  next();
});

// Virtual para verificar se a mensagem foi lida
transactionMessageSchema.virtual('isRead').get(function () {
  return this.status === 'read';
});

// Virtual para verificar se a mensagem foi entregue
transactionMessageSchema.virtual('isDelivered').get(function () {
  return this.status === 'delivered' || this.status === 'read';
});

// Virtual para verificar se a mensagem falhou
transactionMessageSchema.virtual('isFailed').get(function () {
  return this.status === 'failed';
});

// Virtual para verificar se tem anexos
transactionMessageSchema.virtual('hasAttachments').get(function () {
  return this.attachments && this.attachments.length > 0;
});

// Virtual para verificar se Ã© imagem
transactionMessageSchema.virtual('isImage').get(function () {
  return this.type === 'image';
});

// Virtual para verificar se Ã© arquivo
transactionMessageSchema.virtual('isFile').get(function () {
  return this.type === 'file';
});

// Virtual para verificar se Ã© localizaÃ§Ã£o
transactionMessageSchema.virtual('isLocation').get(function () {
  return this.type === 'location';
});

// Virtual para verificar se Ã© sistema
transactionMessageSchema.virtual('isSystem').get(function () {
  return this.type === 'system';
});

// MÃ©todo para marcar como entregue
transactionMessageSchema.methods.markAsDelivered = function () {
  this.status = 'delivered';
  this.deliveredAt = new Date();
  return this.save();
};

// MÃ©todo para marcar como lida
transactionMessageSchema.methods.markAsRead = function (userId) {
  if (this.status !== 'read') {
    this.status = 'read';
    this.readAt = new Date();
  }

  // Adicionar usuÃ¡rio Ã  lista de leitores se nÃ£o estiver
  const alreadyRead = this.readBy.find(reader => reader.userId.toString() === userId.toString());

  if (!alreadyRead) {
    this.readBy.push({
      userId,
      readAt: new Date()
    });
  }

  return this.save();
};

// MÃ©todo para marcar como falhou
transactionMessageSchema.methods.markAsFailed = function (reason = 'Erro de entrega') {
  this.status = 'failed';
  return this.save();
};

// MÃ©todo para verificar se foi lida por um usuÃ¡rio especÃ­fico
transactionMessageSchema.methods.isReadBy = function (userId) {
  return this.readBy.some(reader => reader.userId.toString() === userId.toString());
};

// MÃ©todo para obter dados pÃºblicos (sem informaÃ§Ãµes sensÃ­veis)
transactionMessageSchema.methods.getPublicData = function () {
  return {
    id: this._id,
    transactionId: this.transactionId,
    from: this.from,
    to: this.to,
    body: this.body,
    type: this.type,
    status: this.status,
    hasAttachments: this.hasAttachments,
    createdAt: this.createdAt,
    deliveredAt: this.deliveredAt,
    readAt: this.readAt,
    isRead: this.isRead,
    isDelivered: this.isDelivered,
    isFailed: this.isFailed
  };
};

// MÃ©todo para obter dados completos (para usuÃ¡rios autorizados)
transactionMessageSchema.methods.getFullData = function (userId) {
  const baseData = this.getPublicData();

  // Adicionar anexos se existirem
  if (this.attachments && this.attachments.length > 0) {
    baseData.attachments = this.attachments;
  }

  // Adicionar metadados se existirem
  if (this.metadata) {
    baseData.metadata = this.metadata;
  }

  // Adicionar informaÃ§Ãµes de leitura
  baseData.readBy = this.readBy;

  // Adicionar informaÃ§Ãµes de resposta
  if (this.parentMessage) {
    baseData.parentMessage = this.parentMessage;
  }

  if (this.replies && this.replies.length > 0) {
    baseData.replies = this.replies;
  }

  return baseData;
};

// MÃ©todo para obter dados de exibiÃ§Ã£o (para UI)
transactionMessageSchema.methods.getDisplayData = function (currentUserId) {
  const baseData = this.getPublicData();

  // Adicionar flag se Ã© mensagem do usuÃ¡rio atual
  baseData.isOwnMessage = this.from.toString() === currentUserId.toString();

  // Adicionar informaÃ§Ãµes de anexos para exibiÃ§Ã£o
  if (this.attachments && this.attachments.length > 0) {
    baseData.attachments = this.attachments.map(attachment => ({
      name: attachment.name,
      type: attachment.type,
      size: attachment.size,
      url: attachment.url,
      thumbnail: attachment.thumbnail,
      isImage: attachment.type.startsWith('image/'),
      isFile: !attachment.type.startsWith('image/')
    }));
  }

  // Adicionar metadados de localizaÃ§Ã£o se aplicÃ¡vel
  if (this.type === 'location' && this.metadata?.coordinates) {
    baseData.location = {
      lat: this.metadata.coordinates.lat,
      lng: this.metadata.coordinates.lng,
      address: this.metadata.coordinates.address
    };
  }

  return baseData;
};

// MÃ©todos estÃ¡ticos para consultas comuns

// Buscar mensagens de uma transaÃ§Ã£o
transactionMessageSchema.statics.findByTransaction = function (transactionId, options = {}) {
  const { limit = 50, skip = 0, sort = { createdAt: -1 }, includeDeleted = false } = options;

  const query = { transactionId };

  if (!includeDeleted) {
    query.isDeleted = false;
  }

  return this.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('from', 'name email phone')
    .populate('to', 'name email phone')
    .populate('parentMessage')
    .populate('replies');
};

// Buscar mensagens nÃ£o lidas de um usuÃ¡rio
transactionMessageSchema.statics.findUnreadByUser = function (userId, transactionId = null) {
  const query = {
    to: userId,
    status: { $ne: 'read' },
    isDeleted: false
  };

  if (transactionId) {
    query.transactionId = transactionId;
  }

  return this.find(query)
    .populate('from', 'name email phone')
    .populate('transactionId', 'type itemDetails')
    .sort({ createdAt: -1 });
};

// Buscar mensagens de um usuÃ¡rio
transactionMessageSchema.statics.findByUser = function (userId, options = {}) {
  const {
    limit = 50,
    skip = 0,
    sort = { createdAt: -1 },
    includeDeleted = false,
    transactionId = null
  } = options;

  const query = {
    $or: [{ from: userId }, { to: userId }],
    isDeleted: false
  };

  if (transactionId) {
    query.transactionId = transactionId;
  }

  if (includeDeleted) {
    delete query.isDeleted;
  }

  return this.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('from', 'name email phone')
    .populate('to', 'name email phone')
    .populate('transactionId', 'type itemDetails');
};

// EstatÃ­sticas de mensagens
transactionMessageSchema.statics.getStats = async function (userId = null) {
  const matchStage = userId ? { $or: [{ from: userId }, { to: userId }] } : {};

  const stats = await this.aggregate([
    { $match: { ...matchStage, isDeleted: false } },
    {
      $group: {
        _id: null,
        totalMessages: { $sum: 1 },
        textMessages: {
          $sum: { $cond: [{ $eq: ['$type', 'text'] }, 1, 0] }
        },
        imageMessages: {
          $sum: { $cond: [{ $eq: ['$type', 'image'] }, 1, 0] }
        },
        fileMessages: {
          $sum: { $cond: [{ $eq: ['$type', 'file'] }, 1, 0] }
        },
        locationMessages: {
          $sum: { $cond: [{ $eq: ['$type', 'location'] }, 1, 0] }
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

  return (
    stats[0] || {
      totalMessages: 0,
      textMessages: 0,
      imageMessages: 0,
      fileMessages: 0,
      locationMessages: 0,
      systemMessages: 0,
      sentMessages: 0,
      deliveredMessages: 0,
      readMessages: 0,
      failedMessages: 0
    }
  );
};

// Buscar conversas ativas de um usuÃ¡rio
transactionMessageSchema.statics.findActiveConversations = function (userId, limit = 20) {
  return this.aggregate([
    {
      $match: {
        $or: [{ from: userId }, { to: userId }],
        isDeleted: false
      }
    },
    {
      $group: {
        _id: '$transactionId',
        lastMessage: { $last: '$$ROOT' },
        messageCount: { $sum: 1 },
        unreadCount: {
          $sum: {
            $cond: [{ $and: [{ $eq: ['$to', userId] }, { $ne: ['$status', 'read'] }] }, 1, 0]
          }
        }
      }
    },
    {
      $sort: { 'lastMessage.createdAt': -1 }
    },
    {
      $limit: limit
    },
    {
      $lookup: {
        from: 'transactions',
        localField: '_id',
        foreignField: '_id',
        as: 'transaction'
      }
    },
    {
      $unwind: '$transaction'
    },
    {
      $lookup: {
        from: 'users',
        localField: 'lastMessage.from',
        foreignField: '_id',
        as: 'fromUser'
      }
    },
    {
      $unwind: '$fromUser'
    },
    {
      $lookup: {
        from: 'users',
        localField: 'lastMessage.to',
        foreignField: '_id',
        as: 'toUser'
      }
    },
    {
      $unwind: '$toUser'
    }
  ]);
};

const TransactionMessage = mongoose.model('TransactionMessage', transactionMessageSchema);

export default TransactionMessage;
