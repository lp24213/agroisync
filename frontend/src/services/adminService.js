import axios from 'axios'

// Configuração da API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api'

class AdminService {
  constructor() {
    this.isAuthenticated = false
    this.adminToken = null
  }

  // Login administrativo
  async adminLogin(email, password) {
    try {
      // Verificar credenciais fixas
      if (email === 'luispaulodeoliveira@agrotm.com.br' && password === 'Th@ys15221008') {
        // Gerar token admin simulado (em produção seria via backend)
        const adminToken = btoa(`admin:${email}:${Date.now()}`)

        this.isAuthenticated = true
        this.adminToken = adminToken

        return {
          success: true,
          token: adminToken,
          message: 'Login administrativo realizado com sucesso'
        }
      } else {
        return {
          success: false,
          error: 'Credenciais inválidas'
        }
      }
    } catch (error) {
      console.error('Erro no login administrativo:', error)
      return {
        success: false,
        error: 'Erro de conexão'
      }
    }
  }

  // Verificar se o usuário é admin
  async checkAdminStatus(userId, userEmail) {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/verify`, {
        userId,
        email: userEmail
      })

      if (response.data.success) {
        this.isAuthenticated = true
        this.adminToken = response.data.token
        return { isAdmin: true, role: response.data.role }
      } else {
        return { isAdmin: false, error: response.data.error }
      }
    } catch (error) {
      console.error('Erro ao verificar status de admin:', error)
      return { isAdmin: false, error: 'Erro ao verificar permissões' }
    }
  }

  // Carregar dados do dashboard admin
  async loadDashboardData() {
    try {
      if (!this.isAuthenticated) {
        throw new Error('Admin não autenticado')
      }

      const response = await axios.get(`${API_BASE_URL}/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${this.adminToken}`
        }
      })

      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Erro ao carregar dados do dashboard')
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error)

      // Retornar dados vazios em caso de erro (conforme solicitado no prompt)
      return {
        metrics: {
          totalUsers: 0,
          activeUsers: 0,
          totalRevenue: 0,
          pendingPayments: 0,
          totalProducts: 0,
          totalFreights: 0,
          totalTransactions: 0
        },
        transactions: [],
        users: [],
        recentActivity: [],
        systemStatus: 'operational'
      }
    }
  }

  // Obter transações para o painel admin (read-only)
  async getAdminTransactions(filters = {}) {
    try {
      if (!this.isAuthenticated) {
        throw new Error('Admin não autenticado')
      }

      const response = await axios.get(`${API_BASE_URL}/admin/transactions`, {
        headers: {
          Authorization: `Bearer ${this.adminToken}`
        },
        params: filters
      })

      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Erro ao carregar transações')
      }
    } catch (error) {
      console.error('Erro ao carregar transações:', error)
      return []
    }
  }

  // Obter usuários para o painel admin
  async getAdminUsers(filters = {}) {
    try {
      if (!this.isAuthenticated) {
        throw new Error('Admin não autenticado')
      }

      const response = await axios.get(`${API_BASE_URL}/admin/users`, {
        headers: {
          Authorization: `Bearer ${this.adminToken}`
        },
        params: filters
      })

      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Erro ao carregar usuários')
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
      return []
    }
  }

  // Obter estatísticas do sistema
  async getSystemStats() {
    try {
      if (!this.isAuthenticated) {
        throw new Error('Admin não autenticado')
      }

      const response = await axios.get(`${API_BASE_URL}/admin/system/stats`, {
        headers: {
          Authorization: `Bearer ${this.adminToken}`
        }
      })

      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Erro ao carregar estatísticas do sistema')
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas do sistema:', error)
      return {
        totalUsers: 0,
        activeUsers: 0,
        totalRevenue: 0,
        pendingPayments: 0,
        totalProducts: 0,
        totalFreights: 0,
        totalTransactions: 0
      }
    }
  }

  // Atualizar status do sistema
  async updateSystemStatus(status) {
    try {
      if (!this.isAuthenticated) {
        throw new Error('Admin não autenticado')
      }

      const response = await axios.put(
        `${API_BASE_URL}/admin/system/status`,
        {
          status
        },
        {
          headers: {
            Authorization: `Bearer ${this.adminToken}`
          }
        }
      )

      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Erro ao atualizar status do sistema')
      }
    } catch (error) {
      console.error('Erro ao atualizar status do sistema:', error)
      throw error
    }
  }

  // Processar pagamento pendente
  async processPayment(paymentId) {
    try {
      if (!this.isAuthenticated) {
        throw new Error('Admin não autenticado')
      }

      const response = await axios.post(
        `${API_BASE_URL}/admin/payments/${paymentId}/process`,
        {},
        {
          headers: {
            Authorization: `Bearer ${this.adminToken}`
          }
        }
      )

      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Erro ao processar pagamento')
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error)
      throw error
    }
  }

  // Aprovar usuário
  async approveUser(userId) {
    try {
      if (!this.isAuthenticated) {
        throw new Error('Admin não autenticado')
      }

      const response = await axios.put(
        `${API_BASE_URL}/admin/users/${userId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${this.adminToken}`
          }
        }
      )

      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Erro ao aprovar usuário')
      }
    } catch (error) {
      console.error('Erro ao aprovar usuário:', error)
      throw error
    }
  }

  // Banir usuário
  async banUser(userId, reason) {
    try {
      if (!this.isAuthenticated) {
        throw new Error('Admin não autenticado')
      }

      const response = await axios.put(
        `${API_BASE_URL}/admin/users/${userId}/ban`,
        {
          reason
        },
        {
          headers: {
            Authorization: `Bearer ${this.adminToken}`
          }
        }
      )

      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Erro ao banir usuário')
      }
    } catch (error) {
      console.error('Erro ao banir usuário:', error)
      throw error
    }
  }

  // Obter logs do sistema
  async getSystemLogs(filters = {}) {
    try {
      if (!this.isAuthenticated) {
        throw new Error('Admin não autenticado')
      }

      const response = await axios.get(`${API_BASE_URL}/admin/system/logs`, {
        headers: {
          Authorization: `Bearer ${this.adminToken}`
        },
        params: filters
      })

      if (response.data.success) {
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Erro ao carregar logs do sistema')
      }
    } catch (error) {
      console.error('Erro ao carregar logs do sistema:', error)
      return []
    }
  }

  // Desconectar admin
  logout() {
    this.isAuthenticated = false
    this.adminToken = null
  }
}

// Exportar instância única
const adminService = new AdminService()
export default adminService
