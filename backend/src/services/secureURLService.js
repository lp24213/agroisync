import crypto from 'crypto';
import jwt from 'jsonwebtoken';

class SecureURLService {
  constructor() {
    this.secretKey = process.env.JWT_SECRET || 'agroisync-secure-url-secret-2024';
    this.algorithm = 'aes-256-gcm';
  }

  /**
   * Gerar token seguro para URLs de cadastro
   * @param {string} type - Tipo de cadastro (signup-store, signup-freight, signup-product)
   * @param {Object} metadata - Dados adicionais (opcional)
   * @returns {string} - Token seguro
   */
  generateSecureToken(type, metadata = {}) {
    const payload = {
      type,
      metadata,
      timestamp: Date.now(),
      nonce: crypto.randomBytes(16).toString('hex')
    };

    return jwt.sign(payload, this.secretKey, {
      expiresIn: '24h',
      issuer: 'agroisync',
      audience: 'agroisync-signup'
    });
  }

  /**
   * Verificar token seguro
   * @param {string} token - Token a ser verificado
   * @returns {Object} - Dados decodificados
   */
  verifySecureToken(token) {
    try {
      return jwt.verify(token, this.secretKey, {
        issuer: 'agroisync',
        audience: 'agroisync-signup'
      });
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
  }

  /**
   * Gerar URL segura para cadastro
   * @param {string} type - Tipo de cadastro
   * @param {Object} metadata - Dados adicionais
   * @returns {string} - URL segura
   */
  generateSecureURL(type, metadata = {}) {
    const token = this.generateSecureToken(type, metadata);
    const baseUrl = process.env.FRONTEND_URL || 'https://agroisync.com';

    return `${baseUrl}/${type}/${token}`;
  }

  /**
   * Gerar código de convite seguro
   * @param {string} referrerId - ID do usuário que está convidando
   * @param {string} type - Tipo de cadastro
   * @returns {string} - Código de convite
   */
  generateInviteCode(referrerId, type) {
    const payload = {
      referrerId,
      type,
      timestamp: Date.now(),
      nonce: crypto.randomBytes(8).toString('hex')
    };

    const token = jwt.sign(payload, this.secretKey, {
      expiresIn: '7d',
      issuer: 'agroisync',
      audience: 'agroisync-invite'
    });

    // Converter para código mais amigável
    return Buffer.from(token).toString('base64url');
  }

  /**
   * Verificar código de convite
   * @param {string} inviteCode - Código de convite
   * @returns {Object} - Dados do convite
   */
  verifyInviteCode(inviteCode) {
    try {
      const token = Buffer.from(inviteCode, 'base64url').toString('utf8');
      return jwt.verify(token, this.secretKey, {
        issuer: 'agroisync',
        audience: 'agroisync-invite'
      });
    } catch (error) {
      throw new Error('Código de convite inválido ou expirado');
    }
  }

  /**
   * Gerar URL de convite completa
   * @param {string} referrerId - ID do usuário que está convidando
   * @param {string} type - Tipo de cadastro
   * @returns {string} - URL de convite completa
   */
  generateInviteURL(referrerId, type) {
    const inviteCode = this.generateInviteCode(referrerId, type);
    const baseUrl = process.env.FRONTEND_URL || 'https://agroisync.com';

    return `${baseUrl}/signup/${inviteCode}`;
  }

  /**
   * Criptografar dados sensíveis para URL
   * @param {Object} data - Dados a serem criptografados
   * @returns {string} - Dados criptografados em base64
   */
  encryptData(data) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.secretKey);
    cipher.setAAD(Buffer.from('agroisync-data', 'utf8'));

    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    const result = {
      encrypted,
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      algorithm: this.algorithm
    };

    return Buffer.from(JSON.stringify(result)).toString('base64url');
  }

  /**
   * Descriptografar dados da URL
   * @param {string} encryptedData - Dados criptografados
   * @returns {Object} - Dados descriptografados
   */
  decryptData(encryptedData) {
    try {
      const data = JSON.parse(Buffer.from(encryptedData, 'base64url').toString('utf8'));

      const decipher = crypto.createDecipher(data.algorithm, this.secretKey);
      decipher.setAAD(Buffer.from('agroisync-data', 'utf8'));
      decipher.setAuthTag(Buffer.from(data.authTag, 'hex'));

      let decrypted = decipher.update(data.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return JSON.parse(decrypted);
    } catch (error) {
      throw new Error('Erro ao descriptografar dados');
    }
  }
}

const secureURLService = new SecureURLService();

export default secureURLService;
