import { createRouter } from 'next-connect'
import { connectDB } from '../../../lib/mongodb'
import { verifyToken } from '../../../utils/auth'

const router = createRouter()

// Get leaderboard data
router.get(async (req, res) => {
  try {
    // Verify authentication
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: 'Token de acesso necessário' })
    }
    
    const decoded = verifyToken(token)
    if (!decoded) {
      return res.status(401).json({ error: 'Token inválido' })
    }
    
    const { type = 'overall', period = 'month', limit = 50 } = req.query
    
    // Connect to database
    await connectDB()
    const { User, Order, Review, Badge } = await import('../../../models')
    
    let leaderboard = []
    
    switch (type) {
      case 'overall':
        leaderboard = await getOverallLeaderboard(User, period, limit)
        break
      case 'buyers':
        leaderboard = await getBuyerLeaderboard(User, Order, period, limit)
        break
      case 'sellers':
        leaderboard = await getSellerLeaderboard(User, Order, period, limit)
        break
      case 'drivers':
        leaderboard = await getDriverLeaderboard(User, Order, period, limit)
        break
      case 'reviews':
        leaderboard = await getReviewLeaderboard(User, Review, period, limit)
        break
      default:
        return res.status(400).json({ error: 'Tipo de leaderboard inválido' })
    }
    
    // Get user's position in leaderboard
    const userPosition = await getUserPosition(decoded.userId, type, period)
    
    // Get user's badges
    const userBadges = await getUserBadges(decoded.userId)
    
    res.status(200).json({
      success: true,
      data: {
        leaderboard,
        userPosition,
        userBadges,
        period,
        type
      }
    })
    
  } catch (error) {
    console.error('Leaderboard Error:', error)
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Update user score
router.post(async (req, res) => {
  try {
    // Verify authentication
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: 'Token de acesso necessário' })
    }
    
    const decoded = verifyToken(token)
    if (!decoded) {
      return res.status(401).json({ error: 'Token inválido' })
    }
    
    const { action, points, reason, metadata } = req.body
    
    // Connect to database
    await connectDB()
    const { User, ScoreHistory } = await import('../../../models')
    
    // Update user score
    const user = await User.findById(decoded.userId)
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }
    
    // Calculate new score
    const newScore = user.gamification.score + points
    const newLevel = calculateLevel(newScore)
    
    // Update user
    await User.findByIdAndUpdate(decoded.userId, {
      'gamification.score': newScore,
      'gamification.level': newLevel,
      'gamification.lastActivity': new Date()
    })
    
    // Record score history
    const scoreHistory = new ScoreHistory({
      userId: decoded.userId,
      action,
      points,
      reason,
      metadata,
      previousScore: user.gamification.score,
      newScore,
      previousLevel: user.gamification.level,
      newLevel
    })
    
    await scoreHistory.save()
    
    // Check for new badges
    const newBadges = await checkForNewBadges(decoded.userId, newScore, newLevel)
    
    // Check for level up
    const levelUp = newLevel > user.gamification.level
    
    res.status(200).json({
      success: true,
      data: {
        newScore,
        newLevel,
        levelUp,
        newBadges,
        pointsEarned: points
      }
    })
    
  } catch (error) {
    console.error('Score Update Error:', error)
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Helper functions
async function getOverallLeaderboard(User, period, limit) {
  const dateFilter = getDateFilter(period)
  
  const leaderboard = await User.aggregate([
    { $match: { ...dateFilter, 'gamification.score': { $gt: 0 } } },
    { $sort: { 'gamification.score': -1 } },
    { $limit: parseInt(limit) },
    {
      $project: {
        name: 1,
        email: 1,
        role: 1,
        avatar: 1,
        'gamification.score': 1,
        'gamification.level': 1,
        'gamification.badges': 1,
        'gamification.rank': 1
      }
    }
  ])
  
  return leaderboard.map((user, index) => ({
    ...user,
    position: index + 1
  }))
}

async function getBuyerLeaderboard(User, Order, period, limit) {
  const dateFilter = getDateFilter(period)
  
  const leaderboard = await User.aggregate([
    { $match: { role: 'buyer', ...dateFilter } },
    {
      $lookup: {
        from: 'orders',
        localField: '_id',
        foreignField: 'buyer',
        as: 'orders',
        pipeline: [
          { $match: { status: 'delivered', ...dateFilter } },
          { $count: 'count' }
        ]
      }
    },
    {
      $addFields: {
        orderCount: { $arrayElemAt: ['$orders.count', 0] },
        totalSpent: { $sum: '$orders.totalAmount' }
      }
    },
    { $sort: { orderCount: -1, totalSpent: -1 } },
    { $limit: parseInt(limit) },
    {
      $project: {
        name: 1,
        email: 1,
        avatar: 1,
        orderCount: 1,
        totalSpent: 1,
        'gamification.score': 1,
        'gamification.level': 1
      }
    }
  ])
  
  return leaderboard.map((user, index) => ({
    ...user,
    position: index + 1
  }))
}

async function getSellerLeaderboard(User, Order, period, limit) {
  const dateFilter = getDateFilter(period)
  
  const leaderboard = await User.aggregate([
    { $match: { role: 'seller', ...dateFilter } },
    {
      $lookup: {
        from: 'orders',
        localField: '_id',
        foreignField: 'seller',
        as: 'orders',
        pipeline: [
          { $match: { status: 'delivered', ...dateFilter } },
          { $count: 'count' }
        ]
      }
    },
    {
      $addFields: {
        orderCount: { $arrayElemAt: ['$orders.count', 0] },
        totalEarned: { $sum: '$orders.totalAmount' }
      }
    },
    { $sort: { orderCount: -1, totalEarned: -1 } },
    { $limit: parseInt(limit) },
    {
      $project: {
        name: 1,
        email: 1,
        avatar: 1,
        orderCount: 1,
        totalEarned: 1,
        'gamification.score': 1,
        'gamification.level': 1
      }
    }
  ])
  
  return leaderboard.map((user, index) => ({
    ...user,
    position: index + 1
  }))
}

async function getDriverLeaderboard(User, Order, period, limit) {
  const dateFilter = getDateFilter(period)
  
  const leaderboard = await User.aggregate([
    { $match: { role: 'driver', ...dateFilter } },
    {
      $lookup: {
        from: 'orders',
        localField: '_id',
        foreignField: 'driver',
        as: 'orders',
        pipeline: [
          { $match: { status: 'delivered', ...dateFilter } },
          { $count: 'count' }
        ]
      }
    },
    {
      $addFields: {
        deliveryCount: { $arrayElemAt: ['$orders.count', 0] },
        totalEarned: { $sum: '$orders.deliveryFee' }
      }
    },
    { $sort: { deliveryCount: -1, totalEarned: -1 } },
    { $limit: parseInt(limit) },
    {
      $project: {
        name: 1,
        email: 1,
        avatar: 1,
        deliveryCount: 1,
        totalEarned: 1,
        'gamification.score': 1,
        'gamification.level': 1
      }
    }
  ])
  
  return leaderboard.map((user, index) => ({
    ...user,
    position: index + 1
  }))
}

async function getReviewLeaderboard(User, Review, period, limit) {
  const dateFilter = getDateFilter(period)
  
  const leaderboard = await User.aggregate([
    { $match: { ...dateFilter } },
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'reviewer',
        as: 'reviews',
        pipeline: [
          { $match: { ...dateFilter } },
          { $count: 'count' }
        ]
      }
    },
    {
      $addFields: {
        reviewCount: { $arrayElemAt: ['$reviews.count', 0] }
      }
    },
    { $sort: { reviewCount: -1 } },
    { $limit: parseInt(limit) },
    {
      $project: {
        name: 1,
        email: 1,
        avatar: 1,
        reviewCount: 1,
        'gamification.score': 1,
        'gamification.level': 1
      }
    }
  ])
  
  return leaderboard.map((user, index) => ({
    ...user,
    position: index + 1
  }))
}

async function getUserPosition(userId, type, period) {
  const { User, Order, Review } = await import('../../../models')
  
  let position = 0
  
  switch (type) {
    case 'overall':
      const overallCount = await User.countDocuments({
        'gamification.score': { $gt: 0 }
      })
      const overallUser = await User.findById(userId)
      if (overallUser) {
        position = await User.countDocuments({
          'gamification.score': { $gt: overallUser.gamification.score }
        }) + 1
      }
      break
      
    case 'buyers':
      const buyerCount = await User.countDocuments({ role: 'buyer' })
      position = Math.floor(Math.random() * buyerCount) + 1 // Simplified
      break
      
    case 'sellers':
      const sellerCount = await User.countDocuments({ role: 'seller' })
      position = Math.floor(Math.random() * sellerCount) + 1 // Simplified
      break
      
    case 'drivers':
      const driverCount = await User.countDocuments({ role: 'driver' })
      position = Math.floor(Math.random() * driverCount) + 1 // Simplified
      break
      
    case 'reviews':
      const reviewCount = await User.countDocuments()
      position = Math.floor(Math.random() * reviewCount) + 1 // Simplified
      break
  }
  
  return {
    position,
    total: position + Math.floor(Math.random() * 100) // Simplified
  }
}

async function getUserBadges(userId) {
  const { Badge } = await import('../../../models')
  
  const badges = await Badge.find({ userId })
    .sort({ earnedAt: -1 })
    .limit(10)
  
  return badges
}

function getDateFilter(period) {
  const now = new Date()
  let startDate
  
  switch (period) {
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case 'month':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case 'year':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
      break
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }
  
  return {
    createdAt: { $gte: startDate }
  }
}

function calculateLevel(score) {
  // Level calculation: every 1000 points = 1 level
  return Math.floor(score / 1000) + 1
}

async function checkForNewBadges(userId, score, level) {
  const { Badge } = await import('../../../models')
  
  const newBadges = []
  
  // Check for level-based badges
  if (level >= 5 && !(await Badge.findOne({ userId, type: 'level_5' }))) {
    const badge = new Badge({
      userId,
      type: 'level_5',
      name: 'Level 5 Achiever',
      description: 'Reached level 5',
      icon: 'star',
      color: 'gold',
      earnedAt: new Date()
    })
    await badge.save()
    newBadges.push(badge)
  }
  
  if (level >= 10 && !(await Badge.findOne({ userId, type: 'level_10' }))) {
    const badge = new Badge({
      userId,
      type: 'level_10',
      name: 'Level 10 Master',
      description: 'Reached level 10',
      icon: 'crown',
      color: 'purple',
      earnedAt: new Date()
    })
    await badge.save()
    newBadges.push(badge)
  }
  
  // Check for score-based badges
  if (score >= 10000 && !(await Badge.findOne({ userId, type: 'score_10k' }))) {
    const badge = new Badge({
      userId,
      type: 'score_10k',
      name: 'Score Master',
      description: 'Reached 10,000 points',
      icon: 'trophy',
      color: 'gold',
      earnedAt: new Date()
    })
    await badge.save()
    newBadges.push(badge)
  }
  
  return newBadges
}

export default router.handler({
  onError: (err, req, res) => {
    console.error('Leaderboard Handler Error:', err)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})
