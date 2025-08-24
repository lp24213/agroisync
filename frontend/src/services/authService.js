import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth service
export const authService = {
  // Register new user
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Erro ao cadastrar usuário');
    }
  },

  // Login user
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Erro ao fazer login');
    }
  },

  // Get current user data
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Error getting current user:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Erro ao obter dados do usuário');
    }
  },

  // Logout user
  async logout() {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      console.error('Error logging out:', error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Erro ao fazer logout');
    }
  },

  // Check if user is authenticated
  async isAuthenticated() {
    try {
      await this.getCurrentUser();
      return true;
    } catch (error) {
      return false;
    }
  },

  // Check if user has active plan for specific module
  async hasActivePlan(module) {
    try {
      const userData = await this.getCurrentUser();
      const plan = userData.data.plans[module];
      return plan && plan.status === 'active';
    } catch (error) {
      return false;
    }
  },

  // Check if user has module enabled
  async hasModule(module) {
    try {
      const userData = await this.getCurrentUser();
      return userData.data.modules[module] === true;
    } catch (error) {
      return false;
    }
  }
};

export default authService;
