import nodemailer from 'nodemailer';
import twilio from 'twilio';

// Configuração de email (usando SMTP genérico)
const emailTransporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true para 465, false para outras portas
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Configuração SMS (usando Twilio)
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

class NotificationService {
  constructor() {
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@agrosync.com';
    this.fromName = process.env.FROM_NAME || 'AgroSync';
    this.twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
  }

  /**
   * Enviar email via SMTP
   * @param {string} to - Email do destinatário
   * @param {string} subject - Assunto do email
   * @param {string} htmlBody - Corpo HTML do email
   * @param {string} textBody - Corpo texto do email (opcional)
   * @returns {Promise<Object>} - Resultado do envio
   */
  async sendEmail(to, subject, htmlBody, textBody = null) {
    try {
      const mailOptions = {
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to: to,
        subject: subject,
        html: htmlBody
      };

      if (textBody) {
        mailOptions.text = textBody;
      }

      const result = await emailTransporter.sendMail(mailOptions);
      
      console.log(`✅ Email enviado com sucesso para ${to}:`, result.messageId);

      return {
        success: true,
        messageId: result.messageId,
        message: 'Email enviado com sucesso'
      };
    } catch (error) {
      console.error(`❌ Erro ao enviar email para ${to}:`, error);

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
      // Formatar número de telefone para E.164 se necessário
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      const result = await twilioClient.messages.create({
        body: message,
        from: this.twilioPhoneNumber,
        to: formattedPhone
      });
      
      console.log(`✅ SMS enviado com sucesso para ${formattedPhone}:`, result.sid);
      
      return {
        success: true,
        messageId: result.sid,
        message: 'SMS enviado com sucesso'
      };
    } catch (error) {
      console.error(`❌ Erro ao enviar SMS para ${phoneNumber}:`, error);
      
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  /**
   * Enviar email de recuperação de senha
   * @param {string} to - Email do usuário
   * @param {string} resetToken - Token de redefinição
   * @param {string} userName - Nome do usuário
   * @returns {Promise<Object>} - Resultado do envio
   */
  async sendPasswordResetEmail(to, resetToken, userName) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const subject = 'Redefinição de Senha - AgroSync';
    
    const htmlBody = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Redefinição de Senha - AgroSync</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e293b 0%, #334155 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #1e293b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
          .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌾 AgroSync</h1>
            <p>Plataforma de Agronegócio</p>
          </div>
          
          <div class="content">
            <h2>Olá, ${userName}!</h2>
            
            <p>Recebemos uma solicitação para redefinir sua senha na plataforma AgroSync.</p>
            
            <p>Se você não fez essa solicitação, ignore este email. Caso contrário, clique no botão abaixo para criar uma nova senha:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">🔐 Redefinir Senha</a>
            </div>
            
            <div class="warning">
              <strong>⚠️ Importante:</strong>
              <ul>
                <li>Este link expira em 15 minutos</li>
                <li>Não compartilhe este email com ninguém</li>
                <li>Se o botão não funcionar, copie e cole este link: ${resetUrl}</li>
              </ul>
            </div>
            
            <p>Após redefinir sua senha, você poderá fazer login normalmente na plataforma.</p>
            
            <p>Se tiver alguma dúvida, entre em contato conosco através do suporte.</p>
            
            <p>Atenciosamente,<br>
            <strong>Equipe AgroSync</strong></p>
          </div>
          
          <div class="footer">
            <p>Este email foi enviado automaticamente. Não responda a esta mensagem.</p>
            <p>&copy; 2024 AgroSync. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const textBody = `
      Redefinição de Senha - AgroSync
      
      Olá, ${userName}!
      
      Recebemos uma solicitação para redefinir sua senha na plataforma AgroSync.
      
      Para redefinir sua senha, acesse: ${resetUrl}
      
      IMPORTANTE:
      - Este link expira em 15 minutos
      - Não compartilhe este email com ninguém
      
      Se você não fez essa solicitação, ignore este email.
      
      Após redefinir sua senha, você poderá fazer login normalmente.
      
      Atenciosamente,
      Equipe AgroSync
      
      ${process.env.FRONTEND_URL}
    `;
    
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
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verificação de Conta - AgroSync</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f0fdf4; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌾 AgroSync</h1>
            <p>Plataforma de Agronegócio</p>
          </div>
          
          <div class="content">
            <h2>Bem-vindo ao AgroSync, ${userName}!</h2>
            
            <p>Obrigado por se cadastrar em nossa plataforma. Para ativar sua conta, clique no botão abaixo:</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">✅ Verificar Conta</a>
            </div>
            
            <p>Após verificar sua conta, você terá acesso completo a todos os recursos da plataforma.</p>
            
            <p>Se o botão não funcionar, copie e cole este link: ${verificationUrl}</p>
            
            <p>Atenciosamente,<br>
            <strong>Equipe AgroSync</strong></p>
          </div>
          
          <div class="footer">
            <p>Este email foi enviado automaticamente. Não responda a esta mensagem.</p>
            <p>&copy; 2024 AgroSync. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
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
      cleaned = '55' + cleaned;
    }
    
    // Adiciona o + no início
    return '+' + cleaned;
  }

  /**
   * Verificar configuração do serviço
   * @returns {Promise<Object>} - Status da configuração
   */
  async checkConfiguration() {
    const config = {
      email: {
        configured: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
        host: process.env.SMTP_HOST || 'Not configured',
        user: process.env.SMTP_USER || 'Not configured'
      },
      sms: {
        configured: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER),
        phoneNumber: process.env.TWILIO_PHONE_NUMBER || 'Not configured'
      }
    };

    return config;
  }
}

const notificationService = new NotificationService();

export default notificationService;
