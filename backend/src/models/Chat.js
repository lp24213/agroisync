const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    // Identificação da conversa
    conversationId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    
    // Usuário (nullable para usuários anônimos)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    
    // Mensagens da conversa
    messages: [
      {
        role: {
          type: String,
          enum: ['user', 'assistant', 'system'],
          required: true
        },
        text: {
          type: String,
          required: true
        },
        timestamp: {
          type: Date,
          default: Date.now
        },
        metadata: {
          // Para mensagens com imagens
          attachments: [
            {
              type: {
                type: String,
                enum: ['image', 'file', 'voice']
              },
              url: String,
              filename: String,
              size: Number,
              mimeType: String,
              altText: String,
              caption: String // Caption gerada pelo LLM para imagens
            }
          ],
          // Para mensagens de voz
          voiceData: {
            duration: Number,
            transcription: String,
            audioUrl: String
          },
          // Status da mensagem
          status: {
            type: String,
            enum: ['sending', 'delivered', 'error'],
            default: 'delivered'
          },
          // Contexto específico (ex: freight order ID)
          context: {
            type: String,
            freightOrderId: mongoose.Schema.Types.ObjectId,
            productId: mongoose.Schema.Types.ObjectId
          }
        }
      }
    ],
    
    // Contexto da conversa
    context: {
      type: String,
      default: 'general'
    },
    
    // Configurações da conversa
    settings: {
      voiceEnabled: {
        type: Boolean,
        default: true
      },
      language: {
        type: String,
        default: 'pt'
      },
      aiModel: {
        type: String,
        default: 'gpt-3.5-turbo'
      }
    },
    
    // Estatísticas
    stats: {
      totalMessages: {
        type: Number,
        default: 0
      },
      totalTokens: {
        type: Number,
        default: 0
      },
      lastActivityAt: {
        type: Date,
        default: Date.now
      }
    },
    
    // Status da conversa
    isActive: {
      type: Boolean,
      default: true
    },
    
    // Tags para categorização
    tags: [String]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Índices
chatSchema.index({ userId: 1, createdAt: -1 });
chatSchema.index({ conversationId: 1 });
chatSchema.index({ 'stats.lastActivityAt': -1 });
chatSchema.index({ context: 1 });

// Virtuals
chatSchema.virtual('isAnonymous').get(function () {
  return !this.userId;
});

chatSchema.virtual('messageCount').get(function () {
  return this.messages.length;
});

chatSchema.virtual('lastMessage').get(function () {
  return this.messages.length > 0 ? this.messages[this.messages.length - 1] : null;
});

// Middleware pre-save
chatSchema.pre('save', function (next) {
  // Atualizar estatísticas
  this.stats.totalMessages = this.messages.length;
  this.stats.lastActivityAt = new Date();
  
  next();
});

// Métodos de instância
chatSchema.methods.addMessage = function (role, text, metadata = {}) {
  this.messages.push({
    role,
    text,
    timestamp: new Date(),
    metadata: {
      ...metadata,
      status: 'delivered'
    }
  });
  
  return this.save();
};

chatSchema.methods.getRecentMessages = function (limit = 10) {
  return this.messages.slice(-limit);
};

chatSchema.methods.clearHistory = function () {
  this.messages = [];
  this.stats.totalMessages = 0;
  return this.save();
};

// Métodos estáticos
chatSchema.statics.findByUserId = function (userId) {
  return this.find({ userId }).sort({ 'stats.lastActivityAt': -1 });
};

chatSchema.statics.findByConversationId = function (conversationId) {
  return this.findOne({ conversationId });
};

chatSchema.statics.createConversation = function (userId = null, context = 'general') {
  const conversationId = require('uuid').v4();
  
  return this.create({
    conversationId,
    userId,
    context,
    messages: []
  });
};

chatSchema.statics.findActiveConversations = function (limit = 50) {
  return this.find({ isActive: true })
    .sort({ 'stats.lastActivityAt': -1 })
    .limit(limit);
};

module.exports = mongoose.model('Chat', chatSchema);
