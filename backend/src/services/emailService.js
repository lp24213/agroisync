const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  async initializeTransporter() {
    try {
      // Configuração para diferentes provedores
      const emailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
    auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      };

      // Se usando SendGrid
      if (process.env.EMAIL_PROVIDER === 'sendgrid') {
        emailConfig.service = 'SendGrid';
        emailConfig.auth = {
          user: 'apikey',
          pass: process.env.SENDGRID_API_KEY
        };
      }

      // Se usando Mailgun
      if (process.env.EMAIL_PROVIDER === 'mailgun') {
        emailConfig.service = 'Mailgun';
        emailConfig.auth = {
          user: process.env.MAILGUN_SMTP_USER,
          pass: process.env.MAILGUN_SMTP_PASS
        };
      }

      // Se usando AWS SES
      if (process.env.EMAIL_PROVIDER === 'ses') {
        emailConfig.service = 'SES';
        emailConfig.auth = {
          user: process.env.AWS_ACCESS_KEY_ID,
          pass: process.env.AWS_SECRET_ACCESS_KEY
        };
        emailConfig.region = process.env.AWS_REGION || 'us-east-1';
      }

      this.transporter = nodemailer.createTransporter(emailConfig);

      // Verificar conexão
      await this.transporter.verify();
      logger.info('Serviço de email inicializado com sucesso');
    } catch (error) {
      logger.error('Erro ao inicializar serviço de email:', error);
      // Fallback para desenvolvimento
      this.transporter = nodemailer.createTransporter({
        host: 'localhost',
        port: 1025,
        ignoreTLS: true
      });
    }
  }

  async sendEmail({ to, subject, html, text, from = null }) {
    try {
      const mailOptions = {
        from: from || process.env.SMTP_FROM || 'noreply@agroisync.com',
        to,
        subject,
        html,
        text
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`Email enviado para ${to}: ${result.messageId}`);
      return result;
    } catch (error) {
      logger.error('Erro ao enviar email:', error);
      throw error;
    }
  }

  async sendPasswordResetEmail({ to, name, resetUrl, expiresIn }) {
    const subject = 'Redefinição de Senha - AgroSync';
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Redefinição de Senha</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Redefinição de Senha</h1>
            <p>AgroSync - Plataforma Inteligente de Agronegócio</p>
          </div>
          
          <div class="content">
            <h2>Olá, ${name}!</h2>
            
            <p>Recebemos uma solicitação para redefinir a senha da sua conta no AgroSync.</p>
            
            <p>Para criar uma nova senha, clique no botão abaixo:</p>
            
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Redefinir Minha Senha</a>
      </div>
            
            <div class="warning">
              <strong>⚠️ Importante:</strong>
              <ul>
                <li>Este link expira em <strong>${expiresIn}</strong></li>
                <li>Se você não solicitou esta redefinição, ignore este email</li>
                <li>Nunca compartilhe este link com outras pessoas</li>
              </ul>
            </div>
            
            <p>Se o botão não funcionar, copie e cole este link no seu navegador:</p>
            <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 5px;">${resetUrl}</p>
            
            <p>Se você tiver alguma dúvida, entre em contato conosco através do nosso suporte.</p>
            
            <p>Atenciosamente,<br>Equipe AgroSync</p>
          </div>
          
          <div class="footer">
            <p>Este é um email automático, não responda a esta mensagem.</p>
            <p>© 2024 AgroSync. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      Redefinição de Senha - AgroSync
      
      Olá, ${name}!
      
      Recebemos uma solicitação para redefinir a senha da sua conta no AgroSync.
      
      Para criar uma nova senha, acesse este link: ${resetUrl}
      
      IMPORTANTE:
      - Este link expira em ${expiresIn}
      - Se você não solicitou esta redefinição, ignore este email
      - Nunca compartilhe este link com outras pessoas
      
      Se você tiver alguma dúvida, entre em contato conosco através do nosso suporte.
      
      Atenciosamente,
      Equipe AgroSync
    `;

    return await this.sendEmail({
      to,
      subject,
      html,
      text
    });
  }

  async sendWelcomeEmail({ to, name, verificationUrl }) {
    const subject = 'Bem-vindo ao AgroSync!';
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bem-vindo ao AgroSync</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .features { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚀 Bem-vindo ao AgroSync!</h1>
            <p>Plataforma Inteligente de Agronegócio</p>
          </div>
          
          <div class="content">
            <h2>Olá, ${name}!</h2>
            
            <p>É um prazer tê-lo(a) conosco na AgroSync! Sua conta foi criada com sucesso.</p>
            
            <div class="features">
              <h3>🌟 Recursos disponíveis:</h3>
              <ul>
                <li><strong>Marketplace:</strong> Compre e venda produtos agrícolas</li>
                <li><strong>AgroConecta:</strong> Sistema de logística e rastreamento</li>
                <li><strong>Chat Inteligente:</strong> Assistente IA para suas necessidades</li>
                <li><strong>Análises:</strong> Dados e insights do mercado</li>
              </ul>
        </div>
            
            <p>Para começar a usar sua conta, verifique seu email clicando no botão abaixo:</p>
            
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verificar Email</a>
      </div>
            
            <p>Se você tiver alguma dúvida ou precisar de ajuda, nossa equipe de suporte está sempre disponível.</p>
            
            <p>Bem-vindo(a) à revolução do agronegócio!<br>Equipe AgroSync</p>
          </div>
          
          <div class="footer">
            <p>Este é um email automático, não responda a esta mensagem.</p>
            <p>© 2024 AgroSync. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({
      to,
      subject,
      html,
      text: `Bem-vindo ao AgroSync, ${name}! Verifique seu email em: ${verificationUrl}`
    });
  }

  async sendNotificationEmail({ to, name, subject, message, actionUrl = null, actionText = null }) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📢 Notificação AgroSync</h1>
          </div>
          
          <div class="content">
            <h2>Olá, ${name}!</h2>
            
            <p>${message}</p>
            
            ${actionUrl && actionText ? `
              <div style="text-align: center;">
                <a href="${actionUrl}" class="button">${actionText}</a>
              </div>
            ` : ''}
            
            <p>Atenciosamente,<br>Equipe AgroSync</p>
          </div>
          
          <div class="footer">
            <p>© 2024 AgroSync. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({
      to,
      subject,
      html,
      text: `${subject}\n\nOlá, ${name}!\n\n${message}${actionUrl ? `\n\nAcesse: ${actionUrl}` : ''}`
    });
  }
}

module.exports = new EmailService();