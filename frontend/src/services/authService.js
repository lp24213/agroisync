import axios from 'axios';

// Configuração da API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Tipos de autenticação
export const AUTH_METHODS = {
  'PASSWORD': 'Senha',
  'SMS': 'SMS',
  'EMAIL': 'E-mail',
  '2FA': 'Autenticação em Duas Etapas',
  'BIOMETRIC': 'Biometria'
};

// Estados de verificação
export const VERIFICATION_STATUS = {
  'PENDING': 'Pendente',
  'SENT': 'Enviado',
  'VERIFIED': 'Verificado',
  'EXPIRED': 'Expirado',
  'FAILED': 'Falhou'
};

// Tipos de OTP
export const OTP_TYPES = {
  'SMS': 'SMS',
  'EMAIL': 'E-mail',
  '2FA_APP': 'App 2FA',
  'BACKUP_CODES': 'Códigos de Backup'
};

class AuthService {
  constructor() {
    this.otpAttempts = new Map();
    this.maxOtpAttempts = 3;
    this.otpExpiryTime = 5 * 60 * 1000; // 5 minutos
  }

  // Gerar OTP para SMS
  async generateSMSOTP(phoneNumber) {
    try {
      // Em produção, chamar endpoint do backend que usa AWS SNS
      // const response = await axios.post(`${API_BASE_URL}/auth/otp/sms`, {
      //   phoneNumber
      // });

      // Simular geração para desenvolvimento
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiryTime = Date.now() + this.otpExpiryTime;
      
      // Salvar OTP localmente para simulação
      this.saveOTP(phoneNumber, otp, expiryTime, 'SMS');
      
      console.log('📱 OTP SMS enviado via AWS SNS:', {
        to: phoneNumber,
        otp: otp,
        expiry: new Date(expiryTime).toLocaleTimeString()
      });

      return {
        success: true,
        message: 'OTP enviado via SMS',
        otp: otp, // Em produção, não retornar o OTP
        expiryTime: expiryTime
      };
    } catch (error) {
      console.error('Erro ao gerar OTP SMS:', error);
      throw error;
    }
  }

  // Gerar OTP para Email
  async generateEmailOTP(email) {
    try {
      // Em produção, chamar endpoint do backend que usa AWS SES
      // const response = await axios.post(`${API_BASE_URL}/auth/otp/email`, {
      //   email
      // });

      // Simular geração para desenvolvimento
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiryTime = Date.now() + this.otpExpiryTime;
      
      // Salvar OTP localmente para simulação
      this.saveOTP(email, otp, expiryTime, 'EMAIL');
      
      console.log('📧 OTP Email enviado via AWS SES:', {
        to: email,
        otp: otp,
        expiry: new Date(expiryTime).toLocaleTimeString()
      });

      return {
        success: true,
        message: 'OTP enviado via e-mail',
        otp: otp, // Em produção, não retornar o OTP
        expiryTime: expiryTime
      };
    } catch (error) {
      console.error('Erro ao gerar OTP Email:', error);
      throw error;
    }
  }

  // Verificar OTP
  async verifyOTP(identifier, otp, type = 'SMS') {
    try {
      const savedOTP = this.getOTP(identifier, type);
      
      if (!savedOTP) {
        return {
          success: false,
          message: 'OTP não encontrado ou expirado'
        };
      }

      if (Date.now() > savedOTP.expiryTime) {
        this.clearOTP(identifier, type);
        return {
          success: false,
          message: 'OTP expirado'
        };
      }

      if (savedOTP.otp !== otp) {
        // Incrementar tentativas
        const attempts = this.getOTPAttempts(identifier, type);
        if (attempts >= this.maxOtpAttempts) {
          this.clearOTP(identifier, type);
          return {
            success: false,
            message: 'Máximo de tentativas excedido. OTP inválido.'
          };
        }
        this.incrementOTPAttempts(identifier, type);
        
        return {
          success: false,
          message: 'OTP inválido'
        };
      }

      // OTP válido
      this.clearOTP(identifier, type);
      return {
        success: true,
        message: 'OTP verificado com sucesso'
      };
    } catch (error) {
      console.error('Erro ao verificar OTP:', error);
      throw error;
    }
  }

  // Configurar 2FA para usuário
  async setup2FA(userId) {
    try {
      // Em produção, gerar secret para app 2FA (Google Authenticator, Authy)
      // const response = await axios.post(`${API_BASE_URL}/auth/2fa/setup`, {
      //   userId
      // });

      // Simular configuração para desenvolvimento
      const secret = this.generateSecret();
      const qrCodeUrl = this.generateQRCode(secret, 'AgroSync', 'user@example.com');
      const backupCodes = this.generateBackupCodes();
      
      console.log('🔐 2FA configurado:', {
        userId,
        secret: secret,
        backupCodes: backupCodes
      });

      return {
        success: true,
        secret: secret,
        qrCodeUrl: qrCodeUrl,
        backupCodes: backupCodes,
        message: '2FA configurado com sucesso'
      };
    } catch (error) {
      console.error('Erro ao configurar 2FA:', error);
      throw error;
    }
  }

  // Verificar código 2FA
  async verify2FACode(userId, code) {
    try {
      // Em produção, verificar código via backend
      // const response = await axios.post(`${API_BASE_URL}/auth/2fa/verify`, {
      //   userId,
      //   code
      // });

      // Simular verificação para desenvolvimento
      const isValid = this.validate2FACode(code);
      
      return {
        success: isValid,
        message: isValid ? 'Código 2FA válido' : 'Código 2FA inválido'
      };
    } catch (error) {
      console.error('Erro ao verificar código 2FA:', error);
      throw error;
    }
  }

  // Recuperar senha
  async forgotPassword(email) {
    try {
      // Em produção, chamar endpoint do backend
      // const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, {
      //   email
      // });

      // Simular envio para desenvolvimento
      const resetToken = this.generateResetToken();
      const expiryTime = Date.now() + (24 * 60 * 60 * 1000); // 24 horas
      
      // Salvar token de reset localmente para simulação
      this.saveResetToken(email, resetToken, expiryTime);
      
      console.log('🔑 E-mail de recuperação enviado via AWS SES:', {
        to: email,
        resetToken: resetToken,
        expiry: new Date(expiryTime).toLocaleString()
      });

      return {
        success: true,
        message: 'E-mail de recuperação enviado',
        resetToken: resetToken // Em produção, não retornar o token
      };
    } catch (error) {
      console.error('Erro ao enviar e-mail de recuperação:', error);
      throw error;
    }
  }

  // Resetar senha
  async resetPassword(resetToken, newPassword) {
    try {
      // Em produção, chamar endpoint do backend
      // const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, {
      //   resetToken,
      //   newPassword
      // });

      // Simular reset para desenvolvimento
      const resetData = this.getResetToken(resetToken);
      
      if (!resetData) {
        return {
          success: false,
          message: 'Token de reset inválido ou expirado'
        };
      }

      if (Date.now() > resetData.expiryTime) {
        this.clearResetToken(resetToken);
        return {
          success: false,
          message: 'Token de reset expirado'
        };
      }

      // Senha resetada com sucesso
      this.clearResetToken(resetToken);
      
      console.log('🔑 Senha resetada com sucesso para:', resetData.email);

      return {
        success: true,
        message: 'Senha resetada com sucesso'
      };
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      throw error;
    }
  }

  // Verificar força da senha
  validatePasswordStrength(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const score = [
      password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar
    ].filter(Boolean).length;

    const strength = {
      0: 'Muito Fraca',
      1: 'Fraca',
      2: 'Média',
      3: 'Forte',
      4: 'Muito Forte',
      5: 'Excelente'
    };

    return {
      score: score,
      strength: strength[score],
      isValid: score >= 3,
      details: {
        minLength: password.length >= minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar
      }
    };
  }

  // Verificar email
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Verificar telefone (formato brasileiro)
  validatePhone(phone) {
    const phoneRegex = /^(\+55\s?)?(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/;
    return phoneRegex.test(phone);
  }

  // Métodos auxiliares para simulação
  saveOTP(identifier, otp, expiryTime, type) {
    const key = `${identifier}_${type}`;
    localStorage.setItem(`otp_${key}`, JSON.stringify({
      otp,
      expiryTime,
      type,
      attempts: 0
    }));
  }

  getOTP(identifier, type) {
    const key = `${identifier}_${type}`;
    const data = localStorage.getItem(`otp_${key}`);
    return data ? JSON.parse(data) : null;
  }

  clearOTP(identifier, type) {
    const key = `${identifier}_${type}`;
    localStorage.removeItem(`otp_${key}`);
  }

  getOTPAttempts(identifier, type) {
    const key = `${identifier}_${type}`;
    const data = localStorage.getItem(`otp_${key}`);
    return data ? JSON.parse(data).attempts : 0;
  }

  incrementOTPAttempts(identifier, type) {
    const key = `${identifier}_${type}`;
    const data = localStorage.getItem(`otp_${key}`);
    if (data) {
      const otpData = JSON.parse(data);
      otpData.attempts += 1;
      localStorage.setItem(`otp_${key}`, JSON.stringify(otpData));
    }
  }

  saveResetToken(email, token, expiryTime) {
    localStorage.setItem(`reset_${token}`, JSON.stringify({
      email,
      expiryTime
    }));
  }

  getResetToken(token) {
    const data = localStorage.getItem(`reset_${token}`);
    return data ? JSON.parse(data) : null;
  }

  clearResetToken(token) {
    localStorage.removeItem(`reset_${token}`);
  }

  generateSecret() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  generateQRCode(secret, issuer, account) {
    const otpauth = `otpauth://totp/${issuer}:${account}?secret=${secret}&issuer=${issuer}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpauth)}`;
  }

  generateBackupCodes() {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substring(2, 8).toUpperCase());
    }
    return codes;
  }

  validate2FACode(code) {
    // Simular validação de código 2FA
    return code.length === 6 && /^\d{6}$/.test(code);
  }

  generateResetToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // Limpar dados de desenvolvimento
  clearDevelopmentData() {
    // Limpar todos os OTPs e tokens de reset
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('otp_') || key.startsWith('reset_')) {
        localStorage.removeItem(key);
      }
    });
    
    this.otpAttempts.clear();
    console.log('Dados de desenvolvimento limpos');
  }
}

export default new AuthService();
