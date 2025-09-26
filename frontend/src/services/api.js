// Serviço de API para integrar frontend com backend existente
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://agroisync.contato-00d.workers.dev/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Método para fazer requisições autenticadas
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro na requisição');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
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
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
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
      body: JSON.stringify(freightData),
    });
  }

  async updateFreight(id, freightData) {
    return this.request(`/freights/${id}`, {
      method: 'PUT',
      body: JSON.stringify(freightData),
    });
  }

  // Métodos para mensageria
  async getMessages(conversationId) {
    return this.request(`/messages/${conversationId}`);
  }

  async sendMessage(messageData) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
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
      body: JSON.stringify(planData),
    });
  }

  // Métodos para usuários
  async getUserProfile() {
    return this.request('/users/profile');
  }

  async updateUserProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
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
