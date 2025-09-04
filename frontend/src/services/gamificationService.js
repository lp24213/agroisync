import axios from 'axios';

// Configuração da API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Configuração do axios com interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Constantes para badges e conquistas
export const BADGE_CATEGORIES = {
  TRANSACTION: 'TRANSACTION',
  PRODUCT: 'PRODUCT',
  FREIGHT: 'FREIGHT',
  COMMUNITY: 'COMMUNITY',
  SPECIAL: 'SPECIAL'
};

export const BADGE_RARITY = {
  COMMON: 'COMMON',
  RARE: 'RARE',
  EPIC: 'EPIC',
  LEGENDARY: 'LEGENDARY'
};

export const BADGE_RARITY_COLORS = {
  COMMON: 'text-gray-600 bg-gray-100',
  RARE: 'text-blue-600 bg-blue-100',
  EPIC: 'text-purple-600 bg-purple-100',
  LEGENDARY: 'text-yellow-600 bg-yellow-100'
};

export const BADGE_RARITY_NAMES = {
  COMMON: 'Comum',
  RARE: 'Raro',
  EPIC: 'Épico',
  LEGENDARY: 'Lendário'
};

// Ações que geram pontos
export const POINT_ACTIONS = {
  TRANSACTION_COMPLETED: {
    action: 'TRANSACTION_COMPLETED',
    points: 100,
    description: 'Transação completada com sucesso'
  },
  PRODUCT_CREATED: {
    action: 'PRODUCT_CREATED',
    points: 25,
    description: 'Produto cadastrado'
  },
  FREIGHT_CREATED: {
    action: 'FREIGHT_CREATED',
    points: 25,
    description: 'Frete cadastrado'
  },
  POSITIVE_REVIEW: {
    action: 'POSITIVE_REVIEW',
    points: 50,
    description: 'Avaliação positiva recebida'
  },
  NEGATIVE_REVIEW: {
    action: 'NEGATIVE_REVIEW',
    points: -25,
    description: 'Avaliação negativa recebida'
  },
  COMMUNITY_HELP: {
    action: 'COMMUNITY_HELP',
    points: 75,
    description: 'Ajudou outro usuário'
  },
  REFERRAL: {
    action: 'REFERRAL',
    points: 200,
    description: 'Indicou um novo usuário'
  },
  DAILY_LOGIN: {
    action: 'DAILY_LOGIN',
    points: 10,
    description: 'Login diário'
  },
  WEEKLY_ACTIVITY: {
    action: 'WEEKLY_ACTIVITY',
    points: 100,
    description: 'Atividade semanal'
  },
  MONTHLY_ACTIVITY: {
    action: 'MONTHLY_ACTIVITY',
    points: 500,
    description: 'Atividade mensal'
  }
};

class GamificationService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
  }

  // Limpar cache
  clearCache() {
    this.cache.clear();
  }

  // Verificar se cache é válido
  isCacheValid(key) {
    const cached = this.cache.get(key);
    if (!cached) return false;
    
    return Date.now() - cached.timestamp < this.cacheTimeout;
  }

  // Obter perfil de reputação do usuário
  async getUserProfile() {
    try {
      const cacheKey = 'userProfile';
      if (this.isCacheValid(cacheKey)) {
        return this.cache.get(cacheKey).data;
      }

      const response = await api.get('/gamification/profile');
      const data = response.data;

      // Cachear resultado
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error('Erro ao buscar perfil de reputação:', error);
      throw error;
    }
  }

  // Obter ranking global
  async getLeaderboard(page = 1, limit = 20, category = 'global', region = null) {
    try {
      const cacheKey = `leaderboard_${category}_${region}_${page}_${limit}`;
      if (this.isCacheValid(cacheKey)) {
        return this.cache.get(cacheKey).data;
      }

      const params = { page, limit, category };
      if (region) params.region = region;

      const response = await api.get('/gamification/leaderboard', { params });
      const data = response.data;

      // Cachear resultado
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error('Erro ao buscar ranking:', error);
      throw error;
    }
  }

  // Obter badges do usuário
  async getUserBadges() {
    try {
      const cacheKey = 'userBadges';
      if (this.isCacheValid(cacheKey)) {
        return this.cache.get(cacheKey).data;
      }

      const response = await api.get('/gamification/badges');
      const data = response.data;

      // Cachear resultado
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error('Erro ao buscar badges:', error);
      throw error;
    }
  }

  // Adicionar pontos para uma ação
  async addPoints(action, points, description, metadata = {}) {
    try {
      const response = await api.post('/gamification/points', {
        action,
        points,
        description,
        metadata
      });

      // Limpar cache relacionado ao usuário
      this.clearCache();

      return response.data;
    } catch (error) {
      console.error('Erro ao adicionar pontos:', error);
      throw error;
    }
  }

  // Obter estatísticas do usuário
  async getUserStats() {
    try {
      const cacheKey = 'userStats';
      if (this.isCacheValid(cacheKey)) {
        return this.cache.get(cacheKey).data;
      }

      const response = await api.get('/gamification/stats');
      const data = response.data;

      // Cachear resultado
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  }

  // Atualizar configurações de notificações
  async updateNotifications(notifications) {
    try {
      const response = await api.put('/gamification/notifications', {
        notifications
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar notificações:', error);
      throw error;
    }
  }

  // Obter conquistas disponíveis
  async getAchievements() {
    try {
      const cacheKey = 'achievements';
      if (this.isCacheValid(cacheKey)) {
        return this.cache.get(cacheKey).data;
      }

      const response = await api.get('/gamification/achievements');
      const data = response.data;

      // Cachear resultado
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error('Erro ao buscar conquistas:', error);
      throw error;
    }
  }

  // Métodos utilitários para ações comuns
  async addTransactionPoints(transactionId, amount) {
    return this.addPoints(
      POINT_ACTIONS.TRANSACTION_COMPLETED.action,
      POINT_ACTIONS.TRANSACTION_COMPLETED.points,
      POINT_ACTIONS.TRANSACTION_COMPLETED.description,
      { transactionId, amount }
    );
  }

  async addProductPoints(productId) {
    return this.addPoints(
      POINT_ACTIONS.PRODUCT_CREATED.action,
      POINT_ACTIONS.PRODUCT_CREATED.points,
      POINT_ACTIONS.PRODUCT_CREATED.description,
      { productId }
    );
  }

  async addFreightPoints(freightId) {
    return this.addPoints(
      POINT_ACTIONS.FREIGHT_CREATED.action,
      POINT_ACTIONS.FREIGHT_CREATED.points,
      POINT_ACTIONS.FREIGHT_CREATED.description,
      { freightId }
    );
  }

  async addReviewPoints(reviewId, isPositive) {
    const action = isPositive ? 
      POINT_ACTIONS.POSITIVE_REVIEW : 
      POINT_ACTIONS.NEGATIVE_REVIEW;
    
    return this.addPoints(
      action.action,
      action.points,
      action.description,
      { reviewId, isPositive }
    );
  }

  // Calcular progresso para o próximo nível
  calculateLevelProgress(experience, experienceToNextLevel) {
    const percentage = Math.round((experience / experienceToNextLevel) * 100);
    return {
      current: experience,
      required: experienceToNextLevel,
      percentage: Math.min(percentage, 100)
    };
  }

  // Formatar pontuação
  formatScore(score) {
    if (score >= 1000000) {
      return `${(score / 1000000).toFixed(1)}M`;
    } else if (score >= 1000) {
      return `${(score / 1000).toFixed(1)}K`;
    }
    return score.toString();
  }

  // Verificar se usuário subiu de nível
  checkLevelUp(oldLevel, newLevel) {
    return newLevel > oldLevel;
  }

  // Obter cor da raridade do badge
  getBadgeRarityColor(rarity) {
    return BADGE_RARITY_COLORS[rarity] || BADGE_RARITY_COLORS.COMMON;
  }

  // Obter nome da raridade do badge
  getBadgeRarityName(rarity) {
    return BADGE_RARITY_NAMES[rarity] || BADGE_RARITY_NAMES.COMMON;
  }
}

// Instância única do serviço
const gamificationService = new GamificationService();

export default gamificationService;
export {
  BADGE_RARITY,
  BADGE_RARITY_COLORS,
  BADGE_RARITY_NAMES,
  POINT_ACTIONS
};
