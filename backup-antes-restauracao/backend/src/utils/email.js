// @ts-check

import { Resend } from 'resend';

/**
 * Templates de e-mail
 * @enum {Object}
 */
export const EmailTemplates = {
  WELCOME: {
    subject: 'Bem-vindo ao AgroSync!',
    template: (name) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2B8A3E;">Bem-vindo ao AgroSync!</h1>
        <p>Olá ${name},</p>
        <p>Obrigado por se cadastrar no AgroSync. Estamos felizes em tê-lo conosco!</p>
        <p>Com o AgroSync você pode:</p>
        <ul>
          <li>Gerenciar seus produtos agrícolas</li>
          <li>Conectar-se com outros produtores</li>
          <li>Acompanhar preços e tendências do mercado</li>
          <li>E muito mais!</li>
        </ul>
        <p>Se precisar de ajuda, nossa equipe está sempre pronta para ajudar.</p>
        <p>Boas vendas!</p>
        <p>Equipe AgroSync</p>
      </div>
    `
  },
  RECOVERY: {
    subject: 'Código de Recuperação de Senha - AgroSync',
    template: (name, code) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recuperação de Senha</title>
      </head>
      <body>
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #E9ECEF; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2B8A3E; margin: 0;">Recuperação de Senha</h1>
          </div>
          
          <div style="margin-bottom: 30px;">
            <p style="font-size: 16px;">Olá <strong>${name}</strong>,</p>
            <p style="font-size: 16px;">Recebemos uma solicitação de recuperação de senha para sua conta no AgroSync.</p>
          </div>

          <div style="background-color: #F8F9FA; border-radius: 8px; padding: 30px; margin-bottom: 30px; text-align: center;">
            <p style="font-size: 14px; color: #495057; margin-bottom: 15px;">Seu código de recuperação é:</p>
            <div style="background: #FFFFFF; padding: 20px; border-radius: 4px; border: 2px solid #2B8A3E;">
              <span style="font-family: monospace; font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #2B8A3E;">${code}</span>
            </div>
            <p style="font-size: 14px; color: #868E96; margin-top: 15px;">Este código expira em 1 hora</p>
          </div>

          <div style="margin-bottom: 30px;">
            <p style="font-size: 14px; color: #495057;">Por segurança:</p>
            <ul style="color: #495057; font-size: 14px;">
              <li>Nunca compartilhe este código com ninguém</li>
              <li>A equipe AgroSync nunca pedirá este código por telefone ou mensagem</li>
              <li>Se você não solicitou este código, altere sua senha imediatamente</li>
            </ul>
          </div>

          <div style="border-top: 1px solid #E9ECEF; padding-top: 20px; text-align: center;">
            <p style="color: #868E96; font-size: 14px;">Se você não solicitou a recuperação de senha, por favor ignore este e-mail.</p>
            <p style="color: #868E96; font-size: 14px;">Atenciosamente,<br/>Equipe AgroSync</p>
          </div>
        </div>
      </body>
      </html>
    `
  },
  ORDER_CONFIRMATION: {
    subject: 'Confirmação de Pedido - AgroSync',
    template: (name, orderId, total) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2B8A3E;">Confirmação de Pedido</h1>
        <p>Olá ${name},</p>
        <p>Seu pedido #${orderId} foi confirmado!</p>
        <p>Valor total: R$ ${total.toFixed(2)}</p>
        <p>Você pode acompanhar o status do seu pedido em nosso site.</p>
        <p>Obrigado por escolher o AgroSync!</p>
        <p>Atenciosamente,<br/>Equipe AgroSync</p>
      </div>
    `
  },
  NEW_MESSAGE: {
    subject: 'Nova Mensagem - AgroSync',
    template: (name, sender) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2B8A3E;">Nova Mensagem</h1>
        <p>Olá ${name},</p>
        <p>Você recebeu uma nova mensagem de ${sender} no AgroSync.</p>
        <p>Acesse sua conta para ver o conteúdo completo.</p>
        <p>Atenciosamente,<br/>Equipe AgroSync</p>
      </div>
    `
  }
};

/**
 * Cliente de e-mail configurado
 * @typedef {Object} EmailClient
 * @property {string} from - E-mail do remetente
 * @property {Resend} client - Cliente Resend
 */

/**
 * Configura cliente de e-mail
 * @param {object} env - Variáveis de ambiente
 * @returns {EmailClient} Cliente configurado
 */
export function getEmailClient(env) {
  return {
    from: env.RESEND_FROM_EMAIL || 'no-reply@agroisync.com',
    client: new Resend(env.RESEND_API_KEY)
  };
}

/**
 * Envia um e-mail
 * @param {EmailClient} emailClient - Cliente de e-mail
 * @param {string} to - Destinatário
 * @param {string} subject - Assunto
 * @param {string} html - Corpo HTML
 * @returns {Promise<void>} 
 */
export async function sendEmail(emailClient, to, subject, html) {
  if (!emailClient || !emailClient.client) {
    console.error('Email client não inicializado');
    throw new Error('Email client not initialized');
  }

  try {
    const result = await emailClient.client.emails.send({
      from: emailClient.from || process.env.RESEND_FROM_EMAIL || 'AgroSync <noreply@agroisync.com>',
      to: [to],
      subject,
      html,
      tags: [{ name: 'category', value: 'recovery' }]
    });

    if (!result.data || !result.data.id) {
      throw new Error('Failed to send email - no confirmation from Resend');
    }

    logger.info(`Email sent successfully to ${to} - ID: ${result.data.id}`);
    return result;
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

/**
 * Envia e-mail de boas-vindas
 * @param {EmailClient} emailClient 
 * @param {string} to 
 * @param {string} name 
 */
export async function sendWelcomeEmail(emailClient, to, name) {
  const template = EmailTemplates.WELCOME;
  await sendEmail(
    emailClient,
    to,
    template.subject,
    template.template(name)
  );
}

/**
 * Envia e-mail de recuperação de senha
 * @param {EmailClient} emailClient 
 * @param {string} to 
 * @param {string} name 
 * @param {string} code 
 */
export async function sendRecoveryEmail(emailClient, to, name, code) {
  const template = EmailTemplates.RECOVERY;
  await sendEmail(
    emailClient,
    to,
    template.subject,
    template.template(name, code)
  );
}

/**
 * Envia e-mail de confirmação de pedido
 * @param {EmailClient} emailClient 
 * @param {string} to 
 * @param {string} name 
 * @param {string} orderId 
 * @param {number} total 
 */
export async function sendOrderConfirmationEmail(emailClient, to, name, orderId, total) {
  const template = EmailTemplates.ORDER_CONFIRMATION;
  await sendEmail(
    emailClient,
    to,
    template.subject,
    template.template(name, orderId, total)
  );
}

/**
 * Envia e-mail de nova mensagem
 * @param {EmailClient} emailClient 
 * @param {string} to 
 * @param {string} name 
 * @param {string} sender 
 */
export async function sendNewMessageEmail(emailClient, to, name, sender) {
  const template = EmailTemplates.NEW_MESSAGE;
  await sendEmail(
    emailClient,
    to,
    template.subject,
    template.template(name, sender)
  );
}