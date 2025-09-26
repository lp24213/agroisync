import nodemailer from 'nodemailer';
import twilio from 'twilio';
import devConfig from '../config/devConfig.js';
import logger from '../utils/logger.js';

// Verificar se estamos em modo de desenvolvimento
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.SMTP_HOST;

// Configuração de email (usando SMTP genérico)
const emailTransporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || devConfig.email.host,
  port: process.env.SMTP_PORT || devConfig.email.port,
  secure: false, // true para 465, false para outras portas
  auth: {
    user: process.env.SMTP_USER || devConfig.email.user,
    pass: process.env.SMTP_PASS || devConfig.email.pass
  }
});

// Configuração SMS (usando Twilio)
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID || devConfig.sms.accountSid,
  process.env.TWILIO_AUTH_TOKEN || devConfig.sms.authToken
);

// Função para enviar email via Resend
const sendEmailViaResend = async (to, subject, html) => {
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'AgroSync <onboarding@resend.dev>',
        to,
        subject,
        html
      })
    });

    const data = await response.json();
    if (response.ok && data.id) {
      logger.info(`Email enviado via Resend para ${to}: ${data.id}`);
      return { success: true, messageId: data.id };
    } else {
      throw new Error(`Resend Error: ${data.message}`);
    }
  } catch (error) {
    logger.error(`Erro ao enviar email via Resend para ${to}:`, error);
    return { success: false, error: error.message };
  }
};

class NotificationService {
  constructor() {
    this.fromEmail = process.env.FROM_EMAIL || devConfig.email.fromEmail;
    this.fromName = process.env.FROM_NAME || devConfig.email.fromName;
    this.twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || devConfig.sms.phoneNumber;
    this.isDevelopment = isDevelopment;
  }

  /**
   * Enviar email via Resend (prioritário) ou SMTP (fallback)
   * @param {string} to - Email do destinatário
   * @param {string} subject - Assunto do email
   * @param {string} htmlBody - Corpo HTML do email
   * @param {string} textBody - Corpo texto do email (opcional)
   * @returns {Promise<Object>} - Resultado do envio
   */
  async sendEmail(to, subject, htmlBody, textBody = null) {
    try {
      // Modo de desenvolvimento - simular envio
      if (this.isDevelopment) {
        logger.info('🔧 [DEV MODE] Simulando envio de email:');
        logger.info(`   Para: ${to}`);
        logger.info(`   Assunto: ${subject}`);
        logger.info(`   Corpo: ${textBody || htmlBody.substring(0, 100)}...`);
        return {
          success: true,
          messageId: `dev-${Date.now()}`,
          message: 'Email simulado (modo desenvolvimento)'
        };
      }

      // Tentar enviar via Cloudflare Worker primeiro
      const workerResult = await this.sendEmailViaWorker(to, subject, htmlBody);
      if (workerResult.success) {
        return workerResult;
      }
      logger.warn('Cloudflare Worker falhou, tentando Resend como fallback');

      // Fallback para Resend
      if (process.env.RESEND_API_KEY) {
        const resendResult = await sendEmailViaResend(to, subject, htmlBody);
        if (resendResult.success) {
          return resendResult;
        }
        logger.warn('Resend falhou, tentando SMTP como fallback');
      }

      // Fallback para SMTP
      const mailOptions = {
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to,
        subject,
        html: htmlBody
      };

      if (textBody) {
        mailOptions.text = textBody;
      }

      const result = await emailTransporter.sendMail(mailOptions);

      logger.info(`✅ Email enviado com sucesso para ${to}:`, result.messageId);

      return {
        success: true,
        messageId: result.messageId,
        message: 'Email enviado com sucesso'
      };
    } catch (error) {
      logger.error(`❌ Erro ao enviar email para ${to}:`, error);

      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  /**
   * Enviar SMS via Twilio
   * @param {string} phoneNumber - Número do telefone (formato E.164)
   * @param {string} message - Mensagem do SMS
   * @returns {Promise<Object>} - Resultado do envio
   */
  async sendSMS(phoneNumber, message) {
    try {
      // Modo de desenvolvimento - simular envio
      if (this.isDevelopment) {
        logger.info('🔧 [DEV MODE] Simulando envio de SMS:');
        logger.info(`   Para: ${phoneNumber}`);
        logger.info(`   Mensagem: ${message}`);
        return {
          success: true,
          messageId: `dev-sms-${Date.now()}`,
          message: 'SMS simulado (modo desenvolvimento)'
        };
      }

      // Formatar número de telefone para E.164 se necessário
      const formattedPhone = this.formatPhoneNumber(phoneNumber);

      const result = await twilioClient.messages.create({
        body: message,
        from: this.twilioPhoneNumber,
        to: formattedPhone
      });

      logger.info(`✅ SMS enviado com sucesso para ${formattedPhone}:`, result.sid);

      return {
        success: true,
        messageId: result.sid,
        message: 'SMS enviado com sucesso'
      };
    } catch (error) {
      logger.error(`❌ Erro ao enviar SMS para ${phoneNumber}:`, error);

      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  /**
   * Enviar email via Cloudflare Worker
   * @param {string} to - Email do destinatário
   * @param {string} subject - Assunto do email
   * @param {string} htmlBody - Corpo HTML do email
   * @returns {Promise<Object>} - Resultado do envio
   */
  async sendEmailViaWorker(to, subject, _htmlBody) {
    try {
      const workerUrl =
        process.env.CLOUDFLARE_WORKER_URL || 'https://agroisync-api.contato-00d.workers.dev';

      // Determinar endpoint baseado no assunto
      let endpoint = '/api/email/send-verification';
      if (subject.includes('Recuperação') || subject.includes('recuperação')) {
        endpoint = '/api/forgot-password';
      }

      const response = await fetch(`${workerUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: to })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        logger.info(
          `Email enviado via Cloudflare Worker para ${to}: ${data.data?.messageId || 'N/A'}`
        );
        return { success: true, messageId: data.data?.messageId || 'worker-sent' };
      } else {
        throw new Error(`Worker Error: ${data.message}`);
      }
    } catch (error) {
      logger.error(`Erro ao enviar email via Cloudflare Worker para ${to}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Enviar código OTP por email
   * @param {string} to - Email do destinatário
   * @param {string} code - Código OTP
   * @param {string} userName - Nome do usuário
   * @returns {Promise<Object>} - Resultado do envio
   */
  async sendOTPEmail(to, code, userName) {
    const subject = 'Código de Verificação - AgroSync';

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #059669; margin: 0;">🌾 AgroSync</h1>
          <p style="color: #666; margin: 10px 0 0 0;">Plataforma de Agronegócio</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
          <h2 style="color: #333; margin: 0 0 20px 0;">Seu código de verificação</h2>
          <div style="background: #059669; color: white; font-size: 36px; font-weight: bold; padding: 20px; border-radius: 8px; letter-spacing: 5px; margin: 20px 0;">
            ${code}
          </div>
          <p style="color: #666; margin: 20px 0 0 0;">Este código é válido por 10 minutos.</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 14px; margin: 0;">
            Se você não solicitou este código, ignore este email.<br>
            AgroSync - Conectando o agronegócio brasileiro.
          </p>
        </div>
      </div>
    `;

    const textBody = `Código de Verificação AgroSync\n\nOlá, ${userName}!\n\nUse o código abaixo para verificar seu email:\n\n${code}\n\nEste código expira em 10 minutos.\n\nSe você não solicitou este código, ignore este email.\n\nAtenciosamente,\nEquipe AgroSync`;

    return await this.sendEmail(to, subject, htmlBody, textBody);
  }

  /**
   * Enviar email de verificação de conta
   * @param {string} to - Email do usuário
   * @param {string} verificationToken - Token de verificação
   * @param {string} userName - Nome do usuário
   * @returns {Promise<Object>} - Resultado do envio
   */
  async sendEmailVerification(to, verificationToken, userName) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    const subject = 'Verifique sua Conta - AgroSync';

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #059669; margin: 0;">🌾 AgroSync</h1>
          <p style="color: #666; margin: 10px 0 0 0;">Plataforma de Agronegócio</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px;">
          <h2 style="color: #333; margin: 0 0 20px 0;">Bem-vindo ao AgroSync, ${userName}!</h2>
          
          <p style="color: #666; margin: 0 0 20px 0;">Obrigado por se cadastrar em nossa plataforma. Para ativar sua conta, clique no botão abaixo:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="display: inline-block; background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              ✅ Verificar Conta
            </a>
          </div>
          
          <p style="color: #666; margin: 20px 0 0 0;">Após verificar sua conta, você terá acesso completo a todos os recursos da plataforma.</p>
          
          <p style="color: #999; font-size: 14px; margin: 20px 0 0 0;">
            Se o botão não funcionar, copie e cole este link: ${verificationUrl}
          </p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 14px; margin: 0;">
            AgroSync - Conectando o agronegócio brasileiro.
          </p>
        </div>
      </div>
    `;

    const textBody = `
      Verificação de Conta - AgroSync
      
      Bem-vindo ao AgroSync, ${userName}!
      
      Obrigado por se cadastrar em nossa plataforma. Para ativar sua conta, acesse:
      ${verificationUrl}
      
      Após verificar sua conta, você terá acesso completo a todos os recursos.
      
      Atenciosamente,
      Equipe AgroSync
      
      ${process.env.FRONTEND_URL}
    `;

    return await this.sendEmail(to, subject, htmlBody, textBody);
  }

  /**
   * Enviar SMS com código OTP
   * @param {string} phoneNumber - Número do telefone
   * @param {string} otpCode - Código OTP de 6 dígitos
   * @param {string} userName - Nome do usuário
   * @returns {Promise<Object>} - Resultado do envio
   */
  async sendOTPSMS(phoneNumber, otpCode, userName) {
    const message = `AgroSync: Olá ${userName}! Seu código de verificação é: ${otpCode}. Expira em 5 minutos. Não compartilhe com ninguém.`;

    return await this.sendSMS(phoneNumber, message);
  }

  /**
   * Enviar SMS de boas-vindas
   * @param {string} phoneNumber - Número do telefone
   * @param {string} userName - Nome do usuário
   * @returns {Promise<Object>} - Resultado do envio
   */
  async sendWelcomeSMS(phoneNumber, userName) {
    const message = `AgroSync: Bem-vindo ${userName}! Sua conta foi criada com sucesso. Acesse ${process.env.FRONTEND_URL} para começar.`;

    return await this.sendSMS(phoneNumber, message);
  }

  /**
   * Formatar número de telefone para formato E.164
   * @param {string} phoneNumber - Número do telefone
   * @returns {string} - Número formatado
   */
  formatPhoneNumber(phoneNumber) {
    // Remove todos os caracteres não numéricos
    let cleaned = phoneNumber.replace(/\D/g, '');

    // Se começa com 0, remove
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }

    // Se não tem código do país, adiciona +55 (Brasil)
    if (!cleaned.startsWith('55')) {
      cleaned = `55${cleaned}`;
    }

    // Adiciona o + no início
    return `+${cleaned}`;
  }

  /**
   * Enviar email de recuperação de senha
   * @param {string} to - Email do usuário
   * @param {string} resetCode - Código de recuperação
   * @param {string} userName - Nome do usuário
   * @returns {Promise<Object>} - Resultado do envio
   */
  async sendPasswordResetEmail(to, resetCode, userName) {
    const subject = 'Recuperação de Senha - AgroSync';

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #059669; margin: 0;">🌾 AgroSync</h1>
          <p style="color: #666; margin: 10px 0 0 0;">Recuperação de Senha</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
          <h2 style="color: #333; margin: 0 0 20px 0;">Código de recuperação</h2>
          <div style="background: #dc2626; color: white; font-size: 36px; font-weight: bold; padding: 20px; border-radius: 8px; letter-spacing: 5px; margin: 20px 0;">
            ${resetCode}
          </div>
          <p style="color: #666; margin: 20px 0 0 0;">Este código é válido por 15 minutos.</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 14px; margin: 0;">
            Se você não solicitou a recuperação de senha, ignore este email.<br>
            AgroSync - Conectando o agronegócio brasileiro.
          </p>
        </div>
      </div>
    `;

    const textBody = `
      Recuperação de Senha - AgroSync
      
      Olá, ${userName}!
      
      Recebemos uma solicitação para redefinir sua senha na plataforma AgroSync.
      
      Seu código de recuperação é: ${resetCode}
      
      Este código é válido por 15 minutos.
      
      Se você não fez essa solicitação, ignore este email.
      
      Atenciosamente,
      Equipe AgroSync
      
      ${process.env.FRONTEND_URL}
    `;

    return await this.sendEmail(to, subject, htmlBody, textBody);
  }

  /**
   * Verificar configuração do serviço
   * @returns {Promise<Object>} - Status da configuração
   */
  checkConfiguration() {
    const config = {
      mode: this.isDevelopment ? 'development' : 'production',
      email: {
        configured:
          !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) ||
          !!process.env.RESEND_API_KEY,
        host: process.env.SMTP_HOST || devConfig.email.host,
        user: process.env.SMTP_USER || devConfig.email.user,
        fromEmail: this.fromEmail,
        fromName: this.fromName,
        resendConfigured: !!process.env.RESEND_API_KEY
      },
      sms: {
        configured: !!(
          process.env.TWILIO_ACCOUNT_SID &&
          process.env.TWILIO_AUTH_TOKEN &&
          process.env.TWILIO_PHONE_NUMBER
        ),
        phoneNumber: this.twilioPhoneNumber,
        accountSid: process.env.TWILIO_ACCOUNT_SID || devConfig.sms.accountSid
      }
    };

    logger.info('📧 Configuração de Notificações:', config);
    return config;
  }
}

const notificationService = new NotificationService();

export default notificationService;
