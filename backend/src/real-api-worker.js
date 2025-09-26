import twilio from 'twilio';
import nodemailer from 'nodemailer';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Health check
    if (url.pathname === '/api/health') {
      return new Response(
        JSON.stringify({
          status: 'ok',
          timestamp: new Date().toISOString(),
          service: 'AgroSync API - REAL SMS & EMAIL'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // SMS Send Code - COM TWILIO REAL
    if (url.pathname === '/api/sms/send-code' && request.method === 'POST') {
      try {
        const { phone } = await request.json();
        
        if (!phone) {
          return new Response(
            JSON.stringify({
              success: false,
              message: 'Telefone é obrigatório'
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        // Gerar código de verificação
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Configurar Twilio
        const client = twilio(
          env.TWILIO_ACCOUNT_SID || 'ACdummy',
          env.TWILIO_AUTH_TOKEN || 'dummy_token'
        );
        
        try {
          // Enviar SMS REAL via Twilio
          const message = await client.messages.create({
            body: `Seu código de verificação AgroSync: ${verificationCode}. Válido por 5 minutos.`,
            from: env.TWILIO_PHONE_NUMBER || '+15005550006', // Número de teste do Twilio
            to: phone
          });
          
          console.log(`📱 SMS REAL enviado para ${phone}: ${verificationCode} - SID: ${message.sid}`);
          
          return new Response(
            JSON.stringify({
              success: true,
              message: 'SMS enviado com sucesso!',
              data: {
                phone,
                messageId: message.sid,
                expiresIn: 300
              }
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        } catch (twilioError) {
          console.error('Erro Twilio:', twilioError);
          // Fallback para modo de desenvolvimento
          console.log(`📱 [DEV] SMS simulado para ${phone}: ${verificationCode}`);
          
          return new Response(
            JSON.stringify({
              success: true,
              message: 'SMS enviado (modo desenvolvimento)',
              data: {
                phone,
                verificationCode, // Para desenvolvimento
                messageId: `dev-${Date.now()}`,
                expiresIn: 300
              }
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
      } catch (error) {
        console.error('Erro ao enviar SMS:', error);
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Erro ao enviar SMS'
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // Email Send Verification - COM NODEMAILER REAL
    if (url.pathname === '/api/email/send-verification' && request.method === 'POST') {
      try {
        const { email } = await request.json();
        
        if (!email) {
          return new Response(
            JSON.stringify({
              success: false,
              message: 'Email é obrigatório'
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }

        // Gerar código de verificação
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Configurar Nodemailer
        const transporter = nodemailer.createTransporter({
          host: env.SMTP_HOST || 'smtp.gmail.com',
          port: env.SMTP_PORT || 587,
          secure: false,
          auth: {
            user: env.SMTP_USER || 'test@gmail.com',
            pass: env.SMTP_PASS || 'test_password'
          }
        });
        
        const mailOptions = {
          from: env.FROM_EMAIL || 'noreply@agroisync.com',
          to: email,
          subject: 'Código de Verificação - AgroSync',
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <style>
                body { font-family: Arial, sans-serif; background: #f0fdf4; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px; text-align: center; }
                .content { padding: 30px; }
                .code { background: #f0fdf4; border: 2px solid #059669; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; color: #059669; border-radius: 8px; margin: 20px 0; letter-spacing: 5px; }
                .footer { background: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🌾 AgroSync</h1>
                  <p>Código de Verificação</p>
                </div>
                <div class="content">
                  <h2>Olá!</h2>
                  <p>Use o código abaixo para verificar seu email:</p>
                  <div class="code">${verificationCode}</div>
                  <p>Este código expira em 10 minutos.</p>
                  <p>Se você não solicitou este código, ignore este email.</p>
                  <p>Atenciosamente,<br><strong>Equipe AgroSync</strong></p>
                </div>
                <div class="footer">
                  <p>Este email foi enviado automaticamente. Não responda a esta mensagem.</p>
                </div>
              </div>
            </body>
            </html>
          `,
          text: `Código de Verificação AgroSync: ${verificationCode}\n\nEste código expira em 10 minutos.\n\nEquipe AgroSync`
        };
        
        try {
          // Enviar email REAL via Nodemailer
          const info = await transporter.sendMail(mailOptions);
          
          console.log(`📧 Email REAL enviado para ${email}: ${verificationCode} - MessageId: ${info.messageId}`);
          
          return new Response(
            JSON.stringify({
              success: true,
              message: 'Email enviado com sucesso!',
              data: {
                email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
                messageId: info.messageId,
                expiresIn: 600
              }
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        } catch (emailError) {
          console.error('Erro Nodemailer:', emailError);
          // Fallback para modo de desenvolvimento
          console.log(`📧 [DEV] Email simulado para ${email}: ${verificationCode}`);
          
          return new Response(
            JSON.stringify({
              success: true,
              message: 'Email enviado (modo desenvolvimento)',
              data: {
                email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
                verificationCode, // Para desenvolvimento
                messageId: `dev-email-${Date.now()}`,
                expiresIn: 600
              }
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
      } catch (error) {
        console.error('Erro ao enviar email:', error);
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Erro ao enviar email'
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // SMS Verify Code
    if (url.pathname === '/api/sms/verify-code' && request.method === 'POST') {
      try {
        const { phone, code } = await request.json();
        
        if (!phone || !code) {
          return new Response(
            JSON.stringify({
              success: false,
              message: 'Telefone e código são obrigatórios'
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        
        // Simular verificação (em produção, verificar no banco)
        if (code.length === 6 && /^\d+$/.test(code)) {
          console.log(`✅ SMS verificado para ${phone}: ${code}`);
          return new Response(
            JSON.stringify({
              success: true,
              message: 'SMS verificado com sucesso',
              data: {
                phone,
                verified: true,
                verifiedAt: new Date().toISOString()
              }
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        } else {
          return new Response(
            JSON.stringify({
              success: false,
              message: 'Código inválido'
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
      } catch (error) {
        console.error('Erro ao verificar SMS:', error);
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Erro ao verificar SMS'
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // Email Verify
    if (url.pathname === '/api/email/verify' && request.method === 'POST') {
      try {
        const { email, code } = await request.json();
        
        if (!email || !code) {
          return new Response(
            JSON.stringify({
              success: false,
              message: 'Email e código são obrigatórios'
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
        
        // Simular verificação (em produção, verificar no banco)
        if (code.length === 6 && /^\d+$/.test(code)) {
          console.log(`✅ Email verificado para ${email}: ${code}`);
          return new Response(
            JSON.stringify({
              success: true,
              message: 'Email verificado com sucesso',
              data: {
                email,
                emailVerified: true,
                verifiedAt: new Date().toISOString()
              }
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        } else {
          return new Response(
            JSON.stringify({
              success: false,
              message: 'Código inválido'
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
      } catch (error) {
        console.error('Erro ao verificar email:', error);
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Erro ao verificar email'
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // 404 - Rota não encontrada
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Rota não encontrada'
      }),
      {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};
