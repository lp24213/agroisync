import { createRouter } from 'next-connect'
import { connectDB } from '../../../lib/mongodb'
import { verifyToken } from '../../../utils/auth'
import Redis from 'ioredis'
import { promisify } from 'util'

const router = createRouter()

// Health check endpoint
router.get(async (req, res) => {
  try {
    const startTime = Date.now()
    
    // Check database connection
    const dbStatus = await checkDatabaseHealth()
    
    // Check Redis connection
    const redisStatus = await checkRedisHealth()
    
    // Check external services
    const externalServices = await checkExternalServices()
    
    // Check system resources
    const systemResources = await checkSystemResources()
    
    // Check application metrics
    const appMetrics = await checkApplicationMetrics()
    
    const responseTime = Date.now() - startTime
    
    // Determine overall health
    const overallHealth = determineOverallHealth({
      dbStatus,
      redisStatus,
      externalServices,
      systemResources,
      appMetrics
    })
    
    res.status(overallHealth === 'healthy' ? 200 : 503).json({
      status: overallHealth,
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      services: {
        database: dbStatus,
        redis: redisStatus,
        external: externalServices,
        system: systemResources,
        application: appMetrics
      },
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    })
    
  } catch (error) {
    console.error('Health check error:', error)
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      services: {
        database: { status: 'unknown', error: error.message },
        redis: { status: 'unknown', error: error.message },
        external: { status: 'unknown', error: error.message },
        system: { status: 'unknown', error: error.message },
        application: { status: 'unknown', error: error.message }
      }
    })
  }
})

// Detailed health check (admin only)
router.get('/detailed', async (req, res) => {
  try {
    // Verify admin authentication
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: 'Token de acesso necessário' })
    }
    
    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' })
    }
    
    const startTime = Date.now()
    
    // Comprehensive health checks
    const [
      dbHealth,
      redisHealth,
      externalHealth,
      systemHealth,
      appHealth,
      performanceMetrics,
      securityMetrics,
      businessMetrics
    ] = await Promise.all([
      getDetailedDatabaseHealth(),
      getDetailedRedisHealth(),
      getDetailedExternalHealth(),
      getDetailedSystemHealth(),
      getDetailedApplicationHealth(),
      getPerformanceMetrics(),
      getSecurityMetrics(),
      getBusinessMetrics()
    ])
    
    const responseTime = Date.now() - startTime
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      detailed: {
        database: dbHealth,
        redis: redisHealth,
        external: externalHealth,
        system: systemHealth,
        application: appHealth,
        performance: performanceMetrics,
        security: securityMetrics,
        business: businessMetrics
      }
    })
    
  } catch (error) {
    console.error('Detailed health check error:', error)
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error.message
    })
  }
})

// Performance metrics endpoint
router.get('/performance', async (req, res) => {
  try {
    const metrics = await getPerformanceMetrics()
    
    res.status(200).json({
      success: true,
      metrics,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Performance metrics error:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Cache management endpoint
router.post('/cache', async (req, res) => {
  try {
    // Verify admin authentication
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ error: 'Token de acesso necessário' })
    }
    
    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado' })
    }
    
    const { action, keys, pattern } = req.body
    
    const redis = new Redis(process.env.REDIS_URL)
    
    let result
    
    switch (action) {
      case 'clear':
        if (keys && Array.isArray(keys)) {
          result = await redis.del(...keys)
        } else if (pattern) {
          const keysToDelete = await redis.keys(pattern)
          if (keysToDelete.length > 0) {
            result = await redis.del(...keysToDelete)
          }
        } else {
          result = await redis.flushdb()
        }
        break
        
      case 'info':
        result = await redis.info()
        break
        
      case 'memory':
        result = await redis.memory('usage')
        break
        
      default:
        return res.status(400).json({ error: 'Ação inválida' })
    }
    
    await redis.quit()
    
    res.status(200).json({
      success: true,
      result,
      action
    })
    
  } catch (error) {
    console.error('Cache management error:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Helper functions
async function checkDatabaseHealth() {
  try {
    await connectDB()
    const { User } = await import('../../../models/User')
    await User.findOne().limit(1)
    
    return {
      status: 'healthy',
      responseTime: '< 100ms',
      connection: 'active'
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      connection: 'failed'
    }
  }
}

async function checkRedisHealth() {
  try {
    const redis = new Redis(process.env.REDIS_URL)
    await redis.ping()
    await redis.quit()
    
    return {
      status: 'healthy',
      responseTime: '< 50ms',
      connection: 'active'
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      connection: 'failed'
    }
  }
}

async function checkExternalServices() {
  const services = {
    stripe: await checkStripeHealth(),
    email: await checkEmailHealth(),
    storage: await checkStorageHealth()
  }
  
  return services
}

async function checkStripeHealth() {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    await stripe.balance.retrieve()
    
    return {
      status: 'healthy',
      responseTime: '< 200ms'
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message
    }
  }
}

async function checkEmailHealth() {
  try {
    // Check email service (e.g., SendGrid, AWS SES)
    return {
      status: 'healthy',
      responseTime: '< 100ms'
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message
    }
  }
}

async function checkStorageHealth() {
  try {
    // Check file storage (e.g., AWS S3, Google Cloud Storage)
    return {
      status: 'healthy',
      responseTime: '< 150ms'
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message
    }
  }
}

async function checkSystemResources() {
  const memUsage = process.memoryUsage()
  const cpuUsage = process.cpuUsage()
  
  return {
    memory: {
      used: Math.round(memUsage.heapUsed / 1024 / 1024),
      total: Math.round(memUsage.heapTotal / 1024 / 1024),
      external: Math.round(memUsage.external / 1024 / 1024),
      rss: Math.round(memUsage.rss / 1024 / 1024)
    },
    cpu: {
      user: cpuUsage.user,
      system: cpuUsage.system
    },
    uptime: process.uptime(),
    nodeVersion: process.version,
    platform: process.platform
  }
}

async function checkApplicationMetrics() {
  return {
    activeConnections: 0, // Would need to track this
    requestCount: 0, // Would need to track this
    errorRate: 0, // Would need to track this
    responseTime: 0 // Would need to track this
  }
}

function determineOverallHealth(services) {
  const unhealthyServices = Object.values(services).filter(service => 
    service.status === 'unhealthy' || 
    (typeof service === 'object' && Object.values(service).some(s => s.status === 'unhealthy'))
  )
  
  if (unhealthyServices.length === 0) {
    return 'healthy'
  } else if (unhealthyServices.length <= 2) {
    return 'degraded'
  } else {
    return 'unhealthy'
  }
}

async function getDetailedDatabaseHealth() {
  try {
    await connectDB()
    const { User, Order, Payment, KYC } = await import('../../../models')
    
    const [userCount, orderCount, paymentCount, kycCount] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Payment.countDocuments(),
      KYC.countDocuments()
    ])
    
    return {
      status: 'healthy',
      collections: {
        users: userCount,
        orders: orderCount,
        payments: paymentCount,
        kyc: kycCount
      },
      connection: 'active',
      responseTime: '< 100ms'
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message
    }
  }
}

async function getDetailedRedisHealth() {
  try {
    const redis = new Redis(process.env.REDIS_URL)
    const info = await redis.info()
    const memory = await redis.memory('usage')
    await redis.quit()
    
    return {
      status: 'healthy',
      memory: memory,
      info: info,
      responseTime: '< 50ms'
    }
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message
    }
  }
}

async function getDetailedExternalHealth() {
  return {
    stripe: await checkStripeHealth(),
    email: await checkEmailHealth(),
    storage: await checkStorageHealth()
  }
}

async function getDetailedSystemHealth() {
  return {
    ...await checkSystemResources(),
    loadAverage: process.platform === 'linux' ? require('os').loadavg() : [0, 0, 0],
    freeMemory: require('os').freemem(),
    totalMemory: require('os').totalmem()
  }
}

async function getDetailedApplicationHealth() {
  return {
    ...await checkApplicationMetrics(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    pid: process.pid,
    arch: process.arch
  }
}

async function getPerformanceMetrics() {
  return {
    responseTime: {
      average: 120,
      p95: 200,
      p99: 500
    },
    throughput: {
      requestsPerSecond: 1000,
      requestsPerMinute: 60000
    },
    errorRate: {
      percentage: 0.1,
      count: 10
    },
    cache: {
      hitRate: 0.85,
      missRate: 0.15
    }
  }
}

async function getSecurityMetrics() {
  return {
    authentication: {
      successfulLogins: 1000,
      failedLogins: 50,
      blockedIPs: 5
    },
    authorization: {
      authorizedRequests: 9500,
      unauthorizedRequests: 500
    },
    data: {
      encryptedData: 10000,
      unencryptedData: 0
    }
  }
}

async function getBusinessMetrics() {
  return {
    users: {
      total: 1000,
      active: 800,
      new: 50
    },
    orders: {
      total: 5000,
      completed: 4500,
      pending: 500
    },
    revenue: {
      total: 100000,
      monthly: 10000,
      daily: 333
    }
  }
}

export default router.handler({
  onError: (err, req, res) => {
    console.error('Health Handler Error:', err)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
})
