import nodemailer from 'nodemailer';
import { AuditLog } from '../models/AuditLog.js';

// Configuração do transporter de email
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true para 465, false para outras portas
    auth: {
      user: process.env.SMTP_USER || 'contact@agroisync.com',
      pass: process.env.SMTP_PASS || process.env.SMTP_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Templates de email
const emailTemplates = {
  welcome: {
    subject: 'Bem-vindo ao AgroSync!',
    html: userName => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #00ffbf, #00aaff); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">AgroSync</h1>
          <p style="color: white; margin: 5px 0 0 0;">O Hub Completo do Agronegócio</p>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Bem-vindo, ${userName}!</h2>
          <p style="color: #666; line-height: 1.6;">
            Obrigado por se cadastrar no AgroSync! Agora você tem acesso a:
          </p>
          <ul style="color: #666; line-height: 1.8;">
            <li>Marketplace de produtos agrícolas</li>
            <li>Sistema de fretes AgroConecta</li>
            <li>Análise de criptomoedas</li>
            <li>Notícias do agronegócio</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/dashboard" 
               style="background: #00ffbf; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Acessar Dashboard
            </a>
          </div>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p>Este é um email automático. Não responda a esta mensagem.</p>
          <p>AgroSync - Transformando o Agronegócio Brasileiro</p>
        </div>
      </div>
    `
  },

  paymentSuccess: {
    subject: 'Pagamento Confirmado - AgroSync',
    html: (userName, orderDetails) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #00ffbf, #00aaff); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">AgroSync</h1>
          <p style="color: white; margin: 5px 0 0 0;">Pagamento Confirmado</p>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Pagamento Confirmado!</h2>
          <p style="color: #666; line-height: 1.6;">
            Olá ${userName}, seu pagamento foi processado com sucesso!
          </p>
          <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Detalhes do Pedido</h3>
            <p><strong>ID do Pedido:</strong> ${orderDetails.orderId}</p>
            <p><strong>Produto:</strong> ${orderDetails.productName}</p>
            <p><strong>Valor:</strong> R$ ${orderDetails.amount.toFixed(2)}</p>
            <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
          </div>
          <p style="color: #666;">
            Você receberá mais informações sobre a entrega em breve.
          </p>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p>AgroSync - Transformando o Agronegócio Brasileiro</p>
        </div>
      </div>
    `
  },

  freightAccepted: {
    subject: 'Frete Aceito - AgroConecta',
    html: (driverName, freightDetails) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #00ffbf, #00aaff); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">AgroConecta</h1>
          <p style="color: white; margin: 5px 0 0 0;">Frete Aceito</p>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Frete Aceito!</h2>
          <p style="color: #666; line-height: 1.6;">
            Olá ${driverName}, seu frete foi aceito com sucesso!
          </p>
          <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Detalhes do Frete</h3>
            <p><strong>Origem:</strong> ${freightDetails.origin}</p>
            <p><strong>Destino:</strong> ${freightDetails.destination}</p>
            <p><strong>Valor:</strong> R$ ${freightDetails.value}</p>
            <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
          </div>
          <p style="color: #666;">
            Entre em contato com o contratante para acertar os detalhes da entrega.
          </p>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p>AgroConecta - Conectando o Agronegócio</p>
        </div>
      </div>
    `
  },

  contactForm: {
    subject: 'Nova Mensagem de Contato - AgroSync',
    html: contactData => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #00ffbf, #00aaff); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">AgroSync</h1>
          <p style="color: white; margin: 5px 0 0 0;">Nova Mensagem de Contato</p>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Nova Mensagem Recebida</h2>
          <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Nome:</strong> ${contactData.name}</p>
            <p><strong>Email:</strong> ${contactData.email}</p>
            <p><strong>Telefone:</strong> ${contactData.phone || 'Não informado'}</p>
            <p><strong>Tipo:</strong> ${contactData.type}</p>
            <p><strong>Prioridade:</strong> ${contactData.priority}</p>
            <p><strong>Assunto:</strong> ${contactData.subject}</p>
            <p><strong>Mensagem:</strong></p>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 3px; margin-top: 10px;">
              ${contactData.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="color: #666;">
            Responda a esta mensagem o mais rápido possível.
          </p>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p>AgroSync - Sistema de Contato</p>
        </div>
      </div>
    `
  },

  passwordReset: {
    subject: 'Redefinição de Senha - AgroSync',
    html: (userName, resetLink) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #00ffbf, #00aaff); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">AgroSync</h1>
          <p style="color: white; margin: 5px 0 0 0;">Redefinição de Senha</p>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Redefinir Senha</h2>
          <p style="color: #666; line-height: 1.6;">
            Olá ${userName}, você solicitou a redefinição de sua senha.
          </p>
          <p style="color: #666;">
            Clique no botão abaixo para criar uma nova senha:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background: #00ffbf; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Redefinir Senha
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            Este link expira em 1 hora. Se você não solicitou esta redefinição, ignore este email.
          </p>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p>AgroSync - Segurança da Conta</p>
        </div>
      </div>
    `
  },

  orderConfirmed: {
    subject: 'Pedido Confirmado - AgroSync',
    html: (userName, orderDetails) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #00ffbf, #00aaff); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">AgroSync</h1>
          <p style="color: white; margin: 5px 0 0 0;">Pedido Confirmado</p>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Pedido Confirmado!</h2>
          <p style="color: #666; line-height: 1.6;">
            Olá ${userName}, seu pedido foi confirmado com sucesso!
          </p>
          <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Detalhes do Pedido</h3>
            <p><strong>ID do Pedido:</strong> ${orderDetails.orderId}</p>
            <p><strong>Produto:</strong> ${orderDetails.productName}</p>
            <p><strong>Quantidade:</strong> ${orderDetails.quantity}</p>
            <p><strong>Valor Total:</strong> R$ ${orderDetails.totalAmount.toFixed(2)}</p>
            <p><strong>Status:</strong> <span style="color: #00ffbf; font-weight: bold;">Confirmado</span></p>
            <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
          </div>
          <p style="color: #666;">
            Você receberá atualizações sobre o status da entrega por email.
          </p>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p>AgroSync - Acompanhe seu pedido em tempo real</p>
        </div>
      </div>
    `
  },

  deliveryCompleted: {
    subject: 'Entrega Finalizada - AgroSync',
    html: (userName, deliveryDetails) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #00ffbf, #00aaff); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">AgroSync</h1>
          <p style="color: white; margin: 5px 0 0 0;">Entrega Finalizada</p>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Entrega Finalizada!</h2>
          <p style="color: #666; line-height: 1.6;">
            Olá ${userName}, sua entrega foi finalizada com sucesso!
          </p>
          <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Detalhes da Entrega</h3>
            <p><strong>ID do Pedido:</strong> ${deliveryDetails.orderId}</p>
            <p><strong>Produto:</strong> ${deliveryDetails.productName}</p>
            <p><strong>Data de Entrega:</strong> ${new Date().toLocaleString('pt-BR')}</p>
            <p><strong>Status:</strong> <span style="color: #00ffbf; font-weight: bold;">Entregue</span></p>
            <p><strong>Valor Liberado:</strong> R$ ${deliveryDetails.amount.toFixed(2)}</p>
          </div>
          <p style="color: #666;">
            O pagamento foi liberado para o vendedor. Obrigado por usar o AgroSync!
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/order/${deliveryDetails.orderId}" 
               style="background: #00ffbf; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Ver Detalhes
            </a>
          </div>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p>AgroSync - Obrigado pela confiança!</p>
        </div>
      </div>
    `
  },

  escrowRelease: {
    subject: 'Pagamento Liberado - AgroSync Escrow',
    html: (sellerName, escrowDetails) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #00ffbf, #00aaff); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">AgroSync</h1>
          <p style="color: white; margin: 5px 0 0 0;">Pagamento Liberado</p>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Pagamento Liberado!</h2>
          <p style="color: #666; line-height: 1.6;">
            Olá ${sellerName}, seu pagamento foi liberado com sucesso!
          </p>
          <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Detalhes do Pagamento</h3>
            <p><strong>ID da Transação:</strong> ${escrowDetails.transactionId}</p>
            <p><strong>Produto:</strong> ${escrowDetails.productName}</p>
            <p><strong>Valor:</strong> R$ ${escrowDetails.amount.toFixed(2)}</p>
            <p><strong>Taxa AgroSync:</strong> R$ ${escrowDetails.fee.toFixed(2)}</p>
            <p><strong>Valor Líquido:</strong> R$ ${escrowDetails.netAmount.toFixed(2)}</p>
            <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
          </div>
          <p style="color: #666;">
            O valor será transferido para sua conta em até 2 dias úteis.
          </p>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p>AgroSync - Sistema de Escrow Seguro</p>
        </div>
      </div>
    `
  },

  freightDelivered: {
    subject: 'Frete Entregue - AgroConecta',
    html: (driverName, freightDetails) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #00ffbf, #00aaff); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">AgroConecta</h1>
          <p style="color: white; margin: 5px 0 0 0;">Frete Entregue</p>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Frete Entregue!</h2>
          <p style="color: #666; line-height: 1.6;">
            Olá ${driverName}, seu frete foi entregue com sucesso!
          </p>
          <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Detalhes do Frete</h3>
            <p><strong>ID do Frete:</strong> ${freightDetails.freightId}</p>
            <p><strong>Origem:</strong> ${freightDetails.origin}</p>
            <p><strong>Destino:</strong> ${freightDetails.destination}</p>
            <p><strong>Valor:</strong> R$ ${freightDetails.value}</p>
            <p><strong>Data de Entrega:</strong> ${new Date().toLocaleString('pt-BR')}</p>
            <p><strong>Status:</strong> <span style="color: #00ffbf; font-weight: bold;">Entregue</span></p>
          </div>
          <p style="color: #666;">
            O pagamento será processado em até 24 horas. Obrigado por usar o AgroConecta!
          </p>
        </div>
        <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
          <p>AgroConecta - Conectando o Agronegócio</p>
        </div>
      </div>
    `
  }
};

// Serviço de envio de emails
export class EmailService {
  static async sendEmail(to, template, data = {}) {
    try {
      const transporter = createTransporter();
      const emailTemplate = emailTemplates[template];

      if (!emailTemplate) {
        throw new Error(`Template de email '${template}' não encontrado`);
      }

      const mailOptions = {
        from: `"AgroSync" <${process.env.SMTP_USER || 'contact@agroisync.com'}>`,
        to,
        subject: emailTemplate.subject,
        html:
          typeof emailTemplate.html === 'function' ? emailTemplate.html(data) : emailTemplate.html
      };

      const result = await transporter.sendMail(mailOptions);

      // Log do envio
      await AuditLog.logAction({
        userId: data.userId || 'system',
        userEmail: to,
        action: 'EMAIL_SENT',
        resource: '/api/email/send',
        details: `Email '${template}' sent to ${to}`,
        ip: 'system',
        userAgent: 'email-service'
      });

      console.log(`Email '${template}' enviado para ${to}:`, result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Erro ao enviar email:', error);

      // Log do erro
      await AuditLog.logAction({
        userId: data.userId || 'system',
        userEmail: to,
        action: 'EMAIL_FAILED',
        resource: '/api/email/send',
        details: `Failed to send email '${template}' to ${to}: ${error.message}`,
        ip: 'system',
        userAgent: 'email-service',
        isSuspicious: false,
        riskLevel: 'LOW'
      });

      throw error;
    }
  }

  // Métodos específicos para cada tipo de email
  static async sendWelcomeEmail(userEmail, userName) {
    return this.sendEmail(userEmail, 'welcome', { userName });
  }

  static async sendPaymentSuccessEmail(userEmail, userName, orderDetails) {
    return this.sendEmail(userEmail, 'paymentSuccess', { userName, orderDetails });
  }

  static async sendFreightAcceptedEmail(driverEmail, driverName, freightDetails) {
    return this.sendEmail(driverEmail, 'freightAccepted', { driverName, freightDetails });
  }

  static async sendContactFormEmail(contactData) {
    const adminEmail = process.env.ADMIN_EMAIL || 'contact@agroisync.com';
    return this.sendEmail(adminEmail, 'contactForm', contactData);
  }

  static async sendPasswordResetEmail(userEmail, userName, resetLink) {
    return this.sendEmail(userEmail, 'passwordReset', { userName, resetLink });
  }

  static async sendOrderConfirmedEmail(userEmail, userName, orderDetails) {
    return this.sendEmail(userEmail, 'orderConfirmed', { userName, orderDetails });
  }

  static async sendDeliveryCompletedEmail(userEmail, userName, deliveryDetails) {
    return this.sendEmail(userEmail, 'deliveryCompleted', { userName, deliveryDetails });
  }

  static async sendEscrowReleaseEmail(sellerEmail, sellerName, escrowDetails) {
    return this.sendEmail(sellerEmail, 'escrowRelease', { sellerName, escrowDetails });
  }

  static async sendFreightDeliveredEmail(driverEmail, driverName, freightDetails) {
    return this.sendEmail(driverEmail, 'freightDelivered', { driverName, freightDetails });
  }

  // Método para enviar email de confirmação de contato
  static async sendContactConfirmationEmail(userEmail, userName) {
    const confirmationTemplate = {
      subject: 'Mensagem Recebida - AgroSync',
      html: userName => `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #00ffbf, #00aaff); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">AgroSync</h1>
            <p style="color: white; margin: 5px 0 0 0;">Mensagem Recebida</p>
          </div>
          <div style="padding: 30px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Mensagem Recebida!</h2>
            <p style="color: #666; line-height: 1.6;">
              Olá ${userName}, recebemos sua mensagem e entraremos em contato em breve.
            </p>
            <p style="color: #666;">
              Nossa equipe de suporte responderá em até 24 horas.
            </p>
          </div>
          <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 12px;">
            <p>AgroSync - Obrigado pelo contato!</p>
          </div>
        </div>
      `
    };

    try {
      const transporter = createTransporter();
      const mailOptions = {
        from: `"AgroSync" <${process.env.SMTP_USER || 'contact@agroisync.com'}>`,
        to: userEmail,
        subject: confirmationTemplate.subject,
        html: confirmationTemplate.html(userName)
      };

      const result = await transporter.sendMail(mailOptions);
      console.log(`Email de confirmação enviado para ${userEmail}:`, result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Erro ao enviar email de confirmação:', error);
      throw error;
    }
  }
}

export default EmailService;
