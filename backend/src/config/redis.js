const redis = require('redis');
const logger = require('../utils/logger');

const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  retry_strategy: (options) => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      logger.error('Redis server connection refused');
      return new Error('Redis server connection refused');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      logger.error('Redis retry time exhausted');
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      logger.error('Redis max retry attempts reached');
      return undefined;
    }
    // Reconectar após
    return Math.min(options.attempt * 100, 3000);
  }
});

redisClient.on('connect', () => {
  logger.info('Redis conectado');
});

redisClient.on('error', (err) => {
  logger.error('Erro Redis:', err);
});

redisClient.on('ready', () => {
  logger.info('Redis pronto para uso');
});

redisClient.on('end', () => {
  logger.warn('Conexão Redis encerrada');
});

// Funções utilitárias para Redis
const redisUtils = {
  // Cache com TTL
  async setCache(key, value, ttl = 3600) {
    try {
      await redisClient.setEx(key, ttl, JSON.stringify(value));
    } catch (error) {
      logger.error('Erro ao definir cache:', error);
    }
  },

  // Obter cache
  async getCache(key) {
    try {
      const value = await redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Erro ao obter cache:', error);
      return null;
    }
  },

  // Deletar cache
  async deleteCache(key) {
    try {
      await redisClient.del(key);
    } catch (error) {
      logger.error('Erro ao deletar cache:', error);
    }
  },

  // Cache de sessão
  async setSession(sessionId, data, ttl = 86400) {
    await this.setCache(`session:${sessionId}`, data, ttl);
  },

  async getSession(sessionId) {
    return await this.getCache(`session:${sessionId}`);
  },

  async deleteSession(sessionId) {
    await this.deleteCache(`session:${sessionId}`);
  },

  // Cache de rate limiting
  async incrementRateLimit(key, window = 60) {
    try {
      const current = await redisClient.incr(key);
      if (current === 1) {
        await redisClient.expire(key, window);
      }
      return current;
    } catch (error) {
      logger.error('Erro no rate limiting:', error);
      return 0;
    }
  },

  // Cache de produtos
  async cacheProducts(category, products, ttl = 1800) {
    await this.setCache(`products:${category}`, products, ttl);
  },

  async getCachedProducts(category) {
    return await this.getCache(`products:${category}`);
  },

  // Cache de cotações
  async cacheQuotes(quotes, ttl = 300) {
    await this.setCache('quotes:latest', quotes, ttl);
  },

  async getCachedQuotes() {
    return await this.getCache('quotes:latest');
  }
};

module.exports = { redisClient, redisUtils };
