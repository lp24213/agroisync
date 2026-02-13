import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import devConfig from '../config/devConfig.js';
import logger from '../utils/logger.js';
import EmailLog from '../models/EmailLog.js';

// Verificar se estamos em modo de desenvolvimento
const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.SMTP_HOST;

// ConfiguraÃ§Ã£o de email (usando SMTP genÃ©rico)
// SMTP desativado (Resend-only). Mantido para compatibilidade caso reative no futuro.
// const emailTransporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST || devConfig.email.host,
//   port: process.env.SMTP_PORT || devConfig.email.port,
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER || devConfig.email.user,
//     pass: process.env.SMTP_PASS || devConfig.email.pass
//   }
// });

// ConfiguraÃ§Ã£o SMS (Twilio foi removido). Mantemos variÃ¡veis de ambiente compatÃ­veis,
// mas o envio real via Twilio foi substituÃ­do por um fallback que apenas registra e simula o envio.
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID || devConfig.sms.accountSid;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN || devConfig.sms.authToken;
const isSmsConfigured = Boolean(twilioAccountSid && twilioAuthToken);
const twilioClient = null; // Twilio package intentionally removed; use simulated sender below

// Cliente Resend (SDK oficial) - instanciação preguiçosa
let resendClient = null;
const getResendClient = () => {
  if (resendClient) return resendClient;
  if (process.env.RESEND_API_KEY) {
    try {
      resendClient = new Resend(process.env.RESEND_API_KEY);
      return resendClient;
    } catch (err) {
      logger.error('Falha ao inicializar Resend client:', err);
      resendClient = null;
      return null;
    }
  }
  return null;
};

// Função para enviar email via Resend (SDK)
const sendEmailViaResend = async (to, subject, html, text) => {
  const client = getResendClient();
  if (!client) {
    return { success: false, error: 'RESEND_API_KEY ausente' };
  }
  try {
    const from = process.env.RESEND_FROM || 'AgroSync <contato@agroisync.com>';
    const result = await client.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      ...(text ? { text } : {})
    });

    const messageId = result?.data?.id || result?.id || 'resend-sent';
    logger.info(
      JSON.stringify({
        event: 'email.sent',
        provider: 'resend',
        to,
        subject,
        messageId,
        timestamp: new Date().toISOString()
      })
    );
    try {
      await EmailLog.create({ provider: 'resend', to, subject, messageId, status: 'sent' });
    } catch (e) {
      // não bloquear fluxo por falha de log
      logger.warn(`Falha ao persistir EmailLog (sent): ${e?.message || e}`);
    }
    return { success: true, messageId };
  } catch (error) {
    const msg = error?.message || error?.name || 'Erro desconhecido ao enviar via Resend';
    logger.error(
      JSON.stringify({
        event: 'email.error',
        provider: 'resend',
        to,
        subject,
        error: msg,
        timestamp: new Date().toISOString()
      })
    );
    try {
      await EmailLog.create({ provider: 'resend', to, subject, status: 'error', error: msg });
    } catch (e) {
      logger.warn(`Falha ao persistir EmailLog (error): ${e?.message || e}`);
    }
    return { success: false, error: msg };
  }
};

class NotificationService {
  constructor() {
    this.fromEmail = process.env.FROM_EMAIL || devConfig.email.fromEmail;
    this.fromName = process.env.FROM_NAME || devConfig.email.fromName;
    this.twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || devConfig.sms.phoneNumber;
    this.isDevelopment = isDevelopment;
    this.isSmsConfigured = isSmsConfigured && Boolean(this.twilioPhoneNumber);
  }

  /**
   * Enviar email via Resend (prioritÃ¡rio) ou SMTP (fallback)
   * @param {string} to - Email do destinatÃ¡rio
   * @param {string} subject - Assunto do email
   * @param {string} htmlBody - Corpo HTML do email
   * @param {string} textBody - Corpo texto do email (opcional)
   * @returns {Promise<Object>} - Resultado do envio
   */
  async sendEmail(to, subject, htmlBody, textBody = null) {
    if (!process.env.RESEND_API_KEY) {
      const error = 'RESEND_API_KEY não configurada';
      logger.error(error);
      return { success: false, error };
    }

    const resendResult = await sendEmailViaResend(to, subject, htmlBody, textBody);
    if (!resendResult.success) {
      // Não usar fallback: falhar explicitamente para visibilidade
      return { success: false, error: resendResult.error || 'Falha ao enviar via Resend' };
    }
    return resendResult;
  }

  /**
   * Enviar SMS via Twilio
   * @param {string} phoneNumber - NÃºmero do telefone (formato E.164)
   * @param {string} message - Mensagem do SMS
   * @returns {Promise<Object>} - Resultado do envio
   */
  async sendSMS(phoneNumber, message) {
    try {
      // Modo de desenvolvimento - simular envio
      if (this.isDevelopment) {
        logger.info('ðŸ”§ [DEV MODE] Simulando envio de SMS:');
        logger.info(`   Para: ${phoneNumber}`);
        logger.info(`   Mensagem: ${message}`);
        return {
          success: true,
          messageId: `dev-sms-${Date.now()}`,
          message: 'SMS simulado (modo desenvolvimento)'
        };
      }

      // Se nÃ£o hÃ¡ configuraÃ§Ã£o vÃ¡lida de SMS, retornar como desabilitado
      // Se nÃ£o hÃ¡ configuraÃ§Ã£o vÃ¡lida de SMS, retornar como desabilitado
      if (!this.isSmsConfigured) {
        logger.warn('SMS nÃ£o configurado. Ignorando envio.');
        return { success: false, error: 'SMS desabilitado', code: 'SMS_DISABLED' };
      }

      // Twilio foi removido do projeto. Para evitar quebrar chamadas, fazemos um envio simulado
      // que apenas registra a tentativa e retorna sucesso. Se quiser ativar um provedor real,
      // substitua este bloco por integraÃ§Ãµes com outro provedor.
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      const fakeId = `sim-sms-${Date.now()}`;
      logger.info(
        `[SIMULATED SMS] Para: ${formattedPhone}; From: ${this.twilioPhoneNumber}; Mensagem: ${message}; id: ${fakeId}`
      );
      try {
        // Persistir log do envio (opcional) — EmailLog usado como placeholder para não criar nova model
        await EmailLog.create({
          provider: 'simulated-sms',
          to: formattedPhone,
          subject: 'SMS',
          messageId: fakeId,
          status: 'sent'
        });
      } catch (e) {
        logger.warn(`Falha ao persistir EmailLog para SMS simulado: ${e?.message || e}`);
      }
      return {
        success: true,
        messageId: fakeId,
        message: 'SMS simulado com sucesso (Twilio removido)'
      };
    } catch (error) {
      logger.error(`âŒ Erro ao enviar SMS para ${phoneNumber}:`, error);

      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  /**
   * Enviar email via Cloudflare Worker
   * @param {string} to - Email do destinatÃ¡rio
   * @param {string} subject - Assunto do email
   * @param {string} htmlBody - Corpo HTML do email
   * @returns {Promise<Object>} - Resultado do envio
   */
  async sendEmailViaWorker() {
    // Desativado: sem fallback (Resend only)
    return Promise.resolve({ success: false, error: 'Worker email desativado' });
  }

  /**
   * Enviar cÃ³digo OTP por email
   * @param {string} to - Email do destinatÃ¡rio
   * @param {string} code - CÃ³digo OTP
   * @param {string} userName - Nome do usuÃ¡rio
   * @returns {Promise<Object>} - Resultado do envio
   */
  async sendOTPEmail(to, code, userName) {
    const subject = 'CÃ³digo de VerificaÃ§Ã£o - AgroSync';

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #059669; margin: 0;">AgroSync</h1>
          <p style="color: #666; margin: 10px 0 0 0;">Plataforma de AgronegÃ³cio</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
          <h2 style="color: #333; margin: 0 0 20px 0;">Seu cÃ³digo de verificaÃ§Ã£o</h2>
          <div style="background: #059669; color: white; font-size: 36px; font-weight: bold; padding: 20px; border-radius: 8px; letter-spacing: 5px; margin: 20px 0;">
            ${code}
          </div>
          <p style="color: #666; margin: 20px 0 0 0;">Este cÃ³digo Ã© vÃ¡lido por 10 minutos.</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 14px; margin: 0;">
            Se vocÃª nÃ£o solicitou este cÃ³digo, ignore este email.<br>
            AgroSync - Conectando o agronegÃ³cio brasileiro.
          </p>
        </div>
      </div>
    `;

    const textBody = `CÃ³digo de VerificaÃ§Ã£o AgroSync\n\nOlÃ¡, ${userName}!\n\nUse o cÃ³digo abaixo para verificar seu email:\n\n${code}\n\nEste cÃ³digo expira em 10 minutos.\n\nSe vocÃª nÃ£o solicitou este cÃ³digo, ignore este email.\n\nAtenciosamente,\nEquipe AgroSync`;

    return await this.sendEmail(to, subject, htmlBody, textBody);
  }

  /**
   * Enviar email de verificaÃ§Ã£o de conta
   * @param {string} to - Email do usuÃ¡rio
   * @param {string} verificationToken - Token de verificaÃ§Ã£o
   * @param {string} userName - Nome do usuÃ¡rio
   * @returns {Promise<Object>} - Resultado do envio
   */
  async sendEmailVerification(to, verificationToken, userName) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    const subject = 'Verifique sua Conta - AgroSync';

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #059669; margin: 0;">AgroSync</h1>
          <p style="color: #666; margin: 10px 0 0 0;">Plataforma de AgronegÃ³cio</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px;">
          <h2 style="color: #333; margin: 0 0 20px 0;">Bem-vindo ao AgroSync, ${userName}!</h2>
          
          <p style="color: #666; margin: 0 0 20px 0;">Obrigado por se cadastrar em nossa plataforma. Para ativar sua conta, clique no botÃ£o abaixo:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="display: inline-block; background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Verificar Conta
            </a>
          </div>
          
          <p style="color: #666; margin: 20px 0 0 0;">ApÃ³s verificar sua conta, vocÃª terÃ¡ acesso completo a todos os recursos da plataforma.</p>
          
          <p style="color: #999; font-size: 14px; margin: 20px 0 0 0;">
            Se o botÃ£o nÃ£o funcionar, copie e cole este link: ${verificationUrl}
          </p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 14px; margin: 0;">
            AgroSync - Conectando o agronegÃ³cio brasileiro.
          </p>
        </div>
      </div>
    `;

    const textBody = `
      VerificaÃ§Ã£o de Conta - AgroSync
      
      Bem-vindo ao AgroSync, ${userName}!
      
      Obrigado por se cadastrar em nossa plataforma. Para ativar sua conta, acesse:
      ${verificationUrl}
      
      ApÃ³s verificar sua conta, vocÃª terÃ¡ acesso completo a todos os recursos.
      
      Atenciosamente,
      Equipe AgroSync
      
      ${process.env.FRONTEND_URL}
    `;

    return await this.sendEmail(to, subject, htmlBody, textBody);
  }

  /**
   * Enviar SMS com cÃ³digo OTP
   * @param {string} phoneNumber - NÃºmero do telefone
   * @param {string} otpCode - CÃ³digo OTP de 6 dÃ­gitos
   * @param {string} userName - Nome do usuÃ¡rio
   * @returns {Promise<Object>} - Resultado do envio
   */
  async sendOTPSMS(phoneNumber, otpCode, userName) {
    const message = `AgroSync: OlÃ¡ ${userName}! Seu cÃ³digo de verificaÃ§Ã£o Ã©: ${otpCode}. Expira em 5 minutos. NÃ£o compartilhe com ninguÃ©m.`;

    return await this.sendSMS(phoneNumber, message);
  }

  /**
   * Enviar SMS de boas-vindas
   * @param {string} phoneNumber - NÃºmero do telefone
   * @param {string} userName - Nome do usuÃ¡rio
   * @returns {Promise<Object>} - Resultado do envio
   */
  async sendWelcomeSMS(phoneNumber, userName) {
    const message = `AgroSync: Bem-vindo ${userName}! Sua conta foi criada com sucesso. Acesse ${process.env.FRONTEND_URL} para comeÃ§ar.`;

    return await this.sendSMS(phoneNumber, message);
  }

  /**
   * Formatar nÃºmero de telefone para formato E.164
   * @param {string} phoneNumber - NÃºmero do telefone
   * @returns {string} - NÃºmero formatado
   */
  formatPhoneNumber(phoneNumber) {
    // Remove todos os caracteres nÃ£o numÃ©ricos
    let cleaned = phoneNumber.replace(/\D/g, '');

    // Se comeÃ§a com 0, remove
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }

    // Se nÃ£o tem cÃ³digo do paÃ­s, adiciona +55 (Brasil)
    if (!cleaned.startsWith('55')) {
      cleaned = `55${cleaned}`;
    }

    // Adiciona o + no inÃ­cio
    return `+${cleaned}`;
  }

  /**
   * Enviar email de recuperaÃ§Ã£o de senha
   * @param {string} to - Email do usuÃ¡rio
   * @param {string} resetCode - CÃ³digo de recuperaÃ§Ã£o
   * @param {string} userName - Nome do usuÃ¡rio
   * @returns {Promise<Object>} - Resultado do envio
   */
  async sendPasswordResetEmail(to, resetCode, userName) {
    const subject = 'RecuperaÃ§Ã£o de Senha - AgroSync';

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #059669; margin: 0;">AgroSync</h1>
          <p style="color: #666; margin: 10px 0 0 0;">RecuperaÃ§Ã£o de Senha</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
          <h2 style="color: #333; margin: 0 0 20px 0;">CÃ³digo de recuperaÃ§Ã£o</h2>
          <div style="background: #dc2626; color: white; font-size: 36px; font-weight: bold; padding: 20px; border-radius: 8px; letter-spacing: 5px; margin: 20px 0;">
            ${resetCode}
          </div>
          <p style="color: #666; margin: 20px 0 0 0;">Este cÃ³digo Ã© vÃ¡lido por 15 minutos.</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 14px; margin: 0;">
            Se vocÃª nÃ£o solicitou a recuperaÃ§Ã£o de senha, ignore este email.<br>
            AgroSync - Conectando o agronegÃ³cio brasileiro.
          </p>
        </div>
      </div>
    `;

    const textBody = `
      RecuperaÃ§Ã£o de Senha - AgroSync
      
      OlÃ¡, ${userName}!
      
      Recebemos uma solicitaÃ§Ã£o para redefinir sua senha na plataforma AgroSync.
      
      Seu cÃ³digo de recuperaÃ§Ã£o Ã©: ${resetCode}
      
      Este cÃ³digo Ã© vÃ¡lido por 15 minutos.
      
      Se vocÃª nÃ£o fez essa solicitaÃ§Ã£o, ignore este email.
      
      Atenciosamente,
      Equipe AgroSync
      
      ${process.env.FRONTEND_URL}
    `;

    return await this.sendEmail(to, subject, htmlBody, textBody);
  }

  /**
   * Verificar configuraÃ§Ã£o do serviÃ§o
   * @returns {Promise<Object>} - Status da configuraÃ§Ã£o
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
        configured: this.isSmsConfigured,
        phoneNumber: this.twilioPhoneNumber,
        accountSid: process.env.TWILIO_ACCOUNT_SID || devConfig.sms.accountSid
      }
    };

    logger.info('ðŸ“§ ConfiguraÃ§Ã£o de NotificaÃ§Ãµes:', config);
    return config;
  }
}

const notificationService = new NotificationService();

export default notificationService;
