import { config } from '../config/config.js';

// Configuração da API
const API_BASE_URL = config.api.baseURL;

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Headers padrão
  getHeaders(token = null) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  // Função genérica para requisições
  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config = {
        headers: this.getHeaders(options.token),
        ...options,
      };

      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // ===== AUTENTICAÇÃO =====
  
  // Login
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Registro
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Logout
  async logout(token) {
    return this.request('/auth/logout', {
      method: 'POST',
      token,
    });
  }

  // Obter usuário atual
  async getCurrentUser(token) {
    return this.request('/auth/me', { token });
  }

  // Alterar senha
  async changePassword(token, passwordData) {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
      token,
    });
  }

  // ===== USUÁRIOS =====
  
  // Atualizar perfil
  async updateProfile(token, profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
      token,
    });
  }

  // Obter assinaturas
  async getUserSubscriptions(token) {
    return this.request('/users/subscriptions', { token });
  }

  // ===== PRODUTOS =====
  
  // Produtos - CRUD
  async getProducts(token, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products?${queryString}`, { token });
  }

  async getProduct(token, productId) {
    return this.request(`/products/${productId}`, { token });
  }

  async createProduct(token, productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
      token,
    });
  }

  async updateProduct(token, productId, productData) {
    return this.request(`/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
      token,
    });
  }

  async deleteProduct(token, productId) {
    return this.request(`/products/${productId}`, {
      method: 'DELETE',
      token,
    });
  }

  // ===== FRETES =====
  
  // Fretes - CRUD
  async getFreights(token, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/freights?${queryString}`, { token });
  }

  async getFreight(token, freightId) {
    return this.request(`/freights/${freightId}`, { token });
  }

  async createFreight(token, freightData) {
    return this.request('/freights', {
      method: 'POST',
      body: JSON.stringify(freightData),
      token,
    });
  }

  async updateFreight(token, freightId, freightData) {
    return this.request(`/freights/${freightId}`, {
      method: 'PUT',
      body: JSON.stringify(freightData),
      token,
    });
  }

  async deleteFreight(token, freightId) {
    return this.request(`/freights/${freightId}`, {
      method: 'DELETE',
      token,
    });
  }

  // ===== MENSAGENS PRIVADAS =====
  
  async getConversations(token, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/messages?${queryString}`, { token });
  }

  async getConversation(token, userId) {
    return this.request(`/messages/conversation/${userId}`, { token });
  }

  async sendMessage(token, messageData) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
      token,
    });
  }

  async getMessage(token, messageId) {
    return this.request(`/messages/${messageId}`, { token });
  }

  async updateMessage(token, messageId, messageData) {
    return this.request(`/messages/${messageId}`, {
      method: 'PUT',
      body: JSON.stringify(messageData),
      token,
    });
  }

  async deleteMessage(token, messageId) {
    return this.request(`/messages/${messageId}`, {
      method: 'DELETE',
      token,
    });
  }

  async getUnreadCount(token) {
    return this.request('/messages/unread/count', { token });
  }

  async searchMessages(token, searchTerm, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/messages/search/${searchTerm}?${queryString}`, { token });
  }

  // ===== MENSAGENS DE CONTATO =====
  
  async submitContact(contactData) {
    return this.request('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }

  async submitPartnership(partnershipData) {
    return this.request('/contact/partnership', {
      method: 'POST',
      body: JSON.stringify(partnershipData),
    });
  }

  // ===== PARCEIROS =====
  
  async getPartners(token, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/partners?${queryString}`, { token });
  }

  async getPartner(token, partnerId) {
    return this.request(`/partners/${partnerId}`, { token });
  }

  async createPartner(token, partnerData) {
    return this.request('/partners', {
      method: 'POST',
      body: JSON.stringify(partnerData),
      token,
    });
  }

  async updatePartner(token, partnerId, partnerData) {
    return this.request(`/partners/${partnerId}`, {
      method: 'PUT',
      body: JSON.stringify(partnerData),
      token,
    });
  }

  async deletePartner(token, partnerId) {
    return this.request(`/partners/${partnerId}`, {
      method: 'DELETE',
      token,
    });
  }

  // ===== MENSAGENS DE PARCEIROS =====
  
  async getPartnershipMessages(token, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/partnership-messages?${queryString}`, { token });
  }

  async getPartnershipMessage(token, messageId) {
    return this.request(`/partnership-messages/${messageId}`, { token });
  }

  async createPartnershipMessage(token, messageData) {
    return this.request('/partnership-messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
      token,
    });
  }

  async updatePartnershipMessage(token, messageId, messageData) {
    return this.request(`/partnership-messages/${messageId}`, {
      method: 'PUT',
      body: JSON.stringify(messageData),
      token,
    });
  }

  async updatePartnershipMessageStatus(token, messageId, statusData) {
    return this.request(`/partnership-messages/${messageId}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
      token,
    });
  }

  async deletePartnershipMessage(token, messageId) {
    return this.request(`/partnership-messages/${messageId}`, {
      method: 'DELETE',
      token,
    });
  }

  async getPartnershipMessageStats(token) {
    return this.request('/partnership-messages/stats/overview', { token });
  }

  async searchPartnershipMessages(token, searchTerm, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/partnership-messages/search/${searchTerm}?${queryString}`, { token });
  }

  // ===== PAGAMENTOS =====
  
  // Planos disponíveis
  async getPlans(token) {
    return this.request('/payments/plans', { token });
  }

  // Histórico de pagamentos
  async getPaymentHistory(token, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/payments/history?${queryString}`, { token });
  }

  // Obter pagamento específico
  async getPayment(token, paymentId) {
    return this.request(`/payments/${paymentId}`, { token });
  }

  // ===== STRIPE =====
  
  async createStripePaymentIntent(token, paymentData) {
    return this.request('/payments/stripe/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify(paymentData),
      token,
    });
  }

  async confirmStripePayment(token, paymentData) {
    return this.request('/payments/stripe/confirm', {
      method: 'POST',
      body: JSON.stringify(paymentData),
      token,
    });
  }

  async createStripeCheckoutSession(token, checkoutData) {
    return this.request('/payments/stripe/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify(checkoutData),
      token,
    });
  }

  async getStripeSubscription(token, subscriptionId) {
    return this.request(`/payments/stripe/subscriptions/${subscriptionId}`, { token });
  }

  async cancelStripeSubscription(token, subscriptionId) {
    return this.request(`/payments/stripe/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      token,
    });
  }

  // ===== METAMASK =====
  
  async createMetamaskInvoice(token, invoiceData) {
    return this.request('/payments/metamask/create-invoice', {
      method: 'POST',
      body: JSON.stringify(invoiceData),
      token,
    });
  }

  async verifyMetamaskPayment(token, verificationData) {
    return this.request('/payments/metamask/verify', {
      method: 'POST',
      body: JSON.stringify(verificationData),
      token,
    });
  }

  async getMetamaskBalance(token, address) {
    return this.request(`/payments/metamask/balance/${address}`, { token });
  }

  async getMetamaskTransactions(token, address, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/payments/metamask/transactions/${address}?${queryString}`, { token });
  }

  // ===== ADMIN =====
  
  // Dashboard
  async getAdminDashboard(token) {
    return this.request('/admin/dashboard', { token });
  }

  // Usuários
  async getAdminUsers(token, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/users?${queryString}`, { token });
  }

  async getAdminUser(token, userId) {
    return this.request(`/admin/users/${userId}`, { token });
  }

  async updateAdminUser(token, userId, userData) {
    return this.request(`/admin/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
      token,
    });
  }

  async blockAdminUser(token, userId, blockData) {
    return this.request(`/admin/users/${userId}/block`, {
      method: 'PUT',
      body: JSON.stringify(blockData),
      token,
    });
  }

  async deleteAdminUser(token, userId) {
    return this.request(`/admin/users/${userId}`, {
      method: 'DELETE',
      token,
    });
  }

  // Mensagens
  async getAdminContactMessages(token, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/messages/contact?${queryString}`, { token });
  }

  async getAdminPartnershipMessages(token, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/messages/partnerships?${queryString}`, { token });
  }

  async getAdminPrivateMessages(token, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/messages/private?${queryString}`, { token });
  }

  // Pagamentos
  async getAdminPayments(token, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/payments?${queryString}`, { token });
  }

  // Analytics
  async getAdminAnalytics(token, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/analytics?${queryString}`, { token });
  }
}

// Instância singleton
const apiService = new ApiService();
export default apiService;
