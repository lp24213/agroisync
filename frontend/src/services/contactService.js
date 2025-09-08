import axios from 'axios'

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api'

class ContactService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/contact`
  }

  // Configurar token de autenticação
  setAuthToken(token) {
    this.authToken = token
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  // ===== CONTACT FORM =====

  // Enviar mensagem de contato
  async sendContactMessage(contactData) {
    try {
      const response = await axios.post(`${this.baseURL}/send`, {
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        subject: contactData.subject,
        message: contactData.message,
        type: contactData.type || 'general', // 'general', 'support', 'sales', 'partnership'
        priority: contactData.priority || 'normal', // 'low', 'normal', 'high', 'urgent'
        attachments: contactData.attachments || [],
        metadata: {
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          ip: contactData.ip,
          referrer: document.referrer
        }
      })
      return response.data
    } catch (error) {
      console.error('Erro ao enviar mensagem de contato:', error)
      throw error
    }
  }

  // Obter mensagens de contato (Admin)
  async getContactMessages(filters = {}) {
    try {
      const response = await axios.get(`${this.baseURL}/messages`, {
        params: filters
      })
      return response.data
    } catch (error) {
      console.error('Erro ao obter mensagens de contato:', error)
      throw error
    }
  }

  // Obter mensagem específica
  async getContactMessage(messageId) {
    try {
      const response = await axios.get(`${this.baseURL}/messages/${messageId}`)
      return response.data
    } catch (error) {
      console.error('Erro ao obter mensagem de contato:', error)
      throw error
    }
  }

  // Marcar mensagem como lida
  async markAsRead(messageId) {
    try {
      const response = await axios.put(`${this.baseURL}/messages/${messageId}/read`)
      return response.data
    } catch (error) {
      console.error('Erro ao marcar mensagem como lida:', error)
      throw error
    }
  }

  // Responder mensagem de contato
  async replyToMessage(messageId, replyData) {
    try {
      const response = await axios.post(`${this.baseURL}/messages/${messageId}/reply`, {
        subject: replyData.subject,
        message: replyData.message,
        adminId: replyData.adminId,
        attachments: replyData.attachments || []
      })
      return response.data
    } catch (error) {
      console.error('Erro ao responder mensagem:', error)
      throw error
    }
  }

  // Arquivar mensagem
  async archiveMessage(messageId) {
    try {
      const response = await axios.put(`${this.baseURL}/messages/${messageId}/archive`)
      return response.data
    } catch (error) {
      console.error('Erro ao arquivar mensagem:', error)
      throw error
    }
  }

  // Deletar mensagem
  async deleteMessage(messageId) {
    try {
      const response = await axios.delete(`${this.baseURL}/messages/${messageId}`)
      return response.data
    } catch (error) {
      console.error('Erro ao deletar mensagem:', error)
      throw error
    }
  }

  // ===== EMAIL TEMPLATES =====

  // Obter templates de email
  async getEmailTemplates() {
    try {
      const response = await axios.get(`${this.baseURL}/templates`)
      return response.data
    } catch (error) {
      console.error('Erro ao obter templates de email:', error)
      throw error
    }
  }

  // Criar template de email
  async createEmailTemplate(templateData) {
    try {
      const response = await axios.post(`${this.baseURL}/templates`, templateData)
      return response.data
    } catch (error) {
      console.error('Erro ao criar template de email:', error)
      throw error
    }
  }

  // Atualizar template de email
  async updateEmailTemplate(templateId, templateData) {
    try {
      const response = await axios.put(`${this.baseURL}/templates/${templateId}`, templateData)
      return response.data
    } catch (error) {
      console.error('Erro ao atualizar template de email:', error)
      throw error
    }
  }

  // Deletar template de email
  async deleteEmailTemplate(templateId) {
    try {
      const response = await axios.delete(`${this.baseURL}/templates/${templateId}`)
      return response.data
    } catch (error) {
      console.error('Erro ao deletar template de email:', error)
      throw error
    }
  }

  // ===== NOTIFICATIONS =====

  // Enviar notificação por email
  async sendNotification(notificationData) {
    try {
      const response = await axios.post(`${this.baseURL}/notifications/send`, {
        to: notificationData.to,
        subject: notificationData.subject,
        template: notificationData.template,
        data: notificationData.data,
        type: notificationData.type || 'email'
      })
      return response.data
    } catch (error) {
      console.error('Erro ao enviar notificação:', error)
      throw error
    }
  }

  // ===== STATISTICS =====

  // Obter estatísticas de contato
  async getContactStats(period = 'month') {
    try {
      const response = await axios.get(`${this.baseURL}/stats`, {
        params: { period }
      })
      return response.data
    } catch (error) {
      console.error('Erro ao obter estatísticas de contato:', error)
      throw error
    }
  }

  // ===== FILE UPLOAD =====

  // Upload de arquivo para mensagem de contato
  async uploadAttachment(file, messageId = null) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      if (messageId) {
        formData.append('messageId', messageId)
      }

      const response = await axios.post(`${this.baseURL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    } catch (error) {
      console.error('Erro ao fazer upload de arquivo:', error)
      throw error
    }
  }

  // ===== VALIDATION =====

  // Validar dados de contato
  validateContactData(data) {
    const errors = {}

    if (!data.name || data.name.trim().length < 2) {
      errors.name = 'Nome deve ter pelo menos 2 caracteres'
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      errors.email = 'Email inválido'
    }

    if (!data.message || data.message.trim().length < 10) {
      errors.message = 'Mensagem deve ter pelo menos 10 caracteres'
    }

    if (data.phone && !this.isValidPhone(data.phone)) {
      errors.phone = 'Telefone inválido'
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  // Validar email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Validar telefone
  isValidPhone(phone) {
    const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  // ===== AUTO-RESPONSE =====

  // Configurar resposta automática
  async setAutoResponse(autoResponseData) {
    try {
      const response = await axios.post(`${this.baseURL}/auto-response`, autoResponseData)
      return response.data
    } catch (error) {
      console.error('Erro ao configurar resposta automática:', error)
      throw error
    }
  }

  // Obter configuração de resposta automática
  async getAutoResponse() {
    try {
      const response = await axios.get(`${this.baseURL}/auto-response`)
      return response.data
    } catch (error) {
      console.error('Erro ao obter resposta automática:', error)
      throw error
    }
  }

  // ===== INTEGRATION =====

  // Integrar com sistema de tickets
  async createTicket(contactData) {
    try {
      const response = await axios.post(`${this.baseURL}/tickets`, contactData)
      return response.data
    } catch (error) {
      console.error('Erro ao criar ticket:', error)
      throw error
    }
  }

  // Obter tickets
  async getTickets(filters = {}) {
    try {
      const response = await axios.get(`${this.baseURL}/tickets`, {
        params: filters
      })
      return response.data
    } catch (error) {
      console.error('Erro ao obter tickets:', error)
      throw error
    }
  }

  // ===== EXPORT =====

  // Exportar mensagens de contato
  async exportContactMessages(format = 'csv', filters = {}) {
    try {
      const response = await axios.get(`${this.baseURL}/export`, {
        params: { format, ...filters },
        responseType: 'blob'
      })
      return response.data
    } catch (error) {
      console.error('Erro ao exportar mensagens:', error)
      throw error
    }
  }
}

// Instância única do serviço
const contactService = new ContactService()

export default contactService
