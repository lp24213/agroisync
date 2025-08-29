import mongoose from 'mongoose';

const userReputationSchema = new mongoose.Schema({
  // Usuário
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },

  // Pontuação geral
  totalScore: {
    type: Number,
    default: 0,
    min: 0,
    index: true
  },

  // Nível do usuário
  level: {
    type: Number,
    default: 1,
    min: 1,
    max: 100,
    index: true
  },

  // Experiência (XP)
  experience: {
    type: Number,
    default: 0,
    min: 0
  },

  // XP necessário para o próximo nível
  experienceToNextLevel: {
    type: Number,
    default: 100
  },

  // Estatísticas de transações
  transactionStats: {
    totalTransactions: { type: Number, default: 0 },
    successfulTransactions: { type: Number, default: 0 },
    cancelledTransactions: { type: Number, default: 0 },
    totalVolume: { type: Number, default: 0 }, // Volume total em BRL
    averageRating: { type: Number, default: 0, min: 0, max: 5 }
  },

  // Estatísticas de produtos
  productStats: {
    totalProducts: { type: Number, default: 0 },
    activeProducts: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    totalContacts: { type: Number, default: 0 }
  },

  // Estatísticas de fretes
  freightStats: {
    totalFreights: { type: Number, default: 0 },
    activeFreights: { type: Number, default: 0 },
    completedFreights: { type: Number, default: 0 }
  },

  // Badges e conquistas
  badges: [{
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: String,
    icon: String,
    category: {
      type: String,
      enum: ['TRANSACTION', 'PRODUCT', 'FREIGHT', 'COMMUNITY', 'SPECIAL'],
      required: true
    },
    earnedAt: {
      type: Date,
      default: Date.now
    },
    rarity: {
      type: String,
      enum: ['COMMON', 'RARE', 'EPIC', 'LEGENDARY'],
      default: 'COMMON'
    }
  }],

  // Histórico de pontuação
  scoreHistory: [{
    action: {
      type: String,
      required: true,
      enum: [
        'TRANSACTION_COMPLETED',
        'PRODUCT_CREATED',
        'FREIGHT_CREATED',
        'POSITIVE_REVIEW',
        'NEGATIVE_REVIEW',
        'COMMUNITY_HELP',
        'REFERRAL',
        'DAILY_LOGIN',
        'WEEKLY_ACTIVITY',
        'MONTHLY_ACTIVITY'
      ]
    },
    points: {
      type: Number,
      required: true
    },
    description: String,
    metadata: mongoose.Schema.Types.Mixed,
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Rankings
  rankings: {
    global: { type: Number, default: null },
    regional: { type: Number, default: null },
    category: { type: Number, default: null }
  },

  // Configurações de notificações
  notifications: {
    levelUp: { type: Boolean, default: true },
    badgeEarned: { type: Boolean, default: true },
    rankingChange: { type: Boolean, default: true },
    weeklyReport: { type: Boolean, default: true }
  },

  // Datas importantes
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastActivityAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Middleware para atualizar updatedAt
userReputationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Método para calcular XP necessário para o próximo nível
userReputationSchema.methods.calculateExperienceToNextLevel = function() {
  return Math.floor(100 * Math.pow(1.5, this.level - 1));
};

// Método para adicionar pontos e verificar level up
userReputationSchema.methods.addPoints = function(points, action, description, metadata = {}) {
  this.totalScore += points;
  this.experience += points;
  
  // Adicionar ao histórico
  this.scoreHistory.push({
    action,
    points,
    description,
    metadata,
    earnedAt: new Date()
  });

  // Verificar level up
  while (this.experience >= this.experienceToNextLevel) {
    this.experience -= this.experienceToNextLevel;
    this.level += 1;
    this.experienceToNextLevel = this.calculateExperienceToNextLevel();
  }

  this.lastActivityAt = new Date();
  return this;
};

// Método para calcular badge baseado em estatísticas
userReputationSchema.methods.calculateBadges = function() {
  const newBadges = [];
  
  // Badge de Primeira Transação
  if (this.transactionStats.totalTransactions >= 1 && 
      !this.badges.find(b => b.id === 'FIRST_TRANSACTION')) {
    newBadges.push({
      id: 'FIRST_TRANSACTION',
      name: 'Primeira Transação',
      description: 'Completou sua primeira transação',
      icon: '🎯',
      category: 'TRANSACTION',
      rarity: 'COMMON'
    });
  }

  // Badge de Vendedor Ativo
  if (this.productStats.totalProducts >= 10 && 
      !this.badges.find(b => b.id === 'ACTIVE_SELLER')) {
    newBadges.push({
      id: 'ACTIVE_SELLER',
      name: 'Vendedor Ativo',
      description: 'Cadastrou 10 ou mais produtos',
      icon: '🏪',
      category: 'PRODUCT',
      rarity: 'RARE'
    });
  }

  // Badge de Transportador
  if (this.freightStats.completedFreights >= 5 && 
      !this.badges.find(b => b.id === 'TRANSPORTER')) {
    newBadges.push({
      id: 'TRANSPORTER',
      name: 'Transportador',
      description: 'Completou 5 ou mais fretes',
      icon: '🚚',
      category: 'FREIGHT',
      rarity: 'RARE'
    });
  }

  // Badge de Confiável
  if (this.transactionStats.averageRating >= 4.5 && 
      this.transactionStats.successfulTransactions >= 20 && 
      !this.badges.find(b => b.id === 'TRUSTED_USER')) {
    newBadges.push({
      id: 'TRUSTED_USER',
      name: 'Usuário Confiável',
      description: 'Alta avaliação e muitas transações bem-sucedidas',
      icon: '⭐',
      category: 'SPECIAL',
      rarity: 'EPIC'
    });
  }

  // Badge de Top Vendedor
  if (this.transactionStats.totalVolume >= 10000 && 
      this.transactionStats.successfulTransactions >= 50 && 
      !this.badges.find(b => b.id === 'TOP_SELLER')) {
    newBadges.push({
      id: 'TOP_SELLER',
      name: 'Top Vendedor',
      description: 'Vendeu mais de R$ 10.000 em produtos',
      icon: '👑',
      category: 'SPECIAL',
      rarity: 'LEGENDARY'
    });
  }

  return newBadges;
};

// Índices para performance
userReputationSchema.index({ totalScore: -1 });
userReputationSchema.index({ level: -1 });
userReputationSchema.index({ 'transactionStats.totalVolume': -1 });
userReputationSchema.index({ 'transactionStats.averageRating': -1 });

const UserReputation = mongoose.model('UserReputation', userReputationSchema);

export default UserReputation;
