// Configurações de desenvolvimento para notificações
export const devConfig = {
  // Email SMTP (Gmail)
  email: {
    host: 'smtp.gmail.com',
    port: 587,
    user: 'luispaulodeoliveira@agrotm.com.br',
    pass: 'Th@ys15221008',
    fromEmail: 'noreply@agroisync.com',
    fromName: 'AgroSync'
  },
  
  // SMS Twilio
  sms: {
    accountSid: 'ACe505b5ec08f28194cc48089843d7ab9f',
    authToken: 'your_twilio_auth_token_here',
    phoneNumber: '+1234567890'
  },
  
  // URLs
  frontendUrl: 'http://localhost:3000',
  
  // Modo de desenvolvimento
  isDevelopment: true,
  enableRealNotifications: false // Desabilitar para desenvolvimento
};

export default devConfig;
