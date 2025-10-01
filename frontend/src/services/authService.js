import axios from 'axios';
import apiConfig from '../config/api.config.js';
import { API_CONFIG, getAuthToken, removeAuthToken } from '../config/constants.js';

// Usar nova config centralizada, mas manter fallback para compatibilidade
const API_BASE_URL = API_CONFIG?.baseURL || apiConfig.baseURL;
const PAYMENT_API_URL = API_CONFIG?.baseURL || apiConfig.baseURL;

class AuthService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: apiConfig.timeout,
      headers: apiConfig.defaultHeaders
    });
    this.paymentApi = axios.create({
      baseURL: PAYMENT_API_URL,
      timeout: apiConfig.timeout,
      headers: apiConfig.defaultHeaders
    });

    // Interceptor para retry automático
    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      config => {
        // Adicionar token se disponível
        // Usar helper centralizado que mantém compatibilidade
        const token = getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor com retry
    this.api.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        if (!originalRequest._retry && error.response?.status >= 500) {
          originalRequest._retry = true;

          // Aguardar antes de tentar novamente
          await new Promise(resolve =>
            setTimeout(resolve, 1000 * (originalRequest._retryCount || 1))
          );

          originalRequest._retryCount = (originalRequest._retryCount || 1) + 1;
          return this.api(originalRequest);
        }

        return Promise.reject(error);
      }
    );
  }

  // Cadastrar usuário com email
  async signUpWithEmail(email, password, userData, turnstileToken) {
    try {
      const response = await this.api.post('/auth/register', {
        name: userData.name,
        email: email,
        password: password,
        phone: userData.phone,
        businessType: userData.businessType || 'all',
        turnstileToken,
        ...userData
      });

      return {
        success: true,
        requiresEmailVerification: response.data.requiresEmailVerification,
        emailCode: response.data.emailCode, // Para desenvolvimento
        user: response.data.data.user,
        token: response.data.data.token
      };
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao cadastrar usuário'
      };
    }
  }

  // Verificar email com código
  async verifyEmail(email, code) {
    try {
      const response = await this.api.post('/auth/verify-email', {
        email,
        code
      });

      return {
        success: true,
        user: response.data.data.user
      };
    } catch (error) {
      console.error('Erro ao verificar email:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao verificar email'
      };
    }
  }

  // Reenviar código de verificação
  async resendVerificationEmail(email) {
    try {
      const response = await this.api.post('/email/send-verification', {
        email
      });

      return {
        success: true,
        emailCode: response.data.data.verificationCode || response.data.data.emailCode, // Para desenvolvimento
        message: response.data.message
      };
    } catch (error) {
      console.error('Erro ao reenviar verificação:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao reenviar verificação'
      };
    }
  }

  // Verificar código de email
  async verifyEmailCode(email, code) {
    try {
      const response = await this.api.post('/email/verify', {
        email,
        code
      });

      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('Erro ao verificar código:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao verificar código'
      };
    }
  }

  // Solicitar recuperação de senha
  async forgotPassword(email, turnstileToken = null) {
    try {
      const response = await this.api.post('/auth/forgot-password', {
        email,
        turnstileToken
      });

      return {
        success: true,
        resetCode: response.data.data.resetCode, // Para desenvolvimento
        message: response.data.message
      };
    } catch (error) {
      console.error('Erro ao solicitar recuperação:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao solicitar recuperação'
      };
    }
  }

  // Redefinir senha
  async resetPassword(email, code, newPassword) {
    try {
      const response = await this.api.post('/auth/reset-password', {
        email,
        code,
        newPassword
      });

      return {
        success: true,
        user: response.data.data.user
      };
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao redefinir senha'
      };
    }
  }

  // Login com email
  async signInWithEmail(email, password, turnstileToken) {
    try {
      const response = await this.api.post('/auth/login', {
        email: email,
        password: password,
        turnstileToken
      });

      return {
        success: true,
        user: response.data.data.user,
        token: response.data.data.token
      };
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Credenciais inválidas'
      };
    }
  }

  // Logout
  async logout() {
    try {
      // Usar helper centralizado para limpar tokens
      removeAuthToken();
      return { success: true };
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      return { success: false, error: 'Erro ao fazer logout' };
    }
  }

  // Verificar se usuário está autenticado
  isAuthenticated() {
    const token = getAuthToken();
    return !!token;
  }

  // Obter token
  getToken() {
    return getAuthToken();
  }

  // Obter usuário atual
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // ===== FUNÇÕES DE PAGAMENTO =====

  async getPaymentPlans() {
    try {
      console.log('💳 Buscando planos de pagamento...');
      const response = await this.paymentApi.get('/payment/plans');

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('❌ Erro ao buscar planos:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao buscar planos'
      };
    }
  }

  async processPayment(planId, paymentMethod, amount, userEmail) {
    try {
      console.log('💳 Processando pagamento...');
      const response = await this.paymentApi.post('/payment/process', {
        planId,
        paymentMethod,
        amount,
        userEmail
      });

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error('❌ Erro ao processar pagamento:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao processar pagamento'
      };
    }
  }
}

const authService = new AuthService();
export default authService;
