import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://agroisync-api.contato-00d.workers.dev/api';
const PAYMENT_API_URL = process.env.REACT_APP_PAYMENT_URL || 'https://agroisync-payment.contato-00d.workers.dev/api';

class AuthService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    this.paymentApi = axios.create({
      baseURL: PAYMENT_API_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });
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
      const response = await this.api.post('/auth/resend-verification', {
        email
      });
      
      return {
        success: true,
        emailCode: response.data.data.emailCode, // Para desenvolvimento
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
      // Limpar token do localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return { success: true };
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      return { success: false, error: 'Erro ao fazer logout' };
    }
  }

  // Verificar se usuário está autenticado
  isAuthenticated() {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    return !!token;
  }

  // Obter token
  getToken() {
    return localStorage.getItem('token') || localStorage.getItem('authToken');
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