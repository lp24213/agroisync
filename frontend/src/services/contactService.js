import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.agroisync.com';

const contactService = {
  // Enviar mensagem de contato
  async sendContactMessage(messageData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/contact/send`, {
        name: messageData.nome,
        email: messageData.email,
        phone: messageData.telefone,
        subject: messageData.assunto,
        message: messageData.mensagem,
        to: 'contato@agroisync.com', // E-mail de destino fixo
        from: 'noreply@agroisync.com' // E-mail de origem
      });

      return {
        success: true,
        message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
        data: response.data
      };
    } catch (error) {
      console.error('Erro ao enviar mensagem de contato:', error);
      
      // Fallback: simular envio bem-sucedido para desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        return {
          success: true,
          message: 'Mensagem enviada com sucesso! (Modo desenvolvimento)',
          data: { id: 'dev-' + Date.now() }
        };
      }
      
      return {
        success: false,
        message: 'Erro ao enviar mensagem. Tente novamente ou entre em contato pelo telefone.',
        error: error.response?.data || error.message
      };
    }
  },

  // Verificar status do envio
  async checkMessageStatus(messageId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/contact/status/${messageId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erro ao verificar status da mensagem:', error);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  },

  // Obter informações de contato
  async getContactInfo() {
    return {
      email: 'contato@agroisync.com',
      phone: '(66) 99236-2830',
      address: 'Sinop - MT, Brasil',
      businessHours: 'Segunda a Sexta: 8h às 18h',
      timezone: 'America/Cuiaba'
    };
  }
};

export default contactService;
