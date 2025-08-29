import AWS from 'aws-sdk';

// Configuração AWS
const awsConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};

// Inicializar serviços AWS
const ses = new AWS.SES(awsConfig);
const sns = new AWS.SNS(awsConfig);

class AWSService {
  constructor() {
    this.sesVerifiedEmail = process.env.SES_VERIFIED_EMAIL || 'noreply@agrosync.com';
    this.sesVerifiedDomain = process.env.SES_VERIFIED_DOMAIN || 'agrosync.com';
    this.smsSenderId = process.env.SMS_SENDER_ID || 'AgroSync';
    this.smsMaxPrice = process.env.SMS_MAX_PRICE || '0.50';
  }

  /**
   * Enviar email via AWS SES
   * @param {string} to - Email do destinatário
   * @param {string} subject - Assunto do email
   * @param {string} htmlBody - Corpo HTML do email
   * @param {string} textBody - Corpo texto do email (opcional)
   * @returns {Promise<Object>} - Resultado do envio
   */
  async sendEmail(to, subject, htmlBody, textBody = null) {
    try {
      const params = {
        Source: this.sesVerifiedEmail,
        Destination: {
          ToAddresses: [to]
        },
        Message: {
          Subject: {
            Data: subject,
            Charset: 'UTF-8'
          },
          Body: {
            Html: {
              Data: htmlBody,
              Charset: 'UTF-8'
            }
          }
        },
        ConfigurationSetName: process.env.SES_CONFIGURATION_SET || undefined
      };

      // Adicionar corpo de texto se fornecido
      if (textBody) {
        params.Message.Body.Text = {
          Data: textBody,
          Charset: 'UTF-8'
        };
      }

      const result = await ses.sendEmail(params).promise();
      
      console.log(`✅ Email enviado com sucesso para ${to}:`, result.MessageId);
      
      return {
        success: true,
        messageId: result.MessageId,
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
   * Enviar SMS via AWS SNS
   * @param {string} phoneNumber - Número do telefone (formato E.164)
   * @param {string} message - Mensagem do SMS
   * @returns {Promise<Object>} - Resultado do envio
   */
  async sendSMS(phoneNumber, message) {
    try {
      // Formatar número de telefone para E.164 se necessário
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      const params = {
        Message: message,
        PhoneNumber: formattedPhone,
        MessageAttributes: {
          'AWS.SNS.SMS.SenderID': {
            DataType: 'String',
            StringValue: this.smsSenderId
          },
          'AWS.SNS.SMS.MaxPrice': {
            DataType: 'String',
            StringValue: this.smsMaxPrice
          },
          'AWS.SNS.SMS.SMSType': {
            DataType: 'String',
            StringValue: 'Transactional'
          }
        }
      };

      const result = await sns.publish(params).promise();
      
      console.log(`✅ SMS enviado com sucesso para ${formattedPhone}:`, result.MessageId);
      
      return {
        success: true,
        messageId: result.MessageId,
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
   * Verificar se o email está verificado no SES
   * @param {string} email - Email para verificar
   * @returns {Promise<boolean>} - Se está verificado
   */
  async isEmailVerified(email) {
    try {
      const params = {
        Identities: [email]
      };
      
      const result = await ses.getIdentityVerificationAttributes(params).promise();
      const attributes = result.VerificationAttributes[email];
      
      return attributes && attributes.VerificationStatus === 'Success';
    } catch (error) {
      console.error('Erro ao verificar status do email:', error);
      return false;
    }
  }

  /**
   * Verificar se o domínio está verificado no SES
   * @param {string} domain - Domínio para verificar
   * @returns {Promise<boolean>} - Se está verificado
   */
  async isDomainVerified(domain) {
    try {
      const params = {
        Identities: [domain]
      };
      
      const result = await ses.getIdentityVerificationAttributes(params).promise();
      const attributes = result.VerificationAttributes[domain];
      
      return attributes && attributes.VerificationStatus === 'Success';
    } catch (error) {
      console.error('Erro ao verificar status do domínio:', error);
      return false;
    }
  }

  /**
   * Obter estatísticas de envio do SES
   * @returns {Promise<Object>} - Estatísticas
   */
  async getSESStats() {
    try {
      const params = {
        StartDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Últimas 24 horas
        EndDate: new Date()
      };
      
      const result = await ses.getSendStatistics().promise();
      return result;
    } catch (error) {
      console.error('Erro ao obter estatísticas do SES:', error);
      return null;
    }
  }

  /**
   * Obter estatísticas de envio do SNS
   * @returns {Promise<Object>} - Estatísticas
   */
  async getSNSStats() {
    try {
      const params = {
        StartDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Últimas 24 horas
        EndDate: new Date()
      };
      
      const result = await sns.getSMSAttributes().promise();
      return result;
    } catch (error) {
      console.error('Erro ao obter estatísticas do SNS:', error);
      return null;
    }
  }
}

const awsService = new AWSService();

export default awsService;
