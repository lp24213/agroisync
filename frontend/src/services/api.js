const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.agrotm.com';

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
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth - Bootstrap de usuário
  async bootstrapUser(token) {
    return this.request('/users/bootstrap', {
      method: 'POST',
      token,
    });
  }

  // Auth - Atualizar perfil
  async updateProfile(token, profileData) {
    return this.request('/users/me', {
      method: 'PUT',
      body: JSON.stringify(profileData),
      token,
    });
  }

  // Produtos - Lista pública
  async getPublicProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products/public?${queryString}`);
  }

  // Produtos - CRUD
  async getProducts(token, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products?${queryString}`, { token });
  }

  async getProduct(token, productId) {
    return this.request(`/products?id=${productId}`, { token });
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

  // Fretes - CRUD
  async getShipments(token, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/shipments?${queryString}`, { token });
  }

  async getShipment(token, shipmentId) {
    return this.request(`/shipments?id=${shipmentId}`, { token });
  }

  async createShipment(token, shipmentData) {
    return this.request('/shipments', {
      method: 'POST',
      body: JSON.stringify(shipmentData),
      token,
    });
  }

  async updateShipment(token, shipmentId, shipmentData) {
    return this.request(`/shipments/${shipmentId}`, {
      method: 'PUT',
      body: JSON.stringify(shipmentData),
      token,
    });
  }

  async deleteShipment(token, shipmentId) {
    return this.request(`/shipments/${shipmentId}`, {
      method: 'DELETE',
      token,
    });
  }

  // Planos e Pagamentos
  async getPlans() {
    return this.request('/plans');
  }

  async createStripeCheckout(token, planType) {
    return this.request('/payments/stripe/checkout', {
      method: 'POST',
      body: JSON.stringify({ planType }),
      token,
    });
  }

  async submitCryptoPayment(token, txHash, planType) {
    return this.request('/payments/crypto/submit', {
      method: 'POST',
      body: JSON.stringify({ txHash, planType }),
      token,
    });
  }

  // Mensageria - Parcerias
  async submitPartnership(partnershipData) {
    return this.request('/partners/submit', {
      method: 'POST',
      body: JSON.stringify(partnershipData),
    });
  }

  // Mensageria - Contato
  async submitContact(contactData) {
    return this.request('/contact/submit', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }

  // Admin - Dashboard
  async getAdminDashboard(token) {
    return this.request('/admin/dashboard', { token });
  }

  // Admin - Usuários
  async getAdminUsers(token, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/users?${queryString}`, { token });
  }

  async updateUserPlan(token, userId, planData) {
    return this.request(`/admin/users/${userId}/plan`, {
      method: 'PUT',
      body: JSON.stringify(planData),
      token,
    });
  }

  // Admin - Pagamentos
  async getAdminPayments(token, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/payments?${queryString}`, { token });
  }

  // Admin - Produtos
  async getAdminProducts(token, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/products?${queryString}`, { token });
  }

  async deleteAdminProduct(token, productId) {
    return this.request(`/admin/products/${productId}`, {
      method: 'DELETE',
      token,
    });
  }

  // Admin - Fretes
  async getAdminShipments(token, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/shipments?${queryString}`, { token });
  }

  // Admin - Parcerias
  async getAdminPartners(token, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/partners?${queryString}`, { token });
  }

  async updatePartnerStatus(token, partnerId, status) {
    return this.request(`/admin/partners/${partnerId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
      token,
    });
  }

  // Admin - Contatos
  async getAdminContacts(token, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/admin/contacts?${queryString}`, { token });
  }

  async updateContactStatus(token, contactId, status) {
    return this.request(`/admin/contacts/${contactId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
      token,
    });
  }
}

// Instância singleton
const apiService = new ApiService();
export default apiService;
