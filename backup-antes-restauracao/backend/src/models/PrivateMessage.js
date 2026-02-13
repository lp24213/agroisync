import mongoose from 'mongoose';

// Private Message schema for user-to-user communication
const privateMessageSchema = new mongoose.Schema({
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
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },

  // Message Type and Context
  messageType: {
    type: String,
    required: true,
    enum: ['inquiry', 'offer', 'negotiation', 'freight_request', 'general'],
    default: 'general'
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
    enum: ['sent', 'delivered', 'read', 'replied', 'archived'],
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
    ref: 'PrivateMessage'
  },
  replies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PrivateMessage'
    }
  ],

  // Attachments
  attachments: [
    {
      filename: String,
      originalName: String,
      mimeType: String,
      size: Number,
      url: String
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
      trim: true
    }
  ],

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

// Ãndices para melhor performance
privateMessageSchema.index({ senderId: 1, receiverId: 1 });
privateMessageSchema.index({ receiverId: 1, status: 1 });
privateMessageSchema.index({ createdAt: -1 });
privateMessageSchema.index({ messageType: 1 });
privateMessageSchema.index({ parentMessage: 1 });

// Middleware para atualizar timestamp
privateMessageSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// MÃ©todo para marcar mensagem como lida
privateMessageSchema.methods.markAsRead = function () {
  this.isRead = true;
  this.status = 'read';
  this.readAt = new Date();
  return this.save();
};

// MÃ©todo para marcar mensagem como respondida
privateMessageSchema.methods.markAsReplied = function () {
  this.status = 'replied';
  return this.save();
};

// MÃ©todo para arquivar mensagem
privateMessageSchema.methods.archive = function () {
  this.status = 'archived';
  return this.save();
};

// MÃ©todo para obter conversa entre dois usuÃ¡rios
privateMessageSchema.statics.getConversation = function (user1Id, user2Id, limit = 50) {
  return this.find({
    $or: [
      { senderId: user1Id, receiverId: user2Id },
      { senderId: user2Id, receiverId: user1Id }
    ]
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('senderId', 'name company.name')
    .populate('receiverId', 'name company.name')
    .populate('relatedProduct', 'name price images')
    .populate('relatedFreight', 'origin destination price');
};

// MÃ©todo para obter mensagens nÃ£o lidas de um usuÃ¡rio
privateMessageSchema.statics.getUnreadMessages = function (userId) {
  return this.find({
    receiverId: userId,
    isRead: false
  })
    .sort({ createdAt: -1 })
    .populate('senderId', 'name company.name')
    .populate('relatedProduct', 'name price images')
    .populate('relatedFreight', 'origin destination price');
};

// MÃ©todo para obter estatÃ­sticas de mensagens
privateMessageSchema.statics.getMessageStats = async function (userId) {
  const stats = await this.aggregate([
    {
      $match: {
        $or: [
          { senderId: mongoose.Types.ObjectId(userId) },
          { receiverId: mongoose.Types.ObjectId(userId) }
        ]
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

// Create PrivateMessage model
const PrivateMessage = mongoose.model('PrivateMessage', privateMessageSchema);

export default PrivateMessage;
