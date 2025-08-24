import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  attachments: [{
    filename: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['image', 'document', 'other'],
      default: 'other'
    },
    size: {
      type: Number
    }
  }],
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  listing: {
    type: {
      type: String,
      enum: ['product', 'freight'],
      required: true
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'listing.model',
      required: true
    },
    model: {
      type: String,
      enum: ['Product', 'Freight'],
      required: true
    }
  },
  module: {
    type: String,
    enum: ['store', 'freight'],
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'closed'],
    default: 'active'
  },
  lastMessage: {
    type: Date,
    default: Date.now
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: new Map()
  },
  messages: [messageSchema],
  isActive: {
    type: Boolean,
    default: true
  },
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
conversationSchema.index({ participants: 1 });
conversationSchema.index({ 'listing.id': 1 });
conversationSchema.index({ module: 1 });
conversationSchema.index({ lastMessage: -1 });
conversationSchema.index({ status: 1 });

// Middleware para atualizar timestamp
conversationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Método para adicionar mensagem
conversationSchema.methods.addMessage = function(senderId, content, attachments = []) {
  const message = {
    sender: senderId,
    content,
    attachments,
    createdAt: new Date()
  };

  this.messages.push(message);
  this.lastMessage = new Date();
  
  // Atualizar contador de não lidas para outros participantes
  this.participants.forEach(participantId => {
    if (participantId.toString() !== senderId.toString()) {
      const currentCount = this.unreadCount.get(participantId.toString()) || 0;
      this.unreadCount.set(participantId.toString(), currentCount + 1);
    }
  });

  return this.save();
};

// Método para marcar mensagens como lidas
conversationSchema.methods.markAsRead = function(userId) {
  this.messages.forEach(message => {
    if (message.sender.toString() !== userId.toString() && !message.isRead) {
      message.isRead = true;
      message.readAt = new Date();
    }
  });

  // Resetar contador de não lidas para o usuário
  this.unreadCount.set(userId.toString(), 0);

  return this.save();
};

// Método para obter conversas de um usuário
conversationSchema.statics.findByUser = function(userId, module = null) {
  const query = {
    participants: userId,
    isActive: true
  };

  if (module) {
    query.module = module;
  }

  return this.find(query)
    .populate('participants', 'name email')
    .populate('listing.id')
    .sort({ lastMessage: -1 });
};

export const Conversation = mongoose.model('Conversation', conversationSchema);
