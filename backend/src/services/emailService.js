import { Resend } from 'resend';
import logger from '../utils/logger.js';
import { EMAIL_CONFIG } from '../config/constants.js';

const resend = new Resend(EMAIL_CONFIG.resendApiKey);

class EmailService {
  constructor() {
    this.transporter = null;
  }

  initializeTransporter() {
    logger.info('Resend Email Service initialized.');
  }

  async sendEmail({ to, subject, html, text, from = null }) {
    try {
      // RESEND CONFIGURADO E FUNCIONANDO
      logger.info(`Enviando email para ${to} via Resend`);

      const result = await resend.emails.send({
        from: from || process.env.RESEND_FROM || 'AgroSync <onboarding@resend.dev>',
        to: [to],
        subject,
        html,
        text
      });

      logger.info(`Email enviado para ${to}: ${result.data?.id}`);
      return result;
    } catch (error) {
      logger.error('Erro ao enviar email:', error);
      throw error;
    }
  }

  async sendPasswordResetEmail({ to, name, resetToken }) {
    const subject = 'Redefinição de Senha - AgroSync';
    const resetUrl = EMAIL_CONFIG.resetPasswordURL(resetToken);

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
          .header { background: linear-gradient(135deg, #2a7f4f 0%, #1e5f3a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { background: #2a7f4f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; }
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

            <p>Recebemos uma solicitação para redefinir a senha da sua conta AgroSync.</p>

            <p>Clique no botão abaixo para criar uma nova senha:</p>

            <a href="${resetUrl}" class="button">Redefinir Senha</a>

            <div class="warning">
              <strong>⚠️ Importante:</strong>
              <ul>
                <li>Este link expira em <strong>1 hora</strong></li>
                <li>Se você não solicitou esta redefinição, ignore este email</li>
                <li>Não compartilhe este link com outras pessoas</li>
              </ul>
            </div>

            <p>Se o botão não funcionar, copie e cole o link abaixo no seu navegador:</p>
            <p style="word-break: break-all; color: #666;">${resetUrl}</p>

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

    return await this.sendEmail({
      to,
      subject,
      html,
      text: `Redefinição de senha AgroSync\n\nOlá, ${name}!\n\nClique no link para redefinir sua senha: ${resetUrl}\n\nEste link expira em 1 hora.`
    });
  }

  async sendWelcomeEmail({ to, name }) {
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
          .header { background: linear-gradient(135deg, #2a7f4f 0%, #1e5f3a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { background: #2a7f4f; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .features { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
          .feature { background: white; padding: 20px; border-radius: 8px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌱 Bem-vindo ao AgroSync!</h1>
            <p>Plataforma Inteligente de Agronegócio</p>
          </div>

          <div class="content">
            <h2>Olá, ${name}!</h2>

            <p>Seja muito bem-vindo ao AgroSync! Estamos felizes em tê-lo conosco nesta jornada de transformação do agronegócio.</p>

            <div class="features">
              <div class="feature">
                <h3>🏪 Marketplace</h3>
                <p>Compre e venda produtos agrícolas com segurança</p>
              </div>
              <div class="feature">
                <h3>🚛 Frete</h3>
                <p>Encontre transportadores confiáveis</p>
              </div>
              <div class="feature">
                <h3>💎 Crypto</h3>
                <p>Pagamentos seguros com criptomoedas</p>
              </div>
              <div class="feature">
                <h3>📊 Analytics</h3>
                <p>Dados em tempo real para suas decisões</p>
              </div>
            </div>

            <p>Comece explorando nossa plataforma:</p>

            <a href="https://agroisync.com/dashboard" class="button">Acessar Dashboard</a>

            <p>Se tiver alguma dúvida, nossa equipe de suporte está sempre pronta para ajudar!</p>

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

    return await this.sendEmail({
      to,
      subject,
      html,
      text: `Bem-vindo ao AgroSync!\n\nOlá, ${name}!\n\nSeja muito bem-vindo ao AgroSync! Acesse seu dashboard: https://agroisync.com/dashboard`
    });
  }

  async sendVerificationCode({ to, name, code }) {
    const subject = 'Código de Verificação - AgroSync';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Código de Verificação</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2a7f4f 0%, #1e5f3a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .code { background: #2a7f4f; color: white; padding: 20px; text-align: center; font-size: 2rem; font-weight: bold; border-radius: 8px; margin: 20px 0; letter-spacing: 5px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Código de Verificação</h1>
            <p>AgroSync - Plataforma Inteligente de Agronegócio</p>
          </div>

          <div class="content">
            <h2>Olá, ${name}!</h2>

            <p>Seu código de verificação para completar o cadastro é:</p>

            <div class="code">${code}</div>

            <div class="warning">
              <strong>⚠️ Importante:</strong>
              <ul>
                <li>Este código expira em <strong>10 minutos</strong></li>
                <li>Não compartilhe este código com outras pessoas</li>
                <li>Se você não solicitou este código, ignore este email</li>
              </ul>
            </div>

            <p>Digite este código na tela de verificação para ativar sua conta.</p>

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

    try {
      const result = await this.sendEmail({
        to,
        subject,
        html,
        text: `Código de verificação AgroSync: ${code}\n\nOlá, ${name}!\n\nSeu código de verificação é: ${code}\n\nEste código expira em 10 minutos.`
      });

      logger.info(`Código de verificação enviado para ${to}: ${code}`);
      return result;
    } catch (error) {
      logger.error(`Erro ao enviar código de verificação para ${to}:`, error);
      throw error;
    }
  }
}

export default new EmailService();
