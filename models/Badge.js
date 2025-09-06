import mongoose from 'mongoose'

const BadgeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: [
      'first_order',
      'first_sale',
      'first_delivery',
      'level_5',
      'level_10',
      'level_25',
      'level_50',
      'score_1k',
      'score_5k',
      'score_10k',
      'score_25k',
      'score_50k',
      'perfect_rating',
      'top_seller',
      'top_buyer',
      'top_driver',
      'early_adopter',
      'loyal_customer',
      'power_user',
      'reviewer',
      'social_butterfly',
      'achiever',
      'collector',
      'explorer',
      'helper',
      'mentor',
      'champion',
      'legend',
      'special'
    ]
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true,
    enum: [
      'star',
      'crown',
      'trophy',
      'medal',
      'badge',
      'shield',
      'fire',
      'lightning',
      'heart',
      'diamond',
      'gem',
      'coin',
      'gift',
      'ribbon',
      'flag',
      'target',
      'check',
      'plus',
      'minus',
      'times',
      'question',
      'exclamation',
      'info',
      'warning',
      'error',
      'success',
      'loading',
      'refresh',
      'download',
      'upload',
      'save',
      'edit',
      'delete',
      'copy',
      'paste',
      'cut',
      'undo',
      'redo',
      'search',
      'filter',
      'sort',
      'list',
      'grid',
      'table',
      'chart',
      'graph',
      'pie',
      'bar',
      'line',
      'area',
      'scatter',
      'bubble',
      'radar',
      'polar',
      'gauge',
      'funnel',
      'sankey',
      'treemap',
      'sunburst',
      'heatmap',
      'boxplot',
      'violin',
      'histogram',
      'density',
      'contour',
      'surface',
      'wireframe',
      'scatter3d',
      'bar3d',
      'line3d',
      'surface3d',
      'mesh3d',
      'scattergl',
      'scatter3dgl',
      'scatterpolargl',
      'scatterternary',
      'scattermapbox',
      'scattergeo',
      'scattergl',
      'scatter3dgl',
      'scatterpolargl',
      'scatterternary',
      'scattermapbox',
      'scattergeo'
    ]
  },
  color: {
    type: String,
    required: true,
    enum: [
      'red',
      'orange',
      'yellow',
      'green',
      'blue',
      'purple',
      'pink',
      'brown',
      'gray',
      'black',
      'white',
      'gold',
      'silver',
      'bronze',
      'copper',
      'platinum',
      'diamond',
      'emerald',
      'ruby',
      'sapphire',
      'amethyst',
      'topaz',
      'citrine',
      'peridot',
      'garnet',
      'aquamarine',
      'tourmaline',
      'zircon',
      'spinel',
      'tanzanite',
      'alexandrite',
      'morganite',
      'kunzite',
      'hiddenite',
      'euclase',
      'benitoite',
      'painite',
      'taaffeite',
      'musgravite',
      'grandidierite',
      'jeremejevite',
      'poudretteite',
      'serendibite',
      'pezzottaite',
      'red_beryl',
      'bixbite',
      'emerald',
      'aquamarine',
      'morganite',
      'goshenite',
      'heliodor',
      'maxixe',
      'red_beryl',
      'bixbite',
      'emerald',
      'aquamarine',
      'morganite',
      'goshenite',
      'heliodor',
      'maxixe'
    ]
  },
  rarity: {
    type: String,
    required: true,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'],
    default: 'common'
  },
  points: {
    type: Number,
    required: true,
    default: 0
  },
  earnedAt: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
})

// Indexes for better performance
BadgeSchema.index({ userId: 1, type: 1 })
BadgeSchema.index({ userId: 1, earnedAt: -1 })
BadgeSchema.index({ type: 1 })
BadgeSchema.index({ rarity: 1 })

// Virtual for badge display
BadgeSchema.virtual('displayName').get(function() {
  return this.name
})

// Virtual for badge description
BadgeSchema.virtual('displayDescription').get(function() {
  return this.description
})

// Method to get badge summary
BadgeSchema.methods.getSummary = function() {
  return {
    id: this._id,
    type: this.type,
    name: this.name,
    description: this.description,
    icon: this.icon,
    color: this.color,
    rarity: this.rarity,
    points: this.points,
    earnedAt: this.earnedAt
  }
}

// Static method to get user badges
BadgeSchema.statics.getUserBadges = async function(userId, limit = 20) {
  return await this.find({ userId })
    .sort({ earnedAt: -1 })
    .limit(limit)
}

// Static method to get badge statistics
BadgeSchema.statics.getBadgeStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        totalPoints: { $sum: '$points' }
      }
    },
    { $sort: { count: -1 } }
  ])
  
  const total = await this.countDocuments()
  
  return {
    total,
    byType: stats,
    totalPoints: stats.reduce((sum, stat) => sum + stat.totalPoints, 0)
  }
}

// Static method to get rarity distribution
BadgeSchema.statics.getRarityDistribution = async function() {
  const distribution = await this.aggregate([
    {
      $group: {
        _id: '$rarity',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ])
  
  return distribution
}

// Static method to get recent badges
BadgeSchema.statics.getRecentBadges = async function(limit = 10) {
  return await this.find()
    .populate('userId', 'name email avatar')
    .sort({ earnedAt: -1 })
    .limit(limit)
}

// Static method to check if user has badge
BadgeSchema.statics.userHasBadge = async function(userId, type) {
  const badge = await this.findOne({ userId, type })
  return !!badge
}

// Static method to award badge
BadgeSchema.statics.awardBadge = async function(userId, type, metadata = {}) {
  // Check if user already has this badge
  const existingBadge = await this.findOne({ userId, type })
  if (existingBadge) {
    return existingBadge
  }
  
  // Get badge configuration
  const badgeConfig = getBadgeConfig(type)
  if (!badgeConfig) {
    throw new Error(`Badge type ${type} not found`)
  }
  
  // Create new badge
  const badge = new this({
    userId,
    type,
    name: badgeConfig.name,
    description: badgeConfig.description,
    icon: badgeConfig.icon,
    color: badgeConfig.color,
    rarity: badgeConfig.rarity,
    points: badgeConfig.points,
    metadata
  })
  
  await badge.save()
  
  // Update user's total points
  const { User } = await import('./User')
  await User.findByIdAndUpdate(userId, {
    $inc: { 'gamification.score': badgeConfig.points }
  })
  
  return badge
}

// Badge configurations
function getBadgeConfig(type) {
  const configs = {
    first_order: {
      name: 'Primeiro Pedido',
      description: 'Realizou seu primeiro pedido',
      icon: 'shopping-cart',
      color: 'blue',
      rarity: 'common',
      points: 100
    },
    first_sale: {
      name: 'Primeira Venda',
      description: 'Realizou sua primeira venda',
      icon: 'dollar-sign',
      color: 'green',
      rarity: 'common',
      points: 100
    },
    first_delivery: {
      name: 'Primeira Entrega',
      description: 'Realizou sua primeira entrega',
      icon: 'truck',
      color: 'orange',
      rarity: 'common',
      points: 100
    },
    level_5: {
      name: 'Nível 5',
      description: 'Alcançou o nível 5',
      icon: 'star',
      color: 'gold',
      rarity: 'uncommon',
      points: 500
    },
    level_10: {
      name: 'Nível 10',
      description: 'Alcançou o nível 10',
      icon: 'crown',
      color: 'purple',
      rarity: 'rare',
      points: 1000
    },
    level_25: {
      name: 'Nível 25',
      description: 'Alcançou o nível 25',
      icon: 'trophy',
      color: 'diamond',
      rarity: 'epic',
      points: 2500
    },
    level_50: {
      name: 'Nível 50',
      description: 'Alcançou o nível 50',
      icon: 'gem',
      color: 'emerald',
      rarity: 'legendary',
      points: 5000
    },
    score_1k: {
      name: '1K Pontos',
      description: 'Alcançou 1.000 pontos',
      icon: 'target',
      color: 'blue',
      rarity: 'common',
      points: 0
    },
    score_5k: {
      name: '5K Pontos',
      description: 'Alcançou 5.000 pontos',
      icon: 'medal',
      color: 'silver',
      rarity: 'uncommon',
      points: 0
    },
    score_10k: {
      name: '10K Pontos',
      description: 'Alcançou 10.000 pontos',
      icon: 'trophy',
      color: 'gold',
      rarity: 'rare',
      points: 0
    },
    score_25k: {
      name: '25K Pontos',
      description: 'Alcançou 25.000 pontos',
      icon: 'crown',
      color: 'purple',
      rarity: 'epic',
      points: 0
    },
    score_50k: {
      name: '50K Pontos',
      description: 'Alcançou 50.000 pontos',
      icon: 'gem',
      color: 'diamond',
      rarity: 'legendary',
      points: 0
    },
    perfect_rating: {
      name: 'Avaliação Perfeita',
      description: 'Recebeu avaliação 5 estrelas',
      icon: 'star',
      color: 'gold',
      rarity: 'uncommon',
      points: 200
    },
    top_seller: {
      name: 'Top Vendedor',
      description: 'Está entre os melhores vendedores',
      icon: 'trending-up',
      color: 'green',
      rarity: 'rare',
      points: 500
    },
    top_buyer: {
      name: 'Top Comprador',
      description: 'Está entre os melhores compradores',
      icon: 'shopping-bag',
      color: 'blue',
      rarity: 'rare',
      points: 500
    },
    top_driver: {
      name: 'Top Entregador',
      description: 'Está entre os melhores entregadores',
      icon: 'truck',
      color: 'orange',
      rarity: 'rare',
      points: 500
    },
    early_adopter: {
      name: 'Early Adopter',
      description: 'Usuário desde o início',
      icon: 'rocket',
      color: 'purple',
      rarity: 'epic',
      points: 1000
    },
    loyal_customer: {
      name: 'Cliente Fiel',
      description: 'Cliente há mais de 1 ano',
      icon: 'heart',
      color: 'red',
      rarity: 'rare',
      points: 750
    },
    power_user: {
      name: 'Power User',
      description: 'Usuário ativo há mais de 6 meses',
      icon: 'zap',
      color: 'yellow',
      rarity: 'uncommon',
      points: 300
    },
    reviewer: {
      name: 'Avaliador',
      description: 'Deixou mais de 10 avaliações',
      icon: 'message-square',
      color: 'blue',
      rarity: 'uncommon',
      points: 250
    },
    social_butterfly: {
      name: 'Borboleta Social',
      description: 'Interagiu com muitos usuários',
      icon: 'users',
      color: 'pink',
      rarity: 'rare',
      points: 400
    },
    achiever: {
      name: 'Conquistador',
      description: 'Conquistou muitos badges',
      icon: 'award',
      color: 'gold',
      rarity: 'epic',
      points: 800
    },
    collector: {
      name: 'Colecionador',
      description: 'Colecionou muitos badges raros',
      icon: 'package',
      color: 'purple',
      rarity: 'legendary',
      points: 1500
    },
    explorer: {
      name: 'Explorador',
      description: 'Explorou todas as funcionalidades',
      icon: 'compass',
      color: 'green',
      rarity: 'rare',
      points: 600
    },
    helper: {
      name: 'Ajudante',
      description: 'Ajudou outros usuários',
      icon: 'help-circle',
      color: 'blue',
      rarity: 'uncommon',
      points: 200
    },
    mentor: {
      name: 'Mentor',
      description: 'Mentorou novos usuários',
      icon: 'user-check',
      color: 'purple',
      rarity: 'epic',
      points: 1000
    },
    champion: {
      name: 'Campeão',
      description: 'Líder em uma categoria',
      icon: 'trophy',
      color: 'gold',
      rarity: 'legendary',
      points: 2000
    },
    legend: {
      name: 'Lenda',
      description: 'Lenda da plataforma',
      icon: 'crown',
      color: 'diamond',
      rarity: 'mythic',
      points: 5000
    },
    special: {
      name: 'Especial',
      description: 'Badge especial',
      icon: 'star',
      color: 'rainbow',
      rarity: 'mythic',
      points: 1000
    }
  }
  
  return configs[type]
}

export default mongoose.models.Badge || mongoose.model('Badge', BadgeSchema)
