import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to, subject, html, text) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@agroisync.com',
      to,
      subject,
      html,
      text,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendWelcomeEmail = async (userEmail, userName) => {
  const subject = 'Bem-vindo ao AgroSync!';
  const html = `
    <h1>Bem-vindo ao AgroSync, ${userName}!</h1>
    <p>Obrigado por se cadastrar em nossa plataforma.</p>
    <p>Você agora pode começar a usar todos os recursos do AgroSync.</p>
  `;
  const text = `Bem-vindo ao AgroSync, ${userName}! Obrigado por se cadastrar.`;

  return await sendEmail(userEmail, subject, html, text);
};

export const sendOrderConfirmationEmail = async (userEmail, orderNumber) => {
  const subject = `Confirmação de Pedido #${orderNumber}`;
  const html = `
    <h1>Pedido Confirmado!</h1>
    <p>Seu pedido #${orderNumber} foi confirmado com sucesso.</p>
    <p>Você receberá atualizações sobre o status da entrega.</p>
  `;
  const text = `Pedido #${orderNumber} confirmado com sucesso.`;

  return await sendEmail(userEmail, subject, html, text);
};

export const sendPasswordResetEmail = async (userEmail, resetToken) => {
  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;
  const subject = 'Redefinição de Senha - AgroSync';
  const html = `
    <h1>Redefinição de Senha</h1>
    <p>Clique no link abaixo para redefinir sua senha:</p>
    <a href="${resetUrl}">Redefinir Senha</a>
    <p>Este link expira em 1 hora.</p>
  `;
  const text = `Redefinição de senha: ${resetUrl}`;

  return await sendEmail(userEmail, subject, html, text);
};
