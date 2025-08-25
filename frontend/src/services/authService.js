// Serviço de autenticação para AGROISYNC
class AuthService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || '/api';
  }

  // Login de usuário normal
  async login(email, password) {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          user: data.user,
          token: data.token,
        };
      } else {
        return {
          success: false,
          message: data.message || 'Erro no login',
        };
      }
    } catch (error) {
      console.error('Erro no serviço de login:', error);
      return {
        success: false,
        message: 'Erro de conexão',
      };
    }
  }

  // Login de administrador
  async loginAdmin(email, password) {
    try {
      const response = await fetch(`${this.baseURL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          user: data.user,
          token: data.token,
        };
      } else {
        return {
          success: false,
          message: data.message || 'Credenciais inválidas',
        };
      }
    } catch (error) {
      console.error('Erro no serviço de login admin:', error);
      return {
        success: false,
        message: 'Erro de conexão',
      };
    }
  }

  // Registro de usuário
  async register(userData) {
    try {
      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          user: data.user,
          token: data.token,
        };
      } else {
        return {
          success: false,
          message: data.message || 'Erro no registro',
        };
      }
    } catch (error) {
      console.error('Erro no serviço de registro:', error);
      return {
        success: false,
        message: 'Erro de conexão',
      };
    }
  }

  // Verificar token de usuário
  async verifyToken(token) {
    try {
      const response = await fetch(`${this.baseURL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.user;
      } else {
        throw new Error('Token inválido');
      }
    } catch (error) {
      console.error('Erro na verificação do token:', error);
      throw error;
    }
  }

  // Verificar token de admin
  async verifyAdminToken(token) {
    try {
      const response = await fetch(`${this.baseURL}/admin/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.user;
      } else {
        throw new Error('Token admin inválido');
      }
    } catch (error) {
      console.error('Erro na verificação do token admin:', error);
      throw error;
    }
  }

  // Atualizar perfil do usuário
  async updateProfile(profileData) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não autenticado');
      }

      const response = await fetch(`${this.baseURL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          user: data.user,
        };
      } else {
        return {
          success: false,
          message: data.message || 'Erro ao atualizar perfil',
        };
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return {
        success: false,
        message: 'Erro de conexão',
      };
    }
  }

  // Recuperar senha
  async forgotPassword(email) {
    try {
      const response = await fetch(`${this.baseURL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: data.message || 'Email de recuperação enviado',
        };
      } else {
        return {
          success: false,
          message: data.message || 'Erro ao enviar email de recuperação',
        };
      }
    } catch (error) {
      console.error('Erro ao solicitar recuperação de senha:', error);
      return {
        success: false,
        message: 'Erro de conexão',
      };
    }
  }

  // Resetar senha
  async resetPassword(token, newPassword) {
    try {
      const response = await fetch(`${this.baseURL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: data.message || 'Senha alterada com sucesso',
        };
      } else {
        return {
          success: false,
          message: data.message || 'Erro ao alterar senha',
        };
      }
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      return {
        success: false,
        message: 'Erro de conexão',
      };
    }
  }

  // Verificar se o usuário tem plano ativo
  async checkSubscriptionStatus() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não autenticado');
      }

      const response = await fetch(`${this.baseURL}/auth/subscription-status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          subscription: data.subscription,
        };
      } else {
        throw new Error('Erro ao verificar status da assinatura');
      }
    } catch (error) {
      console.error('Erro ao verificar status da assinatura:', error);
      return {
        success: false,
        message: 'Erro de conexão',
      };
    }
  }

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    // Redirecionar para a página inicial
    window.location.href = '/';
  }
}

// Exportar instância única do serviço
export const authService = new AuthService();
export default authService;
