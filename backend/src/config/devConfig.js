// Configurações de desenvolvimento para notificações
export const devConfig = {
  // Email SMTP (Gmail)
  email: {
    host: 'smtp.gmail.com',
    port: 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    fromEmail: 'noreply@agroisync.com',
    fromName: 'AgroSync'
  },

  // SMS Twilio
  sms: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || ''
  },

  // URLs
  frontendUrl: 'http://localhost:3000',

  // Modo de desenvolvimento
  isDevelopment: true,
  enableRealNotifications: false // Desabilitar para desenvolvimento
};

export default devConfig;
