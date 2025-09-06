import Redis from 'ioredis'

class CacheManager {
  constructor() {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')
    this.defaultTTL = 3600 // 1 hour
  }

  async get(key) {
    try {
      const value = await this.redis.get(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  async set(key, value, ttl = this.defaultTTL) {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('Cache set error:', error)
      return false
    }
  }

  async del(key) {
    try {
      await this.redis.del(key)
      return true
    } catch (error) {
      console.error('Cache delete error:', error)
      return false
    }
  }

  async clear(pattern = '*') {
    try {
      const keys = await this.redis.keys(pattern)
      if (keys.length > 0) {
        await this.redis.del(...keys)
      }
      return true
    } catch (error) {
      console.error('Cache clear error:', error)
      return false
    }
  }

  async exists(key) {
    try {
      return await this.redis.exists(key)
    } catch (error) {
      console.error('Cache exists error:', error)
      return false
    }
  }

  async expire(key, ttl) {
    try {
      await this.redis.expire(key, ttl)
      return true
    } catch (error) {
      console.error('Cache expire error:', error)
      return false
    }
  }

  async getStats() {
    try {
      const info = await this.redis.info()
      return {
        connected: true,
        info: info
      }
    } catch (error) {
      console.error('Cache stats error:', error)
      return {
        connected: false,
        error: error.message
      }
    }
  }
}

export const cache = new CacheManager()
export default cache
