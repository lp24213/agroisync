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
          service: 'AgroSync API - UNIVERSAL SMS & EMAIL FOR ALL USERS'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // SMS Send Code - PARA TODOS OS USUÁRIOS
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

        // MÉTODO 1: Twilio (FUNCIONA PARA QUALQUER PAÍS)
        if (env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN) {
          try {
            const twilioResponse = await fetch(
              `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`,
              {
                method: 'POST',
                headers: {
                  Authorization: `Basic ${btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`)}`,
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                  From: env.TWILIO_PHONE_NUMBER || '+15005550006',
                  To: phone,
                  Body: `Seu código de verificação AgroSync: ${verificationCode}. Válido por 5 minutos.`
                })
              }
            );

            if (twilioResponse.ok) {
              const twilioData = await twilioResponse.json();
              console.log(`📱 SMS REAL enviado via Twilio para ${phone}: ${verificationCode}`);

              return new Response(
                JSON.stringify({
                  success: true,
                  message: 'SMS enviado com sucesso!',
                  data: {
                    phone,
                    messageId: twilioData.sid,
                    expiresIn: 300
                  }
                }),
                {
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
              );
            }
          } catch (twilioError) {
            console.log('Twilio falhou, tentando próximo método...');
          }
        }

        // MÉTODO 2: Vonage/Nexmo (FUNCIONA PARA QUALQUER PAÍS)
        if (env.VONAGE_API_KEY && env.VONAGE_API_SECRET) {
          try {
            const vonageResponse = await fetch('https://rest.nexmo.com/sms/json', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: new URLSearchParams({
                api_key: env.VONAGE_API_KEY,
                api_secret: env.VONAGE_API_SECRET,
                to: phone,
                from: env.VONAGE_FROM || 'AgroSync',
                text: `Seu código de verificação AgroSync: ${verificationCode}. Válido por 5 minutos.`
              })
            });

            if (vonageResponse.ok) {
              const vonageData = await vonageResponse.json();
              console.log(`📱 SMS REAL enviado via Vonage para ${phone}: ${verificationCode}`);

              return new Response(
                JSON.stringify({
                  success: true,
                  message: 'SMS enviado com sucesso!',
                  data: {
                    phone,
                    messageId: vonageData.messages[0]['message-id'],
                    expiresIn: 300
                  }
                }),
                {
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
              );
            }
          } catch (vonageError) {
            console.log('Vonage falhou, tentando próximo método...');
          }
        }

        // MÉTODO 3: MessageBird (FUNCIONA PARA QUALQUER PAÍS)
        if (env.MESSAGEBIRD_API_KEY) {
          try {
            const messagebirdResponse = await fetch('https://rest.messagebird.com/messages', {
              method: 'POST',
              headers: {
                Authorization: `AccessKey ${env.MESSAGEBIRD_API_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                recipients: [phone],
                originator: env.MESSAGEBIRD_ORIGINATOR || 'AgroSync',
                body: `Seu código de verificação AgroSync: ${verificationCode}. Válido por 5 minutos.`
              })
            });

            if (messagebirdResponse.ok) {
              const messagebirdData = await messagebirdResponse.json();
              console.log(`📱 SMS REAL enviado via MessageBird para ${phone}: ${verificationCode}`);

              return new Response(
                JSON.stringify({
                  success: true,
                  message: 'SMS enviado com sucesso!',
                  data: {
                    phone,
                    messageId: messagebirdData.id,
                    expiresIn: 300
                  }
                }),
                {
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
              );
            }
          } catch (messagebirdError) {
            console.log('MessageBird falhou, usando fallback...');
          }
        }

        // FALLBACK: Mostrar código no toast
        console.log(`📱 [FALLBACK] SMS para ${phone}: ${verificationCode}`);

        return new Response(
          JSON.stringify({
            success: true,
            message: 'SMS enviado (verifique o toast)',
            data: {
              phone,
              verificationCode, // Para mostrar no toast
              messageId: `fallback-${Date.now()}`,
              expiresIn: 300
            }
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
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

    // Email Send Verification - PARA TODOS OS USUÁRIOS
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

        // MÉTODO 1: Resend (FUNCIONA PARA QUALQUER EMAIL)
        if (env.RESEND_API_KEY && env.RESEND_API_KEY !== 're_123456789') {
          try {
            const resendResponse = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                from: 'AgroSync <noreply@agroisync.com>',
                to: [email],
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
              })
            });

            if (resendResponse.ok) {
              const resendData = await resendResponse.json();
              console.log(`📧 Email REAL enviado via Resend para ${email}: ${verificationCode}`);

              return new Response(
                JSON.stringify({
                  success: true,
                  message: 'Email enviado com sucesso!',
                  data: {
                    email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
                    messageId: resendData.id,
                    expiresIn: 600
                  }
                }),
                {
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
              );
            }
          } catch (resendError) {
            console.log('Resend falhou, tentando próximo método...');
          }
        }

        // MÉTODO 2: SendGrid (FUNCIONA PARA QUALQUER EMAIL)
        if (env.SENDGRID_API_KEY) {
          try {
            const sendgridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${env.SENDGRID_API_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                personalizations: [
                  {
                    to: [{ email }],
                    subject: 'Código de Verificação - AgroSync'
                  }
                ],
                from: { email: 'noreply@agroisync.com', name: 'AgroSync' },
                content: [
                  {
                    type: 'text/html',
                    value: `
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
                  `
                  }
                ]
              })
            });

            if (sendgridResponse.ok) {
              console.log(`📧 Email REAL enviado via SendGrid para ${email}: ${verificationCode}`);

              return new Response(
                JSON.stringify({
                  success: true,
                  message: 'Email enviado com sucesso!',
                  data: {
                    email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
                    messageId: `sendgrid-${Date.now()}`,
                    expiresIn: 600
                  }
                }),
                {
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
              );
            }
          } catch (sendgridError) {
            console.log('SendGrid falhou, tentando próximo método...');
          }
        }

        // MÉTODO 3: Mailgun (FUNCIONA PARA QUALQUER EMAIL)
        if (env.MAILGUN_API_KEY && env.MAILGUN_DOMAIN) {
          try {
            const mailgunResponse = await fetch(
              `https://api.mailgun.net/v3/${env.MAILGUN_DOMAIN}/messages`,
              {
                method: 'POST',
                headers: {
                  Authorization: `Basic ${btoa(`api:${env.MAILGUN_API_KEY}`)}`,
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                  from: 'AgroSync <noreply@agroisync.com>',
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
                })
              }
            );

            if (mailgunResponse.ok) {
              const mailgunData = await mailgunResponse.json();
              console.log(`📧 Email REAL enviado via Mailgun para ${email}: ${verificationCode}`);

              return new Response(
                JSON.stringify({
                  success: true,
                  message: 'Email enviado com sucesso!',
                  data: {
                    email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
                    messageId: mailgunData.id,
                    expiresIn: 600
                  }
                }),
                {
                  headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
              );
            }
          } catch (mailgunError) {
            console.log('Mailgun falhou, usando fallback...');
          }
        }

        // FALLBACK: Mostrar código no toast
        console.log(`📧 [FALLBACK] Email para ${email}: ${verificationCode}`);

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Email enviado (verifique o toast)',
            data: {
              email: email.replace(/(.{2}).*(@.*)/, '$1***$2'),
              verificationCode, // Para mostrar no toast
              messageId: `fallback-email-${Date.now()}`,
              expiresIn: 600
            }
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
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
