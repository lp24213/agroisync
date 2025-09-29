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
          service: 'AgroSync API - WHATSAPP + EMAIL GRATUITOS'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // SMS Send Code - FALLBACK NO TOAST
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

        // FORMATAR TELEFONE PARA BRASIL
        let formattedPhone = phone.replace(/\D/g, '');
        if (!formattedPhone.startsWith('55')) {
          formattedPhone = `55${formattedPhone}`;
        }

        console.log(`📱 SMS FALLBACK para ${formattedPhone} com código ${verificationCode}`);

        return new Response(
          JSON.stringify({
            success: true,
            message: `SMS não disponível. Use WhatsApp ou Email. Código: ${verificationCode}`,
            data: {
              phone: formattedPhone,
              verificationCode,
              messageId: `sms-fallback-${Date.now()}`,
              status: 'FALLBACK',
              expiresIn: 300,
              delivered: false
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

    // WhatsApp Send Code - TWILIO SANDBOX GRATUITO
    if (url.pathname === '/api/whatsapp/send-code' && request.method === 'POST') {
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

        // FORMATAR TELEFONE PARA BRASIL
        let formattedPhone = phone.replace(/\D/g, '');
        if (!formattedPhone.startsWith('55')) {
          formattedPhone = `55${formattedPhone}`;
        }

        console.log(
          `🚀 ENVIANDO WHATSAPP via TWILIO SANDBOX para ${formattedPhone} com código ${verificationCode}`
        );

        // TWILIO WHATSAPP SANDBOX - GRATUITO
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
                From: 'whatsapp:+14155238886', // Twilio WhatsApp Sandbox
                To: `whatsapp:+${formattedPhone}`,
                Body: `AgroSync - Seu codigo: ${verificationCode}. Valido por 5 min.`
              })
            }
          );

          const twilioData = await twilioResponse.json();

          if (twilioResponse.ok && twilioData.sid) {
            console.log(
              `📱 WHATSAPP ENTREGUE via Twilio Sandbox para ${formattedPhone}: ${verificationCode}`
            );

            return new Response(
              JSON.stringify({
                success: true,
                message: 'WhatsApp ENTREGUE! Verifique seu WhatsApp.',
                data: {
                  phone: formattedPhone,
                  verificationCode,
                  messageId: twilioData.sid,
                  status: twilioData.status,
                  expiresIn: 300,
                  delivered: true
                }
              }),
              {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              }
            );
          } else {
            throw new Error(`Twilio WhatsApp Error: ${twilioData.message}`);
          }
        } catch (twilioError) {
          console.error(`❌ Twilio WhatsApp falhou: ${twilioError.message}`);

          // FALLBACK - Mostrar código no toast
          return new Response(
            JSON.stringify({
              success: true,
              message: `WhatsApp não entregue. Código: ${verificationCode}`,
              data: {
                phone: formattedPhone,
                verificationCode,
                messageId: `whatsapp-fallback-${Date.now()}`,
                status: 'FALLBACK',
                expiresIn: 300,
                delivered: false,
                error: twilioError.message
              }
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
      } catch (error) {
        console.error('Erro ao enviar WhatsApp:', error);
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Erro ao enviar WhatsApp'
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // Email Send Verification - RESEND GRATUITO
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

        console.log(`🚀 ENVIANDO EMAIL via RESEND para ${email} com código ${verificationCode}`);

        // RESEND EMAIL - GRATUITO (3.000 emails/mês)
        try {
          const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${env.RESEND_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: 'onboarding@resend.dev',
              to: email,
              subject: 'Codigo de Verificacao - AgroSync',
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #059669; margin: 0;">AgroSync</h1>
                    <p style="color: #666; margin: 10px 0 0 0;">Plataforma de Agronegócio</p>
                  </div>
                  
                  <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
                    <h2 style="color: #333; margin: 0 0 20px 0;">Seu código de verificação</h2>
                    <div style="background: #059669; color: white; font-size: 36px; font-weight: bold; padding: 20px; border-radius: 8px; letter-spacing: 5px; margin: 20px 0;">
                      ${verificationCode}
                    </div>
                    <p style="color: #666; margin: 20px 0 0 0;">Este código é válido por 10 minutos.</p>
                  </div>
                  
                  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="color: #999; font-size: 14px; margin: 0;">
                      Se você não solicitou este código, ignore este email.<br>
                      AgroSync - Conectando o agronegócio brasileiro.
                    </p>
                  </div>
                </div>
              `
            })
          });

          const resendData = await resendResponse.json();

          if (resendResponse.ok && resendData.id) {
            console.log(`📧 EMAIL ENTREGUE via Resend para ${email}: ${verificationCode}`);

            return new Response(
              JSON.stringify({
                success: true,
                message: 'Email ENTREGUE! Verifique sua caixa de entrada.',
                data: {
                  email,
                  verificationCode,
                  messageId: resendData.id,
                  status: 'SENT',
                  expiresIn: 600,
                  delivered: true
                }
              }),
              {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              }
            );
          } else {
            throw new Error(`Resend Error: ${resendData.message}`);
          }
        } catch (resendError) {
          console.error(`❌ Resend falhou: ${resendError.message}`);

          // FALLBACK - Mostrar código no toast
          return new Response(
            JSON.stringify({
              success: true,
              message: `Email não entregue. Código: ${verificationCode}`,
              data: {
                email,
                verificationCode,
                messageId: `email-fallback-${Date.now()}`,
                status: 'FALLBACK',
                expiresIn: 600,
                delivered: false,
                error: resendError.message
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

    // Forgot Password - RESEND EMAIL
    if (url.pathname === '/api/forgot-password' && request.method === 'POST') {
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

        // Gerar código de recuperação
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

        console.log(
          `🚀 ENVIANDO EMAIL DE RECUPERAÇÃO via RESEND para ${email} com código ${resetCode}`
        );

        // RESEND EMAIL - RECUPERAÇÃO DE SENHA
        try {
          const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${env.RESEND_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: 'onboarding@resend.dev',
              to: email,
              subject: 'Recuperacao de Senha - AgroSync',
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #059669; margin: 0;">AgroSync</h1>
                    <p style="color: #666; margin: 10px 0 0 0;">Recuperação de Senha</p>
                  </div>
                  
                  <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center;">
                    <h2 style="color: #333; margin: 0 0 20px 0;">Código de recuperação</h2>
                    <div style="background: #dc2626; color: white; font-size: 36px; font-weight: bold; padding: 20px; border-radius: 8px; letter-spacing: 5px; margin: 20px 0;">
                      ${resetCode}
                    </div>
                    <p style="color: #666; margin: 20px 0 0 0;">Este código é válido por 15 minutos.</p>
                  </div>
                  
                  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                    <p style="color: #999; font-size: 14px; margin: 0;">
                      Se você não solicitou a recuperação de senha, ignore este email.<br>
                      AgroSync - Conectando o agronegócio brasileiro.
                    </p>
                  </div>
                </div>
              `
            })
          });

          const resendData = await resendResponse.json();

          if (resendResponse.ok && resendData.id) {
            console.log(`📧 EMAIL DE RECUPERAÇÃO ENTREGUE via Resend para ${email}: ${resetCode}`);

            return new Response(
              JSON.stringify({
                success: true,
                message: 'Email de recuperação ENTREGUE! Verifique sua caixa de entrada.',
                data: {
                  email,
                  resetCode,
                  messageId: resendData.id,
                  status: 'SENT',
                  expiresIn: 900,
                  delivered: true
                }
              }),
              {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              }
            );
          } else {
            throw new Error(`Resend Error: ${resendData.message}`);
          }
        } catch (resendError) {
          console.error(`❌ Resend falhou: ${resendError.message}`);

          // FALLBACK - Mostrar código no toast
          return new Response(
            JSON.stringify({
              success: true,
              message: `Email de recuperação não entregue. Código: ${resetCode}`,
              data: {
                email,
                resetCode,
                messageId: `reset-fallback-${Date.now()}`,
                status: 'FALLBACK',
                expiresIn: 900,
                delivered: false,
                error: resendError.message
              }
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
      } catch (error) {
        console.error('Erro ao enviar email de recuperação:', error);
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Erro ao enviar email de recuperação'
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
