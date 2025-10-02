import axios from 'axios';
import { API_CONFIG, getAuthToken } from '../config/constants.js';

const API_BASE_URL = API_CONFIG.baseURL;

class SecureURLService {
  /**
   * Gera uma URL segura para cadastro
   * @param {Object} data - Dados a serem incluídos na URL
   * @param {string} expiresIn - Tempo de expiração (ex: '7d', '1h')
   * @returns {Promise<string>} - URL segura gerada
   */
  async generateSecureSignupURL(data, expiresIn = '7d') {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const response = await axios.post(
        `${API_BASE_URL}/secure-urls/invite`,
        {
          userType: data.userType || 'producer',
          plan: data.plan || 'basic',
          referrerId: data.referrerId,
          expiresIn
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        return response.data.inviteUrl;
      } else {
        throw new Error('Falha ao gerar URL segura');
      }
    } catch (error) {
      console.error('Erro ao gerar URL segura:', error);
      throw error;
    }
  }

  /**
   * Valida uma URL segura e extrai os dados
   * @param {string} url - URL completa com token
   * @returns {Promise<Object>} - Dados extraídos da URL
   */
  async validateSecureURL(url) {
    try {
      const token = url.split('/').pop(); // Pega o token da URL

      const response = await axios.post(
        `${API_BASE_URL}/secure-urls/validate`,
        { token },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error('URL segura inválida ou expirada');
      }
    } catch (error) {
      console.error('Erro ao validar URL segura:', error);
      throw error;
    }
  }

  /**
   * Extrai dados de uma URL segura sem validação no servidor
   * @param {string} url - URL completa com token
   * @returns {Object|null} - Dados extraídos ou null se inválido
   */
  extractDataFromURL(url) {
    try {
      const token = url.split('/').pop();
      if (!token) return null;

      // Decodifica o JWT (apenas para extrair dados, sem verificar assinatura)
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const payload = JSON.parse(atob(parts[1]));

      // Verifica se não expirou
      if (payload.exp && payload.exp < Date.now() / 1000) {
        if (process.env.NODE_ENV !== 'production') {

          console.warn('Token expirado');

        }
        return null;
      }

      return payload;
    } catch (error) {
      console.error('Erro ao extrair dados da URL:', error);
      return null;
    }
  }

  /**
   * Gera uma URL segura para um tipo específico de cadastro
   * @param {string} userType - Tipo de usuário (producer, buyer, transporter)
   * @param {string} plan - Plano (basic, intermediate, premium)
   * @param {string} referrerId - ID do usuário que está convidando
   * @returns {Promise<string>} - URL segura
   */
  async generateSignupURL(userType, plan, referrerId = null) {
    return this.generateSecureSignupURL({
      userType,
      plan,
      referrerId
    });
  }
}

const secureURLService = new SecureURLService();
export default secureURLService;
