// @ts-check
import axios from 'axios';
import { config } from '../config';

/**
 * Cliente HTTP configurado para a API
 */
export const api = axios.create({
  baseURL: config.api.url,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token
api.interceptors.request.use(config => {
  const token = localStorage.getItem(config.storage.authToken);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  response => response,
  error => {
    // Erros de rede
    if (!error.response) {
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        status: 0
      });
    }

    // Erro de autenticação
    if (error.response.status === 401) {
      localStorage.removeItem(config.storage.authToken);
      localStorage.removeItem(config.storage.userData);
      window.location.href = '/login';
    }

    // Erro do Turnstile
    if (error.response.status === 403 && error.response.data?.error?.includes('Turnstile')) {
      return Promise.reject({
        message: 'Security check failed. Please try again.',
        status: 403
      });
    }

    // Outros erros
    return Promise.reject(error.response.data);
  }
);

/**
 * Serviços da API
 */

// Autenticação
export const auth = {
  async login(email, password, turnstileToken) {
    const { data } = await api.post('/auth/login', {
      email,
      password,
      turnstileToken
    });
    return data;
  },

  async register(userData, turnstileToken) {
    const { data } = await api.post('/auth/register', {
      ...userData,
      turnstileToken
    });
    return data;
  },

  async recover(email, turnstileToken) {
    const { data } = await api.post('/auth/recover', {
      email,
      turnstileToken
    });
    return data;
  }
};

// Perfil
export const profile = {
  async get() {
    const { data } = await api.get('/user/profile');
    return data;
  },

  async update(changes) {
    const { data } = await api.put('/user/profile', changes);
    return data;
  }
};

// Produtos
export const products = {
  async list(filters = {}) {
    const { data } = await api.get('/shop/products', {
      params: filters
    });
    return data;
  },

  async create(product) {
    const { data } = await api.post('/shop/products', product);
    return data;
  },

  async update(id, changes) {
    const { data } = await api.put(`/shop/products/${id}`, changes);
    return data;
  },

  async delete(id) {
    const { data } = await api.delete(`/shop/products/${id}`);
    return data;
  }
};

// Mensagens
export const messages = {
  async list() {
    const { data } = await api.get('/messages');
    return data;
  },

  async send(message) {
    const { data } = await api.post('/messages', message);
    return data;
  }
};

// Fretes
export const freight = {
  async calculate(params) {
    const { data } = await api.get('/freight/calculate', {
      params
    });
    return data;
  }
};

      if (!response.ok) {
        throw new Error(data.message || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      // Log apenas em desenvolvimento
      if (process.env.NODE_ENV !== 'production') {
        // API Error
      }
      throw error;
    }
  }

  // Métodos para produtos (intermediação)
  async getProducts(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/products?${queryParams}`);
  }

  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData)
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE'
    });
  }

  // Métodos para fretes (intermediação)
  async getFreights(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/freights?${queryParams}`);
  }

  async createFreight(freightData) {
    return this.request('/freights', {
      method: 'POST',
      body: JSON.stringify(freightData)
    });
  }

  async updateFreight(id, freightData) {
    return this.request(`/freights/${id}`, {
      method: 'PUT',
      body: JSON.stringify(freightData)
    });
  }

  // Métodos para mensageria
  async getMessages(conversationId) {
    return this.request(`/messages/${conversationId}`);
  }

  async sendMessage(messageData) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData)
    });
  }

  async getConversations() {
    return this.request('/messages/conversations');
  }

  // Métodos para pagamentos
  async getPaymentStatus() {
    return this.request('/payments/status');
  }

  async createStripeSession(planData) {
    return this.request('/payments/stripe/create-session', {
      method: 'POST',
      body: JSON.stringify(planData)
    });
  }

  // Métodos para usuários
  async getUserProfile() {
    return this.request('/users/profile');
  }

  async updateUserProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  // Métodos para admin
  async getAdminStats() {
    return this.request('/admin/stats');
  }

  async getAdminUsers() {
    return this.request('/admin/users');
  }

  // Métodos para cripto
  async getCryptoAssets() {
    return this.request('/crypto/assets');
  }

  async getWalletBalance() {
    return this.request('/crypto/wallet/balance');
  }
}

const apiService = new ApiService();
export default apiService;
