// Serviço de autenticação para AGROISYNC
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

class AuthService {
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        return { ok: true, token: data.token, user: data.user };
      } else {
        return { ok: false, message: data.error || 'Erro no login' };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { ok: false, message: 'Erro de conexão' };
    }
  }

  async loginAdmin(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        return { ok: true, adminToken: data.adminToken, user: data.user };
      } else {
        return { ok: false, message: data.error || 'Erro no login admin' };
      }
    } catch (error) {
      console.error('Erro no login admin:', error);
      return { ok: false, message: 'Erro de conexão' };
    }
  }

  async register(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        return { ok: true, token: data.token, user: data.user };
      } else {
        return { ok: false, message: data.error || 'Erro no registro' };
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      return { ok: false, message: 'Erro de conexão' };
    }
  }

  async verifyToken(token) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        return { ok: true, user: data.user };
      } else {
        return { ok: false, message: data.error || 'Token inválido' };
      }
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      return { ok: false, message: 'Erro de conexão' };
    }
  }

  async verifyAdminToken(adminToken) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      });

      if (response.ok) {
        // Se conseguiu acessar o dashboard, o token é válido
        return { 
          ok: true, 
          user: { 
            id: 'admin', 
            email: 'luispaulodeoliveira@agrotm.com.br',
            role: 'admin',
            isAdmin: true 
          } 
        };
      } else {
        return { ok: false, message: 'Token admin inválido' };
      }
    } catch (error) {
      console.error('Erro ao verificar token admin:', error);
      return { ok: false, message: 'Erro de conexão' };
    }
  }

  async updateProfile(profileData) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (response.ok) {
        return { ok: true, user: data.user };
      } else {
        return { ok: false, message: data.error || 'Erro ao atualizar perfil' };
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return { ok: false, message: 'Erro de conexão' };
    }
  }

  async forgotPassword(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        return { ok: true, message: data.message };
      } else {
        return { ok: false, message: data.error || 'Erro ao solicitar reset' };
      }
    } catch (error) {
      console.error('Erro ao solicitar reset de senha:', error);
      return { ok: false, message: 'Erro de conexão' };
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        return { ok: true, message: data.message };
      } else {
        return { ok: false, message: data.error || 'Erro ao resetar senha' };
      }
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      return { ok: false, message: 'Erro de conexão' };
    }
  }

  async checkSubscriptionStatus() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        return { 
          ok: true, 
          subscriptions: data.subscriptions,
          hasActivePlan: data.subscriptions?.store?.active || data.subscriptions?.agroconecta?.active
        };
      } else {
        return { ok: false, message: data.error || 'Erro ao verificar assinatura' };
      }
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
      return { ok: false, message: 'Erro de conexão' };
    }
  }

  async logout() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
      
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      
      return { ok: true };
    } catch (error) {
      console.error('Erro no logout:', error);
      // Mesmo com erro, limpar tokens locais
      localStorage.removeItem('token');
      localStorage.removeItem('adminToken');
      return { ok: true };
    }
  }
}

export default new AuthService();
