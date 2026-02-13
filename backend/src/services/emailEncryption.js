import CryptoJS from 'crypto-js';
import logger from '../utils/logger.js';

/**
 * Serviço de criptografia AES-256 para senhas de email
 * A chave deve vir de ENV variável EMAIL_ENCRYPTION_KEY
 */
class EmailEncryptionService {
  constructor() {
    this.key = process.env.EMAIL_ENCRYPTION_KEY;
    
    if (!this.key) {
      logger.error('EMAIL_ENCRYPTION_KEY não configurada! Criptografia desabilitada.');
      throw new Error('EMAIL_ENCRYPTION_KEY não configurada');
    }

    // Garantir que a chave tenha 32 bytes (256 bits) para AES-256
    if (this.key.length < 32) {
      logger.warn('EMAIL_ENCRYPTION_KEY muito curta. Padronizando para 32 bytes.');
      this.key = CryptoJS.SHA256(this.key).toString().substring(0, 32);
    }
  }

  /**
   * Criptografa uma senha usando AES-256
   * @param {string} password - Senha em texto plano
   * @returns {string} - Senha criptografada (hex)
   */
  encrypt(password) {
    try {
      if (!password) {
        throw new Error('Password não pode ser vazio');
      }

      const encrypted = CryptoJS.AES.encrypt(password, this.key).toString();
      return encrypted;
    } catch (error) {
      logger.error('Erro ao criptografar senha:', error);
      throw new Error('Falha ao criptografar senha');
    }
  }

  /**
   * Descriptografa uma senha usando AES-256
   * @param {string} encryptedPassword - Senha criptografada (hex)
   * @returns {string} - Senha em texto plano
   */
  decrypt(encryptedPassword) {
    try {
      if (!encryptedPassword) {
        throw new Error('Encrypted password não pode ser vazio');
      }

      const bytes = CryptoJS.AES.decrypt(encryptedPassword, this.key);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!decrypted) {
        throw new Error('Falha ao descriptografar - chave incorreta ou dados corrompidos');
      }

      return decrypted;
    } catch (error) {
      logger.error('Erro ao descriptografar senha:', error);
      throw new Error('Falha ao descriptografar senha');
    }
  }

  /**
   * Verifica se uma senha descriptografada está correta
   * @param {string} encryptedPassword - Senha criptografada
   * @param {string} plainPassword - Senha em texto plano para comparar
   * @returns {boolean}
   */
  verify(encryptedPassword, plainPassword) {
    try {
      const decrypted = this.decrypt(encryptedPassword);
      return decrypted === plainPassword;
    } catch (error) {
      logger.error('Erro ao verificar senha:', error);
      return false;
    }
  }
}

export default new EmailEncryptionService();

