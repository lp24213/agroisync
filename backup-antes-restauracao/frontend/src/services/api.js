import axios from 'axios';
import { config } from '../config';

/**
 * Cliente HTTP configurado para a API
 */
export const api = axios.create({
  baseURL: config?.api?.url || '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: config?.api?.timeout || 30000
});

// Interceptor para adicionar token
api.interceptors.request.use(cfg => {
  try {
    const tokenKey = config?.storage?.authToken || 'authToken';
    const token = localStorage.getItem(tokenKey);
    if (token) {
      cfg.headers = cfg.headers || {};
      cfg.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return cfg;
});

// Interceptor para tratar erros
api.interceptors.response.use(
  response => response,
  error => {
    // Erros de rede
    if (!error.response) {
      return Promise.reject({ message: 'Network error. Please check your connection.', status: 0 });
    }

    // Erro de autenticação
    if (error.response.status === 401) {
      try {
        const tokenKey = config?.storage?.authToken || 'authToken';
        localStorage.removeItem(tokenKey);
        localStorage.removeItem(config?.storage?.userData || 'user');
      } catch (e) {
        // ignore
      }
      window.location.href = '/login';
    }

    // Erro do Turnstile
    if (error.response.status === 403 && error.response.data?.error?.includes('Turnstile')) {
      return Promise.reject({ message: 'Security check failed. Please try again.', status: 403 });
    }

    // Outros erros
    return Promise.reject(error.response.data || error);
  }
);

// Serviços da API (simples wrappers)
export const auth = {
  async login(email, password, turnstileToken) {
    const { data } = await api.post('/auth/login', { email, password, turnstileToken });
    return data;
  },
  async register(userData, turnstileToken) {
    const { data } = await api.post('/auth/register', { ...userData, turnstileToken });
    return data;
  },
  async recover(email, turnstileToken) {
    const { data } = await api.post('/auth/recover', { email, turnstileToken });
    return data;
  }
};

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

export const products = {
  async list(filters = {}) {
    const { data } = await api.get('/shop/products', { params: filters });
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

export const freight = {
  async calculate(params) {
    const { data } = await api.get('/freight/calculate', { params });
    return data;
  }
};

export default api;
