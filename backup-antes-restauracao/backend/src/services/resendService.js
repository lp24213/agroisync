// @ts-check
import { Resend } from 'resend';
import logger from '../utils/logger.js';
import { retryWithBackoff } from '../utils/retry.js';

class ResendService {
  constructor(config) {
    this.config = config;
    this.client = null;
    this.initialized = false;
    this.initializePromise = null;
  }

  async initialize() {
    if (this.initializePromise) {
      return this.initializePromise;
    }

    this.initializePromise = (async () => {
      try {
        if (!this.config.apiKey) {
          throw new Error('RESEND_API_KEY não configurada');
        }

        this.client = new Resend(this.config.apiKey);
        
        // Teste de conexão
        await this.client.emails.get('test').catch(err => {
          if (err.statusCode !== 404) {
            throw err;
          }
        });

        logger.info('Resend Service inicializado com sucesso');
        this.initialized = true;
      } catch (error) {
        logger.error('Falha ao inicializar Resend Service:', error);
        this.initialized = false;
        throw error;
      }
    })();

    return this.initializePromise;
  }

  async sendEmail(options) {
    if (!this.initialized) {
      await this.initialize();
    }

    const { to, subject, html, text, template, templateData } = options;

    const emailData = {
      from: this.config.fromEmail,
      to: Array.isArray(to) ? to : [to],
      subject,
      html: template ? this.renderTemplate(template, templateData) : html,
      text: text || this.stripHtml(html),
      tags: [
        { name: 'application', value: 'agroisync' },
        { name: 'template', value: template || 'custom' }
      ]
    };

    return retryWithBackoff(
      async () => {
        const result = await this.client.emails.send(emailData);
        if (!result?.data?.id) {
          throw new Error('Falha no envio - sem ID de confirmação');
        }
        logger.info(`Email enviado com sucesso para ${to} [ID: ${result.data.id}]`);
        return result;
      },
      {
        maxAttempts: parseInt(this.config.retryAttempts, 10) || 3,
        delayMs: parseInt(this.config.retryDelay, 10) || 5000,
        exponential: true,
        onError: (error, attempt) => {
          logger.error(`Tentativa ${attempt} falhou:`, error);
        }
      }
    );
  }

  renderTemplate(templateName, data) {
    const template = this.getTemplate(templateName);
    if (!template) {
      throw new Error(`Template '${templateName}' não encontrado`);
    }
    return template(data);
  }

  getTemplate(templateName) {
    const templates = {
      welcome: ({ name }) => `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Bem-vindo ao AgroSync</title>
        </head>
        <body>
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2B8A3E;">Bem-vindo ao AgroSync!</h1>
            <p>Olá ${name},</p>
            <p>Estamos muito felizes em ter você conosco! Sua conta foi criada com sucesso.</p>
            <div style="margin: 30px 0; padding: 20px; background-color: #F8F9FA; border-radius: 8px;">
              <p style="margin: 0;">Próximos passos:</p>
              <ul>
                <li>Complete seu perfil</li>
                <li>Explore nossa plataforma</li>
                <li>Conecte-se com outros produtores</li>
              </ul>
            </div>
            <p>Precisa de ajuda? Entre em contato conosco.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E9ECEF;">
              <p style="color: #868E96; font-size: 14px;">Atenciosamente,<br>Equipe AgroSync</p>
            </div>
          </div>
        </body>
        </html>
      `,
      
      recovery: ({ name, code }) => `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Recuperação de Senha</title>
        </head>
        <body>
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2B8A3E;">Recuperação de Senha</h1>
            <p>Olá ${name},</p>
            <p>Recebemos uma solicitação de recuperação de senha para sua conta.</p>
            <div style="margin: 30px 0; padding: 20px; background-color: #F8F9FA; border-radius: 8px; text-align: center;">
              <p style="margin: 0 0 10px 0;">Seu código de recuperação é:</p>
              <div style="background: #FFFFFF; padding: 20px; border-radius: 4px; border: 2px solid #2B8A3E;">
                <span style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #2B8A3E;">
                  ${code}
                </span>
              </div>
              <p style="margin: 10px 0 0 0; color: #868E96;">Este código expira em 1 hora</p>
            </div>
            <div style="margin: 20px 0; padding: 15px; background-color: #FFF5F5; border-radius: 4px;">
              <p style="color: #E03131; margin: 0; font-size: 14px;">
                ⚠️ Por segurança, nunca compartilhe este código com ninguém
              </p>
            </div>
            <p>Se você não solicitou esta recuperação, ignore este e-mail e altere sua senha por segurança.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E9ECEF;">
              <p style="color: #868E96; font-size: 14px;">Atenciosamente,<br>Equipe AgroSync</p>
            </div>
          </div>
        </body>
        </html>
      `,

      orderConfirmation: ({ name, orderId, items, total }) => `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Confirmação de Pedido</title>
        </head>
        <body>
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #2B8A3E;">Pedido Confirmado!</h1>
            <p>Olá ${name},</p>
            <p>Seu pedido foi confirmado com sucesso.</p>
            <div style="margin: 20px 0; padding: 20px; background-color: #F8F9FA; border-radius: 8px;">
              <p style="margin: 0 0 10px 0;"><strong>Pedido #${orderId}</strong></p>
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #DEE2E6;">
                  <th style="text-align: left; padding: 10px;">Item</th>
                  <th style="text-align: right; padding: 10px;">Valor</th>
                </tr>
                ${items.map(item => `
                  <tr style="border-bottom: 1px solid #DEE2E6;">
                    <td style="padding: 10px;">${item.name}</td>
                    <td style="text-align: right; padding: 10px;">R$ ${item.price.toFixed(2)}</td>
                  </tr>
                `).join('')}
                <tr>
                  <td style="padding: 10px;"><strong>Total</strong></td>
                  <td style="text-align: right; padding: 10px;"><strong>R$ ${total.toFixed(2)}</strong></td>
                </tr>
              </table>
            </div>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E9ECEF;">
              <p style="color: #868E96; font-size: 14px;">Atenciosamente,<br>Equipe AgroSync</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    return templates[templateName];
  }

  stripHtml(html) {
    return html.replace(/<[^>]*>?/gm, '');
  }
}

export default ResendService;