import { Resend } from 'resend';
import logger from '../utils/logger.js';
import { EMAIL_CONFIG } from '../config/constants.js';

// Instanciação com validação robusta
let resend = null;
const getResendClient = () => {
  if (resend) {
    return resend;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const enabled = process.env.RESEND_ENABLED === 'true';
  
  if (!enabled) {
    logger.warn('Resend está desabilitado nas configurações');
    return null;
  }

  if (!apiKey) {
    logger.error('RESEND_API_KEY não configurada');
    throw new Error('RESEND_API_KEY not configured');
  }

  try {
    logger.info('Inicializando novo cliente Resend');
    resend = new Resend(apiKey);
    
    // Teste de conexão assíncrono
    (async () => {
      try {
        await resend.emails.get('test');
        logger.info('Conexão com Resend estabelecida com sucesso');
      } catch (err) {
        if (err.statusCode === 404) {
          logger.info('Conexão com Resend estabelecida com sucesso (404 esperado)');
        } else {
          logger.error('Erro ao testar conexão com Resend:', err);
          resend = null;
        }
      }
    })();

    return resend;
  } catch (err) {
    logger.error('Falha crítica ao inicializar Resend client:', err);
    resend = null;
    throw new Error('Failed to initialize Resend client');
  }
};

class EmailService {
  constructor() {
    this.transporter = null;
  }

  initializeTransporter() {
    logger.info('Resend Email Service initialized.');
  }

  async sendEmail({ to, subject, html, text, from = null }) {
    try {
      logger.info(`Iniciando envio de email para ${to}`);
      
      const client = getResendClient();
      if (!client) {
        logger.error('Cliente Resend não inicializado');
        throw new Error('Resend client não configurado corretamente');
      }

      const fromEmail = from || process.env.RESEND_FROM_EMAIL || 'AgroSync <noreply@agroisync.com>';
      logger.debug('Configurações do email:', {
        from: fromEmail,
        to,
        subject,
        hasHtml: !!html,
        hasText: !!text
      });

      const result = await client.emails.send({
        from: fromEmail,
        to: [to],
        subject,
        html,
        text,
        tags: [{ name: 'category', value: 'auth' }]
      });

      if (result.error) {
        logger.error('Erro retornado pelo Resend:', result.error);
        throw new Error(result.error.message || 'Erro ao enviar email');
      }

      logger.info(`Email enviado com sucesso para ${to}. ID: ${result.data?.id}`);
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
            <h1>RedefiniÃ§Ã£o de Senha</h1>
            <p>AgroSync - Plataforma Inteligente de AgronegÃ³cio</p>
          </div>

          <div class="content">
            <h2>OlÃ¡, ${name}!</h2>

            <p>Recebemos uma solicitaÃ§Ã£o para redefinir a senha da sua conta AgroSync.</p>

            <p>Clique no botÃ£o abaixo para criar uma nova senha:</p>

            <a href="${resetUrl}" class="button">Redefinir Senha</a>

            <div class="warning">
              <strong>Importante:</strong>
              <ul>
                <li>Este link expira em <strong>1 hora</strong></li>
                <li>Se vocÃª nÃ£o solicitou esta redefiniÃ§Ã£o, ignore este email</li>
                <li>NÃ£o compartilhe este link com outras pessoas</li>
              </ul>
            </div>

            <p>Se o botÃ£o nÃ£o funcionar, copie e cole o link abaixo no seu navegador:</p>
            <p style="word-break: break-all; color: #666;">${resetUrl}</p>

            <p>Atenciosamente,<br>Equipe AgroSync</p>
          </div>

          <div class="footer">
            <p>Este Ã© um email automÃ¡tico, nÃ£o responda a esta mensagem.</p>
            <p>Â© 2024 AgroSync. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({
      to,
      subject,
      html,
      text: `RedefiniÃ§Ã£o de senha AgroSync\n\nOlÃ¡, ${name}!\n\nClique no link para redefinir sua senha: ${resetUrl}\n\nEste link expira em 1 hora.`
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
            <h1>Bem-vindo ao AgroSync!</h1>
            <p>Plataforma Inteligente de AgronegÃ³cio</p>
          </div>

          <div class="content">
            <h2>OlÃ¡, ${name}!</h2>

            <p>Seja muito bem-vindo ao AgroSync! Estamos felizes em tÃª-lo conosco nesta jornada de transformaÃ§Ã£o do agronegÃ³cio.</p>

            <div class="features">
              <div class="feature">
                <h3>Marketplace</h3>
                <p>Compre e venda produtos agrÃ­colas com seguranÃ§a</p>
              </div>
              <div class="feature">
                <h3>Frete</h3>
                <p>Encontre transportadores confiÃ¡veis</p>
              </div>
              <div class="feature">
                <h3>Crypto</h3>
                <p>Pagamentos seguros com criptomoedas</p>
              </div>
              <div class="feature">
                <h3>Analytics</h3>
                <p>Dados em tempo real para suas decisÃµes</p>
              </div>
            </div>

            <p>Comece explorando nossa plataforma:</p>

            <a href="https://agroisync.com/dashboard" class="button">Acessar Dashboard</a>

            <p>Se tiver alguma dÃºvida, nossa equipe de suporte estÃ¡ sempre pronta para ajudar!</p>

            <p>Atenciosamente,<br>Equipe AgroSync</p>
          </div>

          <div class="footer">
            <p>Este Ã© um email automÃ¡tico, nÃ£o responda a esta mensagem.</p>
            <p>Â© 2024 AgroSync. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({
      to,
      subject,
      html,
      text: `Bem-vindo ao AgroSync!\n\nOlÃ¡, ${name}!\n\nSeja muito bem-vindo ao AgroSync! Acesse seu dashboard: https://agroisync.com/dashboard`
    });
  }

  async sendVerificationCode({ to, name, code }) {
    const subject = 'CÃ³digo de VerificaÃ§Ã£o - AgroSync';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CÃ³digo de VerificaÃ§Ã£o</title>
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
            <h1>CÃ³digo de VerificaÃ§Ã£o</h1>
            <p>AgroSync - Plataforma Inteligente de AgronegÃ³cio</p>
          </div>

          <div class="content">
            <h2>OlÃ¡, ${name}!</h2>

            <p>Seu cÃ³digo de verificaÃ§Ã£o para completar o cadastro Ã©:</p>

            <div class="code">${code}</div>

            <div class="warning">
              <strong>Importante:</strong>
              <ul>
                <li>Este cÃ³digo expira em <strong>10 minutos</strong></li>
                <li>NÃ£o compartilhe este cÃ³digo com outras pessoas</li>
                <li>Se vocÃª nÃ£o solicitou este cÃ³digo, ignore este email</li>
              </ul>
            </div>

            <p>Digite este cÃ³digo na tela de verificaÃ§Ã£o para ativar sua conta.</p>

            <p>Atenciosamente,<br>Equipe AgroSync</p>
          </div>

          <div class="footer">
            <p>Este Ã© um email automÃ¡tico, nÃ£o responda a esta mensagem.</p>
            <p>Â© 2024 AgroSync. Todos os direitos reservados.</p>
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
        text: `CÃ³digo de verificaÃ§Ã£o AgroSync: ${code}\n\nOlÃ¡, ${name}!\n\nSeu cÃ³digo de verificaÃ§Ã£o Ã©: ${code}\n\nEste cÃ³digo expira em 10 minutos.`
      });

      logger.info(`CÃ³digo de verificaÃ§Ã£o enviado para ${to}: ${code}`);
      return result;
    } catch (error) {
      logger.error(`Erro ao enviar cÃ³digo de verificaÃ§Ã£o para ${to}:`, error);
      throw error;
    }
  }
}

export default new EmailService();
